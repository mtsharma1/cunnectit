import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require('@next/env');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const [mode, envFile, extra] = process.argv.slice(2);
function check(condition, message) { if (!condition) throw new Error(message); }
function quote(value) { return JSON.stringify(value).replaceAll('$', '\\$'); }
function cnfQuote(value) { return '"' + value.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', '\\n').replaceAll('\r', '\\r') + '"'; }
async function main() {
  check(envFile && fs.existsSync(envFile), 'Private environment file not found.');
  check(path.basename(envFile) === '.env', 'Helper expects a .env file in a release directory.');
  if (mode === 'create-db') {
    const user = 'cunnectit_app';
    const result = spawnSync('mysql', ['--protocol=socket','--user=root','--batch','--skip-column-names','-e', `SELECT COUNT(*) FROM mysql.user WHERE User='${user}' AND Host='localhost'`], {encoding:'utf8'});
    check(result.status === 0, 'Local root socket authentication failed. Provision the database/account manually and reuse DATABASE_URL.');
    check(result.stdout.trim() === '0', 'cunnectit_app@localhost already exists; reuse its URL instead of rotating credentials.');
    const password = crypto.randomBytes(24).toString('hex');
    const sql = `CREATE DATABASE IF NOT EXISTS cunnectit CHARACTER SET utf8mb4; CREATE USER '${user}'@'localhost' IDENTIFIED BY '${password}'; GRANT SELECT, INSERT, UPDATE, CREATE ON cunnectit.* TO '${user}'@'localhost';`;
    const created = spawnSync('mysql',['--protocol=socket','--user=root'],{input:sql,encoding:'utf8'});
    check(created.status === 0, 'Database provisioning failed; inspect MySQL locally. Details suppressed to protect credentials.');
    let contents = fs.readFileSync(envFile,'utf8').replace(/^\s*DATABASE_URL\s*=.*(?:\r?\n|$)/gm,'');
    contents += `\nDATABASE_URL=${quote(`mysql://${user}:${password}@127.0.0.1:3306/cunnectit`)}\n`;
    fs.writeFileSync(envFile,contents,{mode:0o600});
    console.log('Created dedicated local database account; password saved privately.');
    return;
  }
  loadEnvConfig(path.dirname(envFile), false, {info(){},error(){}});
  const env=process.env;
  const token=env.META_WEBHOOK_VERIFY_TOKEN || env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  for(const [name,value] of Object.entries({DATABASE_URL:env.DATABASE_URL,META_APP_SECRET:env.META_APP_SECRET,WEBHOOK_VERIFY_TOKEN:token,GODADDY_SMTP_USER:env.GODADDY_SMTP_USER,GODADDY_SMTP_PASSWORD:env.GODADDY_SMTP_PASSWORD})) {
    check(value && !/replace[_-]|your-|user:password/i.test(value), `${name} is missing or a placeholder.`);
  }
  const url=new URL(env.DATABASE_URL);
  check(url.protocol==='mysql:' && decodeURIComponent(url.pathname.slice(1))==='cunnectit','DATABASE_URL must be a mysql URL for cunnectit.');
  check(url.username && url.password,'Database username/password are required.');
  check(decodeURIComponent(url.username)!=='root','Use a dedicated database account instead of root.');
  check(!url.search,'URL query options are not supported by this deployment helper; configure TLS on a local or separately managed connection.');
  const port=Number(env.GODADDY_SMTP_PORT || 465);
  check(Number.isInteger(port) && port>0 && port<=65535,'Invalid SMTP port.');
  check(!env.GODADDY_SMTP_SECURE || ['true','false'].includes(env.GODADDY_SMTP_SECURE.toLowerCase()),'SMTP secure must be true or false.');
  if(mode==='validate') {
    check(extra,'Missing private MySQL option-file destination.');
    fs.writeFileSync(extra,`[client]\nhost=${cnfQuote(url.hostname)}\nport=${url.port||3306}\nuser=${cnfQuote(decodeURIComponent(url.username))}\npassword=${cnfQuote(decodeURIComponent(url.password))}\ndatabase=cunnectit\nprotocol=TCP\n`,{mode:0o600});
    console.log('Required environment settings validated; no values printed.');
    return;
  }
  if(mode==='smtp') {
    const transport=nodemailer.createTransport({host:env.GODADDY_SMTP_HOST||'smtpout.secureserver.net',port,secure:env.GODADDY_SMTP_SECURE?.toLowerCase()!=='false',requireTLS:env.GODADDY_SMTP_SECURE?.toLowerCase()==='false',auth:{user:env.GODADDY_SMTP_USER,pass:env.GODADDY_SMTP_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});
    try {await transport.verify(); console.log('SMTP connection/authentication succeeded; no email sent.');} finally {transport.close();}
    return;
  }
  check(mode==='database','Unknown helper command.');
  const connection=await mysql.createConnection({uri:env.DATABASE_URL,connectTimeout:10000});
  try {
    for(const file of ['privacy-consents.sql','message-deliveries.sql']) {
      const schema=fs.readFileSync(path.join(path.dirname(envFile),'database',file),'utf8').replace(/^\uFEFF/,'');
      await connection.query(schema);
    }
    const tables={privacy_consents:['id','consent_id','decision','policy_version','page_path','first_recorded_at','updated_at'],message_deliveries:['workspace_key','wamid','recipient_phone','template_name','status','error_code','error_message','status_payload','charged_amount','credit_due','sent_at','delivered_at','read_at','failed_at']};
    for(const [table,required] of Object.entries(tables)) {
      const [columns]=await connection.execute('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?',[table]);
      const present=new Set(columns.map(c=>c.COLUMN_NAME));
      check(required.every(c=>present.has(c)), `${table} has an incompatible existing schema; restore/migrate it manually.`);
      const [indexes]=await connection.execute('SELECT INDEX_NAME,COLUMN_NAME,SEQ_IN_INDEX FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND NON_UNIQUE=0 ORDER BY INDEX_NAME,SEQ_IN_INDEX',[table]);
      const groups=Object.groupBy(indexes,x=>x.INDEX_NAME);
      const expected=table==='message_deliveries'?'workspace_key,wamid':'consent_id,policy_version';
      check(Object.values(groups).some(g=>g.map(i=>i.COLUMN_NAME).join(',')===expected), `${table} needs its expected unique index.`);
      const [count]=await connection.query(`SELECT COUNT(*) AS count FROM ${table}`);
      console.log(`${table}: schema checked; ${count[0].count} existing rows preserved.`);
    }
  } finally {await connection.end();}
}
main().catch(error=>{console.error(`Deployment configuration check failed (${error.code || 'validation'}). ${error.code ? 'Inspect connectivity, credentials and grants; sensitive details suppressed.' : error.message}`);process.exitCode=1;});

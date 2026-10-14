import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'cunnectit-deploy-test-'));
const envFile=path.join(fixture,'.env');
const optionFile=path.join(fixture,'mysql.cnf');
const helper=path.resolve('scripts/deploy-config.mjs');
const values={DATABASE_URL:'mysql://cunnectit_app:p%23%24%22%5Cword@127.0.0.1:3306/cunnectit',META_WEBHOOK_VERIFY_TOKEN:'contract-token',META_APP_SECRET:'contract-secret',GODADDY_SMTP_USER:'contract@example.invalid',GODADDY_SMTP_PASSWORD:'secret#$"\\word',GODADDY_SMTP_PORT:'465',GODADDY_SMTP_SECURE:'true'};
const env={...process.env};
for(const name of [...Object.keys(values),'WHATSAPP_WEBHOOK_VERIFY_TOKEN']) delete env[name];
function run(overrides={}) {
  fs.writeFileSync(envFile,Object.entries({...values,...overrides}).map(([k,v])=>`${k}=${JSON.stringify(v).replaceAll('$','\\$')}`).join('\n'));
  return spawnSync(process.execPath,[helper,'validate',envFile,optionFile],{env,encoding:'utf8'});
}
try {
  let result=run();
  assert.equal(result.status,0,result.stderr);
  const cnf=fs.readFileSync(optionFile,'utf8');
  assert.ok(cnf.includes('database=cunnectit'));
  assert.ok(cnf.includes('password="p#$\\"\\\\word"'));
  assert.ok(!result.stdout.includes('contract-secret'));
  assert.ok(!result.stdout.includes('p#$'));
  result=run({DATABASE_URL:'mysql://root:test@127.0.0.1/cunnectit'});
  assert.notEqual(result.status,0);
  result=run({DATABASE_URL:'mysql://app:test@127.0.0.1/wrong_database'});
  assert.notEqual(result.status,0);
  result=run({META_APP_SECRET:'REPLACE_WITH_SECRET'});
  assert.notEqual(result.status,0);
  result=run({GODADDY_SMTP_PORT:'invalid'});
  assert.notEqual(result.status,0);
  result=run({META_WEBHOOK_VERIFY_TOKEN:'',WHATSAPP_WEBHOOK_VERIFY_TOKEN:'fallback-contract-token'});
  assert.equal(result.status,0,result.stderr);
  console.log('Deployment environment validation and credential escaping tests passed. No network calls made.');
} finally {fs.rmSync(fixture,{recursive:true,force:true});}

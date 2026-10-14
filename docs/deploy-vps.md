# Cunnectit VPS deployment

Run this script explicitly on an Ubuntu/Debian VPS with systemd. Git clone does not deploy anything. It uses `/opt/cunnectit`, `/etc/cunnectit`, the `cunnectit` service, and internal port 3101. It does not modify Teakwood, DNS, firewall rules, or global Node. Installing packages and restarting/reloading Nginx can affect the shared VPS; review its existing setup first.

## Prepare credentials

Clone the repository on the VPS, then securely supply a private `.env` in that checkout. `.env` is ignored by Git and is not transferred by clone. Use `.env.example` for variable names; replace every placeholder. Preserve the existing Meta verification token and app secret, and use the mailbox's SMTP credentials. Do not put secrets in shell arguments, screenshots, or Git.

`DATABASE_URL` must target `cunnectit`, with a dedicated account rather than root. For MySQL on the same VPS, use `127.0.0.1:3306`. URL-encode special characters in its username/password. A Workbench account configured with `REQUIRE SSL` is not automatically suitable for the application's unencrypted local connection; use a separate local app account. This helper rejects URL query options and does not configure remote database TLS.

The script can provision `cunnectit_app@localhost` via local root socket authentication. It refuses to rotate an existing account. MySQL must already be installed and running; the script deliberately leaves its listener/firewall configuration alone. The generated account receives SELECT, INSERT, UPDATE and CREATE on `cunnectit` only. If root socket authentication is unavailable, provision an account manually and provide its URL.

## Prepare before DNS cutover

From the VPS checkout, with all environment values configured:

```bash
sudo bash scripts/deploy-vps.sh --http-only
```

To create the dedicated local account and replace only DATABASE_URL in the staged private configuration:

```bash
sudo bash scripts/deploy-vps.sh --http-only --create-db
```

This first run needs a private `.env` with valid SMTP and Meta values; the DATABASE_URL placeholder can be replaced by `--create-db`. Future runs reuse `/etc/cunnectit/app.env` by default. To apply changed secrets, pass `--env-file=/absolute/path/to/.env`. The checkout's `.env` is not changed. Port conflicts abort; use `--port=3102` if needed ; later runs reuse the port from the installed service.

The script installs a private Node 22 runtime with checksum verification, uses `npm ci`, checks configuration, backs up the database, creates missing tables, verifies their required columns/unique indexes, checks SMTP authentication without sending mail, runs webhook regression checks, builds Next.js, and starts the service behind Nginx. Builds require outbound network access for Google fonts. Use `--skip-smtp-check` only when intentionally deferring SMTP verification; email functionality remains unverified.

HTTP preparation does not provide public HTTPS. Test with an HTTP Host header before cutover:

```bash
curl -H 'Host: www.cunnectit.com' http://127.0.0.1/api/webhook/whatsapp
sudo systemctl status cunnectit
```

The app binds only to loopback. Its webhook readiness endpoint checks configuration, not a live Meta event or table write. Database connectivity/schema checks run separately during deployment. SMTP verification is not proof of actual email delivery. No real email or Meta delivery test is sent by the script.

## Existing data

The repository includes both table creation schemas. New tables start empty. The script preserves existing tables and `test1`; it does not delete or replace them. It refuses incompatible existing required columns/indexes. Schema additions are not automatically reversed.

Git does not transfer database contents. If historical consents/deliveries are needed, export both tables from the old database and restore a trusted database-scoped SQL dump into `cunnectit` before deployment, using an administrator and a backup. Review the dump for `CREATE DATABASE`, `USE`, user/grant statements and conflicting tables. A full replacement or unreviewed dump is not executed by this script. Retain a backup of the source database until cutover is verified.

Backups are written to `/etc/cunnectit/backups` with root-only permissions. Deployment fails if a backup cannot be made; inspect dump privileges, tables/views or disk space. Backups contain private data; preserve a separate off-VPS copy. Releases and backups are retained; manage disk usage explicitly.

## HTTPS and DNS cutover

Prepare and test the VPS first. Then explicitly change only website DNS for `cunnectit.com` and `www.cunnectit.com` to reach the VPS. Replace the existing www Vercel CNAME as appropriate, and check for stale AAAA records. Preserve GoDaddy MX/TXT email records. Hostinger and OS firewalls must permit 80/443; the script does not edit them. MySQL need not be public for this website.

Once BOTH names reach this VPS, run:

```bash
sudo bash scripts/deploy-vps.sh --https --email=YOUR_CERTIFICATE_EMAIL
```

The script asks for acceptance of Let's Encrypt terms, issues a certificate for both names, redirects HTTP to HTTPS, enables `certbot.timer`, and tests renewal. Re-running in HTTP mode retains an existing Cunnectit certificate rather than downgrading HTTPS. Keep Vercel available until public pages, contact enquiries, consent storage, and signed webhook events are verified. The same public webhook URL can remain registered with Meta.

## Failure and rollback

After the service switch, failures restore the previous release, service definition, private config and Nginx site when present. Package installations, account creation, table additions and certificates are retained. Database changes are not rolled back. A first-run failure removes the newly installed app/proxy definitions but retains its staged release for inspection. Do not publish logs containing credentials.

For manual application rollback, inspect retained release directories, then select the previous successful release:

```bash
sudo ln -sfn /opt/cunnectit/releases/PREVIOUS_RELEASE /opt/cunnectit/current
sudo systemctl restart cunnectit
```

This uses that release's private `.env`. Restore `/etc/cunnectit/app.env` from its matching private backup before the next deployment if credentials also need reverting. A port change may require restoring the matching unit/Nginx backups. Database restoration is a separate operation and must account for writes after the backup.

The tracked environment example has been sanitized. If its former database credential was valid, rotate it wherever used; replacing the file does not remove the credential from Git history.

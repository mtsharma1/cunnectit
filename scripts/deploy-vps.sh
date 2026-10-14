#!/usr/bin/env bash
# Explicit Ubuntu/Debian deployment. Cloning never executes this script.
set -Eeuo pipefail
umask 077
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd -- "$SCRIPT_DIR/.." && pwd)"
BASE=/opt/cunnectit
CONFIG=/etc/cunnectit
SERVICE=cunnectit
APP_USER=cunnectit
SITE=/etc/nginx/sites-available/cunnectit
ENABLED=/etc/nginx/sites-enabled/cunnectit
UNIT=/etc/systemd/system/cunnectit.service
NODE_HOME="$BASE/node"
PORT=3101
PORT_EXPLICIT=0
HTTPS=0
CREATE_DB=0
CHECK_SMTP=1
EMAIL=''
ENV_SOURCE=''
for arg in "$@"; do
  case "$arg" in
    --http-only) HTTPS=0 ;;
    --https) HTTPS=1 ;;
    --create-db) CREATE_DB=1 ;;
    --skip-smtp-check) CHECK_SMTP=0 ;;
    --port=*) PORT="${arg#*=}"; PORT_EXPLICIT=1 ;;
    --env-file=*) ENV_SOURCE="${arg#*=}" ;;
    --email=*) EMAIL="${arg#*=}" ;;
    --help|-h)
      printf 'Usage: sudo bash scripts/deploy-vps.sh [--http-only|--https --email=ADDRESS] [--create-db] [--env-file=/private/.env] [--port=3101] [--skip-smtp-check]\nDefault: HTTP preparation; DNS and firewall settings are never changed.\n'
      exit 0 ;;
    *) printf 'Unknown option: %s\n' "$arg" >&2; exit 1 ;;
  esac
done
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
log() { printf '\n%s\n' "$*"; }
[[ $EUID -eq 0 ]] || fail 'Run with sudo bash scripts/deploy-vps.sh.'
[[ -d /run/systemd/system ]] || fail 'Requires a systemd VPS.'
[[ -f "$REPO/package-lock.json" ]] || fail 'Missing package-lock.json.'
. /etc/os-release
[[ "$ID" == ubuntu || "$ID" == debian ]] || fail 'Supported OS: Ubuntu or Debian.'
if [[ $PORT_EXPLICIT == 0 && -f "$UNIT" ]]; then
  SAVED_PORT="$(sed -n 's/^ExecStart=.* --port \([0-9]*\)$/\1/p' "$UNIT")"
  [[ -z "$SAVED_PORT" ]] || PORT="$SAVED_PORT"
fi
[[ "$PORT" =~ ^[1-9][0-9]{3,4}$ ]] || fail 'Invalid internal port.'
(( PORT >= 1024 && PORT <= 65535 )) || fail 'Port must be 1024..65535.'
if [[ $HTTPS == 1 ]]; then
  [[ "$EMAIL" == *@*.* && "$EMAIL" != *' '* ]] || fail 'Pass --email=ADDRESS with --https.'
  [[ -t 0 ]] || fail 'HTTPS requires an interactive terminal for certificate terms.'
  printf 'Let\047s Encrypt subscriber terms: https://letsencrypt.org/repository/\n'
  read -r -p 'Accept the certificate subscriber terms? [y/N]: ' ACCEPT
  [[ "$ACCEPT" =~ ^[Yy]$ ]] || fail 'Terms were not accepted.'
fi
[[ ! -d "$BASE" || -f "$BASE/.managed-by-cunnectit" ]] || fail '/opt/cunnectit exists and is not managed by this script.'
if [[ ! -f "$BASE/.managed-by-cunnectit" ]]; then
  [[ ! -e "$UNIT" && ! -e "$SITE" && ! -e "$CONFIG" ]] || fail 'Existing Cunnectit service/configuration requires manual review.'
  ! id "$APP_USER" >/dev/null 2>&1 || fail 'Existing cunnectit OS account requires manual review.'
fi
mkdir -p "$BASE" "$CONFIG"
chmod 755 "$BASE"
touch "$BASE/.managed-by-cunnectit"
exec 9>"$BASE/deploy.lock"
flock -n 9 || fail 'Another Cunnectit deployment is running.'
TMP="$(mktemp -d)"
PREVIOUS="$(readlink -f "$BASE/current" 2>/dev/null || true)"
CHANGED=0
COMPLETED=0
for item in "$UNIT" "$SITE" "$CONFIG/app.env"; do
  [[ ! -f "$item" ]] || cp -p "$item" "$TMP/$(basename "$item").previous"
done
WAS_ENABLED=0
[[ ! -L "$ENABLED" ]] || WAS_ENABLED=1
cleanup() {
  local result=$?
  trap - EXIT
  if [[ $COMPLETED == 0 && $CHANGED == 1 ]]; then
    printf '\nDeployment failed; restoring previous app/service/proxy settings.\n' >&2
    systemctl stop "$SERVICE" || true
    if [[ -n "$PREVIOUS" ]]; then ln -sfn "$PREVIOUS" "$BASE/current"; else rm -f "$BASE/current"; fi
    for item in "$UNIT" "$SITE" "$CONFIG/app.env"; do
      if [[ -f "$TMP/$(basename "$item").previous" ]]; then
        cp -p "$TMP/$(basename "$item").previous" "$item"
      else
        rm -f "$item"
      fi
    done
    [[ $WAS_ENABLED == 1 ]] || rm -f "$ENABLED"
    systemctl daemon-reload
    if [[ -n "$PREVIOUS" ]]; then systemctl restart "$SERVICE" || true; else systemctl disable "$SERVICE" >/dev/null 2>&1 || true; fi
    if nginx -t; then systemctl reload nginx || true; fi
    printf 'Database schema additions/accounts, packages and issued certificates are retained.\n' >&2
  fi
  rm -rf -- "$TMP"
  exit "$result"
}
trap cleanup EXIT
if [[ -z "$ENV_SOURCE" ]]; then
  if [[ -f "$CONFIG/app.env" ]]; then ENV_SOURCE="$CONFIG/app.env"; else ENV_SOURCE="$REPO/.env"; fi
fi
[[ -f "$ENV_SOURCE" ]] || fail 'Provide a private .env file with database, SMTP and Meta settings; see .env.example.'
if [[ -d /etc/nginx/sites-enabled ]]; then
  while IFS= read -r config; do
    [[ "$(readlink -f "$config")" == "$SITE" ]] && continue
    if grep -Eq '^[[:space:]]*server_name[[:space:]]+([^;]*[[:space:]])?(www\.)?cunnectit\.com([[:space:]]|;)' "$config"; then
      fail "Cunnectit domain already configured in $config; resolve the conflict manually."
    fi
  done < <(find /etc/nginx/sites-enabled -maxdepth 1 \( -type f -o -type l \))
fi
if ss -H -ltn "sport = :$PORT" | grep -q .; then
  if [[ ! -f "$UNIT" ]] || ! grep -Fq -- "--port $PORT" "$UNIT" || ! systemctl is-active --quiet "$SERVICE"; then
    fail "Port $PORT is occupied. Choose --port=ANOTHER_PORT."
  fi
fi
log 'Installing deployment prerequisites (existing MySQL service is preserved)'
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y ca-certificates curl xz-utils rsync nginx default-mysql-client build-essential
[[ $HTTPS == 0 ]] || DEBIAN_FRONTEND=noninteractive apt-get install -y certbot
log 'Installing a private Node 22 runtime; global Node and Teakwood are preserved'
case "$(uname -m)" in
  x86_64) ARCH=x64 ;;
  aarch64|arm64) ARCH=arm64 ;;
  *) fail 'Unsupported CPU architecture.' ;;
esac
if [[ ! -x "$NODE_HOME/bin/node" ]]; then
  curl --proto '=https' -fsSL https://nodejs.org/dist/latest-v22.x/SHASUMS256.txt -o "$TMP/SHASUMS256.txt"
  ARCHIVE="$(awk -v arch="$ARCH" '$2 ~ ("^node-v22\\.[0-9]+\\.[0-9]+-linux-" arch "\\.tar\\.xz$") {print $2}' "$TMP/SHASUMS256.txt")"
  [[ -n "$ARCHIVE" && "$ARCHIVE" != *$'\n'* ]] || fail 'Cannot resolve Node 22 release.'
  VERSION="${ARCHIVE#node-}"; VERSION="${VERSION%-linux-*}"
  curl --proto '=https' -fsSL "https://nodejs.org/dist/$VERSION/$ARCHIVE" -o "$TMP/$ARCHIVE"
  (cd "$TMP"; awk -v file="$ARCHIVE" '$2 == file' SHASUMS256.txt > CHECKSUM; sha256sum -c CHECKSUM)
  mkdir -p "$NODE_HOME"
  tar -xJf "$TMP/$ARCHIVE" -C "$NODE_HOME" --strip-components=1
fi
chmod -R a+rX "$NODE_HOME"
export PATH="$NODE_HOME/bin:$PATH"
[[ "$(node -p 'process.versions.node.split(".")[0]')" == 22 ]] || fail 'Private runtime must be Node 22.'
id "$APP_USER" >/dev/null 2>&1 || useradd --system --home-dir "$BASE" --shell /usr/sbin/nologin "$APP_USER"
chown root:"$APP_USER" "$CONFIG"
chmod 750 "$CONFIG"
RELEASE="$BASE/releases/$(date -u +%Y%m%dT%H%M%SZ)-$$"
mkdir -p "$RELEASE"
chmod 755 "$BASE/releases"
rsync -a --exclude=.git --exclude=node_modules --exclude=.next --exclude='.env*' --exclude=.vercel --exclude='*.log' "$REPO/" "$RELEASE/"
chmod -R u+rwX,go+rX "$RELEASE"
chown -R "$APP_USER:$APP_USER" "$RELEASE"
# Install dependencies without giving lifecycle scripts access to SMTP/Meta secrets.
(cd "$RELEASE"; runuser -u "$APP_USER" -- env PATH="$PATH" npm ci --include=dev --cache "$RELEASE/.npm-cache")
install -m 600 -o root -g root "$ENV_SOURCE" "$RELEASE/.env"
if [[ $CREATE_DB == 1 ]]; then node "$RELEASE/scripts/deploy-config.mjs" create-db "$RELEASE/.env"; fi
node "$RELEASE/scripts/deploy-config.mjs" validate "$RELEASE/.env" "$TMP/mysql.cnf"
mkdir -p "$CONFIG/backups"
chmod 700 "$CONFIG/backups"
BACKUP="$CONFIG/backups/cunnectit-$(date -u +%Y%m%dT%H%M%SZ)-$$.sql"
log 'Backing up existing database before adding schemas'
mysqldump --defaults-extra-file="$TMP/mysql.cnf" --single-transaction --skip-lock-tables --no-tablespaces cunnectit > "$BACKUP"
chmod 600 "$BACKUP"
node "$RELEASE/scripts/deploy-config.mjs" database "$RELEASE/.env"
if [[ $CHECK_SMTP == 1 ]]; then node "$RELEASE/scripts/deploy-config.mjs" smtp "$RELEASE/.env"; fi
chown "$APP_USER:$APP_USER" "$RELEASE/.env"
chmod 600 "$RELEASE/.env"
log 'Running webhook regression checks and production build'
(cd "$RELEASE"; runuser -u "$APP_USER" -- env PATH="$PATH" npm run webhook:test; runuser -u "$APP_USER" -- env PATH="$PATH" node scripts/test-deploy-config.mjs; runuser -u "$APP_USER" -- env PATH="$PATH" NODE_ENV=production npm run build)
# Preserve all releases and backups; rollback never reverses database changes.
for item in "$UNIT" "$SITE" "$CONFIG/app.env"; do
  [[ ! -f "$item" ]] || cp -p "$item" "$CONFIG/backups/$(basename "$item")-$(date -u +%Y%m%dT%H%M%SZ)-$$"
done
CHANGED=1
cat > "$UNIT" <<UNIT
[Unit]
Description=Cunnectit website
After=network.target
[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$BASE/current
Environment=NODE_ENV=production
Environment=PATH=$NODE_HOME/bin:/usr/bin:/bin
ExecStart=$NODE_HOME/bin/node $BASE/current/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port $PORT
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
UMask=0077
[Install]
WantedBy=multi-user.target
UNIT
install -m 640 -o root -g "$APP_USER" "$RELEASE/.env" "$CONFIG/app.env"
ln -sfn "$RELEASE" "$BASE/current"
systemctl daemon-reload
systemctl enable "$SERVICE"
systemctl restart "$SERVICE"
READY=0
for attempt in {1..40}; do
  if curl -fsS --max-time 3 "http://127.0.0.1:$PORT/" >/dev/null && curl -fsS --max-time 3 "http://127.0.0.1:$PORT/api/webhook/whatsapp" >/dev/null; then READY=1; break; fi
  sleep 1
done
[[ $READY == 1 ]] || fail 'Application health checks failed. Inspect journalctl -u cunnectit locally.'
mkdir -p /var/www/cunnectit-acme
chmod 755 /var/www/cunnectit-acme
CERT=/etc/letsencrypt/live/cunnectit
write_proxy() {
  cat <<NGINX
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_buffering off;
    }
NGINX
}
write_site() {
  {
    printf 'server {\n    listen 80;\n    server_name cunnectit.com www.cunnectit.com;\n    location /.well-known/acme-challenge/ { root /var/www/cunnectit-acme; }\n'
    if [[ -f "$CERT/fullchain.pem" && -f "$CERT/privkey.pem" ]]; then
      printf '    location / { return 301 https://$host$request_uri; }\n}\nserver {\n    listen 443 ssl;\n    server_name cunnectit.com www.cunnectit.com;\n'
      printf '    ssl_certificate %s/fullchain.pem;\n    ssl_certificate_key %s/privkey.pem;\n' "$CERT" "$CERT"
    fi
    write_proxy
    printf '}\n'
  } > "$SITE"
}
write_site
ln -sfn "$SITE" "$ENABLED"
nginx -t
systemctl enable --now nginx
systemctl reload nginx
if [[ $HTTPS == 1 ]]; then
  log 'Issuing HTTPS certificate (both domain names must already reach this VPS)'
  certbot certonly --non-interactive --agree-tos --email "$EMAIL" --webroot -w /var/www/cunnectit-acme --cert-name cunnectit -d cunnectit.com -d www.cunnectit.com --keep-until-expiring --deploy-hook 'systemctl reload nginx'
  write_site
  nginx -t
  systemctl reload nginx
  systemctl enable --now certbot.timer
  certbot renew --cert-name cunnectit --dry-run
fi
for host in cunnectit.com www.cunnectit.com; do
  if [[ -f "$CERT/fullchain.pem" ]]; then
    curl -fsS --max-time 10 --resolve "$host:443:127.0.0.1" "https://$host/api/webhook/whatsapp" >/dev/null
  else
    curl -fsS --max-time 10 -H "Host: $host" http://127.0.0.1/api/webhook/whatsapp >/dev/null
  fi
done
COMPLETED=1
printf '\nCunnectit deployed successfully.\nService: systemctl status cunnectit\nLogs: journalctl -u cunnectit -f\nPrivate configuration: /etc/cunnectit/app.env\nDatabase backup: %s\nDNS and firewall records were not changed.\n' "$BACKUP"

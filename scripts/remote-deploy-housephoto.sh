#!/usr/bin/env bash
set -euo pipefail

domain="housephoto.ru"
server_ip="62.109.10.56"
site_root="/var/www/$domain"
release_id="$(date -u +%Y%m%d%H%M%S)"
release_dir="$site_root/releases/$release_id"
archive="/tmp/housephoto-release.tgz"
nginx_available="/etc/nginx/sites-available/$domain"
nginx_enabled="/etc/nginx/sites-enabled/$domain"
config_backup=""

if ! command -v nginx >/dev/null 2>&1; then
  echo "Nginx не найден. Установка остановлена без изменений."
  exit 1
fi

if [[ ! -f "$archive" ]]; then
  echo "Архив сайта не найден: $archive"
  exit 1
fi

mkdir -p "$release_dir"
tar -xzf "$archive" -C "$release_dir"

if [[ ! -f "$release_dir/index.html" ]]; then
  echo "В архиве отсутствует index.html. Установка остановлена."
  rm -rf "$release_dir"
  exit 1
fi

if [[ -f "$nginx_available" ]]; then
  config_backup="$nginx_available.backup-$release_id"
  cp -a "$nginx_available" "$config_backup"
fi

cat > "$nginx_available" <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name housephoto.ru www.housephoto.ru;

    root /var/www/housephoto.ru/current;
    index index.html;

    access_log /var/log/nginx/housephoto.ru.access.log;
    error_log /var/log/nginx/housephoto.ru.error.log;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location /_next/static/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(?:avif|webp|png|jpe?g|svg|woff2)$ {
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
NGINX

ln -sfn "$nginx_available" "$nginx_enabled"

if ! nginx -t; then
  echo "Новый конфиг Nginx не прошёл проверку. Восстанавливаю прежнее состояние."
  rm -f "$nginx_enabled"
  if [[ -n "$config_backup" ]]; then
    mv -f "$config_backup" "$nginx_available"
    ln -sfn "$nginx_available" "$nginx_enabled"
  else
    rm -f "$nginx_available"
  fi
  rm -rf "$release_dir"
  nginx -t || true
  exit 1
fi

next_link="$site_root/current.next"
rm -f "$next_link"
ln -s "$release_dir" "$next_link"
mv -Tf "$next_link" "$site_root/current"

systemctl reload nginx

if ! curl -fsS -H "Host: $domain" http://127.0.0.1/ | grep -q "HOUSEPHOTO"; then
  echo "Nginx запущен, но проверка главной страницы не прошла."
  exit 1
fi

find "$site_root/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
  | sort -nr \
  | awk 'NR > 3 { sub(/^[^ ]+ /, ""); print }' \
  | while IFS= read -r old_release; do rm -rf "$old_release"; done

rm -f "$archive" /tmp/remote-deploy-housephoto.sh

resolve_to_server() {
  getent ahostsv4 "$1" 2>/dev/null | awk '{print $1}' | grep -Fxq "$server_ip"
}

cert_domains=()
if resolve_to_server "$domain"; then
  cert_domains+=("-d" "$domain")
fi
if resolve_to_server "www.$domain"; then
  cert_domains+=("-d" "www.$domain")
fi

if (( ${#cert_domains[@]} > 0 )) && command -v certbot >/dev/null 2>&1; then
  if certbot --nginx "${cert_domains[@]}" --redirect --non-interactive --agree-tos --register-unsafely-without-email; then
    echo "HTTPS подключён."
  else
    echo "Сайт работает по HTTP, но Certbot не смог выпустить сертификат."
  fi
else
  echo "HTTPS пока пропущен: направьте A-записи домена на $server_ip и повторите установку."
fi

echo "HousePhoto установлен: $release_dir"
echo "Существующие сайты и их процессы не изменялись."

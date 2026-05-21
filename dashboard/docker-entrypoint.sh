#!/bin/sh
set -e

# Apply committed migrations before the server starts. Retries because the
# Postgres container may still be coming up (compose healthcheck + depends_on
# usually covers this, but the retry makes it robust on a slow Proxmox host).
echo "[entrypoint] applying database migrations..."
n=0
until prisma migrate deploy --schema=./prisma/schema.prisma; do
  n=$((n + 1))
  if [ "$n" -ge 30 ]; then
    echo "[entrypoint] database not reachable after 30 attempts — exiting"
    exit 1
  fi
  echo "[entrypoint] migrate deploy failed (db not ready?) — retry $n/30 in 2s"
  sleep 2
done

echo "[entrypoint] migrations applied — starting server"
exec "$@"

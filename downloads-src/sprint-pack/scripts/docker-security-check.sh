#!/usr/bin/env bash
set -euo pipefail

# Basic Docker security checks (read-only)

if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found" >&2
  exit 1
fi

echo "== Docker version =="
docker version || true

echo "== Running containers =="
docker ps --format 'table {{.ID}}\t{{.Image}}\t{{.Names}}\t{{.Ports}}'

echo "== Privileged containers =="
docker ps -q | while read -r id; do
  priv=$(docker inspect -f '{{.HostConfig.Privileged}}' "$id" 2>/dev/null || echo "false")
  if [[ "$priv" == "true" ]]; then
    name=$(docker inspect -f '{{.Name}}' "$id" | sed 's#^/##')
    echo "PRIVILEGED: $name ($id)"
  fi
done

echo "== Containers mounting docker.sock =="
docker ps -q | while read -r id; do
  mounts=$(docker inspect -f '{{range .Mounts}}{{.Source}} {{end}}' "$id" 2>/dev/null || true)
  if echo "$mounts" | grep -q '/var/run/docker.sock'; then
    name=$(docker inspect -f '{{.Name}}' "$id" | sed 's#^/##')
    echo "DOCKER.SOCK MOUNT: $name ($id)"
  fi
done

echo "Done."

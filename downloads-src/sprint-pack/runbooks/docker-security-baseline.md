# Docker Security Baseline

## Goal
Reduce container breakout risk, protect secrets, and prevent insecure runtime configs.

## Baseline rules
- Keep Docker Engine updated
- Avoid running containers as root
- Drop capabilities, enable seccomp
- Use read-only filesystems where possible
- Never bake secrets into images
- Scan images (Trivy/Grype)

## Procedure

### 1) Verify Docker daemon settings
Check `/etc/docker/daemon.json`:
```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" },
  "icc": false,
  "live-restore": true
}
```

### 2) Container run hardening
Preferred flags:
- `--read-only`
- `--cap-drop=ALL` (+ add only necessary)
- `--security-opt=no-new-privileges:true`
- `--pids-limit=200`
- `--memory=512m` `--cpus=1`

Example:
```bash
docker run --read-only --cap-drop=ALL \
  --security-opt no-new-privileges:true \
  --pids-limit 200 --memory 512m --cpus 1 \
  -p 8080:8080 myimage:latest
```

### 3) Image provenance
- Pin image digests
- Use signed images (cosign)
- Mirror to private registry

### 4) Detection
- Alert on:
  - privileged containers
  - mounts of `/var/run/docker.sock`
  - new containers with host networking

## Incident response
If you suspect compromise:
- Collect `docker ps -a`, `docker inspect`, logs
- Snapshot host
- Rotate registry creds
- Rebuild images from trusted source

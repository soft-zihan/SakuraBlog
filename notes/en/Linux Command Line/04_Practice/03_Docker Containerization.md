# 03 Docker Containerization

## 1. `run` — start containers

- `docker run -d -p 8080:80 --name my-app nginx`: run nginx in the background, map ports, and name the container

Key flags:

- `-d`: detached (background)
- `-p <host>:<container>`: port mapping (host 8080 → container 80)
- `-v <host>:<container>`: **volume mount**
  - Core use: **data persistence**. Containers are disposable—delete the container and its internal data disappears. Volumes keep data on the host.
  - Example: `-v /home/user/data:/var/lib/mysql`
- `-e KEY=VALUE`: set environment variables
  - Scenario: DB passwords, API keys
  - Example: `-e MYSQL_ROOT_PASSWORD=secret`
- `--network`: networking mode
  - `bridge` (default): container gets its own IP; expose via port mapping
  - `host`: shares the host network stack (same IP/ports)
    - Pros: very high performance
    - Cons: port conflicts are easy
- `--restart always`: restart on boot or after crashes

- `docker run --rm -it ubuntu bash`: run a temporary interactive container; it is removed after exit

---

## 2. `ps` / `stats` — container status

- `docker ps`: list running containers
- `docker ps -a`: list all containers (including stopped)
- `docker stats`: live CPU/memory usage per container

---

## 3. `exec` / `logs` / `inspect` — debugging and troubleshooting

These are daily operations for container maintenance.

- `docker logs -f <container>`: follow logs
- `docker exec -it <container> bash`: enter an interactive shell
  - Tip: some images don’t have `bash` (e.g., Alpine). Use `sh`.
  - Run as root: `docker exec -u root -it <container> bash`
- `docker inspect <container>`: inspect metadata (mounts, network, env vars)
  - Quick IP lookup:
    - Simple: `docker inspect <ID> | grep IPAddress`
    - More direct:
      `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container>`

---

## 4. `images` / `build` — image management

- `docker images`: list local images
- `docker pull <image>`: pull an image
- `docker build -t my-image:v1 .`: build from the Dockerfile in the current directory
  - Tip: if builds are slow due to networking, try `--network=host` (environment-dependent).

---

## 5. Common operations pain points

- “I changed config but nothing happened”
  - Many apps read config only at startup → `docker restart <container>`
  - If you changed Docker daemon config (`daemon.json`):
    `sudo systemctl daemon-reload && sudo systemctl restart docker`

- “Docker filled up my disk”
  - `docker system prune -a`: remove stopped containers, unused images, and build cache
    - Warning: this clears build cache; the next build may be slower.
  - Log explosion: check large `.log` files under `/var/lib/docker/containers/`
    - Fix: configure log rotation via the `logging` driver (often in `docker-compose.yml`).

---

## 6. `save`/`load`/`export`/`import` — offline deployment

Scenario: the server has no internet access, or you need to move environments manually.

- For images (recommended; preserves layers):
  - `docker save -o my-image.tar <image_name>`
  - `docker load -i my-image.tar`
- For containers (filesystem snapshot; loses build layers):
  - `docker export <container_id> > my-container.tar`
  - `docker import my-container.tar <new_image_name>`

---

## 7. `compose` — multi-container orchestration

- `docker compose up -d`: start services from `docker-compose.yml` (new syntax)
- `docker compose down`: stop and remove containers and networks
- `docker compose logs -f`: follow logs for all services

Pro tip: try **lazydocker** as a TUI for Docker—view logs, restart containers, and clean images interactively.

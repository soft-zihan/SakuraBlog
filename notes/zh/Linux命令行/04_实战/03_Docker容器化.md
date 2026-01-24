# 🐳 Docker 容器化

## 1. run - 启动容器

* **docker run -d -p 8080:80 --name my-app nginx**：后台运行 nginx，映射端口，指定名称

  * **-d**：后台运行 (Detached)
  * **-p `<host>`:`<container>`**：端口映射 (将主机的 8080 映射到容器的 80)
  * **-v `<host>`:`<container>`**：**挂载卷 (Volume)**。
    - **核心用途**：**数据持久化**。容器是“易碎品”，一旦删除，内部数据也会消失。挂载卷能将容器内的数据（如数据库文件、日志）存放在宿主机上，即使容器删了，数据还在。
    - *示例*：`-v /home/user/data:/var/lib/mysql`
  * **-e KEY=VALUE**：**设置环境变量**。
    - **场景**：配置数据库密码、API Key 等。
    - *示例*：`-e MYSQL_ROOT_PASSWORD=secret`
  * **--network**：**网络模式**。
    - `bridge` (默认)：桥接模式，容器有独立 IP，需端口映射。
    - `host`：**主机模式**。容器共享主机的网络栈 (IP 和端口)。**优势**：性能极高，适合高吞吐场景；**缺点**：端口易冲突。
  * **--restart always**：开机自启或崩溃重启
* **docker run --rm -it ubuntu bash**：启动临时容器进入交互模式，退出后自动删除

## 2. ps / stats - 查看容器状态

* **docker ps**：列出正在运行的容器
* **docker ps -a**：列出所有容器 (包括已停止的)
* **docker stats**：实时查看容器资源占用 (CPU/内存)

## 3. exec / logs / inspect - 调试与排障
这是容器运维最频繁的操作。

* **docker logs -f `<container>`**：实时追踪日志。
* **docker exec -it `<container>` bash**：进入交互终端。
  - **💡 技巧**：如果容器里没有 `bash` (如 Alpine 镜像)，尝试用 `sh`。
  - **用户切换**：`docker exec -u root -it <container> bash` (以 root 身份进入)。
* **💡 进阶：`docker inspect <container>`**
  - **场景**：查看容器的元数据（挂载路径、网络配置、环境变量）。
  - **技巧 (简单易记版)**：`docker inspect <ID> | grep IPAddress`
  - **技巧 (专业版)**：直接查容器 IP：`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container>`。

---

## 4. images / build - 镜像管理
* **docker images**：列出本地镜像。
* **docker pull `<image>`**：下载镜像。
* **docker build -t my-image:v1 .**：根据当前目录的 Dockerfile 构建。
  - **💡 技巧**：构建太慢？尝试使用 `--network=host` 避开容器网络问题。

---

## 5. 常见运维痛点
- **修改了 Docker 配置不生效？**
  - 容器内的程序通常只在启动时读取配置。你需要 `docker restart <container>`。
  - 如果是修改了 `daemon.json` (Docker 本身配置)，需执行 `sudo systemctl daemon-reload && sudo systemctl restart docker`。
- **磁盘被 Docker 撑爆了？**
  - **`docker system prune -a`**：一键清理所有未运行的容器、悬空镜像和构建缓存。
    - **⚠️ 警告**：这会删除所有构建缓存 (Build Cache)，下次 build 会变慢。
  - **日志炸弹**：检查 `/var/lib/docker/containers/` 下的 **`.log` 文件**。如果容器输出太多且没设置轮转，单个日志可能达到几十 GB。
    - **解决**：在 `docker-compose.yml` 中配置 `logging` 驱动。

---

## 6. save/load/export/import - 导出与导入 (离线部署必备)

**场景：服务器没外网，或者需要手动搬运环境。**

* **针对镜像 (Image) - 推荐，保留构建层级**：

  * **docker save -o my-image.tar <image_name>**：打包镜像
  * **docker load -i my-image.tar**：加载镜像
* **针对容器 (Container) - 快照模式**：

  * **docker export <container_id> > my-container.tar**：导出运行时的文件系统
  * **docker import my-container.tar <new_image_name>**：导入为新镜像 (丢失历史层级)

## 7. compose - 多容器编排

* **docker compose up -d**：根据 **docker-compose.yml** **启动所有服务 (新版语法，无需中间横杠)**
* **docker compose down**：停止并删除容器、网络
* **docker compose logs -f**：查看编排服务的所有日志

> **💡** **Pro Tip**: 推荐使用 **lazydocker**，它是专门用于 Docker 的终端图形界面工具，能可视化的查看日志、重启容器、清理镜像，体验极佳。
>

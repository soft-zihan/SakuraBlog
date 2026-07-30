# 🐳 Docker容器化基础

> **常见真实场景**:
> "开发环境跑得好好的,上线就出问题?用Docker统一环境,一次构建到处运行!"

本章节带你从零掌握Docker核心概念和日常使用,适合1-3年开发者快速上手。

**参考来源**:
- Docker官方文档 (docs.docker.com)
- 阮一峰Docker入门教程 (ruanyifeng.com)
- Docker从入门到实践 (yeasy.gitbook.io)
- 菜鸟教程Docker章节 (runoob.com)
- 掘金/CSDN高赞实战教程

---

## 1. 核心概念

### 1.1 镜像、容器、仓库

**Docker三剑客,必须搞懂的关系**:

- **镜像(Image)**: 只读模板,相当于"安装包"或"类"
  - 包含运行应用所需的代码、运行时、库、环境变量
  - 采用**联合文件系统**(UnionFS),分层存储,可复用
  - 类比:**面向对象编程中的"类"**

- **容器(Container)**: 镜像的运行实例,相当于"进程"或"对象"
  - 容器 = 镜像 + 读写层(运行时产生的数据)
  - 相互隔离,互不影响,可随时创建/删除
  - 类比:**面向对象编程中的"对象实例"**

- **仓库(Registry)**: 集中存放镜像的地方,相当于"应用商店"
  - **Docker Hub**: 官方公共仓库 (hub.docker.com)
  - **私有仓库**: Harbor、阿里云容器镜像服务等
  - 类比:**GitHub之于代码,App Store之于应用**

**工作流程**:
```
编写Dockerfile → build构建镜像 → push推送到仓库 → pull拉取镜像 → run启动容器
```

### 1.2 为什么用Docker?

**传统虚拟机 vs Docker容器**:

| 对比维度 | 虚拟机(VM) | Docker容器 |
|---------|-----------|-----------|
| 启动速度 | 分钟级 | 秒级 |
| 体积 | GB级别 | MB级别 |
| 性能 | 有虚拟化损耗(5-15%) | 接近原生(95-99%) |
| 隔离性 | 强(硬件级) | 进程级(命名空间+Cgroups) |
| 适用场景 | 多操作系统 | 微服务/持续集成 |

**核心价值**:
- ✅ **环境一致性**: 开发/测试/生产环境100%一致
- ✅ **快速部署**: 秒级启动,弹性扩容
- ✅ **资源高效**: 单机可运行上百个容器
- ✅ **版本控制**: 镜像可回滚,支持标签管理

---

## 2. 常用命令

### 2.1 镜像管理

```bash
# 下载镜像
docker pull nginx:latest              # 下载最新版nginx
docker pull nginx:1.25-alpine         # 下载指定版本(Alpine精简版)
docker pull mysql:8.0 --platform linux/amd64  # 指定平台(M1/M2芯片常用)

# 查看镜像
docker images                         # 列出本地所有镜像
docker images -a                      # 包含中间层镜像
docker images --digests               # 显示镜像摘要
docker image inspect nginx:latest     # 查看镜像详细信息(JSON)

# 删除镜像
docker rmi nginx:latest               # 删除指定镜像
docker rmi $(docker images -q)        # 删除所有镜像
docker rmi $(docker images -f "dangling=true" -q)  # 删除悬空镜像(无标签)

# 搜索镜像
docker search nginx --filter stars=1000  # 搜索星标>1000的nginx镜像

# 导入/导出镜像
docker save -o nginx.tar nginx:latest    # 导出镜像为tar文件
docker load -i nginx.tar                 # 从tar文件导入镜像

# 镜像打标签
docker tag nginx:latest myregistry.com/nginx:v1  # 打标签用于推送到私有仓库
docker push myregistry.com/nginx:v1              # 推送到私有仓库
```

### 2.2 容器生命周期

```bash
# 启动容器
docker run nginx                              # 前台运行(终端会阻塞)
docker run -d nginx                           # 后台运行(Detached模式)
docker run -d --name my-nginx nginx           # 指定容器名称
docker run -d -p 8080:80 nginx                # 端口映射(主机8080→容器80)
docker run -d -p 8080:80 -p 8443:443 nginx    # 多端口映射
docker run -d -v /data:/usr/share/nginx/html nginx  # 挂载数据卷
docker run -d -e MYSQL_ROOT_PASSWORD=123456 mysql  # 设置环境变量
docker run -it ubuntu bash                    # 交互式容器(进入终端)
docker run --rm -it alpine sh                 # 退出后自动删除容器
docker run -d --restart always nginx          # 自动重启策略
docker run -d --restart on-failure:3 nginx    # 失败时最多重启3次

# 查看容器
docker ps                                     # 查看运行中的容器
docker ps -a                                  # 查看所有容器(含已停止)
docker ps -l                                  # 查看最新创建的容器
docker ps --filter "status=exited"            # 查看已退出的容器
docker ps --format "table {{.Names}}\t{{.Status}}"  # 自定义输出格式

# 停止/启动容器
docker stop my-nginx                          # 优雅停止(发送SIGTERM)
docker stop $(docker ps -q)                   # 停止所有运行中的容器
docker kill my-nginx                          # 强制停止(发送SIGKILL)
docker start my-nginx                         # 启动已停止的容器
docker restart my-nginx                       # 重启容器
docker pause my-nginx                         # 暂停容器所有进程
docker unpause my-nginx                       # 恢复容器

# 删除容器
docker rm my-nginx                            # 删除已停止的容器
docker rm -f my-nginx                         # 强制删除运行中的容器
docker rm $(docker ps -aq)                    # 删除所有容器
docker container prune                        # 清理所有已停止容器

# 查看容器信息
docker logs my-nginx                          # 查看容器日志
docker logs -f my-nginx                       # 实时跟踪日志
docker logs --tail 100 my-nginx               # 查看最后100行日志
docker logs -f --since 2024-01-01 my-nginx    # 查看指定时间后的日志
docker top my-nginx                           # 查看容器内进程
docker stats                                  # 实时查看所有容器资源使用
docker stats my-nginx                         # 查看指定容器资源使用
docker inspect my-nginx                       # 查看容器详细信息(JSON)
docker inspect -f '{{.NetworkSettings.IPAddress}}' my-nginx  # 查看容器IP
docker diff my-nginx                          # 查看容器文件系统变更
```

### 2.3 进入容器与文件操作

```bash
# 进入容器
docker exec -it my-nginx bash                 # 进入容器bash终端
docker exec -it my-nginx sh                   # Alpine等精简版用sh
docker exec -u root -it my-nginx bash         # 以root身份进入
docker exec -it my-nginx ls /app              # 执行命令后退出
docker attach my-nginx                        # 附加到容器主进程(不推荐)

# 文件拷贝
docker cp my-nginx:/etc/nginx/nginx.conf ./   # 容器→主机
docker cp ./nginx.conf my-nginx:/etc/nginx/   # 主机→容器

# 查看容器端口映射
docker port my-nginx                          # 查看端口映射情况
```

### 2.4 系统清理

```bash
# 一键清理(危险操作!)
docker system prune                           # 清理停止的容器、悬空镜像、网络
docker system prune -a                        # 清理所有未使用镜像(包括有标签)
docker system prune --volumes                 # 包含数据卷清理

# 分类清理
docker container prune                        # 清理已停止容器
docker image prune                            # 清理悬空镜像
docker image prune -a                         # 清理所有未被容器使用的镜像
docker volume prune                           # 清理未使用数据卷
docker network prune                          # 清理未使用网络

# 查看磁盘使用
docker system df                              # 查看Docker磁盘使用
docker system df -v                           # 详细显示
```

---

## 3. Dockerfile编写

### 3.1 基础指令详解

```dockerfile
# FROM - 指定基础镜像(必须第一条指令)
FROM nginx:1.25-alpine
FROM node:18-slim
FROM python:3.11-slim
FROM ubuntu:22.04

# LABEL - 添加元数据
LABEL maintainer="yourname@example.com"
LABEL version="1.0"
LABEL description="My awesome app"

# WORKDIR - 设置工作目录(不存在会自动创建)
WORKDIR /app

# COPY - 复制文件(保留权限,推荐使用)
COPY package.json ./
COPY src/ ./src/
COPY --chown=node:node . .     # 指定所有者

# ADD - 复制文件(支持URL和解压,不推荐滥用)
ADD https://example.com/file.tar.gz /tmp/
ADD app.tar.gz /app/           # 自动解压

# RUN - 构建时执行命令(每层都会创建新层)
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*  # 清理缓存减小体积

RUN npm install --production
RUN pip install -r requirements.txt

# ENV - 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_HOME=/app

# EXPOSE - 声明端口(仅文档作用,不实际映射)
EXPOSE 3000
EXPOSE 8080 8443

# CMD - 容器启动时执行(可被docker run覆盖)
CMD ["node", "server.js"]
CMD ["npm", "start"]
CMD ["python", "app.py"]

# ENTRYPOINT - 容器启动入口(不会被覆盖,追加参数)
ENTRYPOINT ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["python", "app.py"]

# VOLUME - 声明数据卷
VOLUME ["/data", "/logs"]

# USER - 设置运行用户(安全最佳实践)
USER node
USER 1000:1000  # UID:GID

# HEALTHCHECK - 健康检查
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# ARG - 构建参数(构建时可用,运行时消失)
ARG NODE_ENV=production
ARG VERSION=latest
```

### 3.2 完整示例1: Nginx静态网站

```dockerfile
# 多阶段构建示例 - Nginx静态站点
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:1.25-alpine
LABEL maintainer="dev@example.com"

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 自定义nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3.3 完整示例2: Node.js应用

```dockerfile
# 生产环境Node.js应用
FROM node:18-slim

# 设置工作目录
WORKDIR /usr/src/app

# 复制package文件(利用Docker层缓存)
COPY package*.json ./

# 安装依赖(分离生产依赖和开发依赖)
RUN npm ci --only=production && npm cache clean --force

# 复制应用代码
COPY src/ ./src/
COPY public/ ./public/

# 创建非root用户(安全最佳实践)
RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser \
  && chown -R nodeuser:nodeuser /usr/src/app
USER nodeuser

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["node", "src/server.js"]
```

**构建和运行**:
```bash
# 构建镜像
docker build -t my-node-app:v1 .

# 运行容器
docker run -d \
  --name node-app \
  -p 3000:3000 \
  -e DATABASE_URL=postgres://user:pass@db:5432/mydb \
  my-node-app:v1
```

### 3.4 完整示例3: Python Flask应用

```dockerfile
# Python Flask应用
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 设置Python环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production

# 安装系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 安装Python依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建非root用户
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# 暴露端口
EXPOSE 5000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

# 启动应用
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### 3.5 最佳实践

**✅ 必须遵守**:

1. **使用精简基础镜像**
   ```dockerfile
   # 推荐: Alpine/Slim版本
   FROM node:18-alpine      # ~5MB
   FROM python:3.11-slim    # ~45MB
   
   # 避免: 完整版本
   FROM node:18             # ~300MB
   FROM ubuntu:22.04        # ~77MB
   ```

2. **多阶段构建减小体积**
   ```dockerfile
   # 构建阶段
   FROM golang:1.21 AS builder
   WORKDIR /app
   COPY . .
   RUN go build -o myapp main.go
   
   # 运行阶段(仅包含编译后的二进制文件)
   FROM alpine:latest
   COPY --from=builder /app/myapp /usr/local/bin/
   CMD ["myapp"]
   ```

3. **合并RUN指令减少层数**
   ```dockerfile
   # ❌ 错误: 每个RUN创建一层
   RUN apt-get update
   RUN apt-get install -y curl
   RUN apt-get install -y wget
   RUN rm -rf /var/lib/apt/lists/*
   
   # ✅ 正确: 合并为一条
   RUN apt-get update && apt-get install -y \
       curl \
       wget \
     && rm -rf /var/lib/apt/lists/*
   ```

4. **利用层缓存加速构建**
   ```dockerfile
   # 先复制依赖文件(变化少)
   COPY package.json yarn.lock ./
   RUN yarn install --frozen-lockfile
   
   # 再复制源码(变化频繁)
   COPY . .
   ```

5. **使用.dockerignore排除无用文件**
   ```
   node_modules
   npm-debug.log
   .git
   .env
   Dockerfile
   .dockerignore
   ```

6. **非root用户运行(安全)**
   ```dockerfile
   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
   USER appuser
   ```

7. **固定版本标签**
   ```dockerfile
   # ✅ 推荐: 固定版本
   FROM node:18.19.0-alpine
   FROM python:3.11.7-slim
   
   # ❌ 避免: 使用latest
   FROM node:latest
   ```

---

## 4. docker-compose

### 4.1 基础概念

**为什么需要docker-compose?**
- 手动管理多个容器(run 5次? 太繁琐!)
- 容器间网络配置复杂
- 启动顺序难以控制
- 配置分散,不易维护

**docker-compose.yml核心结构**:
```yaml
version: '3.8'                    # Compose文件格式版本

services:                         # 定义所有服务
  web:                            # 服务名
    build: .                      # 从Dockerfile构建
    ports:
      - "3000:3000"
    depends_on:
      - db                        # 依赖db服务
    
  db:                             # 数据库服务
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:                          # 定义数据卷
  pgdata:

networks:                         # 定义网络(可选)
  default:
    driver: bridge
```

### 4.2 常用命令

```bash
# 启动服务
docker-compose up                 # 前台启动(看日志)
docker-compose up -d              # 后台启动
docker-compose up -d --build      # 重新构建并启动
docker-compose up -d web          # 仅启动web服务

# 停止服务
docker-compose stop               # 停止所有服务
docker-compose stop web           # 停止web服务
docker-compose down               # 停止并删除容器、网络
docker-compose down -v            # 同时删除数据卷
docker-compose down --rmi all     # 同时删除镜像

# 查看状态
docker-compose ps                 # 查看服务状态
docker-compose logs               # 查看所有日志
docker-compose logs -f web        # 实时查看web服务日志
docker-compose logs --tail=100    # 查看最近100行

# 执行命令
docker-compose exec web bash      # 进入web服务容器
docker-compose exec db psql -U postgres  # 进入数据库
docker-compose run --rm web npm test     # 运行一次性命令

# 其他
docker-compose build              # 构建服务镜像
docker-compose pull               # 拉取服务镜像
docker-compose config             # 验证并显示最终配置
docker-compose top                # 查看进程
docker-compose restart            # 重启服务
```

### 4.3 实战案例1: Web应用 + PostgreSQL

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 前端Web应用
  web:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://api:8000
    depends_on:
      - api
    networks:
      - app-network

  # 后端API服务
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres123@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app          # 开发模式热重载
      - /app/node_modules       # 避免覆盖容器内依赖
    networks:
      - app-network

  # PostgreSQL数据库
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # 初始化脚本
    networks:
      - app-network

  # Redis缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    networks:
      - app-network

  # Nginx反向代理(可选)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - web
      - api
    networks:
      - app-network

# 数据卷
volumes:
  pgdata:
  redisdata:

# 网络
networks:
  app-network:
    driver: bridge
```

**使用示例**:
```bash
# 一键启动整个栈
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看数据库日志
docker-compose logs -f db

# 进入API容器
docker-compose exec api bash

# 运行数据库迁移
docker-compose exec api npm run db:migrate

# 停止并清理
docker-compose down -v
```

### 4.4 实战案例2: WordPress博客

```yaml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress123
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress_data:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress123
      MYSQL_ROOT_PASSWORD: root123
    volumes:
      - mysql_data:/var/lib/mysql
    restart: always

volumes:
  wordpress_data:
  mysql_data:
```

### 4.5 环境变量管理

**方式1: 直接在compose文件中**
```yaml
environment:
  - DB_HOST=mysql
  - DB_PASSWORD=secret
```

**方式2: 使用.env文件(推荐)**
```bash
# .env
DB_HOST=mysql
DB_PASSWORD=secret123
DB_NAME=myapp
```

```yaml
# docker-compose.yml
services:
  api:
    environment:
      - DB_HOST=${DB_HOST}
      - DB_PASSWORD=${DB_PASSWORD}
    env_file:
      - .env
```

---

## 5. 数据卷与网络

### 5.1 数据卷(Volume) - 数据持久化

**为什么需要数据卷?**
- 容器删除后,内部数据会丢失!
- 容器间共享数据困难
- 需要将数据库/日志持久化到宿主机

**三种挂载方式对比**:

| 类型 | 语法 | 管理方式 | 适用场景 |
|------|------|---------|---------|
| 命名卷 | `-v myvolume:/data` | Docker管理 | 数据库、持久化数据 |
| 绑定挂载 | `-v /host/path:/data` | 用户管理 | 开发时代码同步 |
| tmpfs | `--tmpfs /data` | 内存存储 | 临时敏感数据 |

#### 5.1.1 命名卷(Named Volume)

```bash
# 创建数据卷
docker volume create mydata

# 查看数据卷
docker volume ls
docker volume inspect mydata

# 使用数据卷
docker run -d -v mydata:/var/lib/mysql mysql:8.0

# docker-compose中使用
volumes:
  pgdata:

services:
  db:
    volumes:
      - pgdata:/var/lib/postgresql/data

# 删除数据卷
docker volume rm mydata
docker volume prune  # 清理未使用卷

# 备份数据卷
docker run --rm -v mydata:/data -v $(pwd):/backup alpine \
  tar czf /backup/mydata-backup.tar.gz -C /data .

# 恢复数据卷
docker run --rm -v mydata:/data -v $(pwd):/backup alpine \
  tar xzf /backup/mydata-backup.tar.gz -C /data
```

#### 5.1.2 绑定挂载(Bind Mount)

```bash
# 挂载宿主机目录
docker run -d -v /Users/me/project:/app node:18

# 只读挂载
docker run -d -v /Users/me/config:/etc/nginx:ro nginx

# 挂载单个文件
docker run -d -v /Users/me/nginx.conf:/etc/nginx/nginx.conf nginx

# docker-compose中使用
services:
  web:
    volumes:
      - ./src:/app/src              # 相对路径(相对于compose文件)
      - /absolute/path:/data        # 绝对路径
      - ./config:/etc/nginx:ro      # 只读
```

#### 5.1.3 命名卷 vs 绑定挂载

```yaml
# ✅ 命名卷 - 数据库持久化
services:
  mysql:
    volumes:
      - mysql_data:/var/lib/mysql  # Docker管理,跨平台兼容

volumes:
  mysql_data:

# ✅ 绑定挂载 - 开发时代码热重载
services:
  api:
    volumes:
      - ./src:/app/src            # 修改代码立即生效

# ❌ 错误示例 - 生产环境用绑定挂载
services:
  mysql:
    volumes:
      - /var/lib/mysql:/var/lib/mysql  # 权限问题,不推荐
```

### 5.2 网络模式

**Docker网络类型**:

| 网络模式 | 说明 | IP | 端口映射 | 性能 |
|---------|------|-----|---------|------|
| bridge(默认) | 桥接网络,容器有独立IP | 有 | 需要 | 正常 |
| host | 共享宿主机网络 | 无(用宿主机IP) | 不需要 | 最高 |
| none | 无网络 | 无 | - | - |
| container | 共享其他容器网络 | 共享 | 共享 | - |

#### 5.2.1 Bridge网络(默认)

```bash
# 创建自定义网络
docker network create my-network

# 查看网络
docker network ls
docker network inspect my-network

# 容器连接到网络
docker run -d --name web --network my-network nginx
docker run -d --name db --network my-network mysql

# 容器间通过服务名通信
# web容器可以直接访问: http://db:3306

# 断开网络连接
docker network disconnect my-network web

# 删除网络
docker network rm my-network
docker network prune

# docker-compose自动创建网络
# compose文件中的服务默认在同一网络,可通过服务名互相访问
```

#### 5.2.2 Host网络

```bash
# 使用宿主机网络
docker run -d --network host nginx

# 特点:
# - 容器直接使用宿主机端口,无需-p映射
# - 性能最佳,适合高并发场景
# - 端口可能冲突
# - 仅支持Linux(Mac/Windows Docker Desktop不支持)

# 使用场景:
# - 高性能Web服务器
# - 监控代理(如Prometheus)
# - 需要访问宿主机网络的服务
```

#### 5.2.3 多网络示例

```yaml
version: '3.8'

services:
  # 前端服务(仅连接frontend网络)
  web:
    image: nginx
    networks:
      - frontend

  # API服务(连接frontend和backend网络,充当网关)
  api:
    image: node:18
    networks:
      - frontend
      - backend

  # 数据库(仅连接backend网络,外部不可访问)
  db:
    image: postgres
    networks:
      - backend

networks:
  frontend:  # 前端网络
  backend:   # 后端网络(隔离数据库)
```

**网络隔离示意图**:
```
外部请求 → web(frontend) → api(frontend+backend) → db(backend)
                                    ↑
                            只有api能访问db
```

---

## 6. 实战排错

### 6.1 容器无法启动

**场景1: 端口被占用**
```bash
# 错误信息: Bind for 0.0.0.0:8080 failed: port is already allocated

# 排查步骤:
lsof -i :8080                    # 查看占用端口的进程
netstat -tulpn | grep 8080       # 或使用netstat

# 解决方案:
# 1. 停止占用端口的服务
kill -9 <PID>

# 2. 或修改映射端口
docker run -d -p 8081:80 nginx   # 改用8081
```

**场景2: 镜像不存在**
```bash
# 错误信息: Unable to find image 'nginx:latest' locally

# 解决方案:
docker pull nginx:latest         # 手动拉取镜像
docker images                    # 确认镜像已下载
```

**场景3: 容器启动后立即退出**
```bash
# 排查步骤:
docker ps -a                     # 查看已退出的容器
docker logs <container_id>       # 查看日志(最重要!)
docker inspect <container_id>    # 查看详细状态

# 常见原因:
# 1. 前台进程结束(容器生命周期=主进程生命周期)
#    解决: 使用-d保持后台运行,或修复应用错误

# 2. 缺少环境变量
#    解决: docker run -e KEY=VALUE ...

# 3. 配置文件错误
#    解决: 检查挂载的配置文件

# 保持容器运行(调试用):
docker run -d nginx tail -f /dev/null
```

### 6.2 网络不通

**场景1: 容器间无法通信**
```bash
# 检查是否在同一网络
docker inspect <container1> | grep NetworkMode
docker inspect <container2> | grep NetworkMode

# 解决: 连接到同一网络
docker network create my-net
docker network connect my-net <container1>
docker network connect my-net <container2>

# 测试连通性
docker exec <container1> ping <container2>
docker exec <container1> curl http://<container2>:80
```

**场景2: 容器无法访问外网**
```bash
# 检查DNS配置
docker run --rm alpine cat /etc/resolv.conf

# 测试外网连通性
docker run --rm alpine ping -c 3 8.8.8.8
docker run --rm alpine nslookup google.com

# 解决: 指定DNS
docker run --dns 8.8.8.8 --dns 8.8.4.4 alpine

# 或修改Docker配置
# /etc/docker/daemon.json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
sudo systemctl restart docker
```

**场景3: 端口映射不生效**
```bash
# 检查端口映射
docker port <container>

# 检查防火墙
sudo ufw status                # Ubuntu
sudo firewall-cmd --list-all   # CentOS

# 解决: 开放端口
sudo ufw allow 8080/tcp
```

### 6.3 数据持久化失败

**场景1: 数据库重启后数据丢失**
```yaml
# ❌ 错误: 未挂载数据卷
services:
  mysql:
    image: mysql:8.0
    # 容器删除后数据丢失!

# ✅ 正确: 使用命名卷
services:
  mysql:
    image: mysql:8.0
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

**场景2: 权限问题**
```bash
# 错误: Permission denied

# 查看数据卷权限
docker run --rm -v mydata:/data alpine ls -la /data

# 修改权限
docker run --rm -v mydata:/data alpine chown -R 1000:1000 /data

# 或在compose中指定
volumes:
  - mydata:/var/lib/postgresql/data:rw
```

### 6.4 磁盘空间不足

```bash
# 检查Docker磁盘使用
docker system df
df -h /var/lib/docker

# 清理无用资源
docker system prune -a --volumes  # ⚠️ 危险!清理所有未使用资源

# 查看大文件
sudo du -sh /var/lib/docker/containers/* | sort -rh | head -10

# 限制容器日志大小
# /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# 或在compose中配置
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 6.5 镜像构建失败

```bash
# 错误: apt-get更新失败
# 解决: 更换国内源
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list
RUN apt-get update

# 错误: npm install超时
# 解决: 使用国内镜像源
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# 错误: 构建缓存导致问题
# 解决: 无缓存构建
docker build --no-cache -t myapp .

# 调试构建过程
docker build --progress=plain -t myapp .  # 显示详细输出
```

### 6.6 快速排错命令清单

```bash
# 一键诊断脚本
echo "=== 容器状态 ==="
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "=== 磁盘使用 ==="
docker system df

echo "=== 网络检查 ==="
docker network ls

echo "=== 最近日志 ==="
docker logs --tail 50 <container_name>

echo "=== 资源使用 ==="
docker stats --no-stream
```

---

## 7. 性能与优化

### 7.1 镜像瘦身

**优化前 vs 优化后对比**:
```dockerfile
# ❌ 优化前: 1.2GB
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y nodejs npm
COPY . /app
WORKDIR /app
RUN npm install
CMD ["node", "server.js"]

# ✅ 优化后: 85MB
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
CMD ["node", "server.js"]
```

**镜像瘦身技巧**:

1. **选择精简基础镜像**
   ```
   ubuntu:22.04        →  77MB
   debian:bullseye     →  124MB
   node:18             →  350MB
   node:18-slim        →  180MB
   node:18-alpine      →  45MB  ✅ 最小
   ```

2. **多阶段构建**
   ```dockerfile
   # 构建阶段(大镜像)
   FROM golang:1.21 AS builder
   WORKDIR /app
   COPY . .
   RUN go build -o myapp
   
   # 运行阶段(小镜像)
   FROM alpine:latest
   COPY --from=builder /app/myapp /usr/local/bin/
   CMD ["myapp"]
   # 最终镜像: ~10MB (vs 构建镜像800MB)
   ```

3. **合并RUN指令**
   ```dockerfile
   # ❌ 4层
   RUN apt-get update
   RUN apt-get install -y curl
   RUN apt-get install -y wget
   RUN rm -rf /var/lib/apt/lists/*
   
   # ✅ 1层
   RUN apt-get update && apt-get install -y \
       curl wget \
     && rm -rf /var/lib/apt/lists/*
   ```

4. **使用.dockerignore**
   ```
   node_modules
   .git
   .env
   Dockerfile
   docker-compose.yml
   README.md
   *.md
   .DS_Store
   ```

5. **清理缓存**
   ```dockerfile
   # Alpine
   RUN apk add --no-cache curl wget
   
   # Debian/Ubuntu
   RUN apt-get update && apt-get install -y curl \
     && rm -rf /var/lib/apt/lists/*
   
   # Node.js
   RUN npm install && npm cache clean --force
   
   # Python
   RUN pip install --no-cache-dir -r requirements.txt
   ```

### 7.2 资源限制

**防止单个容器耗尽资源**:

```bash
# 限制CPU
docker run -d --cpus="1.5" nginx        # 最多使用1.5个CPU核心
docker run -d --cpus="0.5" nginx        # 最多使用50% CPU
docker run -d --cpu-shares=512 nginx    # CPU权重(默认1024)

# 限制内存
docker run -d --memory="512m" nginx     # 最多512MB内存
docker run -d --memory="1g" --memory-swap="2g" nginx  # 1G内存+1G swap

# 限制磁盘IO
docker run -d --device-read-bps /dev/sda:1mb nginx    # 读速度限制
docker run -d --device-write-bps /dev/sda:1mb nginx   # 写速度限制

# 限制进程数(防止fork炸弹)
docker run -d --pids-limit=100 nginx
```

**docker-compose中限制资源**:
```yaml
services:
  web:
    image: nginx
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 7.3 构建加速

```bash
# 使用BuildKit(更快,支持并行构建)
export DOCKER_BUILDKIT=1
docker build -t myapp .

# 或使用docker-compose
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build

# 配置Docker镜像加速(国内)
# /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com"
  ]
}
sudo systemctl daemon-reload
sudo systemctl restart docker

# 使用缓存挂载加速构建(如Go模块)
RUN --mount=type=cache,target=/go/pkg/mod \
    go build -o myapp
```

### 7.4 生产环境最佳实践

1. **健康检查**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
     interval: 30s
     timeout: 10s
     retries: 3
     start_period: 40s
   ```

2. **重启策略**
   ```yaml
   restart: unless-stopped   # 除非手动停止,否则一直重启
   restart: on-failure:5     # 失败时最多重启5次
   ```

3. **日志管理**
   ```yaml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

4. **安全加固**
   - 使用非root用户运行
   - 只读根文件系统: `read_only: true`
   - 限制capabilities: `cap_drop: [ALL]`
   - 定期更新基础镜像

---

## 8. 速查表

### 8.1 常用命令速查

| 操作 | 命令 |
|------|------|
| 启动容器 | `docker run -d -p 8080:80 --name web nginx` |
| 查看容器 | `docker ps` / `docker ps -a` |
| 停止容器 | `docker stop web` |
| 进入容器 | `docker exec -it web bash` |
| 查看日志 | `docker logs -f web` |
| 删除容器 | `docker rm -f web` |
| 查看镜像 | `docker images` |
| 删除镜像 | `docker rmi nginx` |
| 构建镜像 | `docker build -t myapp .` |
| 清理系统 | `docker system prune -a` |
| 启动编排 | `docker-compose up -d` |
| 停止编排 | `docker-compose down` |

### 8.2 常见端口

| 服务 | 端口 |
|------|------|
| HTTP | 80 |
| HTTPS | 443 |
| MySQL | 3306 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| MongoDB | 27017 |
| Node.js | 3000 |
| Python Flask | 5000 |

---

**💡 学习建议**:
1. 先在本地安装Docker Desktop,动手跑通第一个`docker run nginx`
2. 理解"镜像=类,容器=对象"的类比关系
3. 掌握Dockerfile编写,能将自己的应用容器化
4. 学会用docker-compose管理多容器应用
5. 遇到排错,第一时间看`docker logs`

**📚 延伸学习**:
- Docker Swarm/Kubernetes: 容器编排(后续章节)
- CI/CD集成: GitHub Actions + Docker
- 微服务架构: Service Mesh、API Gateway
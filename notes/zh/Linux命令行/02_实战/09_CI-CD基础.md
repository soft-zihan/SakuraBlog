# 🚀 CI/CD基础

> **常见真实场景**:
> "每次手动部署太慢?代码合并后自动测试、自动发布,这就是CI/CD!"

本章节带你理解CI/CD核心概念并上手GitHub Actions。

**来源参考**:
- GitHub官方文档: https://docs.github.com/zh/actions
- Red Hat CI/CD详解: https://www.redhat.com/zh-cn/topics/devops/what-is-ci-cd
- 掘金实战教程: GitHub Actions 实现自动化部署

---

## 1. 核心概念

### 1.1 CI vs CD vs CD

CI/CD是三个实践的缩写,它们层层递进:

| 缩写 | 全称 | 含义 | 关键动作 |
|------|------|------|----------|
| **CI** | Continuous Integration | 持续集成 | 代码合并→自动测试→自动构建 |
| **CD** | Continuous Delivery | 持续交付 | 自动部署到**测试环境**,人工审批后上线 |
| **CD** | Continuous Deployment | 持续部署 | 自动部署到**生产环境**,无需人工干预 |

**形象理解**:
```
开发者提交代码
    ↓
[CI] 自动跑测试、检查代码质量
    ↓
[持续交付] 部署到预发布环境 → 人工点击"发布"
    ↓
[持续部署] 直接部署到生产环境(全自动)
```

### 1.2 为什么需要CI/CD

**没有CI/CD时**:
- ❌ 手动合并代码容易冲突
- ❌ 本地测试通过,上线就报错
- ❌ 部署靠记忆/文档,容易遗漏步骤
- ❌ 发现问题时已经晚了

**有CI/CD后**:
- ✅ 每次提交自动测试,问题早发现
- ✅ 部署流程代码化,可重复、可追溯
- ✅ 快速迭代,一天发布多次
- ✅ 团队协作更安全

### 1.3 常见工具对比

| 工具 | 特点 | 适合场景 |
|------|------|----------|
| **GitHub Actions** | 集成GitHub,免费额度高,YAML配置 | 开源项目、GitHub托管代码 |
| GitLab CI | 与GitLab深度集成,功能强大 | GitLab用户、企业私有部署 |
| Jenkins | 老牌强大,插件生态丰富,但配置复杂 | 传统企业、复杂流水线 |
| CircleCI | 云端SaaS,速度快 | 商业项目、注重速度 |

> 💡 **当前趋势**: GitHub Actions因免费、易用、与代码仓库无缝集成,已成为**最流行**的CI/CD平台。

---

## 2. GitHub Actions入门

### 2.1 Workflow基础

Workflow是CI/CD的**配置文件**,存放在`.github/workflows/`目录下,使用YAML格式。

**最小Workflow结构**:
```yaml
name: CI Pipeline              # Workflow名称

on: [push]                     # 触发条件

jobs:                          # 任务列表
  build:                       # Job名称
    runs-on: ubuntu-latest     # 运行环境
    
    steps:                     # 执行步骤
      - uses: actions/checkout@v4    # 使用官方Action
      - run: echo "Hello CI/CD!"     # 执行命令
```

**核心概念**:
- **Workflow**: 完整的自动化流程(一个YAML文件)
- **Job**: 一组相关的Steps,可并行或顺序执行
- **Step**: 单个执行单元,可以是`uses`(Action)或`run`(命令)
- **Action**: 可复用的最小单元(如`actions/checkout`用于拉取代码)

### 2.2 Trigger触发器

触发器定义**何时**运行Workflow:

```yaml
on:
  # 1. 推送触发
  push:
    branches: [main, develop]
    paths:
      - 'src/**'              # 仅src目录变更时触发
  
  # 2. Pull Request触发
  pull_request:
    branches: [main]
  
  # 3. 定时触发(Cron表达式)
  schedule:
    - cron: '0 2 * * *'       # 每天UTC 2:00运行
  
  # 4. 手动触发
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
```

**常用触发场景**:
- `push`: 代码推送时
- `pull_request`: 提交PR时(适合跑测试)
- `release`: 发布新版本时
- `workflow_dispatch`: 手动触发(适合部署)

### 2.3 Job和Step

**Job执行顺序**:
```yaml
jobs:
  test:                      # 先执行test
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  
  build:                     # test成功后才执行build
    needs: test              # 依赖test job
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
  
  deploy:                    # build成功后才执行deploy
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."
```

**Step中使用Secrets和变量**:
```yaml
steps:
  - name: 使用密钥
    run: echo "${{ secrets.DEPLOY_KEY }}"
  
  - name: 使用变量
    run: echo "分支: ${{ github.ref }}, 提交者: ${{ github.actor }}"
  
  - name: 设置环境变量
    run: echo "VERSION=1.0.0" >> $GITHUB_ENV
```

---

## 3. 实战示例

### 3.1 自动测试(Node.js)

**场景**: 每次推送代码时自动运行测试

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20, 22]  # 测试多个Node版本
    
    steps:
      - uses: actions/checkout@v4
      
      - name: 使用 Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'               # 自动缓存node_modules
      
      - run: npm ci                  # 干净安装依赖
      - run: npm run lint            # 代码检查
      - run: npm test                # 运行测试
      - run: npm run build           # 构建项目
```

**关键点**:
- `npm ci` 比 `npm install` 更快、更可重复
- `cache: 'npm'` 自动缓存依赖,加速后续运行
- `strategy.matrix` 并行测试多个版本

### 3.2 自动构建(Docker)

**场景**: 代码推送时自动构建Docker镜像并推送到镜像仓库

```yaml
name: Docker Build

on:
  push:
    branches: [main]
    tags: ['v*']                   # 打标签时触发

jobs:
  docker:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: 登录 Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: 提取元数据
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: myusername/myapp
          tags: |
            type=sha               # 使用commit sha作为tag
            type=semver,pattern={{version}}
      
      - name: 构建并推送
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha     # 使用GitHub Actions缓存
          cache-to: type=gha,mode=max
```

**关键点**:
- 使用官方`docker/*` Actions,简化配置
- `secrets`存储敏感信息,不要硬编码密码
- 缓存层加速Docker构建

### 3.3 自动部署(SSH)

**场景**: 构建完成后通过SSH部署到服务器

```yaml
name: Deploy to Server

on:
  push:
    branches: [main]
  workflow_dispatch:             # 支持手动触发

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: 构建项目
        run: |
          npm ci
          npm run build
      
      - name: 部署到服务器
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            cd /var/www/myapp
            git pull origin main
            npm ci --production
            pm2 restart myapp
            echo "部署完成!"
```

**前置准备**:
1. 生成SSH密钥对: `ssh-keygen -t ed25519`
2. 将公钥添加到服务器: `ssh-copy-id user@server`
3. 将私钥添加到GitHub Secrets: `SSH_PRIVATE_KEY`

**更安全的方式**(使用rsync):
```yaml
      - name: 同步文件到服务器
        uses: burnett01/rsync-deployments@v6
        with:
          switches: -avzr --delete
          path: dist/
          remote_path: /var/www/myapp/
          remote_host: ${{ secrets.SERVER_HOST }}
          remote_user: ${{ secrets.SERVER_USER }}
          remote_key: ${{ secrets.SSH_PRIVATE_KEY }}
```

---

## 4. 最佳实践

### 4.1 缓存优化

**缓存依赖加速构建**:
```yaml
steps:
  - name: 缓存 node_modules
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-npm-${{ hashFiles('package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-npm-
```

**常用缓存路径**:
| 语言 | 缓存路径 | 锁文件 |
|------|----------|--------|
| Node.js | `node_modules` | `package-lock.json` |
| Python | `~/.cache/pip` | `requirements.txt` |
| Java | `~/.m2/repository` | `pom.xml` |

### 4.2 密钥管理

**❌ 绝对不要**:
```yaml
# 错误示例 - 硬编码密码
- run: mysql -u root -p123456
```

**✅ 正确做法**:
```yaml
# 1. 在GitHub仓库设置 → Secrets → 添加密钥
# 2. 在Workflow中引用
- run: mysql -u root -p${{ secrets.DB_PASSWORD }}
```

**密钥层级**:
- **Repository secrets**: 单个仓库可用
- **Organization secrets**: 组织下所有仓库可用
- **Environment secrets**: 特定环境可用(如production)

**保护生产环境**:
```yaml
jobs:
  deploy-prod:
    environment: production      # 需要审批才能运行
    runs-on: ubuntu-latest
```

### 4.3 失败通知

**方式1: 使用GitHub内置通知**
- 默认会在Actions页面显示失败
- 可设置Email通知(仓库 → Settings → Notifications)

**方式2: 发送到钉钉/飞书/企业微信**:
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - run: npm test
      
      - name: 失败时发送通知
        if: failure()            # 仅失败时运行
        run: |
          curl -X POST "https://oapi.dingtalk.com/robot/send?access_token=${{ secrets.DING_TOKEN }}" \
            -H 'Content-Type: application/json' \
            -d '{"msgtype":"text","text":{"content":"❌ CI失败: ${{ github.repository }}"}}'
```

**常用条件判断**:
```yaml
if: success()    # 成功时运行
if: failure()    # 失败时运行
if: always()     # 总是运行
if: cancelled()  # 取消时运行
```

---

## 5. GitLab CI(快速了解)

### 5.1 .gitlab-ci.yml基础

GitLab CI配置文件为`.gitlab-ci.yml`,放在项目根目录:

```yaml
stages:
  - test
  - build
  - deploy

unit_test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test

build_app:
  stage: build
  image: docker:latest
  script:
    - docker build -t myapp .
  only:
    - main

deploy_prod:
  stage: deploy
  script:
    - ssh deploy@server "cd /app && ./deploy.sh"
  only:
    - tags
  when: manual               # 手动触发
```

**核心概念**:
- `stages`: 定义阶段顺序
- `image`: 指定Docker镜像
- `script`: 执行命令
- `only/except`: 控制触发条件
- `when`: 执行时机(`on_success`/`on_failure`/`always`/`manual`)

### 5.2 与GitHub Actions对比

| 特性 | GitHub Actions | GitLab CI |
|------|----------------|-----------|
| **配置文件** | `.github/workflows/*.yml` | `.gitlab-ci.yml` |
| **最小单元** | Action | Job |
| **Marketplace** | 丰富的第三方Actions | 相对较少 |
| **免费额度** | 2000分钟/月(公开仓库无限) | 400分钟/月 |
| **集成度** | 与GitHub深度集成 | 与GitLab深度集成 |
| **学习曲线** | 低(语法直观) | 中(概念较多) |

**选择建议**:
- 代码在**GitHub** → 用GitHub Actions(无缝集成)
- 代码在**GitLab** → 用GitLab CI(原生支持)
- 不要为了CI/CD迁移代码仓库

---

## 动手练习

1. **创建第一个Workflow**:
   - 在任意仓库创建`.github/workflows/hello.yml`
   - 推送后观察Actions页面运行结果

2. **为你的项目添加CI**:
   - 添加自动测试Workflow
   - 添加代码检查(eslint/prettier)

3. **尝试自动部署**:
   - 配置SSH密钥
   - 实现推送main分支自动部署

> 💡 **下一步**: 学习Docker容器化部署、Kubernetes编排、ArgoCD GitOps实践。

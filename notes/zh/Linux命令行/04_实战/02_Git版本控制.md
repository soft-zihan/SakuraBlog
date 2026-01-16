### 1. init / clone - 仓库初始化与获取

* **git clone `<url>`**：克隆远程仓库到本地
* **git init**：在当前文件夹初始化新仓库
* **git remote add origin `<url>`**：为本地仓库关联远程地址 (初始化后需执行此步)
* **git remote -v**：查看当前关联的远程仓库地址 (检查 fetch/push 权限)

> **💡** **Pro Tip**: 使用 **git clone --depth 1 `<url>`** **进行浅克隆，只拉取最近一次提交，下载速度极快，适合仅需阅读代码或部署的场景。**

### 2. status / diff / log - 查看状态与历史

* **git status**：查看工作区状态
* **git diff**：查看工作区与暂存区的差异
* **git log --oneline --graph --all**：以图形化简略方式查看提交历史

> **💡** **Pro Tip**: 推荐安装 **lazygit**，它是一个基于终端的 UI 工具，能极大提升 Git 操作效率 (类似文件管理器般操作 Git)。

### 3. add / commit - 提交更改

* **git add .**：将所有更改添加到暂存区
* **git add -p**：交互式添加 (逐块确认)，适合只想提交部分修改时
* **git commit -m "msg"**：提交暂存区内容并附带信息
* **git commit --amend**：修改最近一次提交 (可修改注释或追加漏掉的文件，不产生新 commit ID)

### 4. branch / switch / merge - 分支管理

* **git branch**：列出本地分支
* **git switch `<branch>`**：切换分支 (比 **checkout** **语义更清晰)**
* **git switch -c `<new-branch>`**：创建并切换到新分支
* **git merge `<branch>`**：将指定分支合并到当前分支
* **git rebase `<branch>`**：变基合并 (保持提交历史线性整洁，**注意**：不要在公共分支使用)

### 5. restore / reset / stash - 撤销与“后悔药”

* **git restore `<file>`**：丢弃工作区的修改 (恢复到最后一次 commit 状态)。
* **git reset --soft HEAD^**：撤销最近一次 commit，但保留代码在暂存区 (常用于修改 commit message)。
* **git reset --hard HEAD^**：**危险** 彻底回退到上一个版本，丢弃所有更改。
* **💡 终极后悔药：`git reflog`**
  - **场景**：你不小心 `reset --hard` 把代码删了，或者分支弄丢了。
  - **方案**：`reflog` 记录了你所有的操作记录，找到对应的哈希值，用 `git reset --hard <hash>` 就能奇迹般找回。

---

### 6. 实战排障场景

#### 痛点 1：`.gitignore` 设置了但不生效
- **原因**：文件已经被追踪 (tracked)，必须先从缓存中删除。
- **方案**：`git rm -r --cached .` -> `git add .` -> `git commit`。

#### 痛点 2：撤销已经 Push 到远程的提交
- **不要使用 `reset -f`** (除非是个人项目且只有你一个人在用)。
- **方案**：`git revert <commit-id>`。这会产生一个新的提交，其内容是该 ID 的反向修改，安全且保留历史。

#### 痛点 3：合并冲突 (Merge Conflict)
- **方案**：
  1. 打开冲突文件，找到 `<<<<<<<` 到 `>>>>>>>` 标记。
  2. 手动保留需要的代码。
  3. `git add <file>` -> `git commit`。
- **现代化工具**：在 VS Code 中点击 "Accept Incoming Change" 效率最高。

---

### 7. remote / pull / push - 远程同步

* **git remote -v**：查看远程仓库地址
* **git pull**：拉取远程代码并合并 (等同于 fetch + merge)
* **git pull --rebase**：拉取并使用变基模式 (推荐，避免产生无用的 merge commit)
* **git push**：推送本地提交到远程
* **git push -f**：**危险** **强制推送 (仅限自己掌握的分支或修正历史时使用)**

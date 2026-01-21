# 🐙 Git 全方位生存指南

## 0. 核心心法：本地分支 vs 远程分支 (解开混乱之源)

很多新手觉得分支乱，是因为没搞懂**“本地”**和**“远程”**其实是两套东西。

*   **本地分支 (Local Branch)**：你电脑上的 `main`。只有你能看见，随便改，随便删，不需要联网。
*   **远程分支 (Remote Branch)**：GitHub/GitLab 服务器上的 `main`。
*   **远程跟踪分支 (Remote Tracking Branch)**：你电脑上看到的 `origin/main`。这是 Git 在你本地做的一个“快照”，用来告诉你“上次联网时，远程长什么样”。
*   **关联 (Upstream)**：把本地 `main` 和远程 `origin/main` 绑在一起，这样 `git pull/push` 才知道要往哪里传。

> **💡 简单理解**：你本地是**“草稿箱”**，远程是**“公告栏”**。`origin/main` 是你手里拿着的**“公告栏照片”**（只有执行 `git fetch` 时照片才会更新）。

---

## 1. Init / Clone / Config - 初始化与配置

*   **git clone `<url>`**：下载远程仓库（自动建立本地与远程的关联）。
*   **git config --global user.name "Name"**：配置用户名。
*   **git config --global user.email "email@example.com"**：配置邮箱（这决定了 GitHub 上头像显示是否正确）。

---

## 2. Status / Diff / Log - 洞察

*   **git status -s**：精简模式查看状态。
*   **git diff**：看工作区改了啥（还没 add 的）。
*   **git diff --staged**：看暂存区改了啥（准备 commit 的）—— **Push 前最后一道防线**。
*   **git log --oneline --graph --all**：查看“地铁线路图”一样的提交历史。

---

## 3. Branch / Switch - 分支管理

*   **git branch**：看本地有哪些分支。
*   **git branch -r**：看远程有哪些分支。
*   **git switch -c `<new>`**：创建并切换分支。
*   **git switch `<branch>`**：切换分支。

---

## 4. Merge vs Rebase - 合并与变基 (核心概念)

这是新手最容易晕的地方。假设你在 `feature` 分支开发，`main` 分支有了新更新。

### 🔹 Merge (合并)
*   **命令**：`git merge main` (在 feature 分支上执行)
*   **原理**：创建一个新的“合并节点” (Merge Commit)，把两边的修改绑在一起。
*   **优点**：真实记录历史，安全，不改变现有 Commit ID。
*   **缺点**：历史记录会出现很多分叉和环，看起来乱。
*   **适用**：**公共分支**（如把 feature 合并回 main 时）。

### 🔹 Rebase (变基)
*   **命令**：`git rebase main` (在 feature 分支上执行)
*   **原理**：**“剪切 + 粘贴”**。把你 `feature` 分支上的修改暂时拿下来，把 `feature` 的基底移动到 `main` 的最新位置，然后再把你的修改**重新播放**（Replay）上去。
*   **优点**：历史记录是一条直线，极其干净。
*   **缺点**：**会修改历史！** 会改变 Commit ID。
*   **适用**：**个人开发分支**（在合并回主分支前，整理自己的提交记录）。

> **⚠️ 铁律**：**绝对不要在公共分支（别人也在用的分支）上执行 Rebase！**

---

## 5. Remote / Sync - 远程同步与保护

*   **git fetch --all**：更新本地的“远程快照”（origin/xxx），**不合并代码**。这是最安全的“看一眼”操作。
*   **git pull**：`fetch` + `merge`。
*   **git pull --rebase**：`fetch` + `rebase`。推荐用法，能防止产生无意义的合并节点。

### 🛑 痛点：GitHub 分支保护 (Protected Branch) 阻止 Push
当你尝试 `git push -f` 时，报错 `remote: error: GH006: Protected branch update failed`。
*   **原因**：GitHub 仓库设置了 Rule，禁止任何人（包括管理员）强制推送 `main/master`，防止历史被篡改。
*   **解决方案**：
    1.  **正规解法**：不要试图覆盖历史。使用 **`git revert`** 产生一个新的提交来抵消之前的错误（详见第 7 节）。
    2.  **暴力解法（仅限管理员）**：去 GitHub 仓库 -> Settings -> Branches -> 暂时关闭 "Allow force pushes" 或解除保护 -> 本地强推 -> 重新开启保护。**（极不推荐）**

---

## 6. Modify Remote - 修改与删除远程分支

### 修改远程分支名称
Git 没有直接重命名远程分支的命令，必须通过“三步走”实现：
1.  **重命名本地分支**：`git branch -m old-name new-name`
2.  **删除旧的远程分支**：`git push origin --delete old-name`
3.  **推送新的本地分支**：`git push -u origin new-name`

### 删除远程分支
*   **git push origin --delete `<branch>`**

### 清理无效的远程追踪
*   **git remote prune origin**：如果远程分支已经被别人删了，但你本地 `git branch -r` 还能看到，用这个命令清理。

---

## 7. Regret / Rollback - 版本回退与后悔药 (高危与救命)

这是很多人的噩梦，请根据场景选择药方：

### 场景 A：代码还在本地，没 Push 到远程
*   **需求**：我刚 commit 了一版代码，觉得写得太烂，想撤销。
*   **方案**：
    *   `git reset --soft HEAD^`：撤销 Commit，**代码保留在暂存区**（最推荐，重写 commit 专用）。
    *   `git reset --hard HEAD^`：**彻底删除**最近一次 Commit 和所有代码（慎用）。

### 场景 B：代码已经 Push 到远程 (个人分支)
*   **需求**：我 push 错代码了，这个分支只有我一个人用。
*   **方案**：
    1.  `git reset --hard HEAD^` (本地先回退)
    2.  `git push -f` (强制覆盖远程)
    *   *注意：如果使用了 `--force-with-lease` 会更安全，它会检查期间有没有人 push 过。*

### 场景 C：代码已经 Push 到远程 (公共/保护分支) 🔥
*   **需求**：`main` 分支被合并了一个 Bug，或者我误提交了密钥。但我不能 Force Push（因为有分支保护或同事会炸）。
*   **方案**：使用 **`git revert`**。
    *   **git revert `<commit-id>`**
    *   **原理**：Git 会生成一个新的 Commit，内容是**反向操作**（你加了一行，它就删一行）。
    *   **结果**：历史记录一直向前，没有被篡改，但代码效果回退了。完美符合分支保护规则。

---

## 8. Stash - 临时暂存 (多任务切换神器)

*   **git stash**：把当前工作区（未 commit）的所有修改“冻结”并藏起来，让工作区变干净。
*   **git stash pop**：把藏起来的代码“解冻”并恢复。
*   **git stash list**：查看藏了几个版本。
*   **适用场景**：你在修 Bug A，老板突然让你修 Bug B。你不想提交半成品的 A，就用 `stash` 存起来，修完 B 再 `pop` 出来继续做 A。

---

## 9. 终极实战排障 (Troubleshooting)

#### ❓ 痛点 1：Pull 的时候提示 "Refusing to merge unrelated histories"
*   **场景**：你在 GitHub 建了带 README 的仓库，本地又 `init` 了一个仓库，关联后想 Pull 下来。
*   **解决**：`git pull origin main --allow-unrelated-histories`

#### ❓ 痛点 2：Cherry-pick (隔空取物)
*   **场景**：分支 A 里的一个特定修复（commit hash: `a1b2c3`），你想把它应用到分支 B，但不想合并整个分支 A。
*   **解决**：
    1.  `git switch B`
    2.  `git cherry-pick a1b2c3`

#### ❓ 痛点 3：救命！我 reset --hard 删错东西了
*   **场景**：手滑把代码弄没了。
*   **解决**：
    1.  `git reflog` (查看所有操作记录，包括被删除的 commit)。
    2.  找到丢失前的那个哈希值（例如 `index 1` 是 `4b8d3a`）。
    3.  `git reset --hard 4b8d3a` (时光倒流)。

#### ❓ 痛点 4：解决 Git 大小写不敏感导致的问题
*   **场景**：你把文件名从 `File.java` 改成 `file.java`，Git 居然没反应？
*   **原因**：Windows/macOS 默认对文件名大小写不敏感。
*   **解决**：`git config core.ignorecase false`（开启敏感模式）。

#### ❓ 痛点 5：已经提交的文件再写入.gitignore无法撤回
*   **场景**：你不小心把一个重要文件提交了，后来才发现它不应该被提交。
*   **解决**：
    1.  `git rm --cached <file>` (从暂存区移除)。
    2.  `git commit -m "Remove <file> from tracking"` (提交移除操作)。
    3.  `git push` (同步到远程)。

---

### 🛡️ 职业开发者 Git 肌肉记忆总结

1.  **开工前**：`git pull --rebase` (保持基底最新)。
2.  **提交前**：`git status` + `git diff --staged` (确认自己提交了什么)。
3.  **公共分支回退**：**严禁 Reset + Force Push**，必须用 **Revert**。
4.  **私有分支整理**：用 **Rebase** 让提交线变好看。
5.  **遇到冲突**：不要慌，看 `<<<<` 和 `>>>>`，VS Code 会帮你。
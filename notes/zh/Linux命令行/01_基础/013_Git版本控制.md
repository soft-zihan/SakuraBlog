# 🐙 Git 全方位生存指南

## 0. 核心心法：本地分支 vs 远程分支 (解开混乱之源)

很多新手觉得 Git 乱，是因为没搞懂**“本地”**和**“远程”**其实是三层结构，而不是两层。

### 🔑 三层结构图解

1.  **本地分支 (Local Branch)**
    *   **样子**：`main`, `feature/login`
    *   **位置**：你的硬盘里。
    *   **权限**：你的私人领地。随便改、随便删、reset 哪怕炸了也不影响别人。
    *   **状态**：时刻是最新的（你改了就算）。

2.  **远程分支 (Remote Branch)**
    *   **样子**：GitHub/GitLab 服务器上的 `main`
    *   **位置**：云端服务器。
    *   **权限**：公共领地。只有通过 `push` 才能修改它。

3.  **远程跟踪分支 (Remote Tracking Branch) —— ⚠️ 最容易被忽视的概念**
    *   **样子**：`origin/main`, `origin/feature/login` (红色字体的那些)
    *   **位置**：**也在你的硬盘里！**
    *   **本质**：这是 Git 在你本地建立的一个**“影子”或“快照”**。
    *   **更新机制**：它**不会**自动变！只有当你执行 `git fetch` 或 `git pull` 时，Git 才会联网去看看远程长什么样，然后更新这个“影子”。

### 💡 终极比喻：公告栏系统

*   **本地分支** = 你桌上的 **“草稿纸”**。
*   **远程分支** = 公司走廊里的 **“公共公告栏”**。
*   **远程跟踪分支 (`origin/main`)** = 你手机里拍的那张 **“公告栏照片”**。

> **为什么会冲突？**
> 你在草稿纸（本地）上写了代码，想贴到公告栏（远程）上。
> 但 Git 拿出你手机里的照片（`origin/main`）一看，发现：“咦？照片里的公告栏和你现在的草稿对不上啊，或者别人已经贴了新东西。”
> 这时就需要你先更新照片（`fetch`），再处理差异（`merge/rebase`）。

---

## 1. Init / Clone / Config - 初始化与洞察

工欲善其事，必先利其器。这里不仅是配置，更是“长双眼睛”看清项目状态。

### 🛠️ 1.1 起步 (Setup)

#### 配置身份 (必做)
这是第一步。如果不配，你的 Commit 在 GitHub 上就是一个灰色的头像，无法点击跳转。
```bash
# 配置用户名（Commit 记录里显示的名字）
git config --global user.name "Your Name"

# 配置邮箱（必须和 GitHub/GitLab 绑定的邮箱一致，决定头像显示）
git config --global user.email "email@example.com"

# 检查配置
git config --global --list
```

#### 获取仓库
*   **方案 A：已有远程仓库**
    ```bash
    git clone https://github.com/user/repo.git
    # 自动完成：下载代码 + 建立 .git 目录 + 自动关联 origin
    ```
*   **方案 B：从本地空文件夹开始**
    ```bash
    git init
    # 建立 .git 目录，但此时还没有关联远程
    ```

---

### 🔍 1.2 洞察 (Insight) —— 拒绝盲操

新手最常见的错误就是“闭着眼睛敲命令”。请养成肌肉记忆，操作前后都要“看”一下。

#### 1. 看状态 (`git status`)
不要只看默认的长文本，推荐用精简模式：
```bash
git status      # 标准模式，废话较多
git status -s   # 精简模式 (Short) —— 强力推荐
```
> **精简模式输出含义：**
> *   `M ` (红色)：文件在工作区被修改，**未** add。
> *   `M ` (绿色)：文件已 add，**待** commit。
> *   `??`：新文件，Git 还没追踪它。

#### 2. 看差异 (`git diff`) —— Push 前的最后防线
这是很多人的盲区，搞不清 `diff` 到底在比对谁。

*   **场景 A：我刚改了代码，还没 add**
    ```bash
    git diff
    # 比对：【工作区】 vs 【暂存区/上次提交】
    # 作用：看看我刚才手滑改了啥？
    ```

*   **场景 B：我已经 add 了，准备 commit (重点！)**
    ```bash
    git diff --staged
    # 比对：【暂存区】 vs 【HEAD (最新一次提交)】
    # 作用：确认我即将提交进历史记录的到底是啥？（防止把测试代码或密码提交上去）
    ```

#### 3. 看历史 (`git log`)
默认的 `log` 像看书一样太累，我们要像看“地铁线路图”一样看历史。

```bash
# 强烈建议配置别名或记住这个组合
git log --oneline --graph --all
```
*   `--oneline`: 把每个 commit 压缩成一行，只显示哈希前7位和标题。
*   `--graph`: 在左边画出 ASCII 字符组成的树状图，清晰展示分支合并情况。
*   `--all`: 显示所有分支（包括本地和远程跟踪分支），不加这个默认只看当前分支。

---
## 2. Branch / Switch - 分支操作：平行宇宙

Git 的杀手级特性就是“分支”。它允许你开启多个“平行宇宙”，在其中一个宇宙里修 Bug，在另一个宇宙里开发新功能，互不干扰。

### 🌿 2.1 查看与创建

现在的 Git 推荐将“切换”和“恢复”功能从 `git checkout` 中分离出来，使用语义更清晰的 `git switch`。

*   **查看分支**
    ```bash
    git branch        # 查看本地分支
    git branch -r     # 查看远程分支 (remote)
    git branch -av    # 【推荐】查看所有分支(本地+远程) + 最后一次提交信息
    ```

*   **创建与切换**
    ```bash
    # 纯创建（不切换）
    git branch feature-login

    # 切换到已有分支
    git switch feature-login

    # 【常用】创建并自动切换
    git switch -c feature-login
    # (等同于旧版 git checkout -b feature-login)
    ```

### 🗑️ 2.2 删除分支

分支合并完通常就可以删了。

*   **安全删除**（Git 会检查分支是否已经合并，没合并会报错阻止）：
    ```bash
    git branch -d feature-login
    ```
*   **强制删除**（不管有没有合并，强行删）：
    ```bash
    git branch -D feature-login
    ```

> **💡 提示**：你不能删除当前所在的“脚下”的分支。必须先 switch 到别的分支（如 `main`），才能删除目标分支。

---

## 3. Merge vs Rebase - 合并的艺术 (核心概念)

这是 Git 进阶的分水岭。假设你正在 `feature` 分支开发，而 `main` 分支被同事更新了。你需要把 `main` 的新代码同步到你的 `feature` 分支里，或者把你做好的 `feature` 合并回 `main`。

有两种方式，效果截然不同：

### 🪄 3.1 交互式变基 (Interactive Rebase) - 整理历史的神器
`rebase -i` 允许你像剪辑师一样，对 commit 进行修改、合并、删除。

**场景**：你在本地 commit 了 5 次（"fix", "fix again", "fix final"），想把它们合并成一个完美的 "Complete login feature" 再 push。

1.  **启动**：
    ```bash
    git rebase -i HEAD~3  # 修改最近的 3 个 commit
    ```
2.  **编辑**：Git 会打开一个编辑器，显示 commit 列表。
    ```text
    pick a1b2c3d fix: login bug
    squash d4e5f6g fix: typo
    squash g7h8i9j fix: final check
    ```
    - **pick**：保留这个 commit。
    - **squash (s)**：**挤压**。把这个 commit 合并到上一个 commit 里。
    - **reword (r)**：修改提交信息。
    - **drop (d)**：删除这个 commit。
3.  **保存**：`:wq` 保存退出，Git 会自动执行合并。

### 🔹 3.2 Merge (合并)

**“编织绳结”**：保留一切历史真相。

*   **命令**：
    ```bash
    # 假设当前在 feature 分支，想把 main 的更新合过来
    git merge main
    ```
*   **原理**：Git 会创建一个新的 **“合并提交” (Merge Commit)**，把两个分支的历史像系绳子一样打个结连在一起。
*   **优点**：
    *   **诚实**：完整保留了分支的开始和结束时间点。
    *   **安全**：不会修改现有的 Commit ID。
*   **缺点**：
    *   如果不加节制地使用，提交历史（`git log --graph`）会变成一团乱麻，像“地铁线路图”爆炸了一样。
*   **适用场景**：**公共分支之间**（例如把 `feature` 合并回 `main`，或者 `dev` 合并到 `test`）。

### 🔹 3.3 Rebase (变基)

**“剪切 + 粘贴”**：为了强迫症般的整洁。

*   **命令**：
    ```bash
    # 假设当前在 feature 分支，想把 main 的更新合过来
    git rebase main
    ```
*   **原理**：
    1.  **剪切**：Git 把你 `feature` 分支上独有的 commit 先暂时“拿下来”。
    2.  **移动基底**：把 `feature` 分支的根基，移动到 `main` 的最新位置。
    3.  **粘贴 (Replay)**：把你刚才拿下来的 commit，一个接一个地**重新播放**在新的 `main` 后面。
*   **优点**：
    *   **整洁**：历史记录是一条完美的直线，没有分叉，没有多余的 Merge Commit。
*   **缺点**：
    *   **篡改历史**：因为是“重新播放”，**所有 commit 的哈希值（ID）都会变！**
    *   **冲突风险**：如果 commit 很多，每次“重放”都可能遇到冲突，需要一次次解。
*   **适用场景**：**私人开发分支**（在 push 给别人看之前，自己在本地整理代码）。

### ⚔️ 终极对决：黄金法则

> **⚠️ 铁律：绝对不要在公共分支（别人也在用的分支）上执行 Rebase！**

*   如果你 rebase 了 `main` 分支，推送到远程，所有同事的代码历史都会和远程对不上，大家会想打死你。
*   **个人分支**（只有你自己在用）：尽情 **Rebase**，保持直线美感。
*   **公共/集成分支**（团队共享）：老老实实 **Merge**，保留历史痕迹。
---
## 4. Remote / Sync - 远程同步与保护

这里是团队协作最容易“撞车”的地方。还记得第 0 节提到的“公告栏”比喻吗？这一节就是教你如何优雅地和公告栏同步。

### 📡 4.1 Fetch vs Pull (看一眼 vs 拿回来)

*   **git fetch --all** (👀 安全的“看一眼”)
    *   **作用**：更新本地的 `origin/xxx`（远程跟踪分支）。
    *   **特点**：**绝对安全**。它只会更新“照片”，**绝不会**修改你正在写代码的工作区。
    *   **场景**：你想看看同事是不是提交了新代码，但不想打断自己手头的工作。

*   **git pull** (📥 简单粗暴的“拿回来”)
    *   **公式**：`git pull` = `git fetch` + `git merge`
    *   **作用**：把远程代码拉下来，并立刻尝试和你的代码合并。
    *   **缺点**：如果远程有更新，你本地也有提交，`git pull` 默认会产生一个分叉的 Merge Commit（“Merge branch 'main' of... ”），让历史变得不直观。

### 🚀 4.2 推荐姿势：git pull --rebase

这是让你的提交记录保持直线神技。

*   **命令**：
    ```bash
    git pull --rebase
    ```
*   **公式**：`git fetch` + `git rebase`
*   **发生了什么**：
    1.  把远程最新的代码拉下来 (`fetch`)。
    2.  把你本地还没 push 的 commit 暂时“拿下来”。
    3.  把远程代码更新到你的分支上。
    4.  把你刚才拿下来的 commit **排队放到最新代码的后面**。
*   **结果**：你的提交永远在最新进度的最上面，没有无意义的分叉。

### 🛑 4.3 痛点：GitHub 分支保护 (Protected Branch)

当你尝试 Push 时，如果看到这种报错：
`remote: error: GH006: Protected branch update failed.`

*   **发生了什么**：
    GitHub 仓库管理员给这个分支（通常是 `main` 或 `master`）上了锁。
    1.  **禁止直接 Push**：必须通过 Pull Request (PR) 合并。
    2.  **禁止 Force Push**：也就是禁止修改历史（禁止 Rebase/Reset 后的推送）。

*   **如何应对**：
    *   **如果你是普通开发者**：老老实实开一个新的分支，提交代码，去网页端提 PR。
    *   **如果你因为 Reset 回退导致无法 Push**：你的本地历史落后于远程了。在保护分支上，**不能**用 `push -f` 覆盖。你必须用 `git revert` 来产生新的提交以抵消错误（详见第 7 节）。

---

## 5. Modify Remote - 修改与管理远程分支

Git 对远程分支的操作没有“一键重命名”那么直观，通常需要组合拳。

### 🏷️ 5.1 重命名远程分支

假设你有个分支叫 `feature-old`，想改名为 `feature-new`。
**Git 没有直接修改远程名字的命令**，必须走“三步走”战略：

1.  **本地改名**：
    ```bash
    git branch -m feature-old feature-new
    ```
2.  **删除旧的远程分支**：
    ```bash
    git push origin --delete feature-old
    ```
3.  **推送新的本地分支**：
    ```bash
    git push -u origin feature-new
    ```
    > `-u` (upstream) 很重要，它会把本地的新分支和远程的新分支重新关联起来。

### 🗑️ 5.2 删除远程分支

代码合并完了，远程分支留着也是垃圾，删掉它：

```bash
git push origin --delete <branch-name>
```

### 🧹 5.3 清理无效的远程追踪 (Prune)

**场景**：同事在 GitHub 网页上把 `feature-A` 删了，但你在本地输入 `git branch -r`，竟然还能看到 `origin/feature-A`。
**原因**：你的本地“快照”过期了，Git 不会自动帮你删快照。

**解决**（强迫症必备）：
```bash
git remote prune origin
```
或者在 fetch 时自动修剪：
```bash
git fetch -p
```
这会把那些“远程已经不存在，但本地还留着尸体”的跟踪分支全部清理干净。

---
## 6. Regret / Rollback - 后悔药与时光机

这是很多人的噩梦，也是 Git 最强大的地方。请根据你的**“案发现场”**选择对应的药方。

### 💊 场景 A：代码还在本地，没 Push

**情况**：我刚 commit 了一版代码，结果发现要追加内容/要修改内容，想撤销这个 commit，重新来过。

*   **方案 1：温和撤销 (保留代码，推荐)**
    ```bash
    git reset --soft HEAD~1
    ```
    *   **效果**：**Commit 没了**，但你的**代码修改完好无损地保留在“暂存区”** (Green status)。
    *   **适用**：你想修改一下刚才的提交信息，或者补几个文件再重新提交。
    *   **也可以直接给最后一次commit追加内容**：
        ```bash
        git commit --amend
        git commit --amend -m "新的提交信息"
        ```

*   **方案 2：中等撤销 (保留代码，需重写 add)**
    ```bash
    git reset HEAD~1  # 默认为 --mixed
    ```
    *   **效果**：**Commit 没了**，代码修改保留在**“工作区”** (Red status)。
    *   **适用**：你想把刚才的一个大 commit 拆分成几个小 commit。

*   **方案 3：毁灭性撤销 (慎用！)**
    ```bash
    git reset --hard HEAD~1
    ```
    *   **效果**：**Commit 没了，代码也没了**。你的工作区会直接回到上一次提交的状态。
    *   **警告**：除非你确定刚才写的代码全是垃圾，否则别用这个。

### 🔥 场景 B：代码已经 Push 到远程 (私有分支)

**情况**：在这个分支只有你一个人开发，你刚 Push 了一段错误代码。

*   **操作步骤**：
    1.  **本地回退**：先在本地执行时光倒流。
        ```bash
        git reset --hard HEAD~1
        ```
    2.  **强制推送**：因为本地历史落后于远程，普通 push 会被拒绝，必须强推。
        ```bash
        git push -f
        ```
    > **注意**：仅限**只有你一个人用**的分支！

### 🛡️ 场景 C：代码已经 Push 到远程 (公共/保护分支)

**情况**：`main` 分支被合并了一个 Bug，或者大家都在用的分支，你不能随意修改历史（否则同事拉代码会报错）。

*   **救命绝招：git revert**
    ```bash
    git revert <commit-id>
    ```
*   **原理**：Git 不会“删除”那个错误的提交，而是自动生成一个**新的提交**，里面的内容是**把错误的那次提交反向操作一遍**（你加了一行，它就删一行）。
*   **结果**：历史记录一直向前滚，没有被篡改，但代码效果回退了。完美符合分支保护规则。

---

## 7. Productivity Tools - 生产力工具箱

除了基础的提交和同步，这三个工具能让你在复杂工作中游刃有余。

### 📦 7.1 Stash - 临时储物柜

**场景**：你在 `feature-A` 分支写代码写到一半（还没 commit），老板突然冲过来说：“线上有个 Bug，快去 `hotfix` 分支修一下！”
你不想提交半成品的代码，也不想丢弃它。

*   **1. 冻结现场 (存)**
    ```bash
    git stash
    # 或者加个备注，方便以后找
    git stash save "正在写登录功能，还没写完"
    ```
    此时，你的工作区瞬间变干净了，可以放心地切换分支去修 Bug。

*   **2. 恢复现场 (取)**
    修完 Bug 回来后：
    ```bash
    git stash pop   # 恢复并删除存档 (常用)
    git stash apply # 恢复但不删除存档 (如果你想在多个分支应用同一份修改)
    ```
    这会把刚才存的内容拿出来，并从储物柜里删除。

*   **3. 查看储物柜**
    ```bash
    git stash list
    ```

### 🍒 7.2 Cherry-pick - 隔空取物 (摘樱桃)

**场景**：同事在 `branch-B` 里修复了一个 Bug（Commit ID: `a1b2c3d`），这个修复你也需要用在你的 `branch-A` 里。但你**不想合并整个 `branch-B`**（因为里面还有很多未完成的功能）。

*   **操作**：
    1.  切换到你的分支：`git switch branch-A`
    2.  摘取那个特定的 Commit：
        ```bash
        git cherry-pick a1b2c3d
        ```
    Git 会把那次提交的修改，单独“复制”一份应用到你当前的分支。

### 🕵️‍♂️ 7.3 Reflog - 后悔药的后悔药

**场景**：你手滑执行了 `git reset --hard`，把辛辛苦苦写的一堆代码弄丢了，连 commit 记录都没了！想死的心都有了？

别慌，Git 记录了你的每一次动作（包括 Reset）。

1.  **查看所有操作记录**：
    ```bash
    git reflog
    ```
    你会看到类似这样的列表：
    ```
    e5b1c3d HEAD@{0}: reset: moving to HEAD~1  <-- 你刚才手滑的操作
    9a8b7c6 HEAD@{1}: commit: 完成了登录功能    <-- 这里是你丢失的代码！
    ```

2.  **复活**：
    找到你丢失代码时的那个哈希值（比如 `9a8b7c6`），然后跳回去：
    ```bash
    git reset --hard 9a8b7c6
    ```
    **复活成功！**

    > **注意**：`reflog` 只保存在本地，且有过期时间（默认 90 天）。如果你删了 `.git` 目录或者换了电脑，就找不回了。

---
## 8. Troubleshooting - 实战排障指南

这里收集了 99% 的开发者都会踩的坑。当你的 Git 报错时，请来这里查阅。

### 🚨 8.1 拒绝合并：Refusing to merge unrelated histories

*   **案发现场**：
    你在 GitHub 上新建了一个仓库（勾选了“Initialize with a README”）。
    然后在本地也 `git init` 了一个仓库，写了点代码。
    当你试图把两者关联并 `pull` 下来时，Git 报错：`fatal: refusing to merge unrelated histories`。
*   **原因**：
    Git 觉得：“这俩仓库的历史完全不相干（没有共同祖先），你是不是搞错了？”
*   **解决**：
    告诉 Git：“别管那么多，强行合在一起。”
    ```bash
    git pull origin main --allow-unrelated-histories
    ```

### 🔡 8.2 文件名大小写不敏感问题

*   **案发现场**：
    你把 `UserLogin.js` 重命名为 `userLogin.js`。
    输入 `git status`，Git 居然说 **"nothing to commit"**，它根本没发现文件名变了！
*   **原因**：
    Windows 和 macOS 的默认文件系统对大小写不敏感，Git 默认继承了这个特性。
*   **解决**：
    *   **方案 A（推荐，最稳妥）**：使用 Git 专用的重命名命令。
        ```bash
        git mv UserLogin.js userLogin.js
        ```
    *   **方案 B（配置修改）**：让 Git 强制敏感（可能会导致同一目录下出现两个同名文件的问题，慎用）。
        ```bash
        git config core.ignorecase false
        ```

### 🙈 8.3 .gitignore 不生效

*   **案发现场**：
    你明明在 `.gitignore` 里写了 `secret.key`，但每次 `git status` 还是能看到这个文件被追踪。
*   **原因**：
    `.gitignore` **只对“从未被 Git 追踪过”的文件有效**。如果这个文件以前被提交过（哪怕一次），它就已经在 Git 的“名单”里了，忽略规则对它无效。
*   **解决**：
    必须先把文件从“名单”（暂存区）里踢出去，但保留在硬盘里。
    ```bash
    # 1. 从暂存区移除（--cached 表示不删本地文件）
    git rm --cached secret.key
    git rm --cached -r files/

    # 2. 提交这个移除操作
    git commit -m "Stop tracking secret.key"
    ```
    从此以后，Git 就会开始遵守 `.gitignore` 的规则了。

### ⚔️ 8.4 解决代码冲突 (Conflict)

*   **案发现场**：
    `git merge` 或 `git pull` 时，屏幕出现 `CONFLICT (content): Merge conflict in ...`。
*   **解决步骤**：
    1.  **不要慌**：打开冲突的文件。
    2.  **找标记**：你会看到 Git 留下的记号：
        ```text
        <<<<<<< HEAD
        console.log("这是我写的代码");
        =======
        console.log("这是同事写的代码");
        >>>>>>> feature-B
        ```
    3.  **做选择**：
        *   保留上面？
        *   保留下面？
        *   还是两个都要？
        *   删除标记符号（`<<<`, `===`, `>>>`），留下你想要的代码。
    4.  **提交**：
        ```bash
        git add .
        git commit -m "Fix merge conflict"
        ```

---

## 9. Conclusion - 职业开发者肌肉记忆

恭喜你！你已经掌握了 Git 90% 的核心功能。最后，我们将这些知识浓缩成一套**“每日生存法则”**。

### 💪 每日工作流 (Workflow)

1.  **早晨开工**：
    *   `git switch main` （切回主分支）
    *   `git pull --rebase` （拉取最新代码，保持直线）
    *   `git switch -c feature-xxx` （切出新分支干活）

2.  **干活中途**：
    *   `git status -s` （随时看状态）
    *   `git add .` + `git commit` （小步快跑，多提交）

3.  **遇到插队**：
    *   `git stash` （存起来去修 Bug）
    *   `git stash pop` （修完回来继续干）

4.  **提交代码前**：
    *   `git diff --staged` （最后确认一遍自己提交了啥，防社死）

5.  **下班推送**：
    *   **个人分支**：`git rebase main` （把自己的提交整理在 main 之后） -> `git push`
    *   **公共分支**：`git pull --rebase` -> `git push`

### 📜 必背命令速查表 (Cheatsheet)

| 场景 | 命令 |
| :--- | :--- |
| **初始化** | `git clone <url>` |
| **看状态** | `git status -s` |
| **看历史** | `git log --oneline --graph --all` |
| **切分支** | `git switch <branch>` |
| **建分支** | `git switch -c <new-branch>` |
| **拉代码** | `git pull --rebase` (强烈推荐) |
| **撤销提交** | `git reset --soft HEAD~1` (重写 commit 用) |
| **回滚历史** | `git revert <commit-id>` (公共分支用) |
| **救命复活** | `git reflog` + `git reset --hard <hash>` |

> **🎓 结语**：
> Git 不是为了折磨你，而是为了让你在搞砸代码的时候有“后悔药”可吃，在多人协作的时候有“规矩”可循。
> **不要背命令，去理解它背后的图谱。** 祝你 `git push` 永远一路绿灯！ 🚀
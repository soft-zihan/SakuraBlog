# 🚨 Git故障排查

## 0. Regret / Rollback - 后悔药与时光机

这是很多人的噩梦，也是 Git 最强大的地方。请根据你的**"案发现场"**选择对应的药方。

### 💊 场景 A：代码还在本地，没 Push

**情况**：我刚 commit 了一版代码，结果发现要追加内容/要修改内容，想撤销这个 commit，重新来过。

*   **方案 1：温和撤销 (保留代码，推荐)**
    ```bash
    git reset --soft HEAD~1
    ```
    *   **效果**：**Commit 没了**，但你的**代码修改完好无损地保留在"暂存区"** (Green status)。
    *   **适用**：你想修改一下刚才的提交信息，或者补几个文件再重新提交。
    *   **也可以直接给最后一次commit追加内容**：
        ```bash
        git commit --amend
        git commit --amend -m "新的提交信息"
        ```

#### ✅ 进阶补全：`git commit --amend` 的安全边界（以及如何避免"改到一半炸裂"）

把 `--amend` 理解为：**把"最后一次提交"当成草稿重新提交一遍**（Commit ID 会变）。

* **什么时候用它最稳**：
  * 你还没 push（只在本地）：随便 amend，风险几乎为 0。
  * 你 push 了，但这是你的私人分支、且没人基于它开发：可以 amend，但 push 需要用 force。

* **什么时候尽量别用**：
  * 你已经把这个 commit push 到公共/多人使用的分支（包括 main、团队共享 feature）：amend 会改写历史，别人拉取会出现历史分叉，需要团队一起"对齐历史"，成本高。

* **两条避免踩坑的肌肉记忆**：
  1. `amend` 前先确认自己是不是"落后远端"（避免你在旧基底上改最后一个提交，后面一 pull 就进入冲突地狱）：
     ```bash
     git fetch
     git status -sb
     ```
     如果看到 `behind` 或 `diverged`，先把分支同步干净（见Git协作与同步章节）。
  2. `amend` 后如果需要强推，只用 `--force-with-lease`（比 `-f` 安全，能防止你覆盖别人新 push 的提交）：
     ```bash
     git push --force-with-lease
     ```

*   **方案 2：中等撤销 (保留代码，需重写 add)**
    ```bash
    git reset HEAD~1  # 默认为 --mixed
    ```
    *   **效果**：**Commit 没了**，代码修改保留在**"工作区"** (Red status)。
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
*   **原理**：Git 不会"删除"那个错误的提交，而是自动生成一个**新的提交**，里面的内容是**把错误的那次提交反向操作一遍**（你加了一行，它就删一行）。
*   **结果**：历史记录一直向前滚，没有被篡改，但代码效果回退了。完美符合分支保护规则。

---

## 1. Productivity Tools - 生产力工具箱

除了基础的提交和同步，这三个工具能让你在复杂工作中游刃有余。

### 📦 1.1 Stash - 临时储物柜

**场景**：你在 `feature-A` 分支写代码写到一半（还没 commit），老板突然冲过来说："线上有个 Bug，快去 `hotfix` 分支修一下！"
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

### 🍒 1.2 Cherry-pick - 隔空取物 (摘樱桃)

**场景**：同事在 `branch-B` 里修复了一个 Bug（Commit ID: `a1b2c3d`），这个修复你也需要用在你的 `branch-A` 里。但你**不想合并整个 `branch-B`**（因为里面还有很多未完成的功能）。

*   **操作**：
    1.  切换到你的分支：`git switch branch-A`
    2.  摘取那个特定的 Commit：
        ```bash
        git cherry-pick a1b2c3d
        ```
    Git 会把那次提交的修改，单独"复制"一份应用到你当前的分支。

### 🕵️‍♂️ 1.3 Reflog - 后悔药的后悔药

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

### 🧩 1.4 从历史里"只拿回一个文件/一段旧版本"

这是非常高频的需求：你不想回退整个提交历史，只想把某一个文件恢复成"过去某次提交/某个分支"的状态。

#### 1.4.1 恢复成某次提交里的版本（推荐：restore）

```bash
git restore --source <commit-id> -- path/to/file
```

例如把 README 恢复到 `a1b2c3d` 那次提交的样子：

```bash
git restore --source a1b2c3d -- README.md
```

这会改动你的工作区（需要你自己决定是否再 commit）。

#### 1.4.2 从某个分支拿一个文件到当前分支

```bash
git restore --source origin/main -- path/to/file
```

常用于"当前分支写乱了，但远端 main 上有一份正确版本"。

#### 1.4.3 只把内容导出到标准输出/文件（不动工作区）

```bash
git show <commit-id>:path/to/file > /tmp/file.old
```

适合"我想对比一下旧文件内容，但不想把工作区弄脏"。

#### 1.4.4 只看某个文件的历史（含重命名追踪）

```bash
git log --follow -- path/to/file
```

`--follow` 对"文件改名后找不到历史"很关键。

---

## 2. Troubleshooting - 实战排障指南

这里收集了 99% 的开发者都会踩的坑。当你的 Git 报错时，请来这里查阅。

### 🚨 2.1 拒绝合并：Refusing to merge unrelated histories

*   **案发现场**：
    你在 GitHub 上新建了一个仓库（勾选了"Initialize with a README"）。
    然后在本地也 `git init` 了一个仓库，写了点代码。
    当你试图把两者关联并 `pull` 下来时，Git 报错：`fatal: refusing to merge unrelated histories`。
*   **原因**：
    Git 觉得："这俩仓库的历史完全不相干（没有共同祖先），你是不是搞错了？"
*   **解决**：
    告诉 Git："别管那么多，强行合在一起。"
    ```bash
    git pull origin main --allow-unrelated-histories
    ```

### 🔡 2.2 文件名大小写不敏感问题

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

### 🙈 2.3 .gitignore 不生效

*   **案发现场**：
    你明明在 `.gitignore` 里写了 `secret.key`，但每次 `git status` 还是能看到这个文件被追踪。
*   **原因**：
    `.gitignore` **只对"从未被 Git 追踪过"的文件有效**。如果这个文件以前被提交过（哪怕一次），它就已经在 Git 的"名单"里了，忽略规则对它无效。
*   **解决**：
    必须先把文件从"名单"（暂存区）里踢出去，但保留在硬盘里。
    ```bash
    # 1. 从暂存区移除（--cached 表示不删本地文件）
    git rm --cached secret.key
    git rm --cached -r files/

    # 2. 提交这个移除操作
    git commit -m "Stop tracking secret.key"
    ```
    从此以后，Git 就会开始遵守 `.gitignore` 的规则了。

#### 2.3.1 进阶补全：`.gitignore` 的"路径到底相对谁"

`.gitignore` 的匹配，是以它所在目录为基准的；最常见的是放在仓库根目录，规则也就相对仓库根目录（也就是 `.git` 同级）。

常用规则速记：

* `build/`：忽略任何目录名叫 build 的目录（不管在哪一层）
* `/build/`：只忽略仓库根目录下的 build
* `*.log`：忽略所有 `.log` 文件
* `**/node_modules/`：忽略任意层级的 node_modules（递归写法更清晰）
* `!keep.me`：反向规则（把 keep.me 从忽略里"捞出来"）

调试 `.gitignore` 最好用这一招（告诉你"到底是哪一条规则在生效"）：

```bash
git check-ignore -v path/to/file
```

如果一个文件同时被多层 `.gitignore`、全局 ignore、或 `.git/info/exclude` 影响，这条命令能直接定位来源。

### ⚔️ 2.4 解决代码冲突 (Conflict)

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

### 🧨 2.5 `commit --amend` 之后遇到"分叉/冲突/无法 push"怎么避免与收尾

你刚刚踩到的坑，本质不是 amend "制造了冲突"，而是：**你的本地分支和远端分支已经分叉**，然后又在某个同步动作（pull/merge/rebase/amend）里进入了"未合并状态"。

#### 2.5.1 先判断：你现在是不是处在 merge/rebase 进行中

```bash
git status
```

如果你看到：
* `You have unmerged paths`：说明当前处于合并冲突未解决状态（merge 或 rebase 都可能）
* `fix conflicts and run "git commit"`：通常是 merge
* `run "git rebase --continue"`：是 rebase

#### 2.5.2 避免冲突的最佳实践（操作前）

1. **永远先 fetch 再决定怎么同步**（别上来就 pull）：
   ```bash
   git fetch
   git status -sb
   ```
2. 如果只是"自己一个人用的分支"，推荐同步方式固定成 `pull --rebase`：
   ```bash
   git pull --rebase
   ```
   甚至可以配成默认（从此 `git pull` 就会 rebase）：
   ```bash
   git config --global pull.rebase true
   git config --global rebase.autoStash true
   ```

#### 2.5.3 如果你已经进了冲突现场（操作中）

* **你不想继续这次合并/变基，想回到冲突前**：
  ```bash
  git merge --abort
  ```
  或者（如果是 rebase）：
  ```bash
  git rebase --abort
  ```

* **你要把冲突真正解决掉（推荐做法）**：
  1. 打开冲突文件，删掉标记符，留下你要的最终内容。
  2. 如果你看到状态是 `AA`（both added），表示"两边都新增了同一路径的文件"，它不一定有冲突标记，但 Git 仍然需要你选一个最终版本（或手动合并成一个版本）。
  2. 标记已解决：
     ```bash
     git add <file>
     ```
  3. 如果是 merge：完成一次合并提交
     ```bash
     git commit
     ```
     如果是 rebase：继续重放
     ```bash
     git rebase --continue
     ```

#### 2.5.4 amend 之后 push 被拒：什么时候该 force，怎么 force 才安全

如果你 amend 了"已经 push 过的提交"，普通 push 会失败，因为远端历史没有你的新 commit。

* 私人分支：可以强推，但只用这一种安全写法：
  ```bash
  git push --force-with-lease
  ```
* 公共/保护分支：不要强推，改用 `git revert` 产生"向前的修复提交"（第 0C 节：[后悔药 - 公共分支](#-场景-c代码已经-push-到远程-公共保护分支)）。

### 🔁 2.6 "LF will be replaced by CRLF" 行尾警告（Windows 常见）

* **这条 warning 在说什么**：你当前工作区的文件是 LF 行尾，但 Git/配置预计下次会把它写成 CRLF（或反过来）。它不一定是错误，但会让 diff 变得很噪、也容易引发跨平台协作问题。

* **优先建议（团队协作更稳）**：用 `.gitattributes` 统一行尾策略，让仓库自己说了算；避免每个人机器的 `core.autocrlf` 各说各话。

* **如果你只是想让自己别再反复中招**：检查本机设置与现状
  ```bash
  git config --global core.autocrlf
  git config --show-origin --get core.autocrlf
  ```
  常见选项：
  * `true`：检出到工作区转 CRLF，提交时转回 LF（Windows 习惯，但对某些脚本/容器环境可能不友好）
  * `input`：检出不动，提交时把 CRLF 规范成 LF（跨平台更常用）
  * `false`：不做行尾转换（需要团队自己保证一致）

---

## 3. Conclusion - 职业开发者肌肉记忆

恭喜你！你已经掌握了 Git 90% 的核心功能。最后，我们将这些知识浓缩成一套**"每日生存法则"**。

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
> Git 不是为了折磨你，而是为了让你在搞砸代码的时候有"后悔药"可吃，在多人协作的时候有"规矩"可循。
> **不要背命令，去理解它背后的图谱。** 祝你 `git push` 永远一路绿灯！ 🚀

---

## 4. 🔍 高级故障排查工具

### 🎯 4.1 Bisect - 二分查找定位 Bug

💡 *来自 Pro Git 书籍和 CSDN 技术博客*

**场景**：你发现代码在某个版本还好好的，但现在出了 Bug。中间有 100 个 commit，怎么快速找出是哪个 commit 引入的？

**传统做法**：一个一个 commit 试，最多需要 100 次。

**Git Bisect 做法**：二分查找，最多只需要 7 次！

#### 使用步骤

```bash
# 1. 启动 bisect
git bisect start

# 2. 标记当前版本为"坏"（有 Bug）
git bisect bad

# 3. 标记一个已知"好"的版本（没问题）
git bisect good v1.0.0  # 或者 commit ID
git bisect good abc123

# 4. Git 会自动切换到中间的 commit
# 你测试代码，告诉 Git 是好是坏
git bisect good  # 如果这个版本没问题
git bisect bad   # 如果这个版本有问题

# 5. 重复步骤 4，直到 Git 找到第一个"坏"commit
# Git 会输出："abc123 is the first bad commit"

# 6. 结束 bisect
git bisect reset
```

**自动化 bisect**（如果有测试脚本）：
```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# 让 Git 自动运行测试脚本
git bisect run npm test

# Git 会自动定位到引入 Bug 的 commit
```

**实际案例**：
> 某项目发现支付功能异常，历史有 200 个 commit。使用 `git bisect` 仅用 8 次测试就定位到问题 commit，发现是某个同事重构时误删了一行关键代码。

### 🔎 4.2 Blame - 查看每一行代码的提交者

```bash
# 查看文件每一行最后是谁修改的
git blame src/auth/login.js

# 输出示例：
# a1b2c3d (张三 2024-01-15 10:30:00 +0800 1) function login() {
# d4e5f6g (李四 2024-01-20 14:20:00 +0800 2)   const token = generateToken();
# a1b2c3d (张三 2024-01-15 10:30:00 +0800 3)   return token;
# }

# 查看某几行
git blame -L 10,20 src/auth/login.js

# 显示邮箱
git blame -e src/auth/login.js
```

**使用场景**：
* 发现 Bug 代码，想知道谁写的、为什么这么写
* 代码审查时了解代码演进历史
* 找到相关开发者请教问题

**💡 正确心态**：`git blame` 不是用来"甩锅"的，而是用来"理解上下文"的。每行代码背后都有一个开发者在当时做出了他认为最好的决策。

### 📊 4.3 Diff 高级用法

```bash
# 比较两个分支的差异
git diff main..feature-branch

# 比较两个 commit
git diff abc123 def456

# 只看统计信息（哪些文件改了多少行）
git diff --stat abc123 def456

# 查看某个文件的完整修改历史（含重命名）
git log --follow -p src/utils/helper.js

# 查看谁在什么时候删除了某行代码
git log -S "function deletedFunction" --source --all
```

### 🧩 4.4 Worktree - 同时检查多个分支

💡 *来自掘金技术社区*

**场景**：你正在 `feature-A` 分支开发，突然需要查看 `feature-B` 分支的代码来对比。传统做法是 `stash` 然后 `switch`，很麻烦。

**解决方案**：Git Worktree 允许你同时检出多个分支到不同目录。

```bash
# 1. 创建 worktree（把 feature-B 检出到 ../feature-B-review 目录）
git worktree add ../feature-B-review feature-B

# 2. 在新目录查看代码
cd ../feature-B-review
# 现在你可以同时查看两个分支的代码！

# 3. 查看现有 worktree
git worktree list

# 4. 删除 worktree（完成后）
git worktree remove ../feature-B-review
```

**优势**：
* 不需要 stash 和 switch
* 可以同时运行两个分支的代码对比
* 适合代码审查、对比实现方案

---

## 5. 🚨 常见错误场景与解决方案

### 5.1 "Your branch and 'origin/main' have diverged"

**案发现场**：
```
Your branch and 'origin/main' have diverged,
and have 1 and 1 different commits each, respectively.
```

**原因**：你本地有 1 个 commit，远程也有 1 个不同的 commit（通常是别人 push 了，或者你在其他地方 push 过）。

**解决方案**：

```bash
# 方案 A：rebase（推荐，保持直线）
git pull --rebase origin main
# 如果有冲突，解决后
git rebase --continue

# 方案 B：merge（保留分叉历史）
git pull origin main

# 方案 C：如果确定远程的不要，强推（仅限私人分支）
git reset --hard origin/main
git push -f
```

### 5.2 "error: failed to push some refs" (非 fast-forward)

**案发现场**：
```
To https://github.com/user/repo.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/user/repo.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart.
```

**原因**：远程有你的本地没有的提交，Git 拒绝覆盖。

**解决方案**：

```bash
# 1. 先拉取远程更新
git fetch origin main

# 2. 查看差异
git log --oneline HEAD..origin/main

# 3. 合并或 rebase
git pull --rebase origin main

# 4. 再次推送
git push origin main
```

### 5.3 误删分支恢复

**场景**：你不小心删除了一个还没合并的分支。

```bash
# 删除了本地分支
git branch -D feature-important

# 恢复方法：用 reflog 找到分支最后一次 commit
git reflog --all | grep feature-important
# 找到类似：abc123 refs/heads/feature-important@{0}: commit: 重要功能

# 重新创建分支指向那个 commit
git branch feature-important abc123
```

### 5.4 提交了大文件导致仓库膨胀

**场景**：不小心提交了一个 100MB 的视频文件，即使后来删除了，`.git` 目录依然很大。

**解决方案**：

```bash
# 1. 找出大文件
git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -5 | awk '{print $1}')"

# 2. 从历史中彻底删除
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/bigfile.mp4' \
  --prune-empty --tag-name-filter cat -- --all

# 3. 清理并压缩
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. 强推（注意：会改写所有历史）
git push --force --all
```

**更好的工具**：使用 `git-filter-repo`（官方推荐替代 `filter-branch`）：
```bash
# 安装
pip install git-filter-repo

# 删除大文件
git-filter-repo --invert-paths --path path/to/bigfile.mp4 --force
```

### 5.5 合并后发现问题，如何快速回退？

```bash
# 场景：你 merge 了 feature 分支到 main，但发现有严重 Bug

# 方案 A：reset 回退（仅限还没 push）
git reset --hard HEAD~1  # 撤销最后一次 merge

# 方案 B：revert 回退（已经 push 到公共分支）
git revert -m 1 <merge-commit-id>
# -m 1 表示保留第一个父分支（main）的历史

# 方案 C：如果 merge 后还有新提交
git revert <merge-commit-id>  # 不带 -m，自动处理
```

---

## 6. 🎓 高频面试题与解答

### Q1: `git reset`、`git revert`、`git checkout` 的区别？

**答案**（牛客网 + 小林coding 面试题）：

| 命令 | 作用对象 | 是否改写历史 | 使用场景 |
|:---|:---|:---|:---|
| `git reset` | 当前分支 HEAD | ✅ 是 | 本地回退，未 push 的提交 |
| `git revert` | 生成新提交 | ❌ 否 | 公共分支回退，已 push 的提交 |
| `git checkout` | 工作区/分支 | ❌ 否 | 切换分支、恢复文件 |

**详细解释**：

```bash
# git reset：移动 HEAD 指针，"丢弃"提交
git reset --soft HEAD~1   # 只移动指针，代码保留在暂存区
git reset --mixed HEAD~1  # 移动指针，代码保留在工作区（默认）
git reset --hard HEAD~1   # 移动指针，代码全部丢弃

# git revert：生成一个"反向"提交，抵消之前的修改
git revert abc123  # 生成新提交，撤销 abc123 的修改

# git checkout：切换分支或恢复文件
git checkout main  # 切换到 main 分支
git checkout -- file.txt  # 恢复 file.txt 到最后一次提交的状态
```

### Q2: 如何解决 Git 冲突？请描述完整流程。

**答案**（知乎高赞 + CSDN 博客）：

**完整流程**：

1. **识别冲突**：
   ```bash
   git status  # 看到 "both modified" 的文件
   ```

2. **打开冲突文件**，找到冲突标记：
   ```
   <<<<<<< HEAD
   console.log("我的代码");
   console.log("同事的代码");
   >>>>>>> feature-branch
   ```

3. **解决冲突**（三种选择）：
   * 保留我的代码
   * 保留同事的代码
   * 两者结合，重新编写

4. **标记已解决**：
   ```bash
   git add <resolved-file>  # 标记为已解决
   ```

5. **完成合并**：
   ```bash
   # 如果是 merge
git commit -m "fix: 解决合并冲突"

   # 如果是 rebase
git rebase --continue
   ```

**高级技巧**：
```bash
# 如果不确定，可以接受某一方的全部
git checkout --theirs <file>  # 接受对方的
git checkout --ours <file>    # 接受我方的

# 使用图形化工具
git mergetool  # 调用配置的合并工具（如 meld、kdiff3）
```

### Q3: `git pull --rebase` 遇到冲突怎么办？

**答案**：

```bash
# 场景：git pull --rebase 时有冲突

# 1. Git 会暂停 rebase，提示冲突
git status  # 查看冲突文件

# 2. 解决冲突
# 编辑文件 → 删除冲突标记 → 保留正确代码

# 3. 标记已解决
git add <resolved-file>

# 4. 继续 rebase
git rebase --continue

# 5. 如果想放弃 rebase
git rebase --abort  # 回到 rebase 前的状态

# 6. 跳过当前 commit（罕见情况）
git rebase --skip
```

**预防措施**：
```bash
# 配置自动 stash，避免 rebase 时工作区不干净报错
git config --global rebase.autoStash true
```

### Q4: 如何找回丢失的代码？

**答案**：

**场景 1**：误执行 `git reset --hard`
```bash
# 用 reflog 找回
git reflog  # 找到丢失的 commit ID
git reset --hard <commit-id>
```

**场景 2**：误删分支
```bash
# 方法同上，reflog 查找
git reflog --all | grep <branch-name>
git branch <branch-name> <commit-id>
```

**场景 3**：`git stash` 后丢失
```bash
# 查看所有 stash（包括删除的）
git fsck --no-reflog | grep "dangling commit"

# 找到 stash 的 commit 后恢复
git stash apply <commit-id>
```

**场景 4**：文件删除后想恢复
```bash
# 从最后一次提交中恢复
git checkout HEAD -- <deleted-file>

# 从特定 commit 恢复
git checkout <commit-id> -- <deleted-file>
```

### Q5: 什么是 Detached HEAD？如何修复？

**答案**（小林coding 面试题）：

**Detached HEAD 状态**：HEAD 直接指向 commit，而不是分支。

```bash
# 如何进入 detached HEAD
git checkout abc123  # 直接 checkout 到 commit

# 此时提交会怎样？
# 你的提交会成为"孤儿"，没有分支指向它，很容易丢失
```

**修复方法**：

```bash
# 方案 A：如果你想保留当前修改，创建新分支
git checkout -b new-branch-name

# 方案 B：如果你想丢弃修改，回到 main
git checkout main

# 方案 C：如果已经在 detached HEAD 提交了，想合并到 main
git branch temp-save  # 先创建分支保存
git checkout main
git merge temp-save
git branch -d temp-save  # 合并后删除
```

---

## 7. 💎 Git 故障排查决策树

💡 *来自行业最佳实践总结*

```
你遇到了什么问题？
│
├── 想撤销提交？
│   ├── 还没 push → git reset --soft/mixed/hard
│   └── 已经 push 到公共分支 → git revert
│
├── 代码丢失了？
│   ├── 刚 reset --hard → git reflog + git reset --hard <commit>
│   ├── 误删分支 → git reflog --all + git branch
│   └── 删除了 stash → git fsck --no-reflog
│
├── 合并冲突？
│   ├── 解决冲突 → 编辑文件 → git add → git commit/rebase --continue
│   ├── 想放弃 → git merge/rebase --abort
│   └── 接受某一方 → git checkout --theirs/--ours
│
├── push 被拒绝？
│   ├── 非 fast-forward → git pull --rebase + git push
│   ├── 分支保护 → 走 PR 流程
│   └── 私人分支且确定覆盖 → git push --force-with-lease
│
├── 想找引入 Bug 的 commit？
│   └── git bisect start → git bisect bad/good → 重复 → git bisect reset
│
├── 想看谁改了什么？
│   └── git blame <file>
│
└── 仓库太大？
    ├── 找大文件 → git rev-list + git verify-pack
    └── 清理历史 → git filter-branch / git-filter-repo
```

---

## 📚 参考资料

1. **Pro Git 书籍** - [Git 工具（bisect、blame 等）](https://git-scm.com/book/zh/v2/Git-工具)
2. **小林coding** - [Git 面试题精选](https://xiaolincoding.com/interview/git.html)
3. **知乎专栏** - [Git 冲突解决实战](https://zhuanlan.zhihu.com/p/686538265)
4. **牛客网** - [Git 面试官喜欢问什么](https://www.nowcoder.com/discuss/756268918536151040)
5. **CSDN** - [Git reset revert 区别详解](https://blog.csdn.net/m0_54187478/article/details/138539570)
6. **掘金** - [Git 高级工作流与故障排查](https://juejin.cn/post/6986868722136776718)
7. **廖雪峰 Git 教程** - [撤销修改](https://liaoxuefeng.com/books/git/time-travel/restore/index.html)
8. **Atlassian Git 教程** - [Git Reset 详解](https://www.atlassian.com/git/tutorials/undoing-changes/git-reset)
9. **GitHub Docs** - [Git filter-repo 官方文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

> **💡 学习建议**：
> * 故障排查最重要的是**冷静**，99% 的问题都有解决方案
> * 在本地创建测试仓库，故意制造各种故障场景，练习解决方法
> * 面试前重点掌握：reset vs revert、reflog 使用、冲突解决流程
> * 遇到不确定的操作，先用 `git status` 和 `git log` 看清楚当前状态
> * **永远记住**：只要 `.git` 目录还在，绝大多数操作都可以恢复

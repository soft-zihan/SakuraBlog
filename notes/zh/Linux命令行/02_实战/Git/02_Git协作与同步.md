# 🤝 Git协作与同步

## 0. Merge vs Rebase - 合并的艺术 (核心概念)

这是 Git 进阶的分水岭。假设你正在 `feature` 分支开发，而 `main` 分支被同事更新了。你需要把 `main` 的新代码同步到你的 `feature` 分支里，或者把你做好的 `feature` 合并回 `main`。

有两种方式，效果截然不同：

### 🪄 0.1 交互式变基 (Interactive Rebase) - 整理历史的神器
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

### 🔹 0.2 Merge (合并)

**"编织绳结"**：保留一切历史真相。

*   **命令**：
    ```bash
    # 假设当前在 feature 分支，想把 main 的更新合过来
    git merge main
    ```
*   **原理**：Git 会创建一个新的 **"合并提交" (Merge Commit)**，把两个分支的历史像系绳子一样打个结连在一起。
*   **优点**：
    *   **诚实**：完整保留了分支的开始和结束时间点。
    *   **安全**：不会修改现有的 Commit ID。
*   **缺点**：
    *   如果不加节制地使用，提交历史（`git log --graph`）会变成一团乱麻，像"地铁线路图"爆炸了一样。
*   **适用场景**：**公共分支之间**（例如把 `feature` 合并回 `main`，或者 `dev` 合并到 `test`）。

### 🔹 0.3 Rebase (变基)

**"剪切 + 粘贴"**：为了强迫症般的整洁。

*   **命令**：
    ```bash
    # 假设当前在 feature 分支，想把 main 的更新合过来
    git rebase main
    ```
*   **原理**：
    1.  **剪切**：Git 把你 `feature` 分支上独有的 commit 先暂时"拿下来"。
    2.  **移动基底**：把 `feature` 分支的根基，移动到 `main` 的最新位置。
    3.  **粘贴 (Replay)**：把你刚才拿下来的 commit，一个接一个地**重新播放**在新的 `main` 后面。
*   **优点**：
    *   **整洁**：历史记录是一条完美的直线，没有分叉，没有多余的 Merge Commit。
*   **缺点**：
    *   **篡改历史**：因为是"重新播放"，**所有 commit 的哈希值（ID）都会变！**
    *   **冲突风险**：如果 commit 很多，每次"重放"都可能遇到冲突，需要一次次解。
*   **适用场景**：**私人开发分支**（在 push 给别人看之前，自己在本地整理代码）。

### ⚔️ 终极对决：黄金法则

> **⚠️ 铁律：绝对不要在公共分支（别人也在用的分支）上执行 Rebase！**

*   如果你 rebase 了 `main` 分支，推送到远程，所有同事的代码历史都会和远程对不上，大家会想打死你。
*   **个人分支**（只有你自己在用）：尽情 **Rebase**，保持直线美感。
*   **公共/集成分支**（团队共享）：老老实实 **Merge**，保留历史痕迹。

---

## 1. Remote / Sync - 远程同步与保护

这里是团队协作最容易"撞车"的地方。还记得基础篇提到的"公告栏"比喻吗？这一节就是教你如何优雅地和公告栏同步。

### 📡 1.1 Fetch vs Pull (看一眼 vs 拿回来)

*   **git fetch --all** (👀 安全的"看一眼")
    *   **作用**：更新本地的 `origin/xxx`（远程跟踪分支）。
    *   **特点**：**绝对安全**。它只会更新"照片"，**绝不会**修改你正在写代码的工作区。
    *   **场景**：你想看看同事是不是提交了新代码，但不想打断自己手头的工作。

*   **git pull** (📥 简单粗暴的"拿回来")
    *   **公式**：`git pull` = `git fetch` + `git merge`
    *   **作用**：把远程代码拉下来，并立刻尝试和你的代码合并。
    *   **缺点**：如果远程有更新，你本地也有提交，`git pull` 默认会产生一个分叉的 Merge Commit（"Merge branch 'main' of... "），让历史变得不直观。

### 🚀 1.2 推荐姿势：git pull --rebase

这是让你的提交记录保持直线神技。

*   **命令**：
    ```bash
    git pull --rebase
    ```
*   **公式**：`git fetch` + `git rebase`
*   **发生了什么**：
    1.  把远程最新的代码拉下来 (`fetch`)。
    2.  把你本地还没 push 的 commit 暂时"拿下来"。
    3.  把远程代码更新到你的分支上。
    4.  把你刚才拿下来的 commit **排队放到最新代码的后面**。
*   **结果**：你的提交永远在最新进度的最上面，没有无意义的分叉。

### 🛑 1.3 痛点：GitHub 分支保护 (Protected Branch)

当你尝试 Push 时，如果看到这种报错：
`remote: error: GH006: Protected branch update failed.`

*   **发生了什么**：
    GitHub 仓库管理员给这个分支（通常是 `main` 或 `master`）上了锁。
    1.  **禁止直接 Push**：必须通过 Pull Request (PR) 合并。
    2.  **禁止 Force Push**：也就是禁止修改历史（禁止 Rebase/Reset 后的推送）。

*   **如何应对**：
    *   **如果你是普通开发者**：老老实实开一个新的分支，提交代码，去网页端提 PR。
    *   **如果你因为 Reset 回退导致无法 Push**：你的本地历史落后于远程了。在保护分支上，**不能**用 `push -f` 覆盖。你必须用 `git revert` 来产生新的提交以抵消错误（详见Git故障排查章节）。

---

## 2. Modify Remote - 修改与管理远程分支

Git 对远程分支的操作没有"一键重命名"那么直观，通常需要组合拳。

### 🏷️ 2.1 重命名远程分支

假设你有个分支叫 `feature-old`，想改名为 `feature-new`。
**Git 没有直接修改远程名字的命令**，必须走"三步走"战略：

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

### 🗑️ 2.2 删除远程分支

代码合并完了，远程分支留着也是垃圾，删掉它：

```bash
git push origin --delete <branch-name>
```

### 🧹 2.3 清理无效的远程追踪 (Prune)

**场景**：同事在 GitHub 网页上把 `feature-A` 删了，但你在本地输入 `git branch -r`，竟然还能看到 `origin/feature-A`。
**原因**：你的本地"快照"过期了，Git 不会自动帮你删快照。

**解决**（强迫症必备）：
```bash
git remote prune origin
```
或者在 fetch 时自动修剪：
```bash
git fetch -p
```
这会把那些"远程已经不存在，但本地还留着尸体"的跟踪分支全部清理干净。

---

## 3. 🌿 分支策略与工作流 (团队协作核心)

### 📋 3.1 主流分支策略对比

💡 *来自 Atlassian Git 教程和阿里云开发者社区*

#### 方案 A：GitHub Flow (简单高效，推荐小团队)

**特点**：只有 `main` 分支 + 功能分支

```
main (生产环境，始终可部署)
  ├── feature/login (开发新功能)
  ├── feature/payment
  └── hotfix/fix-bug (紧急修复)
```

**工作流**：
1. 从 `main` 创建功能分支
2. 在功能分支上开发、提交
3. 发起 Pull Request (PR)
4. 代码审查 (Code Review)
5. 合并到 `main` 并部署

**适用场景**：
* 持续部署 (CD) 的项目
* 小团队或初创公司
* Web 应用、SaaS 产品

#### 方案 B：Git Flow (结构化，适合大项目)

💡 *来自 Pro Git 书籍和 21CTO 技术文章*

**特点**：多分支结构，严格的分支角色

```
main (生产版本，只接受 hotfix 和 release)
  └── develop (开发分支，集成所有功能)
       ├── feature/user-login (功能分支)
       ├── feature/payment
       ├── release/v1.0.0 (预发布分支)
       └── hotfix/critical-bug (热修复分支)
```

**分支说明**：
* `main`：生产环境代码，每个 commit 对应一个版本标签
* `develop`：日常开发集成分支
* `feature/*`：从 `develop` 创建，完成后合并回 `develop`
* `release/*`：从 `develop` 创建，用于测试和修复 Bug
* `hotfix/*`：从 `main` 创建，修复后同时合并到 `main` 和 `develop`

**适用场景**：
* 有固定发布周期的项目
* 需要维护多个版本
* 企业级软件、移动应用

#### 方案 C：Trunk-Based Development (主干开发，Google/Facebook 使用)

**特点**：所有人直接向 `main` 提交，使用功能开关 (Feature Flag)

```
main (主干，所有人直接提交)
  ├── 功能 A (通过 Feature Flag 控制开关)
  └── 功能 B (通过 Feature Flag 控制开关)
```

**关键实践**：
* 提交必须小且频繁（每天多次）
* 使用 Feature Flag 隐藏未完成的功能
* 强大的自动化测试保障

**适用场景**：
* 超大型团队（Google、Facebook、Netflix）
* 持续交付成熟度高的团队
* 需要极强的 CI/CD 基础设施

### 🎯 3.2 如何选择分支策略？

💡 *来自 Reddit r/ExperiencedDevs 讨论*

**决策树**：
```
你的团队规模？
├── < 10人 → GitHub Flow（简单高效）
├── 10-50人 → Git Flow（结构清晰）
└── > 50人 → 考虑 Trunk-Based（需要成熟的 CI/CD）

你的发布频率？
├── 每天多次 → GitHub Flow / Trunk-Based
├── 每周/每月 → Git Flow
└── 每季度 → Git Flow（更适合长周期）
```

**推荐原则**：
1. **从简单开始**：默认用最简单的策略（GitHub Flow），根据需要调整
2. **避免过度设计**：一开始就用 GitFlow 绝对是个错误（来自 Reddit 高赞回答）
3. **团队共识**：选择后写进团队规范，所有人遵守

---

## 4. ⚠️ 团队协作最佳实践与反模式

### ✅ 最佳实践

#### 1. 提交信息规范 (Conventional Commits)

💡 *来自行业最佳实践*

```bash
# 标准格式
git commit -m "<type>: <description>"

# 示例
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复支付页面金额计算错误"
git commit -m "docs: 更新 README 安装说明"
git commit -m "refactor: 重构用户模块代码结构"
git commit -m "test: 添加登录功能单元测试"
git commit -m "chore: 更新依赖包版本"
```

**常用 Type**：
* `feat`: 新功能
* `fix`: Bug 修复
* `docs`: 文档更新
* `style`: 代码格式（不影响功能）
* `refactor`: 重构
* `test`: 测试相关
* `chore`: 构建/工具链相关

#### 2. Pull Request 规范

* **小步 PR**：每个 PR 只做一件事，控制在 200-400 行以内
* **清晰描述**：说明做了什么、为什么这么做、如何测试
* **及时 Review**：团队约定 24 小时内完成代码审查
* **使用模板**：创建 PR Template 规范提交流程

#### 3. 同步远程代码的正确姿势

```bash
# 早晨开工：同步最新代码
git fetch --all
git status -sb  # 查看本地和远程的差异

# 如果需要合并远程更新
git pull --rebase  # 保持直线历史

# 或者分步操作（更安全）
git fetch origin main
git log --oneline HEAD..origin/main  # 先看看改了啥
git rebase origin/main  # 确认没问题再 rebase
```

#### 4. 分支命名规范

```bash
# 功能分支
feature/user-authentication
feature/payment-integration

# 修复分支
fix/login-bug
hotfix/critical-security-issue

# 发布分支
release/v1.2.0
release/2024-01-sprint

# 实验分支（明确标记，避免混淆）
experiment/new-algorithm
```

### ❌ 常见反模式

#### 1. 分支混乱综合症

💡 *来自 OSCHINA 技术社区*

**症状**：
* 仓库中有几百个"僵尸分支"（开发完忘记删除）
* 分支命名随意：`new-branch`、`test`、`fix2`
* 不知道哪个分支是最新的、哪个可以删除

**解决方案**：
```bash
# 定期清理已合并的分支
git branch --merged | grep -v '\*' | xargs git branch -d

# 清理远程已删除的跟踪分支
git fetch -p

# 设置分支保护规则（GitHub/GitLab）
# 禁止直接 push 到 main/develop
# 要求 PR + Code Review
```

#### 2. 超大 PR / 超长分支

**症状**：
* 一个 PR 改了 2000+ 行代码
* 一个功能分支开发了 2 个月没合并
* 合并时冲突巨大，解冲突解到崩溃

**解决方案**：
* **拆分功能**：把大功能拆成小步骤，每步独立提交
* **频繁同步**：每天 `rebase` 或 `merge` 最新 `main`
* **及时合并**：功能完成后立即提 PR，不要攒着

#### 3. 在公共分支上 Rebase

```bash
# ❌ 绝对不要这样做！
git checkout main
git rebase feature-branch  # 如果 main 是公共分支

# ✅ 正确做法：在公共分支上用 merge
git checkout main
git merge feature-branch
```

**后果**：Rebase 会改写历史，导致所有同事的本地仓库和远程不一致，需要团队一起"对齐历史"，成本极高。

#### 4. 不经 Review 直接 Push

**症状**：
* 直接 push 到 main/develop
* 绕过 PR 流程
* 没有自动化测试就合并

**解决方案**：
* 开启分支保护 (Branch Protection)
* 配置 CI/CD 自动运行测试
* 设置 Required Reviews (至少 1-2 人审批)

---

## 5. 🎓 高频面试题与解答

### Q1: `git merge` 和 `git rebase` 的区别？什么时候用哪个？

**答案**（牛客网 + 知乎高赞）：

| 对比维度 | git merge | git rebase |
|:---|:---|:---|
| **历史** | 保留完整分支历史，有分叉 | 线性历史，像一条直线 |
| **Merge Commit** | ✅ 会创建 | ❌ 不会创建 |
| **Commit ID** | 不变 | 会改变（重新生成） |
| **安全性** | 高，不修改历史 | 低，改写历史 |
| **冲突处理** | 一次解决 | 可能多次解决 |

**使用场景**：
```bash
# 公共分支（main/develop）→ 用 merge
git checkout main
git merge feature-branch

# 个人分支 → 用 rebase 保持整洁
git checkout feature-branch
git rebase main
```

**一句话总结**：merge 适合团队协作（保留历史真相），rebase 适合个人开发分支（保持直线美感）。

### Q2: `git pull` 和 `git pull --rebase` 的区别？

**答案**（小林coding 面试题）：

```bash
# git pull = git fetch + git merge
git pull origin main
# 会产生 Merge Commit，历史有分叉

# git pull --rebase = git fetch + git rebase
git pull --rebase origin main
# 不会产生 Merge Commit，历史是直线
```

**推荐配置**（全局默认 rebase）：
```bash
git config --global pull.rebase true
git config --global rebase.autoStash true  # 自动暂存未提交修改
```

### Q3: 什么是 Pull Request (PR) / Merge Request (MR)？

**答案**：

PR/MR 是**代码合并请求**，是团队协作的核心流程：

1. **开发者**：在功能分支上开发 → 推送远程 → 发起 PR
2. **Reviewer**：审查代码 → 提出意见 → 批准或请求修改
3. **合并**：审查通过 → 合并到目标分支 → 删除功能分支

**PR 的价值**：
* 代码审查：发现 Bug、改进设计
* 知识共享：团队成员了解彼此的代码
* 质量保证：确保合并的代码符合规范
* 讨论平台：对实现方案进行讨论

### Q4: 如何处理大型团队的分支冲突？

**答案要点**：

1. **预防为主**：
   * 频繁同步远程代码（每天至少一次）
   * 小步提交，频繁合并
   * 明确模块分工，减少文件冲突

2. **冲突解决流程**：
   ```bash
   # 1. 同步最新代码
   git fetch origin main
   
   # 2. 尝试 rebase（或 merge）
   git rebase origin/main
   
   # 3. 如果有冲突，解决后继续
   # 编辑冲突文件 → git add <file>
   git rebase --continue
   
   # 4. 推送到远程
   git push origin feature-branch
   ```

3. **团队规范**：
   * 约定谁负责解决冲突（通常是发起 PR 的人）
   * 使用工具辅助（VS Code、IntelliJ 的冲突解决工具）
   * 复杂冲突拉上相关开发者一起讨论

---

## 📚 参考资料

1. **Atlassian Git 教程** - [合并与变基](https://www.atlassian.com/zh/git/tutorials/merging-vs-rebasing)
2. **知乎专栏** - [图解 merge 和 rebase 的区别](https://zhuanlan.zhihu.com/p/686538265)
3. **阿里云开发者社区** - [Rebase与Merge的正确使用场景](https://developer.aliyun.com/article/1679801)
4. **Pro Git 书籍** - [Git 分支策略](https://git-scm.com/book/zh/v2/Git-分支-分支的工作流)
5. **小林coding** - [Git 面试题精选](https://xiaolincoding.com/interview/git.html)
6. **掘金** - [git rebase 和 merge 的区别](https://juejin.cn/post/6986868722136776718)
7. **Atlassian** - [Git 分支策略指南](https://www.atlassian.com/zh/agile/software-development/branching)
8. **Reddit r/ExperiencedDevs** - [如何选择合适的分支策略](https://www.reddit.com/r/ExperiencedDevs/comments/18nimvn/)
9. **OSCHINA** - [Git分支策略与团队协作最佳实践](https://my.oschina.net/emacs_7992551/blog/19212054)

> **💡 学习建议**：
> * 在 GitHub 上创建一个测试仓库，邀请朋友一起练习 PR 流程
> * 重点理解：merge vs rebase 的本质区别，不要死记命令
> * 面试前准备：能清晰说出 3 种分支策略的优缺点和适用场景
> * 实战练习：故意制造冲突，然后练习解决冲突的完整流程

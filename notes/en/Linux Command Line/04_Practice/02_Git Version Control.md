# 02 Git Survival Guide (Practical, End-to-End)

This chapter is a “professional survival guide” for Git: concepts first, then daily workflows, and finally how to recover when things go wrong.

## 0. The core mental model: local vs remote is actually **three layers**

Many people feel Git is chaotic because they only think in two layers (“local” vs “remote”). In practice, it’s **three**:

### 1) Local branch

- Looks like: `main`, `feature/login`
- Lives on: your machine
- Safety: your private sandbox—you can reset/rewrite/delete without affecting others

### 2) Remote branch

- Lives on: GitHub/GitLab server (e.g., `main`)
- Changes only when you `push` (or merge via PR)

### 3) Remote-tracking branch (**easy to forget**)

- Looks like: `origin/main`, `origin/feature/login`
- Lives on: your machine (yes, local)
- Meaning: a local “snapshot” of the remote state
- Updates only when you run `git fetch` (or `git pull`)

### A useful analogy (notice board)

- Local branch = your “draft paper”
- Remote branch = the public notice board
- Remote-tracking branch (`origin/main`) = the photo of the notice board on your phone

Conflicts happen when your “photo” is outdated. You update the photo (`fetch`), then reconcile differences (`merge`/`rebase`).

---

## 1. Init / Clone / Config — setup and visibility

### 1.1 Identity (do this first)

```bash
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
git config --global --list
```

### 1.2 Getting a repo

- Option A: clone an existing remote repo
  ```bash
  git clone https://github.com/user/repo.git
  ```
- Option B: start from a local folder
  ```bash
  git init
  ```

### 1.3 “Never operate blindly”: status/diff/log

1) Status

```bash
git status
git status -s
```

- `M ` (red): modified in working tree, not staged
- `M ` (green): staged, ready to commit
- `??`: untracked file

2) Diff (your last line of defense)

- Before staging:
  ```bash
  git diff
  ```
  Compares: working tree vs index/HEAD

- After staging (very important):
  ```bash
  git diff --staged
  ```
  Compares: index vs HEAD

3) History (read it like a subway map)

```bash
git log --oneline --graph --all
```

---

## 2. Branches — parallel universes

### View and create

```bash
git branch
git branch -r
git branch -av
```

Modern Git recommends `git switch` for switching:

```bash
git branch feature-login        # create only
git switch feature-login        # switch
git switch -c feature-login     # create and switch
```

### Delete branches

```bash
git branch -d feature-login     # safe delete (only if merged)
git branch -D feature-login     # force delete
```

---

## 3. Merge vs Rebase — the big split in Git maturity

### 3.1 Interactive rebase (`rebase -i`) — clean up history

Use it to squash “fix/fix again/final” into one clean commit before sharing.

```bash
git rebase -i HEAD~3
```

In the editor, you may see:

```text
pick   a1b2c3d fix: login bug
squash d4e5f6g fix: typo
squash g7h8i9j fix: final check
```

- `pick`: keep commit
- `squash` (`s`): merge into previous commit
- `reword` (`r`): change message
- `drop` (`d`): remove commit

### 3.2 Merge — keep all history as it happened

```bash
git merge main
```

- Pros: honest, safe (does not rewrite existing commit IDs)
- Cons: overuse can create noisy graphs
- Best for: merging into shared branches (e.g., PR merge)

### 3.3 Rebase — “replay” commits on top of a new base

```bash
git rebase main
```

- Pros: linear history
- Cons: rewrites commit IDs; can cause repeated conflict resolution
- Best for: **private branches** before pushing

### Golden rule

Never rebase a branch that other people are using (shared/protected branches).

---

## 4. Remote sync and protections

### Fetch vs pull

- `git fetch --all`: safe “look” (updates `origin/*` snapshots, does not touch your working tree)
- `git pull`: `fetch` + `merge` (can create merge commits)

### Recommended: `git pull --rebase`

```bash
git pull --rebase
```

This keeps your local commits on top of the latest upstream state, usually producing a cleaner history.

### Protected branches (GitHub)

If you see:

`remote: error: GH006: Protected branch update failed.`

Common rules:

- Direct push is blocked; changes must go through PRs
- Force push is blocked (history rewriting is not allowed)

If you need to “undo” something on a protected branch, use `git revert` (see next section).

---

## 5. Managing remote branches

### Rename a remote branch (3 steps)

```bash
git branch -m feature-old feature-new
git push origin --delete feature-old
git push -u origin feature-new
```

### Delete a remote branch

```bash
git push origin --delete <branch-name>
```

### Prune stale remote-tracking branches

```bash
git remote prune origin
git fetch -p
```

---

## 6. Rollback: the time machine (choose by “scene”)

### Scene A: not pushed yet

- Soft reset (recommended, keep staged changes):
  ```bash
  git reset --soft HEAD~1
  ```
- Mixed reset (keep changes, but unstaged):
  ```bash
  git reset HEAD~1
  ```
- Hard reset (danger: discard changes):
  ```bash
  git reset --hard HEAD~1
  ```

Amend the last commit:

```bash
git commit --amend
git commit --amend -m "new message"
```

### Scene B: pushed to a private branch (only you use it)

```bash
git reset --hard HEAD~1
git push -f
```

Only do this on branches nobody else depends on.

### Scene C: pushed to a shared/protected branch

Use `revert`:

```bash
git revert <commit-id>
```

This creates a new commit that applies the reverse change, keeping history forward-only and compatible with protected-branch rules.

---

## 7. Productivity tools

### 7.1 Stash

Scenario: you’re halfway through feature work and need to hotfix urgently.

```bash
git stash
git stash save "work in progress: login feature"
git stash list
git stash pop
git stash apply
```

### 7.2 Cherry-pick

Apply one specific commit from another branch without merging the whole branch:

```bash
git switch branch-A
git cherry-pick a1b2c3d
```

### 7.3 Reflog (recovery after “oops”)

If you hard-reset and “lost” commits, reflog can save you:

```bash
git reflog
git reset --hard <hash-from-reflog>
```

Reflog is local and expires (commonly ~90 days).

---

## 8. Troubleshooting (common errors)

### 8.1 “Refusing to merge unrelated histories”

```bash
git pull origin main --allow-unrelated-histories
```

### 8.2 Case-insensitive filesystem rename issues

Prefer:

```bash
git mv UserLogin.js userLogin.js
```

Optionally (use with caution):

```bash
git config core.ignorecase false
```

### 8.3 `.gitignore` “doesn’t work”

If a file was already tracked, ignoring won’t stop tracking. Remove from index only:

```bash
git rm --cached secret.key
git rm --cached -r files/
git commit -m "Stop tracking secrets"
```

### 8.4 Merge conflicts

Open the conflict file and resolve markers:

```text
<<<<<<< HEAD
your version
=======
their version
>>>>>>> feature-B
```

Then:

```bash
git add .
git commit -m "Fix merge conflict"
```

---

## 9. Conclusion: daily muscle memory

### Daily workflow

1) Start the day

- `git switch main`
- `git pull --rebase`
- `git switch -c feature-xxx`

2) While working

- `git status -s`
- commit small steps frequently

3) Interruptions

- `git stash`
- `git stash pop`

4) Before pushing

- `git diff --staged`

### Quick cheatsheet

| Scenario | Command |
| :--- | :--- |
| Clone | `git clone <url>` |
| Status | `git status -s` |
| History | `git log --oneline --graph --all` |
| Switch branch | `git switch <branch>` |
| New branch | `git switch -c <new-branch>` |
| Pull cleanly | `git pull --rebase` |
| Undo last commit (keep changes) | `git reset --soft HEAD~1` |
| Revert on shared branch | `git revert <commit-id>` |
| Recover | `git reflog` + `git reset --hard <hash>` |

Git isn’t here to torture you—it gives you rules for collaboration and “undo buttons” when mistakes happen. Don’t memorize commands; understand the model.

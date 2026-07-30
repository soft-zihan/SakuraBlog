# 05 Pitfalls and Dangerous Operations

Linux gives you a lot of power, which means mistakes can be very expensive. These are “survival rules” every beginner should know.

## 1. Redirection pitfall (`sudo` vs `>`)

Classic trap: you want to append a line to a protected file:

- ❌ `sudo echo "127.0.0.1 mylocal" >> /etc/hosts`

Why it fails: `sudo` applies to `echo`, but the `>>` redirection is handled by your current **shell**. If your shell can’t write `/etc/hosts`, the redirect fails.

Correct approach: use `tee` with `sudo`:

```bash
echo "127.0.0.1 mylocal" | sudo tee -a /etc/hosts > /dev/null
```

`tee` reads stdin and writes to the file, so `sudo tee` writes as root.

---

## 2. Safer environment variable editing

You will often set env vars (Java/Go/PATH, etc.).

- Principle: avoid directly editing `/etc/profile` or `/etc/environment` as a beginner.
- Recommended:
  1. Edit `~/.bashrc` or `~/.zshrc` for your user.
  2. Backup first: `cp ~/.bashrc ~/.bashrc.bak`
  3. Apply immediately: `source ~/.bashrc` (no reboot needed)
- Pitfall recovery: if after `source` everything “breaks”, you likely corrupted `PATH`. Restore with:
  `/usr/bin/cp ~/.bashrc.bak ~/.bashrc`

---

## 3. Remote “disconnect” plan

When changing SSH ports, firewalls (ufw/iptables), or network configs on a remote server:

- Worst case: a mistake locks you out (then you need console access).
- Safer strategy:
  - Use `at` to schedule an automatic rollback 5 minutes later before doing the risky change. If you can still log in, cancel the scheduled task.
  - Do the work inside `tmux` so your running tasks survive network drops.

---

## 4. Deleting is dangerous (`rm`)

- The deadly space:
  - ❌ `rm -rf / usr/lib` (a space after `/` can turn into “delete root + delete usr/lib” attempts)
  - ❌ `rm -rf /*` (tries to delete everything under root; never do this outside a disposable VM)
  - ✅ Habit: don’t hand-type long paths with `rm -rf`. Use Tab completion. Or run `ls` first to verify, then replace `ls` with `rm`.

---

## 5. Protect your secrets (shell history)

- Don’t type passwords in commands:
  - ❌ `mysql -u root -p123456`
  - Risk: it is stored in plaintext in `~/.bash_history`. Anyone with access can see it via `history`.
  - ✅ Use `-p` without the password, then type it when prompted (input is hidden).
- Temporary history bypass: in some shells, prefixing a command with a leading space prevents it from being saved (depends on shell settings).

---

## 6. The “nuclear weapon” of disk operations (`dd`)

`dd` does low-level block copying (bootable USBs, disk backups).

- Dangerous example: `sudo dd if=ubuntu.iso of=/dev/sdb`
- Warning: if you pick the wrong output disk (e.g. your system disk `/dev/sda`), it overwrites without confirmation.
- Safety: run `lsblk` multiple times and verify the target disk before running `dd`.

---

## 7. Shell-level safety habits

- Prevent accidental overwrite with `>`:
  - Add `set -o noclobber` to `.bashrc`
  - Effect: `echo "test" > existing_file` fails instead of overwriting; use `>|` if you really intend to overwrite.

- Always start scripts with:
  - `set -euo pipefail` (“script armor”)
    - `-e`: exit on any error
    - `-u`: error on unset variables
      - Horror example: `rm -rf $TMP_DIR/` becomes `rm -rf /` if `$TMP_DIR` is empty. With `-u`, the script fails before disaster.
    - `-o pipefail`: a pipeline fails if any command in it fails (default only checks the last command)

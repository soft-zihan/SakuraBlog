# 06 Scenario-based Cheatsheet

This chapter collects high-frequency “real work” tasks for developers and ops, with the shortest useful command combinations.

## 1. File operations

### Batch rename extensions

- Scenario: rename all `.txt` files to `.md` in the current directory.
- Option A: `rename 's/\\.txt$/\\.md/' *.txt` (requires `rename`)
- Pure shell:
  - `for f in *.txt; do mv "$f" "${f%.txt}.md"; done`

### Count lines of code (exclude noise)

- Scenario: count code lines in a project while excluding `node_modules` or `.git`.
- Example:
  - `find . -name "*.js" -not -path "*/node_modules/*" | xargs wc -l`
- Modern tools:
  - `tokei` (install required) or `cloc .`

### Truncate a file quickly (keep the file)

- Scenario: a log file is huge; you want to clear it without deleting it.
- Command: `> access.log`

---

## 2. Disk and cleanup

### Diagnose “disk full”

- Quick top-10 large entries:
  - `du -ah . | sort -rh | head -n 10`
- Interactive:
  - `ncdu` (navigate and delete large dirs like a file manager)
- Docker cleanup:
  - `docker system prune -a` (removes unused containers/networks/images)

### Delete logs older than 30 days

- `find /var/log -name "*.log" -mtime +30 -exec rm -f {} \\;`

### See what is being written right now

- By process: `sudo iotop`
- By file: `sudo opensnoop`

---

## 3. Networking scenarios

### Find alive hosts in a LAN subnet

- `fping -asg 192.168.1.0/24`

### Count TCP connections by remote IP (attack/debug)

- Scenario: suspect abuse or a client holding too many connections.
- Command:
  - `netstat -ant | awk '/^tcp/ {print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn`
- Meaning: extract TCP peers → cut remote IP → sort/dedup/count → sort by count desc

### Test if a remote port is open (without telnet)

- `nc -zv 1.2.3.4 80`

### Quickly get your public IP

- `curl ifconfig.me` or `curl ip.sb`

---

## 4. Developer combinations

### Global find-and-replace in code

- Scenario: replace `http://old-api.com` with `https://new-api.com` everywhere.
- Classic:
  - `grep -rl "old-api" . | xargs sed -i 's/old-api/new-api/g'`
- With ripgrep:
  - `sed -i 's/old/new/g' $(rg -l "old")`

### Keep retrying a command until it succeeds

- Scenario: wait for a server to come up or a deployment to finish.
- Command:
  - `until ping -c 1 1.2.3.4; do sleep 5; done && echo "Server is UP!"`

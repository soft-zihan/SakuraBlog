# 01 Find and Search

## 1. `find` vs `fd` — finding files (classic vs modern)

`find` is the standard, portable tool with huge capabilities. `fd` is a modern alternative that is faster and has simpler syntax (it also respects `.gitignore` by default).

- Basic searches:
  - `find . -name "*.log"` (classic) vs `fd log` (modern)
  - `find . -type f -size +100M`: find files larger than 100MB
  - Time-based search (`-mtime`):
    - `find . -mtime -1`: modified within the last **24 hours**
    - `find . -mtime +1`: modified **more than 24 hours** ago
    - `find . -mtime 1`: modified **between 24 and 48 hours** ago
  - `fd -e jpg`: search by extension (convenient `fd` syntax)

- Logical operators:
  - OR: `find . -name "*.jpg" -o -name "*.png"`
  - NOT: `find . -not -name "*.log"`

- Advanced: find and execute
  - `find . -name "*.tmp" -exec rm -f {} \;`
  - Syntax breakdown:
    - `{}` is a placeholder for each matched filename
    - `\;` ends the `-exec` clause (the backslash prevents the shell from treating `;` as a command separator)
  - `find . -name "*.tmp" -delete`: a shorter way to delete matches
  - `fd -e tmp -x rm -f`: `fd` can execute in parallel and is often very fast

- More practical tricks:
  - `find . -empty`: find empty files or directories
  - `find . -perm 777`: find dangerously-permissive files
  - `find . -user root`: find by owner
  - Regex matching: `find . -regex '.*\\(log\\|txt\\)'` (match log or txt via regex)
  - Sort by mtime: `find . -type f -printf "%T@ %p\\n" | sort -n`

### Pairing with `xargs` (recommended)

- Why not always use `-exec`? `-exec` often spawns a new process per file. If you match 10,000 files, that’s 10,000 process invocations.
- `xargs` batches many filenames into fewer command runs, which is much faster:
  - `find . -name "*.log" | xargs rm -f`
  - Safer with spaces/newlines in filenames:
    `find . -name "*.log" -print0 | xargs -0 rm -f`

---

## 2. `locate` — instant system-wide lookup (database-based)

- `locate filename`: searches a prebuilt database instead of scanning the disk, so it’s extremely fast.
- How it works: many systems run a daily indexing job that builds/updates the database.
- Note: newly created files may not show up immediately.
- Manually update the database: `sudo updatedb`.

---

## 3. `grep` / `rg` — searching file *content*

Although `grep` is a text-processing tool, it is commonly used to “find files that contain a string”.

- Typical use:
  - `grep -rn "API_KEY" .`: recursive search with line numbers
  - `grep -rl "API_KEY" .`: list only filenames (`-l`)
  - `grep -o "REGEX"`: print only the matched parts
    - Example: extract URLs from HTML:
      `grep -o 'http://[^"]*' file.html`

- Modern replacement: `rg` (ripgrep)
  - `rg "keyword"`: often much faster than grep and respects `.gitignore` by default

---

## 4. `fzf` — fuzzy search with interactive selection

If you can’t remember a path, `fzf` is a lifesaver.

- `cd $(find . -type d | fzf)`: fuzzy-pick a directory and `cd` into it
- `vim $(fzf)`: fuzzy-pick a file and open it in Vim

---

## 5. `lsof` — “detective-level” find (LiSt Open Files)

`lsof` helps answer: “Which process is holding this file/port/resource?”

- Port usage: `lsof -i :8080` (who is using port 8080?)
- File usage: `lsof /var/log/nginx/access.log` (who is writing to this log?)
- Directory usage: `lsof +D /mnt/data` (who is using files under this mount point?)
- Per-process: `lsof -p 1234` (which files/libraries are opened by PID 1234?)

---

## 6. `which` / `type` / `whereis` — where does a command come from?

- `which python`: show the path that will be executed
- `whereis ls`: find the binary, sources, and man pages
- `type -a ls`: show whether `ls` is an alias/function/binary and list all resolutions. If command behavior is weird, `type` helps reveal hidden aliases.

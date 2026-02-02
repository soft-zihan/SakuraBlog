# 01 File Management

This chapter covers the everyday basics: viewing, creating, moving, and deleting files and folders.

## 0. The soul of the command line: Tab completion

Remember the first productivity rule: **never type a full path by hand**.

- Type the first few characters of a command or filename, then press **`Tab`** to auto-complete.
- If nothing happens, there are multiple matches—press **`Tab`** twice to list candidates.

---

## 1. Browsing and viewing

### `pwd` (Print Working Directory) — Where am I?

- **`pwd`** prints your current full path. When you get lost in deep folders, it’s your “radar”.

---

### `ls` (List) — list directory contents

- `ls -l`: long listing (permissions / owner / size / time)
  - **How to read it**:
    `drwxr-xr-x  2  user  group  4.0K  Jan 1 12:00  my_folder`
    1. `d`: type (**d** directory, **-** file, **l** symlink)
    2. `rwxr-xr-x`: permission bits
    3. `2`: **link count**
       - For files: how many names (hard links) point to the same inode.
       - For directories: **number of subdirectories + 2** (`.` and `..`). So an empty directory shows **2**.
       - Example: create a subdir `sub` under `test/`, and `test`’s link count goes from 2 to 3 because `sub/..` points back to `test`.
    4. `user`: file owner
    5. `group`: group owner
    6. `4.0K`: **directory entry size**, not the sum of files inside. Use `du -sh` for total size.
    7. `Jan 1 12:00`: last modified time
    8. `my_folder`: name

- `ls -a`: show all files (including dotfiles)
  - **Special entries**:
    - `.`: current directory
    - `..`: parent directory
- `ls -lh`: human-readable sizes (KB/MB/GB)

> 💡 Pro tip: try **`eza`** (needs installation) as a modern replacement for `ls` with Git status, icons, and tree view.

---

### `stat` — inspect metadata

- `stat file.txt` shows detailed metadata for a file.
- **Core concept: inode**
  - The inode is the file’s “ID card” on disk; the filename is only a “label”.
  - One inode can have multiple names (hard links). Filenames resolve to data through the inode.

---

### `cd` (Change Directory) — move between directories

- `cd /path/to/dir`: go to a directory by path.
- `cd` (no args) or `cd ~`: jump to your home directory.
- `cd ..`: go to the parent directory.
- `cd .`: stay in the current directory (often used with `./script.sh`).
- `cd -`: go back to the previous directory (like a “back” button).

> 💡 Pro tip: try **`z`** or **`zoxide`** as a smarter `cd` that jumps by “fuzzy” directory names (e.g., `z pro` → `/home/user/projects`).

---

## 2. Creating and managing

### `mkdir` — create directories

- `mkdir -p`: create nested directories recursively (e.g., `a/b/c`).

### `touch` — create an empty file

- `touch file.txt`: create a file if it doesn’t exist (or update its timestamp if it does).

### `cp` (Copy)

- `cp -r`: recursively copy a directory.
- `cp -a`: **archive mode** (stronger than `-r`): preserves permissions, timestamps, and link relationships.
  - Scenario: when migrating a codebase or backing up configs, use `-a`. Otherwise all “modified times” become “now”, making debugging by timestamps harder.
- Safer variants:
  - `cp -i`: ask before overwriting.
  - `cp -n`: never overwrite existing files.
- `cp -u` (update): copy only if source is newer or destination doesn’t exist.

### `mv` (Move) — move and rename

- `mv a.txt b.txt`: rename.
- `mv file.txt /path/to/dir/`: move to a directory.
- `mv -i`: ask before overwriting.

---

### `ln` (Link)

- `ln -s <target> <link>`: create a **symbolic link** (like a shortcut).
- `ln <target> <link>`: create a **hard link** (another name for the same file data).

#### Symbolic link vs hard link

| Feature | Symbolic Link | Hard Link |
| :--- | :--- | :--- |
| Nature | A special file that points to a path | Another name for the same inode |
| Cross filesystem | Yes | **No** (must be same filesystem/partition) |
| Link directories | Yes | **No** (in most cases) |
| If target is deleted | Breaks (dangling link) | Still works as long as one hard link remains |
| Inode number | Different | **Same** |

- Pitfall: when creating symlinks, prefer **absolute paths**.
  - Why: a relative symlink like `ln -s ./a.txt b.txt` is resolved relative to the link’s location. If you move `b.txt`, it may no longer find `./a.txt`. An absolute path keeps working after moving.

---

### `rm` (Remove) — delete (⚠️ be extremely careful)

- `rm -i`: ask before deleting.
- `rm -rf`: force and recurse.
- ⚠️ Warning: Linux has **no recycle bin by default**. After `rm`, recovery is difficult.
- Pro safety: install `trash-cli` and use an alias like `alias rm='trash'` to move deletions to a trash folder.

---

## 3. Stats and practical tricks

### Sorting and recursive listing (`ls`)

- `ls -lhS`: sort by size (largest first).
- `ls -lht`: sort by modified time (newest first).
- `ls -R`: recursively list subdirectories.

### `wc` (Word Count)

- `wc -l file.txt`: count lines.
- `ls | wc -l`: count how many entries are in the current directory.

### `file` — identify file type

- `file my_script.sh`: print what type of file it is (e.g., “Bourne-Again shell script”).

### `diff` — compare differences

- `diff file1.txt file2.txt`: line-by-line diff.

> 💡 Pro tip: try **`delta`** as a modern replacement for `diff`, with great syntax highlighting and a nicer Git diff experience.

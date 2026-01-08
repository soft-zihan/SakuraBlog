# ⚠️ Dangerous Operations and Pitfalls (Safety First)

Linux grants users high privileges, which also means mistakes can be costly. Here are the "life-saving" rules every beginner must know.

## 1. Redirection Traps

- **`>` vs `>>`**:
  - `>`: **Overwrite** file. If the file exists, its content will be cleared!
  - `>>`: **Append** content to the end of the file.
  - *Habit for Safety*: Before executing a redirection command, check the output with `cat` or `echo` first, then add `> filename` once confirmed.
- **`set -e` in Scripts**:
  - Adding `set -e` at the beginning of a Shell script makes it stop immediately if an error occurs, preventing error cascading. However, use it cautiously as non-critical errors (like `grep` not finding content) might unexpectedly terminate the script.

## 2. Delete with Caution (rm)

- **Fatal Space**:
  - ❌ `rm -rf / usr/lib`: Note the space after `/`! This will attempt to delete the root directory.
  - ✅ `rm -rf /usr/lib`: Correct way.
  - *Habit for Safety*: Never manually type long paths containing `rm -rf`. **Always use Tab completion**, or use `ls` to confirm the path first, or `cd` into it first.
- **Using a Trash Bin**:
  - Recommended to install **`trash-cli`**.
  - Set an alias: `alias rm='trash'`. This moves files to the trash instead of physical deletion when executing `rm`.

## 3. Permission Management

- **Avoid `chmod 777`**:
  - `777` means anyone can read, write, and execute the file, which is highly insecure.
  - **Recommended**:
    - Files: `644` (Owner read/write, others read-only)
    - Directories: `755` (Owner read/write/execute, others read/execute)
    - Scripts/Executables: `700` (Only owner can execute) or `755`.

## 4. Alias Protection

- You can add the following aliases to `.bashrc` or `.zshrc` to force confirmation before deleting or overwriting:
  ```bash
  alias rm='rm -i'
  alias cp='cp -i'
  alias mv='mv -i'
  ```

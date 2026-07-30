# 02 Viewing and Editing

In Linux philosophy, “everything is a file”. Being able to inspect and edit file contents is a core skill.

## 1. Viewing file content

### `cat` — print everything at once

- `cat file.txt`: print the entire file to the terminal.
- `cat -n file.txt`: print with line numbers.
- ⚠️ Warning: `cat` dumps everything. If a file is hundreds of MB, your terminal may freeze. **Use `cat` for small files; for large files, use `less`.**

### `less` — paged viewing (recommended)

- `less file.txt`: open an interactive pager.
- Mnemonic: **Less is more** (it’s more powerful than `more`).
- Core keys:
  - `Space` / `f`: page down
  - `b`: page up
  - `j` / `k`: scroll down/up one line (Vim style)
  - `/keyword`: search (press `n` for next, `N` for previous)
  - `q`: quit

### `head` / `tail` — top and bottom

- `head -n 20 file.txt`: show the first 20 lines.
- `tail -n 20 file.txt`: show the last 20 lines.
- `tail -f access.log`: follow appended content in real time.
  - Scenario: monitor server logs and watch for new errors.
  - Stop with `Ctrl + C`.

> 💡 Pro tip (modern replacement): install **`bat`** as a nicer `cat` with syntax highlighting, paging, and Git change markers.

---

## 2. Terminal editors

On servers you may not have a GUI editor like VS Code. You should learn at least one terminal editor.

### Nano — beginner-friendly (minimal)

If you’re new, start with Nano. It shows shortcuts at the bottom.

- Start: `nano filename`
- Save: `Ctrl + O`, then press Enter to confirm the filename
- Exit: `Ctrl + X`

### Vim — the “must-know” editor

Vim has a steep learning curve, but it’s installed almost everywhere. **You should know the basics**, otherwise you’ll be stuck on machines where only Vim is available.

#### Core concept: modes

The most confusing beginner question: “Why doesn’t typing work?” Because Vim starts in **Normal mode**.

1. **Normal mode** (default)
   - Move the cursor, delete text, copy/paste.
   - Press `Esc` any time to return here.
2. **Insert mode** (typing mode)
   - Press `i` to enter. Then you can type normally.
3. **Command-line mode** (save/quit)
   - From Normal mode, press `:` to enter.

#### ⚡ Vim survival kit (memorize these 5)

1. Start editing: `i`
2. Stop editing: `Esc`
3. Save and quit: `:wq` + Enter
4. Quit without saving: `:q!` + Enter
5. Delete current line: `dd` (in Normal mode)

#### Common shortcuts

- Move: `h` (left), `j` (down), `k` (up), `l` (right)
- Undo: `u` (Normal mode)
- Search: `/keyword`, then `n` for next
- Line start/end: `0` / `$`
- File start/end: `gg` / `G`

---

## 3. Summary

- Small files: `cat`
- Large files: `less`
- Logs: `tail -f`
- Simple edits: `nano`
- Serious editing: `vim`

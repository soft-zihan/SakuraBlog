# 04 Productivity and Redirection

Want to operate a terminal at “hacker speed”? Learn shortcuts, history tricks, and Linux’s superpower: I/O redirection.

## 1. Terminal shortcuts

### Editing the current line and controlling processes

- `Tab`: auto-complete (the most important shortcut). Don’t type full filenames.
- `Ctrl + A` / `Ctrl + E`: jump to the start / end of the line.
- `Ctrl + U` / `Ctrl + K`: delete everything before / after the cursor.
- `Ctrl + C`: terminate the current program.
- `Ctrl + Z`: suspend the current program.
  - Pitfall: the program is paused in the background, not killed. Use `fg` to bring it back.
- `Ctrl + L`: clear screen (same as `clear`).
- `Ctrl + D`: exit the current shell (same as `exit`).

### History expansion and search

- `!!`: run the previous command (classic: `sudo !!` when you forgot sudo).
- `!$`: reuse the **last argument** of the previous command.
  - Example: `mkdir /path/to/long/dir` → `cd !$`
- `Ctrl + R`: reverse search your command history. Type keywords to match.
  - Pro tip: install **`fzf`** to make this a full-screen interactive search.

---

## 2. Core: I/O redirection and pipes

This is the essence of Unix philosophy: **connect commands by sending output to input**.

### The three streams

1. **stdin (0)**: standard input (usually your keyboard).
2. **stdout (1)**: standard output (normal output to the terminal).
3. **stderr (2)**: standard error (error messages).

### Common redirection operators

- `>`: overwrite output
  - `ls > files.txt`: write the file list to `files.txt` (truncate first).
- `>>`: append output
  - `echo "Error: 404" >> error.log`: append a line to the end of a file.
- `2>`: redirect stderr only
  - `find / -name "test" 2> /dev/null`: throw “Permission denied” errors into the black hole (`/dev/null`) and keep only normal results.
- `2>&1`: merge stderr into stdout
  - `&>`: modern shorthand equivalent to redirect both.
- `|` (pipe): the key technique
  - Feeds the left command’s `stdout` into the right command’s `stdin`.
  - Example: `cat access.log | grep "Error" | wc -l`
    1. `cat`: read the file
    2. `grep`: filter lines containing “Error”
    3. `wc -l`: count the remaining lines

---

## 3. Aliases

Use `alias` to shorten long commands and build your personal terminal workflow.

- Temporary: run `alias ll='ls -lha'` in the current shell.
- Persistent:
  1. Edit your config: `nano ~/.bashrc` (or `~/.zshrc`)
  2. Add alias lines at the end
  3. Reload: `source ~/.bashrc`

### Suggested aliases

```bash
# Common shortcuts
alias ll='ls -lha'              # long listing
alias ..='cd ..'                # go up quickly
alias ...='cd ../..'            # go up two levels

# Safety (avoid accidental destructive actions)
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Quality-of-life
alias grep='grep --color=auto'  # highlight grep
alias update='sudo apt update && sudo apt upgrade' # one-shot update
```

# 03 Environment Variables

Why does `ls` work immediately, but your own script shows “command not found”? Environment variables are the reason.

## 1. What are environment variables?

Environment variables are the OS runtime’s “global configuration table”. They influence how the system behaves: where it looks for executables, which editor to use by default, language settings, and more.

- Show all variables: `env` or `printenv`
- Show one variable: `echo $PATH` (note the `$` prefix)

### Common environment variables

| Variable | Meaning | Example |
| :--- | :--- | :--- |
| `PATH` | executable search path (most important) | `/usr/bin:/bin:/usr/local/bin` |
| `USER` | current username | `han` |
| `HOME` | user home directory | `/home/han` |
| `SHELL` | current shell | `/bin/bash` |
| `EDITOR` | default text editor | `vim` or `nano` |
| `LANG` | locale/language setting | `en_US.UTF-8` |

---

## 2. Core concept: `PATH`

`PATH` is a colon-separated (`:`) list of directories.

### How it works

When you run a command like `python`, the OS searches the directories in `PATH` **from left to right**:

1. Check `/usr/local/bin`… not found
2. Check `/usr/bin`… **found** → execute it
3. If nothing is found in any directory → `command not found`

### Practical: turn your script into a “command”

Suppose you wrote `hello.sh` under `~/myscripts`.

1. Run directly: you must type the full path: `~/myscripts/hello.sh`
2. Add to `PATH`: if `~/myscripts` is in `PATH`, you can run `hello.sh` from anywhere

---

## 3. Setting and persistence (`export`)

### Temporary change (current terminal only)

```bash
export PATH=$PATH:/home/han/myscripts
```

Explanation:

- `export`: marks the variable as an environment variable (visible to child processes)
- `$PATH`: references the current value
- `:`: separator
- Effect: appends a new directory to the end of the existing `PATH`

### Permanent change (write to shell config)

If you want it to survive reboots and new terminals, put it in your shell’s config file.

#### Shell startup (why “my config didn’t take effect”)

Linux loads config files differently depending on how the shell starts:

1. **Login shell** (e.g., SSH login)
   - typical order: `/etc/profile` → `~/.bash_profile` (or `~/.profile`) → often ends up loading `~/.bashrc`
2. **Non-login shell** (e.g., opening a terminal from the desktop)
   - reads `~/.bashrc` (or `~/.zshrc`) directly

#### Best practice

- Put personal config in `~/.bashrc` (Bash) or `~/.zshrc` (Zsh), so it works both locally and via SSH.
- After editing, reload your config:

```bash
source ~/.bashrc
```

---

## 4. Troubleshooting checklist

Problem: you installed Node.js / Python / Go, but the terminal says the command is not found.

Cause: the install directory is not in `PATH`.

Fix:

1. Find the install path (e.g., `/usr/local/go/bin`)
2. Add to the end of `~/.bashrc`: `export PATH=$PATH:/usr/local/go/bin`
3. Run `source ~/.bashrc`

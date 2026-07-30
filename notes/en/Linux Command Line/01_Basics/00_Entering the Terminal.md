# 00 Entering the Terminal

Welcome to the Linux world. Before learning commands, it helps to understand a few core concepts.

## 1. What are a Terminal and a Shell?

- **Terminal**: the “window” where you type commands and see output (e.g., GNOME Terminal on Ubuntu, Konsole on KDE, iTerm2 on macOS).
- **Shell**: the command interpreter running inside the terminal. It parses what you type and asks the OS to execute it.
  - **Bash**: the default shell on many Linux distributions.
  - **Zsh**: a more modern shell with richer features (many “pro tips” feel best with Zsh).

## 2. What am I seeing? (Understanding the prompt)

When you open a terminal, you may see something like:

`han@ubuntu:~/Documents$ `

- **han**: your current username.
- **ubuntu**: the machine name (hostname).
- **~/Documents**: your current working directory (`~` means your home directory).
- **$**: prompt for a normal user (if you see **#**, you’re root).

## 3. A core rule: Linux is case-sensitive

On Windows, `File.txt` and `file.txt` often refer to the same file. On Linux, they are **two different files**. The same applies to commands: `ls` works, but `LS` usually fails.

## 4. Learn how to learn: getting help

When you meet a command you don’t recognize, don’t rely only on search engines—Linux comes with built-in manuals:

- **`command --help`**: quick usage and options (most commonly used).
- **`man command`**: full manual page. Press `q` to quit.
- **`tldr command`** (needs installation): simplified examples of common use-cases—great for beginners.

## 5. Installing tools

Use the package manager of your system:

- **Ubuntu/Debian**: `sudo apt update && sudo apt install <tool>`
- **CentOS/RHEL/Fedora**: `sudo dnf install <tool>` (older systems use `yum`)
- **Arch Linux**: `sudo pacman -S <tool>`
- **macOS**: `brew install <tool>` (requires Homebrew)

### 💡 Prepare your toolbox: modern replacements

To improve the learning experience, this tutorial recommends modern alternatives that are often nicer than the traditional tools (e.g., `fzf`, `zoxide`, `bat`, `ripgrep`).

> 🔗 **Installation guide**: see Practice → [Modern Tools](../04_Practice/01_Modern Tools.md).

## 6. Roadmap

This tutorial is split into four stages:

1. **Basics**
   - File management (`ls`, `cp`, `mv`)
   - Viewing & editing (`cat`, `vim`, `nano`)
   - Permissions & users (`chmod`, `sudo`)
   - Terminal productivity & redirection (shortcuts, `|`, `>`)
2. **Core**
   - Finding & searching (`find`, `grep`)
   - Text processing & regex (`sed`, `awk`, Regex)
   - Environment variables (`PATH`, `.bashrc`)
3. **Advanced**
   - Process management (`ps`, `top`)
   - Networking & remote (`ssh`, `curl`)
   - Disk/archives (`tar`, `du`)
   - Shell scripting (`for`, `if`)
   - Automation (`cron`, `systemd`)
4. **Practice**
   - Modern tools, Git, Docker, pitfalls, and scenario-based cheatsheets.

---

Now, let’s start with the most fundamental topic: file management.

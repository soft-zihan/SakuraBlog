# 01 Modern Tools and Techniques

> Recommended Rust/Go “replacements” in 2024 that can easily make your terminal workflow feel 10× better.

## 1. Modern replacements

| Classic | Modern alternative (recommended) | Why it’s better |
| :--- | :--- | :--- |
| `man` | `tldr` | The strongest recommendation: shows common examples instead of long manuals. |
| `ls` | `exa` (or `eza`) | Git status, icons, and tree view (`eza --tree`). |
| `cat` | `bat` | Syntax highlighting, paging, line numbers, Git change markers. |
| `find` | `fd` | Simple syntax (`fd pattern`), respects `.gitignore`, very fast. |
| `grep` | `rg` (ripgrep) | Extremely fast search with smart filtering. |
| `cd` | `z` / `zoxide` | “Smart” jumping based on frecency (frequency + recency). |
| `du` | `dust` | More intuitive disk-usage tree (similar spirit to `ncdu`). |
| `diff` | `delta` | Beautiful diffs with syntax highlighting, great with Git. |
| `top` | `btop` / `glances` | More visual than `htop`, often with mouse support and more metrics. |
| `curl` | `httpie` (`http`) | Human-friendly syntax and highlighted JSON output. |

## 2. Power combos (where efficiency really comes from)

The tools are great, but **combining them** is where the real productivity shows up.

### `fzf`: fuzzy finder king

Don’t treat it as “just a search box”. It’s a command-line teleport.

- Search command history instantly:
  - Press `Ctrl + R`. With `fzf`, you can type any fragments of an old command (even out of order) and jump to complex commands from months ago.
- Interactive file picking:
  - `vim $(fzf)`: pick a file from a fuzzy list and open it.
- Combine with process management:
  - `kill -9 $(ps -ef | fzf | awk '{print $2}')`: interactively select a process and kill it.

### `zoxide`: a smarter `cd`

- Remembers directories you visit.
- Fuzzy matches: `z proj` can jump straight to something like `/home/user/work/my-super-project`.
- Quick back: `z -` returns to the previous directory.

---

## 3. Advanced configuration

### `fzf` preview (with `bat`)

Default `fzf` is a list. With `bat`, you can get a live preview pane.

Add this to `.bashrc` or `.zshrc`:

```bash
export FZF_DEFAULT_OPTS="--preview 'bat --style=numbers --color=always --line-range :500 {}'"
```

Effect: when you run `vim $(fzf)`, the right side shows a live preview of the selected file.

### Ripgrep (`rg`) config file

Typing `--hidden --glob '!node_modules'` every time is annoying. Put defaults in `~/.ripgreprc`:

```text
--hidden
--glob=!node_modules/*
--glob=!.git/*
--smart-case
```

Enable it in your shell config:

```bash
export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
```

### Deeper `zoxide` integration

- `zi`: interactively choose a directory via `fzf`
  - Scenario: you only remember the path contains “config”. Run `zi`, search “config”, and jump.

---

## 4. Why choose modern tools?

- Faster: many are written in Rust (`rg`, `fd`, `bat`) and scale well for big projects.
- Better defaults: less “flags memorization”; syntax highlighting and Git integration often come by default.
- Lower cognitive load: for example, `fd` skips `node_modules` and `.git` by default so you focus on what matters.

### Install suggestions

- Ubuntu/Debian: `sudo apt install fzf zoxide bat ripgrep fd-find`
- Handy aliases (in `.bashrc` / `.zshrc`): `alias cat='bat'`, `alias cd='z'`

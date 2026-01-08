# ⌨️ Editor and Terminal Interaction

### 1. Vim Editor
Vim is a powerful text editor with three primary modes:
- **Normal Mode** (Default): Move, delete, copy, etc.
  - `i`: Enter Insert mode
  - `x`: Delete current character
  - `dd`: Delete current line
  - `yy`: Copy current line
  - `p`: Paste
  - `u`: Undo
  - `/word`: Search backward for "word", press `n` for next, `N` for previous
  - `Esc`: Return to Normal mode
- **Insert Mode**: Text editing
- **Command Mode** (Press `:` in Normal mode):
  - `:w`: Save
  - `:q`: Exit
  - `:wq`: Save and exit
  - `:q!`: Force exit without saving

### 2. Nano Editor (Minimalist)
Nano is simpler than Vim, with operation hints displayed at the bottom:
- `nano file`: Open or create a file
- `Ctrl + O`: Save file
- `Ctrl + X`: Exit (will ask if unsaved)
- `Ctrl + W`: Search text

### 3. Common Editing Shortcuts (Terminal Universal)
- `Ctrl + C`: Terminate current process
- `Ctrl + L`: Clear screen (equivalent to `clear`)
- `Ctrl + D`: Exit current Shell or delete character at cursor
- `Ctrl + A`: Move cursor to beginning of line
- `Ctrl + E`: Move cursor to end of line
- `Ctrl + U`: Cut/delete all content before cursor
- `Ctrl + K`: Cut/delete all content after cursor
- `Ctrl + W`: Delete one word before cursor

### 4. Terminal Interaction Mastery (Shell Shortcuts)
Mastering these shortcuts will significantly boost your terminal efficiency.

#### History Operations (History Expansion)
- `!!`: Execute the previous command (commonly used when forgetting sudo, e.g., `sudo !!`).
- `!$`: Reference the **last argument** of the previous command (very common).
  - *Scenario*: `mkdir -p /var/www/html/project` -> `cd !$` (enter the newly created directory directly).
- `!^`: Reference the **first argument** of the previous command.
- `!n`: Execute the nth command in the history.

#### Efficient Interaction Shortcuts
- **`Ctrl + R`**: **Search command history** (Reverse-i-search).
  - *Tip*: Enter keywords, press `Ctrl + R` repeatedly to cycle through matches. Installing `fzf` as a replacement is highly recommended.
- **`Ctrl + X, Ctrl + E`**: **Edit the current long command in an editor**.
  - *Scenario*: When you've written a super long curl command and find a mistake, this combination opens Vim/Nano to edit it; saving and exiting will execute it automatically.
- **`Alt + .`**: (May need configuration on macOS) Equivalent to `!$`, quickly pastes the last argument.

### 5. Alias Management (Alias)
Use `alias` to shorten long commands. Configure these in `~/.bashrc` or `~/.zshrc` to make them permanent.

- `alias ll='ls -lha'`: List all files with detailed info.
- `alias grep='grep --color=auto'`: Make grep output colored.
- `alias update='sudo apt update && sudo apt upgrade'`: One-click system update.

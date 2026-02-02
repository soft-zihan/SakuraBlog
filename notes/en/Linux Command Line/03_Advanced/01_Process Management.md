# 01 Process Management

Knowing how to observe, control, and troubleshoot processes is a key step toward Linux proficiency.

## 1. Monitoring processes (`ps` / `top` / `htop`)

### `ps` — a static snapshot

- `ps aux | grep nginx`: the most common combo—check if nginx is running and find its PID.
- `ps -ef`: list all processes in a standard format.

### `top` — real-time monitoring

- `top`: live view of system resource usage.
- Useful keys inside `top`:
  - `P`: sort by CPU usage
  - `M`: sort by memory usage
  - `1`: toggle per-CPU core view
  - `k`: kill a process (enter PID)
  - `q`: quit

### `htop` — modern interactive monitoring (recommended)

- More readable than `top`, supports mouse interaction, with colors and highlights.
- Install: `sudo apt install htop`

---

## 2. Terminating processes (`kill`)

When a program is stuck or needs a restart, you may need to “kill” it.

- `kill PID`: send a termination signal to a PID.
- Core concept: signals
  - `kill -15 PID` (SIGTERM): **graceful** termination (default). Gives the process a chance to clean up (save state, close DB connections).
  - `kill -9 PID` (SIGKILL): **force** kill immediately. Can cause data loss. Use only when SIGTERM fails.
- `pkill <name>`: kill by process name match.
- `killall <name>`: kill all processes with the same name.

---

## 3. Background jobs

- Append `&` to run a command in the background:
  - `python server.py &`
- `Ctrl + Z`: suspend the current foreground job (paused in background).
- `jobs`: list background jobs in the current shell session.
- `fg %n`: bring job `n` to the foreground.
- `bg %n`: resume a suspended job in the background.
- `nohup <cmd> &`: keep running after you log out (“no hang up”).
  - `nohup python server.py > output.log 2>&1 &`

---

## 4. `tmux` — terminal multiplexer (productivity king)

`tmux` solves two big problems:

1. **Disconnect protection**: if SSH drops, your tasks keep running; reconnect and reattach.
2. **Multiple panes**: split windows inside a single SSH session.

### Basic session management

- `tmux new -s work`: create a session named `work`.
- `tmux detach` (or `Ctrl+B`, then `d`): detach; processes keep running.
- `tmux ls`: list sessions.
- `tmux a -t work`: attach to the `work` session.
- `tmux kill-session -t work`: kill a session.

### Common shortcuts

Press the prefix **`Ctrl + B`**, release, then press:

- Split panes: `%` (left/right), `"` (top/bottom)
- Navigate: arrow keys to switch panes; `z` toggles zoom for the current pane
- Windows: `c` new window, `n`/`p` next/previous window

Pro tip: add `set -g mouse on` in `~/.tmux.conf` to enable mouse resizing.

---

## 5. `watch` — run periodically

- `watch -n 1 'ls -lh file.txt'`: refresh every second to observe file size changes.
- `watch -d 'netstat -tulpn'`: highlight changes while watching port status.

---

## Performance troubleshooting toolbox (from symptoms to root cause)

When a server is slow or unstable, a practical progression is:

1. **Big picture (`top` / `htop`)**
   - Identify the bottleneck (CPU, memory, I/O)
   - Get the top PID(s)
2. **More detail (`iostat` / `vmstat`)**
   - `iostat -x 1`: high `%iowait` often means disks are the bottleneck
   - `vmstat 1`: sustained swap-in/out (`si`/`so`) indicates memory pressure
3. **Deep inspection (`strace`)**
   - `strace -p PID`: observe system calls the process is making
   - Example: the app “hangs” with no error, but `strace` shows it stuck on `read` for a config file

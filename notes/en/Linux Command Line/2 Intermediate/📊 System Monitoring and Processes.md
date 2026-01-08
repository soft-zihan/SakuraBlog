### 1. ps / top / htop / fastfetch - Process and System Monitoring
- `ps -ef`: View all processes in standard format (Process Status)
- `ps aux`: View processes in BSD format (including CPU/Memory usage)
- `top`: Real-time display of system resource usage (P: sort by CPU, M: sort by Memory, q: exit)
> 💡 **Pro Tip**: Try using **`btop`** or **`glances`** instead of `top`; they have cooler interfaces, support mouse operations, and show more hardware info.
- `htop`: More intuitive interactive process monitoring, supports mouse and richer column display
- `fastfetch`: Modern system information display tool (similar to screenfetch/neofetch), quickly view distro, kernel, hardware, etc.

### 2. kill / pkill / killall - Terminate Processes
- `kill PID`: Send termination signal to specified PID
- `kill -9 PID`: Force kill process (SIGKILL)
- `pkill process_name`: Batch kill processes by name
- `killall process_name`: Same as `pkill`, kills all matching processes by name

### 3. df / du / ncdu / lsblk - Disk and Filesystem
- `df -h`: View disk partition space usage (Disk Free)
- `du -sh`: View total size of current directory (Disk Usage)
> 💡 **Pro Tip**: Try using **`dust`** instead of `du` for a more intuitive tree-like disk usage map.
- `du -sh *`: View size of each file/folder in current directory
- `ncdu`: Interactive disk usage analyzer, more intuitive than `du`
- `lsblk`: List tree structure of all block devices (hard drives, partitions) and mount points

### 4. free / uptime - System Resources
- `free -h`: View memory usage
- `uptime`: View system uptime and load average

### 5. iostat / vmstat - Performance Analysis
- `iostat`: View disk I/O (Input/Output Statistics)
- `vmstat`: View virtual memory and CPU activity (Virtual Memory Statistics)

### 6. dmesg / journalctl - System Logs
- `dmesg`: Displays messages from the kernel ring buffer, often used for hardware or driver diagnostics.
- `journalctl -u nginx.service`: View logs for a specific service (e.g., nginx) (for systemd systems).
- `journalctl -f`: Real-time scrolling display of all logs.

### 7. Task Management and Background Running
- `&`: Append to a command to run it in the background (e.g., `python server.py &`)
- `Ctrl + Z`: Suspend current foreground task to background (paused state)
- `jobs`: View all background tasks in current terminal
- `fg %n`: Bring task number n to the foreground
- `bg %n`: Resume suspended background task in the background
- `nohup command &`: Let command continue running after exiting terminal (No Hang Up)
- `disown %n`: Unbind background task from terminal, similar effect to `nohup`

### 8. tmux - Terminal Multiplexer (The Ultimate Tool)
- `tmux new -s name`: Start a new session
- `tmux attach`: Reconnect to the last session
- `tmux ls`: List all sessions
- `tmux kill-session -t name`: Kill a session
- **Common Shortcuts** (Default prefix is `Ctrl + B`):
  - `d`: Detach current session (runs in background)
  - `c`: Create new window
  - `n/p`: Switch to next/previous window
  - `"` / `%`: Horizontal / Vertical split (pane)
  - `Arrow keys`: Navigate between panes

### 9. watch - Periodic Execution
- `watch -n 1 'kubectl get pods'`: Refresh command result every second, monitor changes in real-time.
- `watch -d 'ls -l'`: Highlight changed parts.

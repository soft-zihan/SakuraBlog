# 🚀 Scenario-based Cheatsheet

Indexed by **problem-solving** logic to help you quickly locate solutions.

## 1. Disk and Storage
- **What to do if the disk is full?**
  1. `df -h`: Check which partition is full.
  2. `ncdu` (or `du -sh *`): Dive into directories to find large files.
  3. `rm` / `trash`: Clean up junk files.
  4. `docker system prune`: If Docker is taking up too much space, clean up unused images and containers.

## 2. System Performance and Processes
- **How to troubleshoot CPU / Memory spikes?**
  1. `top` / `htop` / `btop`: Check overall load.
  2. Press `P` (sort by CPU) or `M` (sort by Memory).
  3. `strace -p PID`: View specific system calls being executed by high-usage processes (requires root).
  4. `ps -ef | grep process_name`: View process startup parameters.

- **Program frozen?**
  1. `ps aux | grep program_name`: Find the PID.
  2. `kill PID`: Try to terminate normally.
  3. `kill -9 PID`: Force kill (last resort).

## 3. Network and Connectivity
- **Is the port open?**
  - `telnet IP Port`
  - `nc -zv IP Port` (Recommended)
- **Who is using the port?**
  - `ss -tulpn | grep :port_number`
  - `lsof -i :port_number`
- **View local public IP**
  - `curl ifconfig.me`

## 4. Logs and Troubleshooting
- **Too many logs, how to find errors?**
  - `tail -f log_file | grep -i error --color`: Real-time monitoring and highlight "error".
  - `less log_file` -> Press `G` to jump to bottom -> Press `?error` to search upwards for errors.

## 5. File Search
- **Forgot where a file is?**
  - `find . -name "*config*"`: Search in the current directory.
  - `locate config.ini`: Fast search across the whole disk (index-based).
  - `fzf`: Interactive fuzzy search.

# 05 Automation and Services

Make Linux work for you: manage background services with `systemd` and schedule tasks with `cron`.

## 1. `systemctl` — service management (systemd)

On modern Linux (Ubuntu 18.04+, CentOS 7+, etc.), `systemd` is the standard way to manage services.

### Core commands

- `sudo systemctl status nginx`: check status (first step when debugging)
- `sudo systemctl start nginx`: start
- `sudo systemctl stop nginx`: stop
- `sudo systemctl restart nginx`: restart
- `sudo systemctl reload nginx`: reload config without stopping the service

### Enable on boot

- `sudo systemctl enable nginx`: enable auto-start
- `sudo systemctl disable nginx`: disable auto-start

### Editing config the “safe” way

- Traditional way: edit `/lib/systemd/system/xxx.service` directly (bad idea: updates can overwrite it).
- Better way: `sudo systemctl edit nginx`
  - Creates a “drop-in” override file.
  - You only override the parts you need (e.g., `ExecStart=`), and systemd merges them.
  - Run `sudo systemctl daemon-reload` to apply changes.

---

## 2. `journalctl` — systemd logs

`systemd` centralizes service logs; `journalctl` is the standard query tool.

### Follow logs in real time

- `journalctl -f`: like `tail -f`
- `journalctl -u nginx.service -f`: follow logs for one service

### Debugging failures

- `journalctl -b`: logs since the current boot
- `journalctl -p err -b`: error-level (and above) logs since boot
- `journalctl -xe`: show recent logs with extra context (great for startup failures)

### Cleaning up disk usage

- `journalctl --disk-usage`: check journal size
- `sudo journalctl --vacuum-time=7d`: delete logs older than 7 days

---

## 3. `crontab` — scheduled jobs (automation core)

Think of it as Linux’s alarm clock: run commands at specified times.

### Core commands

- `crontab -e`: edit current user’s jobs
- `crontab -l`: list current jobs

### Syntax (five fields)

`* * * * * command`  
(minute hour day month weekday)

| Example | Meaning |
| :--- | :--- |
| `0 2 * * *` | run daily at 02:00 |
| `*/15 * * * *` | run every 15 minutes |
| `0 9-18 * * *` | run hourly from 9:00 to 18:00 |
| `0 0 1 * *` | run monthly on day 1 at 00:00 |

### Common pitfalls

1. **PATH issues**: cron jobs do not load your interactive shell environment by default.
   - Bad: `python script.py`
   - Good: `/usr/bin/python3 /home/han/script.py` (use absolute paths)
   - Or define PATH at the top of crontab:
     `PATH=/usr/local/bin:/usr/bin:/bin`
2. **Redirect logs**: otherwise errors may be invisible.
   - Example: `* * * * * /cmd >> /tmp/cron.log 2>&1`

---

## 4. Hardware and system info

When someone asks “what’s the server spec?”, these are handy:

- CPU: `lscpu` (cores, architecture, frequency)
- Memory: `free -h` (focus on **Available**, not Free)
- Disk: `df -h` / `lsblk`
- Devices: `lsusb` / `lspci`
- Kernel logs: `dmesg -T` (hardware-related issues)

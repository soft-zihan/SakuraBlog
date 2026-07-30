# 02 Networking and Remote

## 1. `ping` / `telnet` / `nc` — connectivity tests

- `ping host`: test reachability
  - Note: unlike Windows, Linux `ping` runs continuously. Stop with `Ctrl + C`, or use `ping -c 4 host` to send 4 packets.
- `telnet <ip> <port>`: basic port connectivity test (e.g., `telnet 1.2.3.4 80`)
- `nc -zv host port`: a more modern tool (netcat) for checking ports

---

## 2. `ufw` — simple firewall management (Ubuntu)

If a port is unreachable on a cloud server, check not only your service but also the firewall.

- `sudo ufw status`: show firewall status
- `sudo ufw allow 80`: allow inbound port 80
- `sudo ufw enable`: enable the firewall

---

## 3. `ip` / `ifconfig` / `hostname` — addresses and hostnames

- `ip addr`: show all interface IPs (modern standard; replaces `ifconfig`)
- `ifconfig`: legacy interface info (from `net-tools`)
- `ip route`: show routing table
- `hostname`: view or temporarily set the hostname
- `hostname -I`: quickly show all local IPs

---

## 4. `netstat` / `ss` / `lsof` — ports and connections

- `ss -tulpn`: list listening ports with owning processes (recommended, faster than `netstat`)
- `netstat -tulpn`: classic port listing
- `lsof -i :<port>`: see which process is using a specific port
- `sudo nethogs`: live per-process bandwidth usage (needs installation)

---

## 5. `curl` / `wget` — HTTP interaction and downloading

- `curl -I URL`: fetch only HTTP response headers
- `curl -O URL`: download and keep the original filename
- `curl -L URL`: follow redirects (important when URLs redirect)
- `curl -s https://api.example.com/data | jq`: silent mode and pretty-print JSON

### API debugging patterns

- Add headers:
  `curl -H "Content-Type: application/json" -H "Token: secret" URL`
- Basic auth:
  `curl -u "user:password" URL`
- POST JSON:
  ```bash
  curl -X POST -d '{"name":"test"}' -H "Content-Type: application/json" URL
  ```
- Timeouts:
  `curl --connect-timeout 5 --max-time 20 URL` (5s connect timeout, 20s total)

- Public IP in terminal:
  `curl ifconfig.me`
- Resume download:
  `wget -c URL`

---

## 6. Quick file sharing (Python HTTP server)

When you want to share files from a server to a teammate (or download from your phone):

- `python3 -m http.server 8000`
- Effect: the current directory becomes a web page. Open `http://<your-ip>:8000` in a browser to download files.

---

## 7. `nslookup` / `dig` / `nmap` / `mtr` / `tcpdump` — diagnosis and tracing

- `nslookup domain`: simple DNS lookup
- `dig domain`: detailed DNS query tracing
- `nmap <host>`: powerful scanner for open ports and services
- `mtr <host>` (My Traceroute):
  - Scenario: a site is slow and you want to find which hop is dropping packets
  - Combines ping + traceroute with real-time stats (loss rate per hop)

### `tcpdump` (CLI packet capture)

- `sudo tcpdump -i eth0`
- Useful filters:
  - `tcpdump -i eth0 port 80`: only port 80 traffic
  - `tcpdump -i eth0 src 192.168.1.100`: only a source IP
  - `tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0'`: SYN packets only
- Practical options:
  - `-nn`: don’t resolve hostnames/ports (faster; numeric output)
  - `-A`: print payload as ASCII (handy for HTTP inspection)
  - `-w file.pcap`: write to a capture file for Wireshark

---

## 8. `ssh` / `scp` / `rsync` — remote operations and syncing

### SSH basics

- `ssh user@host`: SSH login
- `ssh -p port user@host`: specify port

### File transfer

- `scp file user@host:/path`: secure copy (simple and common)
- `rsync -avzP source/ user@host:/path`:
  - `-a`: archive (preserve perms/times)
  - `-v`: verbose
  - `-z`: compress during transfer
  - `-P`: show progress and allow partial transfers/resume

#### Critical pitfall: trailing slash

- With slash: `rsync -a src/ dest/` means “copy the **contents** of `src` into `dest`”.
- Without slash: `rsync -a src dest/` means “copy the **directory `src` itself** into `dest`”.
- Consequence: missing a slash can create an extra nested `src/` directory on the destination.

### Production-grade rsync tips

- Dry-run: `rsync -avn source/ dest/` (`-n` / `--dry-run`)
- Mirror exactly: `rsync -av --delete source/ dest/` (delete extra files on the destination)
- Exclude: `rsync -av --exclude 'node_modules' --exclude '*.log' source/ dest/`
- Limit bandwidth: `--bwlimit=1000` (KB/s)

---

## SSH productivity: `~/.ssh/config`

Stop memorizing `ssh -p 2222 user@1.2.3.4`. Give servers friendly names.

Edit `~/.ssh/config`:

```ssh config
Host mysrv
    HostName 1.2.3.4
    User root
    Port 2222
    IdentityFile ~/.ssh/id_rsa
```

Now you can simply run: `ssh mysrv`.

---

## SSH port forwarding (tunnels)

- Local forwarding: `ssh -L <localPort>:<targetHost>:<targetPort> user@<jumpServer>`
  - Scenario: from home, you want to access an internal server A (192.168.1.50:80) that is not directly reachable, but you can SSH into a jump host B.
  - Command: `ssh -L 8080:192.168.1.50:80 user@jumpB`
  - Effect: opening `http://localhost:8080` forwards traffic through an encrypted tunnel to A:80.

---

## Passwordless login (SSH keys)

1. `ssh-keygen`: generate a key pair
2. `ssh-copy-id user@host`: copy your public key to the server to enable key-based login

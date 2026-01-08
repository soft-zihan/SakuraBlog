### 1. ping / telnet / nc - Connectivity Testing
- `ping host`: Test network connectivity (Packet Internet Groper)
- `telnet host port`: Test specific port connectivity
- `nc -zv host port`: Modern port testing tool (Netcat)

### 2. ip / ifconfig / hostname - Addresses and Hostname
- `ip addr`: Show all network interface IP addresses (Modern standard)
- `ifconfig`: Show network interface info (Legacy, interface configuration)
- `hostname`: View or temporarily set the current hostname
- `ip route`: Display routing table information

### 3. netstat / ss / lsof - Port and Connection Monitoring
- `ss -tulpn`: View all listening ports and corresponding processes (Recommended, Socket Statistics)
- `netstat -tulpn`: Classic port occupancy viewing tool (Gradually replaced by `ss` in some distributions)
- `lsof -i :port`: View which process is occupying a specific port (List Open Files)
- `sudo nethogs`: View real-time network speed usage by process

### 4. curl / wget - Network Requests and Downloads
- `curl -I URL`: View HTTP response headers only
- `curl -L URL`: Follow HTTP redirects
- `curl -O URL`: Download file and keep original name
- `curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' URL`: Send POST request
- `wget -c URL`: Resume broken download

### 5. ssh / scp / rsync - Remote Operations
- `ssh user@host`: Remote login via SSH (Secure Shell)
- `scp file user@host:/path`: Remote file copy (Secure Copy, somewhat legacy)
- `rsync -avz source/ user@host:/path`: Efficient incremental file synchronization (Remote Sync)

### 6. nslookup / dig - Domain Name Resolution
- `nslookup domain`: Query domain name resolution records (Name Server Lookup)
- `dig domain`: Detailed DNS query (Domain Information Groper)

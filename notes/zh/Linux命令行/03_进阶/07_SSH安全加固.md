# 🔐 SSH安全加固

> **常见真实场景**:
> "服务器刚上线就被暴力破解?SSH是黑客第一目标,必须加固!"

本章节教你快速加固SSH,阻挡99%的自动化攻击。

**来源**: 腾讯云开发者社区、北京大学网络中心、知乎专栏、Red Hat官方文档

## 1. SSH基础安全

### 1.1 禁用密码登录

密码登录是暴力破解的重灾区,攻击者每秒可尝试数千次密码。

```bash
# 编辑sshd_config
sudo vim /etc/ssh/sshd_config

# 禁用密码登录(强制使用密钥)
PasswordAuthentication no

# 禁止空密码
PermitEmptyPasswords no

# 重启生效
sudo systemctl restart sshd
```

**为什么这么做**: 
- 密码可被暴力破解,密钥几乎不可破解(Ed25519密钥需数十亿年)
- 禁用密码后,攻击者即使拿到用户名也无法登录

**⚠️ 注意**: 先配置好密钥登录再禁用密码,否则会被锁在服务器外!

### 1.2 密钥登录配置

```bash
# 1. 确保服务器开启密钥认证
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# 2. 客户端生成密钥(见第2章)
ssh-keygen -t ed25519

# 3. 上传公钥到服务器
ssh-copy-id user@server

# 4. 测试密钥登录
ssh -i ~/.ssh/id_ed25519 user@server
```

**为什么这么做**: 公钥加密体制保证只有持有私钥的客户端才能登录,安全性远超密码。

### 1.3 修改默认端口

```bash
# 修改SSH端口(避开22,推荐10000-65535)
Port 22345

# 重启服务
sudo systemctl restart sshd

# 测试新端口连接
ssh -p 22345 user@server

# ⚠️ 防火墙放行新端口
sudo ufw allow 22345/tcp  # Ubuntu
sudo firewall-cmd --add-port=22345/tcp --permanent  # CentOS
```

**为什么这么做**:
- 22端口是自动化扫描的首要目标,改端口可阻挡90%的脚本小子
- 这不是绝对安全(端口可被扫描),但能大幅减少日志噪音

**⚠️ 注意**: 修改前先测试新端口能否连接,避免把自己锁在外面!

## 2. 密钥管理

### 2.1 生成密钥对

```bash
# 推荐: Ed25519算法(现代、快速、安全)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 兼容老旧系统: RSA 4096位
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 生成过程:
# Enter file in which to save the key: (直接回车用默认路径)
# Enter passphrase: (设置密钥密码,增强安全性)
# Enter same passphrase again: (确认)
```

**生成的文件**:
- `~/.ssh/id_ed25519` - 私钥(永远不要泄露!)
- `~/.ssh/id_ed25519.pub` - 公钥(可安全分享)

### 2.2 密钥类型对比(Ed25519 vs RSA)

| 特性 | Ed25519 | RSA 4096 |
|------|---------|----------|
| 密钥长度 | 256位 | 4096位 |
| 安全强度 | ≈RSA 3072位 | 4096位 |
| 生成速度 | 极快 | 较慢 |
| 签名速度 | 更快 | 慢 |
| 文件大小 | 小(68字节) | 大(748字节) |
| 兼容性 | OpenSSH 6.5+ | 所有系统 |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**为什么选Ed25519**:
- 基于椭圆曲线密码学,256位密钥安全性相当于RSA 3072位
- 更短的密钥、更快的速度、更小的存储占用
- 除非需要兼容10年前的老旧系统,否则一律使用Ed25519

### 2.3 密钥权限设置

SSH对密钥权限要求严格,权限不对会拒绝登录:

```bash
# 正确权限设置
chmod 700 ~/.ssh                    # .ssh目录: 仅所有者可访问
chmod 600 ~/.ssh/id_ed25519         # 私钥: 仅所有者可读写
chmod 644 ~/.ssh/id_ed25519.pub     # 公钥: 所有人可读
chmod 644 ~/.ssh/authorized_keys    # 授权文件: 所有人可读

# 服务器端也要设置
chmod 700 /home/user/.ssh
chmod 600 /home/user/.ssh/authorized_keys
```

**为什么这么做**: 
- SSH会检查权限,权限太开放会拒绝使用密钥(防止其他用户篡改)
- 私钥权限必须是600,否则SSH会报错: "Permissions are too open"

## 3. 防护工具

### 3.1 fail2ban配置

fail2ban监控SSH日志,自动封禁多次登录失败的IP。

```bash
# 安装
sudo apt install fail2ban  # Ubuntu/Debian
sudo yum install fail2ban  # CentOS

# 创建本地配置(不要直接修改jail.conf)
sudo vim /etc/fail2ban/jail.local
```

**配置内容**:

```ini
[DEFAULT]
# 封禁时间: 1小时
bantime = 3600

# 检测窗口: 10分钟内
findtime = 600

# 最大失败次数: 3次
maxretry = 3

# 使用firewalld( CentOS) 或 ufw(Ubuntu)
banaction = ufw

[sshd]
enabled = true
port = 22345          # 如果修改了端口,这里要同步
filter = sshd
logpath = /var/log/auth.log  # Ubuntu
# logpath = /var/log/secure   # CentOS
maxretry = 3
bantime = 3600
findtime = 600
```

```bash
# 启动并设置开机自启
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 查看状态
sudo fail2ban-client status sshd

# 查看被封禁的IP
sudo fail2ban-client get sshd banned

# 解封特定IP
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

**为什么这么做**:
- 即使禁用了密码登录,仍可能有攻击者扫描端口
- fail2ban可自动封禁恶意IP,无需人工干预
- 封禁时间可配置,避免误封(临时封禁而非永久)

### 3.2 SSH日志监控

```bash
# 查看登录成功记录
last | head -20

# 查看登录失败记录(Ubuntu)
sudo grep "Failed password" /var/log/auth.log | tail -20

# 查看登录失败记录(CentOS)
sudo grep "Failed password" /var/log/secure | tail -20

# 实时监控登录尝试
sudo tail -f /var/log/auth.log | grep "sshd"

# 查看当前SSH连接
who
netstat -tnpa | grep sshd

# 统计暴力破解Top 10 IP
sudo grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -10
```

**为什么这么做**: 定期检查日志可发现异常登录尝试,及时采取防护措施。

## 4. 高级加固

### 4.1 sshd_config关键配置

完整的安全配置示例:

```bash
sudo vim /etc/ssh/sshd_config
```

```ini
# === 协议与端口 ===
Protocol 2                    # 仅使用SSHv2(v1有已知漏洞)
Port 22345                    # 非标准端口

# === 认证限制 ===
PasswordAuthentication no     # 禁用密码登录
PubkeyAuthentication yes      # 启用密钥认证
PermitEmptyPasswords no       # 禁止空密码
MaxAuthTries 3                # 最大认证尝试次数(防暴力破解)

# === 用户限制 ===
PermitRootLogin no            # 禁止root直接登录
AllowUsers han admin deploy   # 白名单: 仅允许这些用户

# === 会话管理 ===
ClientAliveInterval 300       # 5分钟无活动发送心跳
ClientAliveCountMax 2         # 2次无响应断开(共10分钟)

# === 安全加固 ===
X11Forwarding no              # 禁用X11转发(除非需要图形界面)
Compression no                # 禁用压缩(防压缩漏洞)
IgnoreRhosts yes              # 禁用rhosts认证(老旧且不安全)
HostBasedAuthentication no    # 禁用主机认证

# === 日志与审计 ===
LogLevel VERBOSE              # 详细日志(记录指纹信息)
PrintLastLog yes              # 显示上次登录时间
PrintMotd yes                 # 显示登录欢迎信息(可加警告语)
```

```bash
# 测试配置语法(重要!避免配置错误导致无法登录)
sudo sshd -t

# 重启服务
sudo systemctl restart sshd
```

**为什么这么做**: 每一项配置都针对特定攻击向量,组合使用可大幅提升安全性。

### 4.2 限制登录用户

```bash
# 方式1: 白名单(推荐)
AllowUsers han admin deploy

# 方式2: 用户组白名单
AllowGroups sshusers

# 方式3: 黑名单(不推荐,容易遗漏)
DenyUsers root test guest

# 创建SSH专用用户组
sudo groupadd sshusers
sudo usermod -aG sshusers han
```

**为什么这么做**:
- 最小权限原则: 仅允许必要用户登录
- 即使其他用户密码泄露,攻击者也无法通过SSH登录

### 4.3 双因素认证(可选)

对安全性要求极高的场景,可启用2FA:

```bash
# 安装Google Authenticator模块
sudo apt install libpam-google-authenticator

# 为用户启用
google-authenticator

# 配置PAM
sudo vim /etc/pam.d/sshd
# 添加: auth required pam_google_authenticator.so

# 配置sshd
sudo vim /etc/ssh/sshd_config
# 添加: AuthenticationMethods publickey,keyboard-interactive:pam

sudo systemctl restart sshd
```

**为什么这么做**: 即使私钥泄露,攻击者还需要手机上的动态验证码。

## 5. 实战案例

### 5.1 暴力破解排查

**现象**: 服务器CPU占用高,日志大量Failed password

```bash
# 1. 查看暴力破解证据
sudo grep "Failed password" /var/log/auth.log | wc -l
# 输出: 15234 (表示有15234次失败尝试)

# 2. 查看攻击源IP
sudo grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -5

# 输出示例:
# 8234 45.123.67.89
# 4521 103.45.67.89
# 2479 185.123.45.67

# 3. 临时封禁攻击IP
sudo ufw deny from 45.123.67.89

# 4. 安装fail2ban自动防护
sudo apt install fail2ban
sudo systemctl enable --now fail2ban

# 5. 长期方案: 禁用密码登录 + 改端口
```

**为什么这么做**: 暴力破解会占用系统资源,且一旦成功后果严重。

### 5.2 密钥登录故障

**问题**: 配置密钥后仍提示输入密码

```bash
# 排查步骤:

# 1. 检查客户端密钥权限
ls -la ~/.ssh/id_ed25519
# 必须是 -rw------- (600)

# 2. 检查服务器端权限
ssh user@server "ls -la ~/.ssh/authorized_keys"
# 必须是 -rw-r--r-- (644)

# 3. 查看服务器日志(Ubuntu)
sudo tail -f /var/log/auth.log | grep sshd

# 4. 查看详细调试信息
ssh -vvv -i ~/.ssh/id_ed25519 user@server

# 常见错误:
# - "Permissions 0644 for 'id_ed25519' are too open" → chmod 600
# - "Authentication refused: bad ownership or modes" → 检查服务器.ssh目录权限
# - "No mutual signature algorithm" → 密钥类型过旧,生成新的Ed25519密钥
```

### 5.3 端口修改后连接

```bash
# 修改端口后的连接方式

# 方式1: 指定端口
ssh -p 22345 han@server.com

# 方式2: 配置~/.ssh/config(推荐)
vim ~/.ssh/config
```

添加内容:

```
Host myserver
    HostName server.com
    Port 22345
    User han
    IdentityFile ~/.ssh/id_ed25519
```

```bash
# 之后直接连接
ssh myserver

# ⚠️ 如果连接不上:

# 1. 检查防火墙
sudo ufw status
sudo ufw allow 22345/tcp

# 2. 检查sshd监听端口
sudo netstat -tlnp | grep sshd
# 应显示: 0.0.0.0:22345

# 3. 检查SELinux(CentOS)
sudo semanage port -l | grep ssh
sudo semanage port -a -t ssh_port_t -p tcp 22345
```

**为什么这么做**: 使用SSH config可简化连接命令,避免每次都要指定端口和密钥。

---

**安全加固检查清单**:
- [ ] 禁用密码登录
- [ ] 修改默认端口
- [ ] 禁止root登录
- [ ] 配置密钥认证(Ed25519)
- [ ] 安装fail2ban
- [ ] 设置用户白名单
- [ ] 配置会话超时
- [ ] 定期查看日志

**下一步**: 配置防火墙 → 设置自动更新 → 部署入侵检测系统

# 🐚 Shell 脚本编程完整指南

Shell 脚本是将一系列命令组合成一个可执行文件的艺术。它是实现复杂自动化任务的基石，从简单的文件批处理到复杂的系统运维，都离不开 Shell 脚本。

## 1. 基础语法速记

### 变量
- **定义**：`name="Linux"` (注意：**等号两边不能有空格**)。
- **引用**：`echo "Hello $name"` 或 `echo ${name}`。
- **只读变量**：`readonly PI=3.14`（定义后不可修改）。
- **删除变量**：`unset name`。

### 条件判断 (if)
```bash
if [ "$status" = "OK" ]; then
    echo "Success"
elif [ "$status" = "PENDING" ]; then
    echo "Waiting"
else
    echo "Failed"
fi
```
**💡 常用判断条件 (Cheat Sheet)**：
| 类型 | 符号 | 含义 |
| :--- | :--- | :--- |
| **文件** | `[ -f file ]` | 文件存在 |
| | `[ -d dir ]` | 目录存在 |
| | `[ -s file ]` | 文件不为空 |
| | `[ -x file ]` | 文件可执行 |
| **字符串** | `[ -z "$str" ]` | 字符串为空 |
| | `[ -n "$str" ]` | 字符串非空 |
| | `[ "$a" = "$b" ]` | 相等 |
| **数值** | `[ $a -eq $b ]` | 相等 (Equal) |
| | `[ $a -ne $b ]` | 不等 (Not Equal) |
| | `[ $a -gt $b ]` | 大于 (Greater Than) |
| | `[ $a -lt $b ]` | 小于 (Less Than) |

### 循环结构
```bash
# for 循环：批量备份 log 文件
shopt -s nullglob
for file in *.log; do
    mv -- "$file" "${file}.bak"
done

# while 循环：读取文件每一行
while IFS= read -r line; do
    echo "处理: $line"
done < input.txt

# until 循环：直到条件满足才停止
until [ -f "/tmp/ready" ]; do
    echo "等待就绪..."
    sleep 2
done
```

### 特殊变量
- **`$0`**：脚本文件名。
- **`$1` ~ `$9`**：第1~9个参数。
- **`${10}`**：第10个及以后的参数（需要花括号）。
- **`$@`**：所有参数（保留引号，推荐）。
- **`$*`**：所有参数（合并成一个字符串）。
- **`$#`**：参数个数。
- **`$?`**：上一个命令的退出状态 (0 表示成功，非 0 表示失败)。
- **`$$`**：当前脚本的进程ID (PID)。
- **`$!`**：最后一个后台进程的PID。

---

## 2. 函数详解

函数是 Shell 脚本的模块化利器，让代码可复用、易维护。

### 2.1 函数定义与调用
```bash
# 定义方式1：常用格式
function greet() {
    echo "Hello, $1!"
}

# 定义方式2：简洁格式
greet() {
    echo "Hello, $1!"
}

# 调用函数（不需要括号）
greet "World"  # 输出: Hello, World!
```

### 2.2 参数传递与局部变量
```bash
calculate() {
    # 局部变量（避免污染全局环境）
    local num1=$1
    local num2=$2
    local result=$((num1 + num2))
    
    echo $result  # 返回值通过 echo 输出
}

sum=$(calculate 10 20)
echo "结果是: $sum"  # 输出: 结果是: 30
```

**💡 关键要点**：
- 函数参数使用 `$1`, `$2` 等访问，**不是**从脚本参数继承
- 使用 `local` 声明局部变量，避免命名冲突
- 函数返回值通过 `echo` 输出，用 `$()` 捕获
- `return` 只能返回 0-255 的整数（退出状态码）

### 2.3 返回值处理
```bash
check_file() {
    local file=$1
    
    if [ -f "$file" ]; then
        echo "文件存在: $file"
        return 0  # 成功
    else
        echo "文件不存在: $file" >&2  # 错误输出到 stderr
        return 1  # 失败
    fi
}

# 调用并检查返回值
if check_file "/etc/passwd"; then
    echo "✓ 检查通过"
else
    echo "✗ 检查失败"
fi
```

---

## 3. 数组处理

### 3.1 索引数组
```bash
# 定义数组
fruits=("apple" "banana" "cherry")

# 访问元素
echo ${fruits[0]}      # apple
echo ${fruits[@]}      # 所有元素: apple banana cherry
echo ${#fruits[@]}     # 数组长度: 3
echo ${!fruits[@]}     # 所有索引: 0 1 2

# 添加元素
fruits+=("durian")

# 删除元素
unset fruits[1]  # 删除 banana

# 遍历数组
for fruit in "${fruits[@]}"; do
    echo "水果: $fruit"
done

# 带索引遍历
for i in "${!fruits[@]}"; do
    echo "$i: ${fruits[$i]}"
done
```

### 3.2 关联数组（Bash 4.0+）
```bash
# 声明关联数组
declare -A user

# 赋值
user[name]="张三"
user[age]=25
user[city]="北京"

# 访问
echo ${user[name]}  # 张三

# 遍历键
for key in "${!user[@]}"; do
    echo "$key: ${user[$key]}"
done

# 实战案例：配置文件解析
declare -A config
while IFS='=' read -r key value; do
    config[$key]=$value
done < config.txt
```

---

## 4. 用户交互

### 4.1 read 命令详解
```bash
# 基本输入
read -p "请输入姓名: " name
echo "你好, $name!"

# 隐藏输入（密码）
read -s -p "请输入密码: " password
echo  # 换行

# 超时设置
read -t 5 -p "5秒内输入选择: " choice
if [ $? -ne 0 ]; then
    echo "超时！"
    exit 1
fi

# 输入验证示例
validate_input() {
    while true; do
        read -p "请输入数字 (1-10): " num
        if [[ "$num" =~ ^[0-9]+$ ]] && [ "$num" -ge 1 ] && [ "$num" -le 10 ]; then
            echo "✓ 输入有效: $num"
            break
        else
            echo "✗ 无效输入，请重试"
        fi
    done
}
```

### 4.2 交互式菜单
```bash
show_menu() {
    while true; do
        echo "\n===== 系统管理菜单 ====="
        echo "1. 查看磁盘使用"
        echo "2. 查看内存使用"
        echo "3. 查看进程数"
        echo "0. 退出"
        read -p "请选择 [0-3]: " choice
        
        case $choice in
            1) df -h ;;
            2) free -h ;;
            3) echo "当前进程数: $(ps aux | wc -l)" ;;
            0) echo "再见！"; exit 0 ;;
            *) echo "无效选项" ;;
        esac
    done
}
```

---

## 5. 信号处理与 trap

`trap` 命令用于捕获信号并在特定事件发生时执行清理操作。

### 5.1 基本用法
```bash
# 捕获 Ctrl+C (SIGINT)
cleanup() {
    echo "\n收到中断信号，正在清理..."
    rm -f /tmp/temp_*
    exit 1
}

trap cleanup SIGINT SIGTERM

# 脚本主逻辑
echo "按 Ctrl+C 测试清理功能"
while true; do
    sleep 1
done
```

### 5.2 常用信号
| 信号 | 编号 | 触发方式 | 说明 |
| :--- | :--- | :--- | :--- |
| **SIGINT** | 2 | Ctrl+C | 中断信号 |
| **SIGTERM** | 15 | `kill <pid>` | 终止信号（默认） |
| **SIGHUP** | 1 | 终端关闭 | 挂起信号 |
| **SIGKILL** | 9 | `kill -9` | 强制杀死（**不可捕获**） |
| **EXIT** | - | 脚本退出 | 伪信号，任何退出方式都触发 |

### 5.3 实战：自动清理临时文件
```bash
#!/bin/bash
set -euo pipefail

TEMP_DIR=$(mktemp -d /tmp/script.XXXXXX)
echo "临时目录: $TEMP_DIR"

# 确保无论成功还是失败都清理
cleanup() {
    local exit_code=$?
    rm -rf "$TEMP_DIR"
    if [ $exit_code -ne 0 ]; then
        echo "脚本出错退出 (代码: $exit_code)"
    else
        echo "清理完成"
    fi
    exit $exit_code
}

trap cleanup EXIT INT TERM

# 你的逻辑
echo "工作中..."
# 模拟失败
# false
```

---

## 6. 🚀 生产级万能模板

创建一个脚本（如 `run.sh`）时，建议以此开头，能避免 90% 的低级错误。

```bash
#!/bin/bash
# 脚本功能：示例模板
# 作者：Your Name
# 日期：2024-01-01

# 1. 脚本防弹衣
# -e: 遇到错误立即退出 (Error)
# -u: 使用未定义变量报错 (Undefined)
# -o pipefail: 管道中任意一步失败都视为失败
set -euo pipefail

# 2. 获取脚本所在目录 (处理路径问题的终极方案)
# 无论你在哪里运行这个脚本，$CUR_DIR 永远指向脚本所在的文件夹
CUR_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# 3. 日志函数
log_info() {
    echo "[INFO]  $(date '+%Y-%m-%d %H:%M:%S') $*"
}

log_error() {
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') $*" >&2
}

# 4. 清理函数
cleanup() {
    log_info "清理临时文件..."
    # 你的清理逻辑
}

trap cleanup EXIT

# 5. 参数检查
if [ $# -lt 1 ]; then
    echo "用法: $0 <参数1> [参数2]"
    exit 1
fi

# 6. 逻辑开始
log_info "脚本启动"
log_info "当前脚本路径: $CUR_DIR"
# ... 你的代码 ...
log_info "脚本完成"
```

---

## 7. 实战案例

### 7.1 日志分析脚本
```bash
#!/bin/bash
# 功能：分析 Nginx 访问日志，统计 Top 10 IP 和错误码

set -euo pipefail

LOG_FILE="${1:-/var/log/nginx/access.log}"

if [ ! -f "$LOG_FILE" ]; then
    echo "错误: 日志文件不存在: $LOG_FILE"
    exit 1
fi

echo "===== 日志分析报告 ====="
echo "文件: $LOG_FILE"
echo "大小: $(du -h "$LOG_FILE" | cut -f1)"
echo "行数: $(wc -l < "$LOG_FILE")"
echo

# Top 10 访问 IP
echo "📊 Top 10 访问 IP:"
awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10
echo

# HTTP 状态码统计
echo "📈 HTTP 状态码分布:"
awk '{print $9}' "$LOG_FILE" | sort | uniq -c | sort -rn
echo

# 错误请求 (4xx, 5xx)
echo "⚠️  错误请求统计:"
awk '$9 >= 400 {print $9, $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10
```

### 7.2 批量重命名脚本
```bash
#!/bin/bash
# 功能：批量将文件名从大写转小写，空格替换为下划线

set -euo pipefail

if [ $# -eq 0 ]; then
    echo "用法: $0 <目录> [扩展名]"
    echo "示例: $0 /path/to/photos jpg"
    exit 1
fi

TARGET_DIR="$1"
EXTENSION="${2:-}"

cd "$TARGET_DIR"

# 构建文件列表
if [ -n "$EXTENSION" ]; then
    files=(*."$EXTENSION")
else
    files=(* )
fi

count=0
for old_name in "${files[@]}"; do
    # 跳过不存在的文件（通配符未匹配时）
    [ -e "$old_name" ] || continue
    
    # 转换：大写→小写，空格→下划线
    new_name=$(echo "$old_name" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
    
    if [ "$old_name" != "$new_name" ]; then
        mv -v "$old_name" "$new_name"
        ((count++))
    fi
done

echo "\n✓ 完成！重命名了 $count 个文件"
```

### 7.3 系统健康检查脚本
```bash
#!/bin/bash
# 功能：系统健康检查并生成报告

set -euo pipefail

REPORT_FILE="/tmp/system_health_$(date +%Y%m%d_%H%M%S).txt"

{
    echo "========================================"
    echo "  系统健康检查报告"
    echo "  时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "  主机: $(hostname)"
    echo "========================================"
    echo

    # CPU 使用率
    echo "🔹 CPU 使用率:"
    top -bn1 | grep "Cpu(s)" | awk '{printf "  使用率: %.1f%%\n", $2 + $4}'
    echo

    # 内存使用
    echo "🔹 内存使用:"
    free -h | awk '/^Mem:/ {printf "  总计: %s, 已用: %s, 可用: %s (%.1f%%)\n", $2, $3, $4, $3/$2*100}'
    echo

    # 磁盘使用
    echo "🔹 磁盘使用 (超过 80% 警告):"
    df -h | awk 'NR==1 || $5+0 > 80 {print "  " $0}'
    echo

    # 负载平均值
    echo "🔹 系统负载:"
    uptime | awk -F'load average:' '{print "  " $2}'
    echo

    # 僵尸进程
    zombie_count=$(ps aux | awk '$8=="Z" {count++} END {print count+0}')
    echo "🔹 僵尸进程: $zombie_count 个"
    
    if [ "$zombie_count" -gt 0 ]; then
        echo "  警告: 发现僵尸进程！"
        ps aux | awk '$8=="Z" {print "  " $0}'
    fi
    echo

    # 最近错误日志
    echo "🔹 最近系统错误 (dmesg):"
    dmesg --level=err 2>/dev/null | tail -5 || echo "  无错误日志"
    echo

    echo "========================================"
    echo "  检查完成"
    echo "========================================"
} | tee "$REPORT_FILE"

echo "\n报告已保存至: $REPORT_FILE"
```

---

## 8. 调试技巧与最佳实践

### 8.1 调试方法
```bash
# 方法1：运行脚本时启用调试
bash -x script.sh

# 方法2：脚本内部部分调试
set -x  # 开启调试
echo "这段代码会被打印"
set +x  # 关闭调试

# 方法3：输出到 stderr 避免干扰
DEBUG=true
log_debug() {
    if [ "$DEBUG" = true ]; then
        echo "[DEBUG] $*" >&2
    fi
}
```

### 8.2 错误处理模板
```bash
# 自定义错误处理函数
error_handler() {
    local line_no=$1
    local exit_code=$2
    echo "[ERROR] 第 $line_no 行出错，退出码: $exit_code" >&2
    # 可选：发送告警邮件/消息
    exit $exit_code
}

trap 'error_handler ${LINENO} $?' ERR

# 关键命令容错
command_that_might_fail || {
    echo "警告: 命令失败，继续执行"
    # 降级处理逻辑
}
```

### 8.3 最佳实践清单

**✅ 应该做的**：
1. 始终使用 `set -euo pipefail` 开头
2. 变量引用加双引号：`"$var"` 而非 `$var`
3. 使用 `local` 声明函数局部变量
4. 用 `[[ ]]` 替代 `[ ]`（支持正则、逻辑运算符）
5. 临时文件用 `mktemp` 创建，用 `trap` 清理
6. 使用 `shellcheck` 静态检查脚本
7. 添加清晰的注释和使用说明
8. 错误信息输出到 stderr: `echo "error" >&2`

**❌ 避免做的**：
1. 不要用反引号 `` `cmd` ``，用 `$(cmd)`
2. 不要忽略命令返回值
3. 不要在循环中调用外部命令（性能差）
4. 不要硬编码路径，使用变量
5. 不要忽略边界条件（空文件、空格文件名）

### 8.4 ShellCheck 使用教程
```bash
# 安装
sudo apt install shellcheck    # Ubuntu
brew install shellcheck        # macOS

# 使用
shellcheck script.sh

# 输出示例：
# In script.sh line 10:
# echo $file
#      ^--^ SC2086: Double quote to prevent globbing and word splitting.

# 忽略特定警告（谨慎使用）
# shellcheck disable=SC2086
echo $file

# VS Code 集成：安装 ShellCheck 插件，实时检查
```

---

## 📚 参考资料

1. **JavaGuide Shell 编程基础**: https://javaguide.cn/cs-basics/operating-system/shell-intro.html
2. **C语言中文网 Shell 教程**: https://c.biancheng.net/shell/
3. **Advanced Bash-Scripting Guide**: https://tldp.org/LDP/abs/html/
4. **ShellCheck 官方**: https://www.shellcheck.net/
5. **Bash 参考手册**: https://www.gnu.org/software/bash/manual/
6. **109 个实用 Shell 脚本**: https://zhuanlan.zhihu.com/p/468187891

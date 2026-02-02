# 🐚 Shell 脚本编程基础 (Shell Scripting)

Shell 脚本是将一系列命令组合成一个可执行文件的艺术。它是实现复杂自动化任务的基石。

## 1. 基础语法速记

### 变量
- **定义**：`name="Linux"` (注意：**等号两边不能有空格**)。
- **引用**：`echo "Hello $name"` 或 `echo ${name}`。

### 条件判断 (if)
```bash
if [ "$status" = "OK" ]; then
    echo "Success"
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
| **字符串** | `[ -z "$str" ]` | 字符串为空 |
| | `[ "$a" = "$b" ]` | 相等 |
| **数值** | `[ $a -eq $b ]` | 相等 (Equal) |
| | `[ $a -gt $b ]` | 大于 (Greater Than) |

### 循环 (for)
```bash
# 批量备份 log 文件
shopt -s nullglob
for file in *.log; do
    mv -- "$file" "${file}.bak"
done
```

### 特殊变量
- **`$0`**：脚本文件名。
- **`$1`**：第一个参数。
- **`$@`**：所有参数。
- **`$?`**：上一个命令的退出状态 (0 表示成功，非 0 表示失败)。

---

## 2. 🚀 生产级万能模板
创建一个脚本（如 `run.sh`）时，建议以此开头，能避免 90% 的低级错误。

```bash
#!/bin/bash
# 脚本功能：示例模板

# 1. 脚本防弹衣
# -e: 遇到错误立即退出 (Error)
# -u: 使用未定义变量报错 (Undefined)
# -o pipefail: 管道中任意一步失败都视为失败
set -euo pipefail

# 2. 获取脚本所在目录 (处理路径问题的终极方案)
# 无论你在哪里运行这个脚本，$CUR_DIR 永远指向脚本所在的文件夹
CUR_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# 3. 逻辑开始
echo "当前脚本路径: $CUR_DIR"
# ... 你的代码 ...
```

---

## 3. 实用技巧
- **调试模式**：`bash -x script.sh`。它会打印出每一行执行的命令，方便找 Bug。
- **参数默认值**：`NAME=${1:-"World"}`。如果没传第一个参数，就默认 NAME 为 "World"。
- **质量工具**：推荐用 `shellcheck` 静态检查脚本（能提前发现大部分引号、变量、管道错误）。
- **清理现场**：用 `trap` 在退出时回收临时文件（避免脚本失败后留下垃圾）。

# 04 Shell Scripting Basics

Shell scripting is the art of combining a sequence of commands into an executable file. It is the foundation for automation.

## 1. Quick syntax notes

### Variables

- Define: `name="Linux"` (important: **no spaces** around `=`)
- Use: `echo "Hello $name"` or `echo ${name}`

### Conditions (`if`)

```bash
if [ "$status" = "OK" ]; then
    echo "Success"
else
    echo "Failed"
fi
```

Common checks (cheat sheet):

| Type | Form | Meaning |
| :--- | :--- | :--- |
| File | `[ -f file ]` | file exists |
|  | `[ -d dir ]` | directory exists |
|  | `[ -s file ]` | file exists and is not empty |
| String | `[ -z "$str" ]` | string is empty |
|  | `[ "$a" = "$b" ]` | equal |
| Number | `[ $a -eq $b ]` | equal |
|  | `[ $a -gt $b ]` | greater than |

### Loops (`for`)

```bash
# Batch backup of log files
for file in $(ls *.log); do
    mv "$file" "${file}.bak"
done
```

### Special variables

- `$0`: script filename
- `$1`: first argument
- `$@`: all arguments
- `$?`: exit status of the previous command (`0` means success; non-zero means failure)

---

## 2. A production-grade template

When you create a script (e.g., `run.sh`), starting with a robust template avoids many beginner mistakes.

```bash
#!/bin/bash
# Script purpose: template example

# 1) Safety settings
# -e: exit on error
# -u: error on undefined variables
# -o pipefail: fail if any command in a pipeline fails
set -euo pipefail

# 2) Get the directory of this script (solves path issues)
# No matter where you run it from, $CUR_DIR points to the script folder.
CUR_DIR=$(cd $(dirname $0); pwd)

# 3) Start logic
echo "Script directory: $CUR_DIR"
# ... your code ...
```

---

## 3. Practical tips

- Debug mode: `bash -x script.sh` (prints each executed line)
- Default argument value: `NAME=${1:-"World"}` (use `"World"` if `$1` is missing)

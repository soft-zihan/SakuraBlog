# 02 Text Processing and Regex (The Power of Text)

This is one of the biggest strengths of Linux: **batch-processing text from the command line**.

## 1. Regex basics

Regex is an upgraded form of “wildcards” for precise string matching. You don’t need to memorize everything—these symbols cover most daily work.

| Symbol | Meaning | Example | What it matches |
| :--- | :--- | :--- | :--- |
| `^` | start of line | `^Error` | lines that start with “Error” |
| `$` | end of line | `OK$` | lines that end with “OK” |
| `.` | any single char | `a.c` | `abc`, `a@c`, `a1c` |
| `*` | repeat (0+ times) | `ab*c` | `ac`, `abc`, `abbbc` |
| `[]` | character class | `[0-9]` | any one digit |

### Common beginner pitfall: regex `*` vs shell `*`

- **Shell glob**: in `ls *.txt`, `*` means “any characters”.
- **Regex**: in `grep "a*"`, `*` means “repeat the previous token 0+ times”.
- Consequence: a bare `*` is invalid in regex; you typically write `.*` to mean “anything”.

Practical combos:

- `^$`: empty line
- `^#`: comment line (starts with `#`)

---

## 2. `grep` — searching text (with regex)

`grep` is the best playground for regex.

- Basics:
  - `grep "login" app.log`: lines containing “login”
  - `grep -i "error" app.log`: ignore case
  - `grep -v "debug" app.log`: invert match (lines NOT containing “debug”)
  - `grep -l "pattern" *.log`: list filenames that match
  - `grep -c "pattern" file`: count matching lines
  - `grep "\\." file`: escape special characters (a literal dot)
  - `grep -E "^[0-9]{3}" app.log`: extended regex (`egrep` style)
  - `grep -P "\\d+" app.log`: Perl regex (supports `\d`, `\w`, etc.)

- Context search (very useful):
  - `grep -C 5 "Error" app.log`: show 5 lines before and after
  - `grep -B 3 "Error" app.log`: show 3 lines before
  - `grep -A 3 "Error" app.log`: show 3 lines after

---

## 3. `cut` — fast column extraction (lightweight `awk`)

When you only need to split by a fixed delimiter, `cut` is simple and fast.

Example:

`cut -d ':' -f 1 /etc/passwd`

- `-d ':'`: delimiter is `:`
- `-f 1`: extract the first field

---

## 4. `sort` / `uniq` — sorting and deduplication

These two are often used together when processing logs or lists.

### `sort`

- `sort -n`: numeric sort (otherwise `10` can come before `2`)
- `sort -r`: reverse order
- `sort -k 2`: sort by the second column

### `uniq`

⚠️ Note: `uniq` only removes **adjacent** duplicates, so you usually need `sort` first.

- `uniq -c`: count occurrences
- `uniq -d`: show only duplicates

---

## 5. `tr` / `column` — character translation and formatting

### `tr` (translate)

- `cat file | tr 'a-z' 'A-Z'`: lowercase → uppercase
- `cat file | tr -d ' '`: delete spaces

### `column -t`

Align messy output into a readable table:

- `cat /etc/passwd | head | column -t -s ':'` (split by `:` and align columns)

---

## 6. `sed` — stream editing (replace / modify text)

You only need to remember one “universal formula”.

### Universal replacement formula

```bash
sed -i 's/OLD/NEW/g' file
```

- `-i` (in-place): edit the file directly
  - macOS note: BSD `sed` requires a backup suffix, e.g. `sed -i '' 's/.../.../' ...`, or install GNU sed.
- `s` (substitute): replacement operation
- `g` (global): replace all matches in each line (without `g`, only the first match per line is replaced)

### Advanced tips: delimiter conflicts and capture groups

1. Delimiter conflicts: if your pattern contains `/`, use another delimiter like `#`:

   ```bash
   sed -i 's#/var/www#/home/www#g' config.conf
   ```

2. Capture groups (backreferences): keep part of the match and reuse it:
   - Scenario: convert `Name: Alice` → `User: Alice`
   - Command: `sed -E 's/Name: (.*)/User: \\1/'`
   - The text inside `()` is stored as `\1`, `\2`, ... for reuse.

3. Deleting lines (`d`):

   ```bash
   # Delete line 5
   sed -i '5d' file.txt

   # Delete lines containing "password"
   sed -i '/password/d' file.txt

   # Delete empty lines
   sed -i '/^$/d' file.txt
   ```

---

## 7. `awk` — data extraction (column processing)

`sed` is great at modifying lines; `awk` is great at extracting/processing fields.

- Core model:
  - Default field separator is whitespace (space or tab)
  - `$1` is the first field, `$0` is the whole line
  - Custom separator: `awk -F: '{print $1}' /etc/passwd`

- Practical examples:
  - Print a column: `ls -l | awk '{print $3}'` (owner name is column 3)
  - Last column: `awk '{print $NF}'` (regardless of how many fields exist)
  - Custom output field separator (`OFS`):
    `awk -F: 'BEGIN{OFS=\" | \"} {print $1, $3}' /etc/passwd` → `root | 0`

- Built-in variables:
  - `NR`: current line number
  - `NF`: number of fields in the current line
  - `FS`: input field separator (same as `-F`)
  - `OFS`: output field separator

- Structured processing with `BEGIN`/`END`:
  - Total lines:
    ```bash
    awk 'END {print \"Total lines:\", NR}' file.txt
    ```
  - Sum:
    ```bash
    awk '{sum+=$2} END {print \"Sum:\", sum}' data.txt
    ```

---

## 8. `jq` — JSON processing (modern dev essential)

In the API era, `jq` is a Swiss army knife for JSON.

- Formatting and basics:
  - `cat data.json | jq .`: pretty-print JSON
  - `jq '.name' data.json`: extract a field
- Arrays and filtering:
  - `jq '.users[0]'`: access an array item
  - `jq '.[] | select(.age > 25)'`: filter objects by a condition
- Advanced transforms:
  - `jq -r '.id'`: raw output (without quotes) for shell piping
  - `jq '[.items[].name]'`: build a new array from selected fields
- Example:
  `curl -s https://api.github.com/repos/stedolan/jq | jq '.stargazers_count'`

---

## 9. `xargs` — turning pipeline output into command arguments

`xargs` converts the **output** of one command into **arguments** for another command.

- Why needed?
  Many commands (`rm`, `kill`, `cp`, ...) don’t read targets from stdin—they expect arguments.

- Advanced: placeholder `-I` and parallelism `-P`
  - Placeholder: insert the item in the middle of your command:
    - `ls *.jpg | xargs -I {} mv {} backup_{}` (rename/move many images)
  - Parallelism:
    - `find . -name "*.jpg" | xargs -P 4 -I {} convert {} {}.png`
    - Runs up to 4 conversions concurrently to use multiple CPU cores.

- Typical patterns:
  - `cat server_list.txt | xargs -n 1 ping -c 1` (`-n 1` passes one argument per run)
  - `find . -name "*.log" -print0 | xargs -0 grep "Error"` (safe for filenames with spaces)

- Killing matching processes (classic pipeline):
  `ps -ef | grep "python" | awk '{print $2}' | xargs kill -9`

---

## 10. Ultimate practice: pipeline “combo”

Linux power comes from combining small tools with `|`.

### Useful awk one-liners

| Need | Command |
| :--- | :--- |
| Sum | `awk '{sum+=$1} END {print sum}' data.txt` |
| Average | `awk '{sum+=$1} END {print sum/NR}' data.txt` |
| Print even lines | `awk 'NR%2==0' file.txt` |
| Filter by multiple fields | `awk '$2 > 10 && $3 == \"OK\"' log.txt` |

### Scenario: top 10 IPs in an access log

Given a large `access.log`, find the busiest IPs:

```bash
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -n 10
```

Step-by-step:

1. `awk '{print $1}'`: extract the first column (IP)
2. `sort`: group identical IPs together
3. `uniq -c`: count occurrences (e.g., `15 192.168.1.1`)
4. `sort -rn`: numeric sort, descending
5. `head -n 10`: keep the top 10

### Summary

- `sed`: batch-modify or delete content
- `awk`: analyze formatted logs and extract fields
- `xargs`: convert earlier results into arguments for later commands (e.g., `find ... | xargs rm -f`)

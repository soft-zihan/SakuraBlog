# 🧩 Text Processing and Regex (The Power of Text)

This is the greatest power of Linux over Windows: **processing text content in batches via the command line**.

## 1. Introduction to Regular Expressions (Regex)
Regex is an upgraded version of "wildcards" used for precise string matching. You don't need to memorize every rule; mastering these 5 symbols solves 90% of problems.

| Symbol | Meaning | Example | Matching Result |
| :--- | :--- | :--- | :--- |
| **`^`** | **Start of line** | `^Error` | Matches lines **starting** with "Error" |
| **`$`** | **End of line** | `OK$` | Matches lines **ending** with "OK" |
| **`.`** | **Any character** | `a.c` | Matches "abc", "a@c", "a1c" |
| **`*`** | **Repetition** (0 or more times) | `ab*c` | Matches "ac", "abc", "abbbc" |
| **`[]`** | **Range** | `[0-9]` | Matches any single digit |

> **Practical Combinations**:
> - `^$`: Matches empty lines.
> - `^#`: Matches comment lines (starting with #).

---

## 2. grep - Text Search (with Regex)
`grep` is the best practice ground for regex.

- **Basic Usage**:
  - `grep "login" app.log`: Find lines containing "login".
  - `grep -v "debug" app.log`: **Invert** search, remove lines containing "debug".
  - `grep -i "error" app.log`: Ignore case.

- **With Regex (add `-E` or use `egrep`)**:
  - `grep -E "^Error" app.log`: Only find lines starting with "Error".
  - `grep -E "[0-9]{3}" app.log`: Find lines containing 3 consecutive digits.

---

## 3. sed - Text Replacement and Modification (Stream Editor)
Don't be intimidated by `sed`; you only need to remember **one universal formula**.

### 💡 Universal Replacement Formula
```bash
sed -i 's/old_content/new_content/g' filename
```
*   **`-i`** (in-place): **Modify the file directly**. Without this, `sed` only prints the modified result to the screen (a safety net for beginners).
*   **`s`** (substitute): Indicates a "replacement" operation.
*   **`g`** (global): **Global replacement**. Without `g`, it only replaces the *first* occurrence found in each line.

### Common Scenarios
1.  **Modifying Config Files**:
    ```bash
    # Change "debug = true" to "debug = false" in config.conf
    sed -i 's/debug = true/debug = false/g' config.conf
    ```

2.  **Handling Paths (Separator Conflict)**:
    If the content contains `/` (like paths), using `/` as a separator will error. You can use `#` or `@` instead:
    ```bash
    # Change /var/www to /home/www
    sed -i 's#/var/www#/home/www#g' config.conf
    ```

3.  **Deleting Specific Lines (`d` mode)**:
    ```bash
    # Delete line 5
    sed -i '5d' file.txt
    
    # Delete all lines containing "password"
    sed -i '/password/d' file.txt
    
    # Delete all empty lines (with regex)
    sed -i '/^$/d' file.txt
    ```

---

## 4. awk - Data Extraction (Column Processing)
`sed` is good at modifying lines, `awk` is good at extracting columns.

- **Core Logic**: Defaults to splitting columns by Space/Tab. `$1` is the first column, `$2` is the second, `$0` is the entire line.
- **Scenarios**:
  ```bash
  # Assuming access.log format is: [IP] [Time] [URL]
  # 192.168.1.1 10:00 /index.html
  
  # View only IP (1st column)
  awk '{print $1}' access.log
  
  # View IP and URL (1st and 3rd columns)
  awk '{print $1, $3}' access.log
  ```

---

## 5. jq - JSON Data Processing
Essential for modern development. Suppose `data.json` is `{"name": "Gemini", "version": 1.5}`.

- `cat data.json | jq .`: Pretty-print output (with color and indentation).
- `cat data.json | jq '.name'`: Extract field, outputs `"Gemini"`.

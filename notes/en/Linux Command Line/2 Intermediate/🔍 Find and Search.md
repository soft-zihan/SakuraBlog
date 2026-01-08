### 1. find - Find Files
- `find . -name "*.txt"`: Search by filename (supports wildcards)
> 💡 **Pro Tip**: Try using **`fd`** instead of `find`; the syntax is simpler (`fd pattern`), it ignores `.gitignore` by default, and it's extremely fast.
- `find . -type f`: Find files only
- `find . -type d`: Find directories only
- `find . -size +10M`: Find files larger than 10MB
- `find . -mtime -7`: Find files modified in the last 7 days
- `find . -name "*.log" -exec rm {} \;`: Execute a command on search results (`{}` represents the file) – the essence of `find`.

### 2. locate - Fast File Lookup (Database-based)
- `locate file`: Quickly locate file path (requires running `updatedb` first)

### 3. which / whereis / type - Locate Command Position
- `which command`: Show path to the command's executable
- `whereis command`: Show binary, source, and manual page locations
- `type command`: Determine command source (built-in, external, alias, etc.), more accurate than `which`.

### 4. fzf - Fuzzy Search Masterpiece (Installation Required)
- `fzf`: Interactive command-line filtering tool; can be used with other commands for fuzzy searching (e.g., `ls | fzf` or `history | fzf`).

> **Note**: For text content searching (`grep`/`rg`), please refer to **`🧩 Text Processing and Regex.md`**.

# 📂 Daily File Management

This covers all basic file operations from viewing and creating to moving and deleting.

## 1. Viewing and Browsing (View)

### ls (List) - List directory contents
- `ls -l`: Display detailed information (permissions/owner/size/time)
> 💡 **Pro Tip**: Try using **`exa`** (or `eza`) as a replacement for `ls`, which supports Git status display, icons, and tree views.
- `ls -a`: Display all files (including hidden files starting with `.`)
- `ls -lh`: Use `-h` for human-readable format (KB/MB/GB)
- `ls -t`: Sort by modification time (use `-r` for reverse sort)

### cd (Change Directory) - Change directory
- `cd /path/to/dir`: Switch to the specified directory
> 💡 **Pro Tip**: Try using **`z`** or **`zoxide`** instead of `cd` for smart jumping (e.g., `z pro` -> `/home/user/projects`).
- `cd ..`: Go up one level
- `cd ~`: Return to home directory
- `cd -`: Return to the previous directory

### cat / head / tail - Content viewing
- `cat -n`: Display content with line numbers
> 💡 **Pro Tip**: Try using **`bat`** instead of `cat`, which supports syntax highlighting, automatic paging, and Git change markers.
- `head -n 20`: View the first 20 lines
- `tail -n 20`: View the last 20 lines
- `tail -f`: Track file appends in real-time (commonly used for logs)

### less - Paged viewing
- `less file`: Interactive paging (Space for next page, b for previous, / to search, q to exit). It's an upgrade from `more`.

### tree - Tree display
- `tree -L 2`: Show only the first 2 levels of the directory

---

## 2. Creating and Managing (Create & Manage)

### mkdir (Make Directory) - Create directory
- `mkdir -p`: Recursively create multi-level directories (e.g., `a/b/c`)

### touch - Create empty file
- `touch file.txt`: Create a new file or update the timestamp of an existing one

### cp (Copy) - Copy
- `cp -r`: Recursively copy an entire directory
- `cp -i`: Prompt before overwriting
- `cp -p`: Preserve file attributes (permissions/time) when copying

### mv (Move) - Move and rename
- `mv a.txt b.txt`: Rename a file
- `mv file /dir/`: Move a file to a specified directory

### rm (Remove) - Delete (⚠️ Use with caution)
- `rm -rf`: Force recursive deletion (no prompt)
- `rm -i`: Prompt before deletion

### ln (Link) - Link
- `ln -s source_file soft_link`: Create a symbolic link (like a shortcut)

---

## 3. Statistics and Attributes (Stats)

### wc (Word Count) - Text statistics
- `wc -l file.txt`: Count the number of lines in a file

### file - Identify file type
- `file my_script.sh`: Show the file type (e.g., "Bourne-Again shell script")

### stat - View metadata
- `stat file.txt`: Show full file information (Inode, permissions, 3 types of timestamps).

### diff - Compare differences
- `diff file1.txt file2.txt`: Compare two files line by line.
> 💡 **Pro Tip**: Try using **`delta`** instead of `diff`, it provides beautiful syntax highlighting and Git diff viewing experience.

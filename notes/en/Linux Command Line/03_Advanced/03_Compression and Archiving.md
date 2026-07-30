# 03 Compression and Archiving

## 1. `tar` — the universal key for archiving + compression

`tar` itself is an archiver (it bundles many files into one). With flags, it can invoke compression engines. `tar.gz` is common on Linux because it preserves file attributes and works well in scripts.

### Golden rule: remember `c` and `x`

- `c` (create): create an archive
- `x` (extract): extract an archive

### Common combos (worth memorizing)

- `tar -czvf project.tar.gz /path` (gzip)
  - Fast, decent compression. Common for source archives and logs.
- `tar -cjvf data.tar.bz2 /path` (bzip2)
  - Better compression than gzip, usually faster than xz.
- `tar -cJvf heavy_data.tar.xz /path` (xz)
  - Slower, but very high compression. Useful for large distribution packages.
- `tar -xvf any_file.tar.gz` (extract)
  - Tip: modern `tar` can often auto-detect compression; you may not need to specify `z` or `J`.
- `tar -tf file.tar.gz` (list)
  - Preview contents without extracting.
- `tar -xvf data.tar.gz -C /target/dir`
  - Extract into a specific directory.

### Flag notes

- `-f` (file): must be followed by the archive filename (often placed near the end).
- `-v` (verbose): print processed filenames.
- `-t` (list): list contents without extracting.
- `--exclude='pattern'`: exclude files/dirs when creating an archive.
  - Example: `tar -czvf app.tar.gz --exclude='node_modules' ./app`
- Extract a specific file without unpacking everything:
  - Example: `tar -xvf data.tar.gz path/to/target_file.txt`

---

## 2. `zip` / `unzip` — cross-platform favorite

When you need to send files to Windows users, ZIP is the safest format.

- `zip -r data.zip dir/`: `-r` is required for recursion.
- `unzip -l data.zip`: list contents without extracting.
- `unzip data.zip -d /target`: extract into a directory.

---

## 3. `gzip` / `bzip2` — compressing a single file

Use these when you don’t need archiving, only compressing a large single file (e.g., a `.sql` backup).

- `gzip large_file.sql`: compress to `.gz` (original disappears).
- `gunzip large_file.sql.gz`: decompress.
- `bzip2 file` / `bunzip2 file.bz2`: slightly better compression than gzip, but slower.

---

## 4. Choosing a format

| Scenario | Recommended | Why |
| :--- | :--- | :--- |
| Daily backups | `.tar.gz` | good balance of speed and size |
| Max space saving | `.tar.xz` | great for long-term cold archives |
| Send to Windows users | `.zip` | can be opened without extra tools |

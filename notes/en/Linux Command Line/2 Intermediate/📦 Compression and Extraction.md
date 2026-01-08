### 1. tar (Tape Archive) - Archiving Tool (Most Common)
- `tar -czvf file.tar.gz /path`: Pack and compress using gzip (c: create, z: gzip, v: verbose, f: filename)
- `tar -cjvf file.tar.bz2 /path`: Pack and compress using bzip2 (j: bzip2)
- `tar -cJvf file.tar.xz /path`: Pack and compress using xz (J: xz, higher compression ratio)
- `tar -xvf file.tar.gz`: Extract file (modern tar automatically identifies compression format; `z`/`j`/`J` can be omitted during extraction)
- `tar -tf file.tar.gz`: List contents without extracting (t: list)
- `-C /dir`: Can be used with extract/compress commands to specify working directory

### 2. zip / unzip - ZIP Format
- `zip -r data.zip dir/`: Recursively compress a directory
- `unzip data.zip`: Extract files
- `unzip -d /dir data.zip`: Extract to a specified directory

### 3. gzip / bzip2 - Single File Compression
- `gzip file`: Compress file (source file is replaced by .gz)
- `gunzip file.gz`: Decompress .gz file
- `bzip2 file` / `bunzip2 file.bz2`: Similar functionality for .bz2 files

### 1. chmod (Change Mode) - Modify permissions
- `chmod +x script.sh`: Grant executable permission
- `chmod 755 file`: Owner has all rights, others can read and execute
- `chmod 644 file`: Owner can read and write, others can only read
- `chmod -R`: Recursively modify permissions for all files in a directory

### 2. chown / chgrp - Modify ownership
- `chown user:group file`: Modify owner and group (Change Owner)
- `chgrp group file`: Modify group (Change Group)
- `chown -R`: Recursive modification

### 3. sudo / su - Elevation and switching
- `sudo command`: Execute command with root privileges (Superuser Do)
- `su - user`: Switch user and load their environment variables (Switch User)
- `sudo -i`: Switch directly to the root environment

### 4. useradd / usermod / userdel - User management
- `useradd name`: Create a new user
- `passwd name`: Set/modify password (Password)
- `userdel -r name`: Delete user and their home directory

### 5. id / whoami / groups - Identity query
- `id`: Display current user's UID, GID, and groups
- `whoami`: Display current username
- `groups`: Display all groups the current user belongs to

### 6. w / who / last - Login information
- `w` or `who`: Display which users are currently logged into the system.
- `last`: Display recent user login history.

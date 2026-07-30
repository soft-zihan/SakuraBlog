# 03 Permissions and Security

## 1. `chmod` (Change Mode) — understanding permission bits

Linux permissions are typically shown as three `rwx` groups:

- **User** (owner)
- **Group**
- **Others**

### Core idea 1: what `rwx` means for files vs directories

| Bit | For files | For directories | Value |
| :--- | :--- | :--- | :--- |
| **r** (read) | read file content | list filenames in the directory (`ls`) | **4** |
| **w** (write) | modify file content | create/delete entries in the directory (`touch`/`rm`) | **2** |
| **x** (execute) | run as a program/script | enter the directory (`cd`) | **1** |

### Core idea 2: numeric (octal) permissions

Permissions are computed by summing `r(4) + w(2) + x(1)`:

- `7` = 4+2+1 (`rwx`)
- `6` = 4+2 (`rw-`)
- `5` = 4+1 (`r-x`)

Example: `chmod 755` → user `7(rwx)`, group `5(r-x)`, others `5(r-x)`.

Common patterns:

- `chmod 755`: typical directory permissions
- `chmod 644`: typical file permissions
- `chmod 600`: private files (e.g., SSH keys), only the owner can read/write

#### Symbolic mode (often more intuitive)

- `chmod +x script.sh`: add execute permission (very common)
- `chmod u+w file`: add write permission for the owner
- `chmod g-r file`: remove read permission from the group
- `chmod a+x file`: add execute for everyone
- `chmod -R ...`: apply recursively to a directory tree

---

## 2. `chown` / `chgrp` — changing ownership

- `chown user:group file`: change both owner and group
- `chgrp group file`: change group only
- `chown -R user:group /dir`: recursive change

---

## 3. `root` / `sudo` / `su` — switching identity

### Root: the superuser

Linux has a superuser named **root**. It has unrestricted privileges and can delete anything. For safety, you should **not** log in as root for daily work.

### `sudo` (SuperUser DO)

When you need elevated permissions (e.g., installing packages), prefix commands with `sudo`:

- `sudo apt update`

Power trick: `sudo !!`  
If you ran a long command and got `Permission denied`, this re-runs the previous command with `sudo`.

### `su` vs `su -`

- `su user` (switch user): switches user but **keeps** the current environment.
  - Example: you stay in the same working directory, and your `PATH` might still be from the previous user.
- `su - user` (login shell): switches user and loads the target user’s **full login environment**.
  - Example: you jump to the target user’s home (`~`) and load their shell config. In production, prefer `su -` to avoid environment/path confusion.

### Recommended: `sudoedit`

Scenario: editing system files like `/etc/hosts`.

- It copies the file to a temporary location, opens it with your **current user’s editor configuration**, then writes it back with privileges.
- This is safer than `sudo vi ...` because it avoids running editor plugins as root (reducing risk from malicious scripts).
- It uses the `EDITOR` environment variable. For example: `export EDITOR=vim`.

---

## 4. User management and identity checks

- `sudo useradd -m username`: create a user and a home directory
- `passwd`: change the current user’s password
- `sudo passwd username`: admin changes another user’s password
- `sudo userdel -r username`: delete a user and their home directory
- `id`: show UID/GID and groups
- `whoami`: show current username
- `groups`: list groups for a user

---

## 5. Auditing and login info

- `w`: show who is logged in and what they are doing (live)
- `who`: list logged-in users
- `last -n 10`: show recent login records (useful for intrusion investigation)

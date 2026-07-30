# 04 Multi-language Environments and Package Management (Complete Guide)

## Outline

1. Choosing tools: classic standards vs modern fast tools
2. Python (general dev + AI)
   - Pip & venv (standard)
   - `uv` (modern, fast, all-in-one)
   - Conda / Mamba (AI/data stacks)
3. Node.js (frontend ecosystem)
   - Version managers: nvm vs fnm
   - Package managers: npm vs pnpm
4. Java (backend ecosystem)
   - SDKMAN!
   - Maven & Gradle
5. One tool for many languages: `mise`
6. Linux system package managers (ops/troubleshooting)

---

## 1. Tool choice: classic standard vs modern fast

| Area | Classic standard (stable/compatible) | Modern fast (better UX) | Recommendation |
| :--- | :--- | :--- | :--- |
| Node version | nvm (shell-based, slower startup) | fnm (Rust, very fast, cross-platform) | Personal: fnm. Team: support both. |
| Node packages | npm (ships with Node) | pnpm (hardlink/store, saves disk) | New projects: pnpm. Beginners: learn npm first. |
| Python env | pip + venv (built-in) | uv (fast, manages almost everything) | Prod/legacy: pip. Personal dev: uv. |
| AI/data | conda (feature-rich) | mamba (fast solver) | Prefer mamba for speed. |
| Java | manual env vars | SDKMAN! | Use SDKMAN! to avoid pain. |

---

## 2. Python: general development and AI

### 2.1 Pip & venv (official baseline)

Best for: servers and tutorials, minimal extra tooling.

```bash
# 1) Create a virtual environment (.venv folder)
python -m venv .venv

# 2) Activate
# macOS/Linux:
source .venv/bin/activate
# Windows:
.venv\\Scripts\\activate

# 3) Install dependencies
pip install -r requirements.txt
# or
pip install requests

# 4) Export dependencies
pip freeze > requirements.txt
```

### 2.2 `uv` (modern recommendation)

`uv` is a Rust tool that can replace `pip` (install), `venv` (env), and even help with Python downloads/locking.

```bash
# 1) Initialize a project
uv init --python 3.11

# 2) Add deps (fast concurrent downloads)
uv add requests
uv add --dev pytest

# 3) Lock and sync
uv sync

# 4) Export to requirements.txt for compatibility
uv pip compile pyproject.toml -o requirements.txt

# 5) Run commands (no manual source)
uv run main.py
```

### 2.3 Conda / Mamba (AI stacks)

For complex native dependencies (PyTorch/TensorFlow). Prefer **mamba** for faster dependency resolution.

```bash
mamba create -n ai_env python=3.10
mamba activate ai_env
mamba install pytorch torchvision -c pytorch
```

---

## 3. Node.js: frontend ecosystem

Node setup is split into:

- Runtime versions (Node itself)
- Libraries/tools (package manager + scripts)

### 3.1 Version management

#### nvm (classic)

```bash
nvm install node
nvm install 18.17.0
nvm use 18
nvm alias default 18
```

#### fnm (fast)

```bash
fnm use --install-if-missing 20
fnm env --use-on-cd | source
```

### 3.2 Package management

#### npm (baseline)

```bash
npm init -y

npm install axios
npm install -D typescript
npm install -g pm2

npm run dev
npm run build
npm run test
npm start

# Switch registry (example mirror)
npm config set registry https://registry.npmmirror.com
```

#### pnpm (efficient)

Uses a content-addressable store + links to save disk space.

```bash
npm install -g pnpm

pnpm install
pnpm add axios
pnpm add -D vite

pnpm dev
pnpm build
```

---

## 4. Java: backend ecosystem

### 4.1 SDKMAN! (version manager)

Manages JDKs and also tools like Maven/Gradle/Spring Boot CLI.

```bash
sdk list java
sdk install java 21.0.1-tem
sdk default java 17.0.9-tem
sdk use java 8.0.392-tem
```

### 4.2 Build tools

- Maven (classic):
  - `mvn clean package` (build jar under `target/`)
  - `mvn install` (install to local repo)
  - `mvn dependency:tree` (debug conflicts)
- Gradle (flexible):
  - `gradle build`
  - `gradle bootRun` (Spring Boot)

---

## 5. `mise` (multi-language one-stop manager)

If you’re full-stack and don’t want nvm + pyenv + sdkman separately, `mise` can manage multiple languages per project via `.mise.toml` and can understand `.nvmrc` / `.java-version`.

```bash
mise use node@20
mise use python@3.12
mise use java@temurin-17

mise ls

mise use -g node@lts
```

---

## 6. Linux system package managers (advanced)

Use these when you need system software (Nginx/Docker/Git) or when language-level tools are insufficient.

### 6.1 APT (Debian/Ubuntu) quick reference

```bash
apt search nginx

sudo apt install nginx
sudo apt remove nginx      # remove packages, keep config
sudo apt purge nginx       # remove packages + config

# Find which package provides a file (needs apt-file)
# sudo apt install apt-file && sudo apt-file update
apt-file search stdio.h

sudo apt-mark hold docker-ce

sudo apt install -f        # fix broken deps
```

### 6.2 DPKG (Debian/Ubuntu low-level)

```bash
dpkg -l | grep nginx
dpkg -L nginx-full
sudo dpkg -P nginx
```

### 6.3 Homebrew (on Linux)

Useful when you don’t have sudo but still want newer tools under your home directory:

```bash
brew install gcc node
```

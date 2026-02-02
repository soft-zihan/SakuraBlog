# 🧱 cgroups 与资源治理（systemd / 容器底层）

> **常见真实场景**：
> “服务时不时被 OOM kill，但机器还有内存；容器里 `top` 看起来很闲，实际请求却很慢；你想限制某个服务 CPU/内存，不想靠‘口头约束’。”

本章聚焦 cgroups v2 的**可用读法**与 systemd 的**可落地资源治理**，不写通用排障流程。

---

## 1. cgroups 是什么：把“资源”变成可控的账本

cgroups（control groups）解决的是三件事：
1. **限制**：最多给你多少 CPU/内存/IO/pids。
2. **隔离**：你的抖动不要拖垮别的服务。
3. **计量**：你到底用了多少资源、是否触发了 OOM/throttle。

现代发行版大多是 **cgroups v2**（统一层级、统一接口）。先确认你是哪一代：

```bash
stat -fc %T /sys/fs/cgroup
```

看到 `cgroup2fs` 一般就是 v2。

---

## 2. 先从 systemd 入手：你几乎一定已经在用 cgroups

systemd 会把服务放进 cgroup。你不需要“手写 cgroup”，先学会看：

```bash
systemd-cgls
systemd-cgtop
```

找到某个服务所在的 cgroup 路径：

```bash
systemctl status <service>
```

然后你就可以去读它的资源文件（v2）：

```bash
cat /sys/fs/cgroup/$(systemctl show -p ControlGroup --value <service>)/memory.current
```

---

## 3. cgroups v2 必会的几个文件（读懂就够用）

下面用 `<CG>` 代表某个 cgroup 路径（例如 `system.slice/nginx.service`）。

### 3.1 内存：current / max / events

```bash
cat /sys/fs/cgroup/<CG>/memory.current
cat /sys/fs/cgroup/<CG>/memory.max
cat /sys/fs/cgroup/<CG>/memory.events
```

你要重点看：
* `memory.current`：当前占用（字节）
* `memory.max`：上限（`max` 表示不限制）
* `memory.events`：是否发生过 `oom`、`oom_kill`、`high`（非常关键，能解释“为什么被杀”）

### 3.2 CPU：cpu.max（配额与周期）

```bash
cat /sys/fs/cgroup/<CG>/cpu.max
cat /sys/fs/cgroup/<CG>/cpu.stat
```

`cpu.max` 典型长这样：
* `max 100000`：不限额
* `50000 100000`：每 100ms 最多用 50ms CPU（等价 50% 单核）

`cpu.stat` 里常见的 `nr_throttled`/`throttled_usec` 可以用来判断“是不是被限到跑不动”。

### 3.3 进程数：pids.current / pids.max

```bash
cat /sys/fs/cgroup/<CG>/pids.current
cat /sys/fs/cgroup/<CG>/pids.max
```

如果 `pids.max` 太小，服务会表现出“偶发 fork/线程创建失败”，但日志不一定直说。

---

## 4. 用 systemd 直接做资源治理（最实用的落地方式）

### 4.1 临时调整：set-property

给某个服务限制内存与 CPU：

```bash
sudo systemctl set-property <service> MemoryMax=1G
sudo systemctl set-property <service> CPUQuota=50%
```

验证写没写进去：

```bash
systemctl show <service> -p MemoryMax -p CPUQuota -p ControlGroup
```

### 4.2 临时跑一个进程，并“顺手管起来”：systemd-run --scope

你想跑一个高消耗命令，但不想它把机器拖死：

```bash
sudo systemd-run --scope -p MemoryMax=2G -p CPUQuota=80% -- bash -c 'your-command'
```

这个能力在“临时压测/临时数据修复/大批量任务”场景非常好用。

---

## 5. 容器里怎么看 cgroups：不要被 `top` 误导

容器里 `top` 的“%CPU/内存”常常是容器视角，不等于宿主机全局。你至少要会读两件事：

容器进程属于哪个 cgroup：

```bash
cat /proc/1/cgroup
```

容器限制是多少（v2）：

```bash
cat /sys/fs/cgroup/memory.max
cat /sys/fs/cgroup/cpu.max
```

如果你看到 CPU/内存被限制，但应用没有做连接池/线程池/缓存的适配，性能会呈现“看起来资源还有，但请求慢”的典型症状。

---

## 6. 常见误区（非常值钱的“少踩坑”）

1. **“机器还有内存，为啥服务被 OOM kill？”**：可能是 cgroup 的 `memory.max` 触发了局部 OOM，去看 `memory.events`。
2. **“CPU 不是 100%，为什么跑不快？”**：可能被 `cpu.max`/`CPUQuota` throttle，去看 `cpu.stat` 的 throttled 指标。
3. **“只要会 Docker 就懂容器资源”**：Docker 只是接口，底层计量/限额依然是 cgroups，最终证据都在 `/sys/fs/cgroup`。


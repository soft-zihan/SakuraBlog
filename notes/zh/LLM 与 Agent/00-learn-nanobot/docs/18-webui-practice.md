# 18 - WebUI 实战

> **阅读时间**：约 1.5 小时  
> **前置知识**：[06 - 安装与上手](../06-install-and-hands-on/README.md)  
> **学习目标**：掌握 Nanobot WebUI 的配置、使用和核心功能

---

## 目录

- [18.1 WebUI 概述](#181-webui-概述)
- [18.2 配置启用 WebUI](#182-配置启用-webui)
- [18.3 启动与访问](#183-启动与访问)
- [18.4 核心功能详解](#184-核心功能详解)
- [18.5 WebUI vs CLI 对比](#185-webui-vs-cli-对比)
- [18.6 局域网访问配置](#186-局域网访问配置)
- [18.7 面试话术](#187-面试话术)

---

## 18.1 WebUI 概述

Nanobot 内置了 WebUI，通过 WebSocket channel 实现，无需额外安装。

**架构特点**：
- WebUI 打包在 published wheel 内，无额外构建步骤
- 基于 WebSocket 实时通信（`channels/websocket.py`，1179行）
- 支持流式输出、文件编辑实时显示、Thought/Response 时间线
- 默认端口 8765，与 Gateway health endpoint（18790）独立

---

## 18.2 配置启用 WebUI

在 `~/.nanobot/config.json` 中添加：

```json
{
  "channels": {
    "websocket": {
      "enabled": true
    }
  }
}
```

**完整配置示例**：

```json
{
  "channels": {
    "websocket": {
      "enabled": true,
      "host": "127.0.0.1",
      "port": 8765,
      "streaming": true
    }
  }
}
```

---

## 18.3 启动与访问

### 启动 Gateway

```bash
nanobot gateway
```

### 访问 WebUI

打开浏览器访问：

```
http://127.0.0.1:8765
```

> **注意**：Gateway 的 health endpoint 在 `gateway.port`（默认 18790），WebUI 在 WebSocket channel 的端口（默认 8765）。

---

## 18.4 核心功能详解

### 18.4.1 Thought/Response 时间线

WebUI 清晰展示 Agent 的思考过程：
- **Thought**：Agent 的推理步骤、工具调用决策
- **Response**：最终回复内容
- 实时流式显示，非等待完成后一次性展示

### 18.4.2 文件编辑活动实时显示

当 Agent 执行文件操作时：
- 实时显示文件编辑进度
- 显示文件状态变化
- 支持查看编辑历史

### 18.4.3 Model Switching

使用 `/model` 命令切换模型：
- 动态切换 Provider 和模型
- 无需重启 Gateway
- 基于 `modelPresets` 配置

### 18.4.4 Context Controls

- 查看当前上下文窗口使用情况
- 控制历史消息加载量
- 手动触发上下文压缩

### 18.4.5 Project Workspaces

- 多项目工作区管理
- 每个 workspace 独立的记忆和配置
- 工作区级别的访问控制

---

## 18.5 WebUI vs CLI 对比

| 特性 | WebUI | CLI |
|------|-------|-----|
| 启动命令 | `nanobot gateway` | `nanobot agent` |
| 实时流式 | ✅ 支持 | ✅ 支持 |
| 文件编辑可视化 | ✅ 实时显示 | ❌ 仅日志 |
| 多会话管理 | ✅ 支持 | ❌ 单会话 |
| Model 切换 | ✅ 可视化 | ✅ `/model` 命令 |
| 适合场景 | 日常使用、调试 | 快速测试、脚本集成 |

---

## 18.6 局域网访问配置

默认 WebUI 仅监听 `127.0.0.1`。要从其他设备访问：

```json
{
  "channels": {
    "websocket": {
      "enabled": true,
      "host": "0.0.0.0",
      "port": 8765
    }
  }
}
```

> ⚠️ **安全警告**：监听 `0.0.0.0` 会暴露到网络。建议配合 `token` 或 `allow_from` 使用。

**配置 Token 认证**：

```json
{
  "channels": {
    "websocket": {
      "enabled": true,
      "host": "0.0.0.0",
      "token": "your-secret-token",
      "websocket_requires_token": true
    }
  }
}
```

---

## 18.7 面试话术

### 话术：描述 Nanobot WebUI 架构

> "Nanobot 的 WebUI 是通过 WebSocket channel 实现的，打包在 published wheel 内，无需额外构建。核心架构是：Gateway 启动后，WebSocket channel 监听端口 8765，客户端通过 WebSocket 连接后，每个连接有独立的 session。WebUI 支持实时流式输出、文件编辑活动显示、Thought/Response 时间线、Model switching 等功能。相比 CLI，WebUI 更适合日常使用和调试，因为它提供了可视化的多会话管理和实时反馈。"

---

> **下一章**：[07 - 记忆系统实战](../07-memory-system/README.md)

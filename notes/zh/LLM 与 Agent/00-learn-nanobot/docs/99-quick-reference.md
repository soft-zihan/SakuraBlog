# 99 - 快速查询卡

> **用途**：快速查阅 Nanobot 常用命令、配置字段、文件路径、Provider/Channel 清单

---

## 目录

- [常用命令速查](#常用命令速查)
- [配置字段速查](#配置字段速查)
- [文件路径速查](#文件路径速查)
- [Provider 清单](#provider-清单)
- [Channel 清单](#channel-清单)
- [错误代码速查](#错误代码速查)

---

## 常用命令速查

| 命令 | 说明 | 示例 |
|------|------|------|
| `nanobot agent` | 启动交互代理 | `nanobot agent` |
| `nanobot agent -m "消息"` | 发送单条消息 | `nanobot agent -m "Hello!"` |
| `nanobot gateway` | 启动网关（含WebUI） | `nanobot gateway` |
| `nanobot gateway --verbose` | 详细日志模式 | `nanobot gateway -v` |
| `nanobot status` | 查看状态 | `nanobot status` |
| `nanobot onboard` | 配置向导 | `nanobot onboard --wizard` |
| `nanobot --version` | 查看版本 | `nanobot --version` |
| `nanobot --help` | 查看帮助 | `nanobot --help` |

---

## 配置字段速查

### 核心配置（`~/.nanobot/config.json`）

```json
{
  "providers": {
    "<provider_name>": {
      "apiKey": "${API_KEY}",
      "apiBase": "https://..."
    }
  },
  "modelPresets": {
    "<preset_name>": {
      "provider": "<provider_name>",
      "model": "<model_id>",
      "maxTokens": 8192,
      "contextWindowTokens": 65536,
      "temperature": 0.1
    }
  },
  "agents": {
    "defaults": {
      "modelPreset": "<preset_name>"
    }
  },
  "channels": {
    "<channel_name>": {
      "enabled": true
    }
  },
  "tools": {
    "mcpServers": {
      "<server_name>": {
        "command": "...",
        "args": ["..."]
      }
    }
  },
  "gateway": {
    "port": 18790,
    "heartbeat": {
      "enabled": true,
      "intervalS": 1800
    }
  }
}
```

### 关键字段说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `providers.<name>.apiKey` | string | - | API 密钥（支持 `${ENV}`） |
| `providers.<name>.apiBase` | string | - | API 端点（可选） |
| `modelPresets.<name>.provider` | string | - | Provider 名称 |
| `modelPresets.<name>.model` | string | - | 模型 ID |
| `modelPresets.<name>.maxTokens` | int | 8192 | 最大输出 token |
| `modelPresets.<name>.contextWindowTokens` | int | 65536 | 上下文窗口 |
| `agents.defaults.modelPreset` | string | - | 默认模型预设 |
| `channels.<name>.enabled` | bool | false | 启用通道 |
| `gateway.port` | int | 18790 | Health 端口 |
| `channels.websocket.port` | int | 8765 | WebUI 端口 |

---

## 文件路径速查

### 配置和 Workspace

| 文件 | 路径 | 说明 |
|------|------|------|
| 配置文件 | `~/.nanobot/config.json` | 主配置文件 |
| Workspace 根目录 | `~/.nanobot/workspace/` | 默认工作区 |
| AGENTS.md | `<workspace>/AGENTS.md` | Agent 身份定义 |
| SOUL.md | `<workspace>/SOUL.md` | 全局人格 |
| USER.md | `<workspace>/USER.md` | 用户画像 |

### 记忆系统

| 文件 | 路径 | 说明 |
|------|------|------|
| MEMORY.md | `<workspace>/memory/MEMORY.md` | 长期记忆 |
| history.jsonl | `<workspace>/memory/history.jsonl` | 会话历史（JSONL） |
| .cursor | `<workspace>/memory/.cursor` | 读取游标 |
| .dream_cursor | `<workspace>/memory/.dream_cursor` | Dream 游标 |

### 会话存储

| 文件 | 路径 | 说明 |
|------|------|------|
| 会话文件 | `<workspace>/sessions/<session_key>.jsonl` | 会话历史 |

### Skills

| 文件 | 路径 | 说明 |
|------|------|------|
| Skills 目录 | `<workspace>/skills/<skill_name>/` | 用户 Skills |
| SKILL.md | `<workspace>/skills/<skill_name>/SKILL.md` | Skill 定义 |

### Cron 和系统任务

| 文件 | 路径 | 说明 |
|------|------|------|
| Cron 任务 | `<workspace>/cron/jobs.json` | 定时任务 |

---

## Provider 清单

### 国际 Provider（12+）

| Provider | 配置名 | 代表模型 | 后端 |
|----------|--------|----------|------|
| OpenAI | `openai` | gpt-4o, gpt-5.5 | openai_compat |
| Anthropic | `anthropic` | claude-sonnet-4, claude-4.8 | anthropic |
| Gemini | `gemini` | gemini-3.1-pro, gemini-3.5-flash | openai_compat |
| Mistral | `mistral` | mistral-large | openai_compat |
| Groq | `groq` | llama-3, mixtral | openai_compat |
| OpenRouter | `openrouter` | 多模型路由 | openai_compat |
| HuggingFace | `huggingface` | 开源模型 | openai_compat |
| OpenAI Codex | `openai_codex` | codex | openai_codex (OAuth) |
| GitHub Copilot | `github_copilot` | copilot | github_copilot (OAuth) |
| Azure OpenAI | `azure_openai` | gpt-4 (Azure) | azure_openai |
| AWS Bedrock | `bedrock` | claude, llama | bedrock |
| NVIDIA NIM | `nim` | nim 模型 | openai_compat |

### 国内 Provider（10+）

| Provider | 配置名 | 代表模型 | 后端 |
|----------|--------|----------|------|
| DeepSeek | `deepseek` | deepseek-v4, deepseek-chat | openai_compat |
| DashScope | `dashscope` | qwen-max, qwen-plus | openai_compat |
| Zhipu | `zhipu` | glm-4, chatglm | openai_compat |
| Moonshot | `moonshot` | kimi-k2.5, kimi-k2.6 | openai_compat |
| MiniMax | `minimax` | minimax-01 | openai_compat |
| StepFun | `stepfun` | step-1 | openai_compat |
| Skywork | `skywork` | skywork-llm | openai_compat |
| LongCat | `longcat` | longcat-chat | openai_compat |
| Atomic Chat | `atomic` | atomic-model | openai_compat |
| VolcEngine | `volcengine` | 豆包 | openai_compat |

### 聚合 Provider（4+）

| Provider | 配置名 | 说明 |
|----------|--------|------|
| OpenRouter | `openrouter` | 聚合多 Provider |
| AiHubMix | `aihubmix` | 聚合 API |
| SiliconFlow | `siliconflow` | 硅基流动 |
| Novita | `novita` | Novita AI |

### 本地 Provider（3+）

| Provider | 配置名 | 说明 |
|----------|--------|------|
| Ollama | `ollama` | 本地模型 |
| vLLM | `custom` | 本地部署 |
| LM Studio | `custom` | 本地推理 |

---

## Channel 清单

### 国际平台（8）

| Channel | 配置名 | 说明 |
|---------|--------|------|
| Telegram | `telegram` | 个人/社群 |
| Discord | `discord` | 社区/游戏 |
| Slack | `slack` | 企业协作 |
| WhatsApp | `whatsapp` | 个人通讯 |
| Signal | `signal` | 加密通讯 |
| MSTeams | `msteams` | 企业协作 |
| Matrix | `matrix` | 去中心化通讯 |
| Email | `email` | 邮件 |

### 国内平台（5）

| Channel | 配置名 | 说明 |
|---------|--------|------|
| Feishu | `feishu` | 飞书（企业协作） |
| DingTalk | `dingtalk` | 钉钉（企业协作） |
| Weixin | `weixin` | 微信（个人/企业） |
| Wecom | `wecom` | 企业微信 |
| QQ | `qq` | QQ（个人/社群） |

### 其他平台（2）

| Channel | 配置名 | 说明 |
|---------|--------|------|
| Napcat | `napcat` | QQ 机器人框架 |
| MoChat | `mochat` | 微信机器人框架 |

### 通用通道（2）

| Channel | 配置名 | 说明 |
|---------|--------|------|
| WebSocket | `websocket` | WebUI（端口 8765） |
| CLI | `cli` | 命令行交互 |

---

## 错误代码速查

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `Authentication failed` | API Key 无效 | 检查 `apiKey` 配置 |
| `Model not found` | 模型 ID 错误 | 检查 `model` 字段 |
| `Connection timeout` | 网络问题 | 检查网络或使用代理 |
| `Environment variable not set` | 环境变量缺失 | 设置对应环境变量 |
| `Config file not found` | 配置文件不存在 | 运行 `nanobot onboard` |
| `Channel failed to start` | Channel 配置错误 | 检查 Channel 配置和凭证 |
| `Memory file corrupted` | 记忆文件损坏 | 备份后删除重建 |
| `Provider not configured` | Provider 未配置 | 在 `providers` 中添加配置 |

---

> **上一章**：[22 - 测试与可观测性](../22-testing-observability/README.md)

---

## 附录：版本信息

**文档版本**：v0.2.1  
**Nanobot 版本**：v0.2.1（截至 2026-06-17）  
**Python 版本**：≥ 3.11  
**最后更新**：2026-06-17

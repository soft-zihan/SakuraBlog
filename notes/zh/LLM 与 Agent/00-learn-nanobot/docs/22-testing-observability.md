# 22 - 测试与可观测性

> **阅读时间**：约 1.5 小时  
> **前置知识**：[06 - 安装与上手](../06-install-and-hands-on/README.md)、[20 - Gateway 与生产部署](../20-gateway-deploy/README.md)  
> **学习目标**：掌握 Nanobot 的日志分析、性能调优、错误排查

---

## 目录

- [22.1 日志系统](#221-日志系统)
- [22.2 Langfuse 可观测性](#222-langfuse-可观测性)
- [22.3 性能调优](#223-性能调优)
- [22.4 错误排查](#224-错误排查)
- [22.5 测试策略](#225-测试策略)

---

## 22.1 日志系统

### 日志格式

Nanobot 使用 loguru 日志库，默认格式：

```
2026-06-17 10:00:00 | INFO  | telegram | Message received from user_123
2026-06-17 10:00:01 | INFO  | agent    | Starting turn for session tg:123
2026-06-17 10:00:02 | INFO  | provider | Calling LLM: deepseek-chat
2026-06-17 10:00:05 | INFO  | agent    | Tool call: read_file(path="notes.md")
2026-06-17 10:00:06 | INFO  | agent    | Turn completed in 6.2s
```

### 启动详细日志

```bash
# 查看详细日志
nanobot gateway --verbose

# 或使用环境变量
NANOBOT_LOG_LEVEL=DEBUG nanobot gateway
```

### 日志分析技巧

```bash
# 查看最近错误
grep "ERROR" nanobot.log | tail -20

# 查看工具调用
grep "Tool call" nanobot.log | tail -50

# 查看 LLM 调用
grep "Calling LLM" nanobot.log | tail -20

# 统计响应时间
grep "Turn completed" nanobot.log | awk '{print $NF}'
```

---

## 22.2 Langfuse 可观测性

### 配置 Langfuse

```json
{
  "observability": {
    "langfuse": {
      "enabled": true
    }
  }
}
```

### 环境变量

```bash
export LANGFUSE_SECRET_KEY="sk-lf-xxx"
export LANGFUSE_PUBLIC_KEY="pk-lf-xxx"
export LANGFUSE_BASE_URL="https://cloud.langfuse.com"
```

### 查看指标

访问 Langfuse Dashboard：
- Token 使用量
- LLM 调用延迟
- 错误率
- 成本统计

---

## 22.3 性能调优

### Context Window 设置

```json
{
  "modelPresets": {
    "primary": {
      "contextWindowTokens": 65536
    }
  }
}
```

**调优建议**：
- 不要设置过大：会导致记忆压缩不触发，API 费用暴增
- 不要设置过小：会频繁压缩，丢失上下文
- 推荐值：模型实际窗口的 80%

### Token 估算

```python
# nanobot 内部使用 estimate_prompt_tokens_chain
# 估算整个 prompt 的 token 数

# 手动估算
# 1 个英文单词 ≈ 1.3 tokens
# 1 个中文字 ≈ 1.5 tokens
```

### AutoCompact 配置

```json
{
  "gateway": {
    "autoCompact": {
      "enabled": true,
      "threshold": 0.8
    }
  }
}
```

当上下文使用率超过 80% 时自动压缩。

---

## 22.4 错误排查

### Provider 连接失败

**症状**：日志显示 `Authentication failed`

**排查步骤**：
```bash
# 1. 检查 API Key
cat config.json | python -m json.tool | grep apiKey

# 2. 测试连接
curl -H "Authorization: Bearer sk-xxx" https://api.deepseek.com/v1/models

# 3. 检查环境变量
echo $DEEPSEEK_API_KEY
```

### Channel 启动失败

**症状**：Gateway 启动但某个 Channel 不可用

**排查步骤**：
```bash
# 1. 查看 Channel 状态
nanobot channels status

# 2. 查看详细日志
nanobot gateway --verbose 2>&1 | grep -i telegram

# 3. 检查配置
cat config.json | python -m json.tool | grep -A 5 telegram
```

### Memory 文件损坏

**症状**：Agent 启动时报错

**排查步骤**：
```bash
# 1. 检查文件格式
cat memory/history.jsonl | python -m json.tool

# 2. 查看 Dream cursor
cat memory/.dream_cursor

# 3. 修复（备份后删除损坏文件）
cp memory/history.jsonl memory/history.jsonl.bak
# 重新启动，nanobot 会自动重建
```

---

## 22.5 测试策略

### 单元测试

```bash
# 运行 nanobot 测试
cd nanobot
pytest tests/ -v
```

### 集成测试

```bash
# 1. 测试 CLI
nanobot agent -m "Hello!"

# 2. 测试 WebUI
curl http://127.0.0.1:8765

# 3. 测试 Health endpoint
curl http://127.0.0.1:18790/health
```

### 压力测试

```bash
# 并发发送消息
for i in {1..10}; do
  nanobot agent -m "Test message $i" &
done
wait
```

---

> **下一章**：[99 - 快速查询卡](../99-quick-reference/README.md)

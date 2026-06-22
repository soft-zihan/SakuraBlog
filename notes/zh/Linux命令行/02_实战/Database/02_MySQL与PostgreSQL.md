# 🔌 MySQL与PostgreSQL (Database - Server Connection)

---

## 1. MySQL / MariaDB：连接与常用命令

### 1.1 先记住：连接就是"四要素"

- 主机：`-h 127.0.0.1`（本机）或服务器 IP
- 端口：`-P 3306`（MySQL 默认）
- 用户：`-u root`（示例而已，生产不建议长期用 root）
- 密码：`-p`（让你交互式输入，别直接写进命令里）

如果你能把这 4 个点说清楚，基本就不会"莫名其妙连不上"。

### 1.2 连接（常用写法）

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p
```

退出交互（mysql 里）：

- 输入 `quit` 或 `exit`（最直观）
- `\q` 也可以
- 彻底退出通用法：`Ctrl + D`（EOF）
- 输入写了一半想取消：`Ctrl + C`

指定数据库：

```bash
mysql -h 127.0.0.1 -u root -p mydb
```

一条命令执行 SQL：

```bash
mysql -h 127.0.0.1 -u root -p -e "SHOW DATABASES;"
```

### 1.3 最常见的"连不上"排查顺序

1. 服务在不在：`ps aux | grep mysqld`
2. 端口监听没：`ss -tulpn | grep 3306`（见网络与远程章节）
3. 账号权限对不对：用户名/密码/权限
4. Host 写法：很多场景 `localhost` 会走 socket，`127.0.0.1` 走 TCP

#### 新手最常见报错（看到就知道怎么改）

- `Can't connect to MySQL server on 'xxx'`：服务没启动 / 端口没监听 / 网络不通
  - 先看：`ss -tulpn | grep 3306`
  - 如果是 Docker：`docker ps | grep mysql`
- `Access denied for user 'xxx'@'yyy'`：用户名/密码不对，或用户没权限
  - 先确认你用的账号是什么：`-u xxx`
  - 尝试换成正确的 host（很多时候 `localhost` 与 `127.0.0.1` 表现不同）
- `Unknown database 'mydb'`：数据库名写错或没创建
  - 先列出库：`mysql ... -e "SHOW DATABASES;"`

### 1.4 备份/恢复（必须会）

备份（导出 SQL）：

```bash
mysqldump -h 127.0.0.1 -u root -p mydb > mydb.sql
```

恢复（导入 SQL）：

```bash
mysql -h 127.0.0.1 -u root -p mydb < mydb.sql
```

---

## 2. PostgreSQL：psql 的高频用法

### 2.1 连接同样是"四要素"（只是命令不一样）

- 主机：`-h 127.0.0.1`
- 端口：`-p 5432`
- 用户：`-U postgres`（示例用户）
- 数据库：`-d mydb`（可选，不写就连默认库）

### 2.2 连接

```bash
psql -h 127.0.0.1 -p 5432 -U postgres
```

指定数据库：

```bash
psql -h 127.0.0.1 -p 5432 -U postgres -d mydb
```

### 2.3 psql 交互命令（非常常用）

```sql
\?
\l        -- 列出数据库
\c mydb   -- 连接数据库
\dt       -- 列出表
\d users  -- 看表结构
\q
```

退出/取消输入（psql 里）：

- 正常退出：`\q`
- 彻底退出通用法：`Ctrl + D`（EOF）
- 输入写了一半想取消：`Ctrl + C`

### 2.4 执行 SQL 文件

```bash
psql -h 127.0.0.1 -U postgres -d mydb -f init.sql
```

### 2.5 备份/恢复

纯 SQL 备份（简单、通用）：

```bash
pg_dump -h 127.0.0.1 -U postgres -d mydb > mydb.sql
psql -h 127.0.0.1 -U postgres -d mydb < mydb.sql
```

#### 新手最常见报错（psql）

- `could not connect to server`：服务没起来或端口不通
  - 先看：`ss -tulpn | grep 5432`
- `password authentication failed for user`：密码不对
  - 如果你用 Docker 起的 Postgres，确认容器环境变量 `POSTGRES_PASSWORD`
- `role "xxx" does not exist`：用户名不对（Postgres 用 role）
- `database "mydb" does not exist`：库不存在，换 `-d` 或先创建库

---

## 3. Docker 跑"临时数据库"（开发/学习最省事）

如果你不想在系统里装一堆服务，最常见做法是用 Docker 起一个本地数据库容器。

### 3.1 一次性跑一个 Postgres

```bash
docker run -d --name pg \
  -e POSTGRES_PASSWORD=pass \
  -p 5432:5432 \
  postgres:16
```

连接：

```bash
psql -h 127.0.0.1 -p 5432 -U postgres
```

### 3.2 一次性跑一个 MySQL

```bash
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=pass \
  -p 3306:3306 \
  mysql:8
```

连接：

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p
```

---

## 4. 安全底线（命令行最容易踩坑）

- **不要把密码写进命令历史**（例如直接在命令里拼接密码）。
- 优先使用：
  - 交互式输入 `-p` / `PGPASSWORD`（短期）/ `.pgpass`（更高级）
  - 环境变量集中管理（见环境变量章节）
- 备份文件是敏感数据：权限至少做到 `chmod 600`，不要随手上传公共仓库。

---

## 5. 最小 SQL 速记（够你"查数据/改一条"）

```sql
-- 查
SELECT * FROM users WHERE id = 1;

-- 插
INSERT INTO users(name) VALUES ('alice');

-- 改
UPDATE users SET name = 'bob' WHERE id = 1;

-- 删
DELETE FROM users WHERE id = 1;
```

---

## 6. PostgreSQL 高级技巧（进阶必备）

### 6.1 psql 高效快捷键

| 快捷键 | 功能 | 示例 |
|--------|------|------|
| `\l` | 列出所有数据库 | `\l` |
| `\c dbname` | 切换数据库 | `\c mydb` |
| `\dt` | 列出所有表 | `\dt` |
| `\d table` | 查看表结构 | `\d users` |
| `\di` | 列出索引 | `\di` |
| `\du` | 列出用户 | `\du` |
| `\df` | 列出函数 | `\df` |
| `\e` | 在编辑器中编辑 SQL | `\e` |
| `\timing` | 开启执行时间显示 | `\timing` |
| `\x` | 切换扩展显示模式 | `\x` |

### 6.2 PostgreSQL 独有的强大功能

**1. JSON/JSONB 支持**（NoSQL 能力）：

```sql
-- 创建 JSONB 列
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  data JSONB
);

-- 插入 JSON
INSERT INTO events(data) VALUES ('{"user": "alice", "action": "login"}');

-- 查询 JSON 字段
SELECT data->>'user' AS username FROM events;
SELECT * FROM events WHERE data->>'action' = 'login';

-- JSONB 支持索引（性能更好）
CREATE INDEX idx_events_data ON events USING GIN (data);
```

**2. 数组类型**：

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT,
  tags TEXT[]  -- 数组类型
);

INSERT INTO articles(title, tags) VALUES 
  ('SQL 教程', ARRAY['database', 'sql']);

-- 查询包含特定标签的文章
SELECT * FROM articles WHERE 'sql' = ANY(tags);
```

**3. 窗口函数**（PostgreSQL 支持最全面）：

```sql
-- 排名
SELECT 
  name,
  salary,
  RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- 移动平均
SELECT 
  date,
  price,
  AVG(price) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg
FROM stock_prices;
```

### 6.3 MySQL vs PostgreSQL 深度对比

| 特性 | MySQL | PostgreSQL |
|------|-------|------------|
| **设计哲学** | 简单易用，快速部署 | 功能强大，SQL 标准遵从 |
| **并发模型** | 线程池 | 多进程 |
| **事务隔离** | 支持 4 种 | 支持 4 种 + Serializable |
| **JSON 支持** | JSON 类型 | JSONB（二进制，更快） |
| **全文搜索** | 内置 | 需要插件/扩展 |
| **GIS 支持** | 基础 | PostGIS（业界最强） |
| **扩展性** | 插件有限 | 丰富的扩展生态 |
| **复制** | 主从/组复制 | 流复制/逻辑复制 |
| **适用场景** | Web 应用、CMS | 数据分析、复杂查询 |

**💡 来自 CSDN 的选型建议**：
> - 选 **MySQL**：快速搭建 Web 应用，团队熟悉 PHP/Java，需要成熟的生态
> - 选 **PostgreSQL**：需要复杂查询、数据分析、GIS、JSON 重度使用
> - 选 **SQLite**：零配置、开发测试、单用户应用、嵌入式

---

## 7. 安全与权限管理（生产必备）

### 7.1 MySQL 用户与权限

```sql
-- 创建用户
CREATE USER 'app_user'@'%' IDENTIFIED BY 'strong_password';

-- 授权（最小权限原则）
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'app_user'@'%';

-- 刷新权限
FLUSH PRIVILEGES;

-- 查看用户权限
SHOW GRANTS FOR 'app_user'@'%';

-- 撤销权限
REVOKE DELETE ON mydb.* FROM 'app_user'@'%';
```

**常用权限**：
- `SELECT`：查询
- `INSERT`：插入
- `UPDATE`：更新
- `DELETE`：删除
- `CREATE`：建表
- `DROP`：删表
- `ALL PRIVILEGES`：所有权限（慎用！）

### 7.2 PostgreSQL 角色与权限

```sql
-- 创建角色（用户）
CREATE ROLE app_user WITH LOGIN PASSWORD 'strong_password';

-- 授权
GRANT CONNECT ON DATABASE mydb TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- 查看权限
\dp  -- 列出表权限
\du  -- 列出角色

-- 撤销权限
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM app_user;
```

### 7.3 安全最佳实践

1. **绝不使用 root/postgres 运行应用**
2. **最小权限原则**：只给需要的权限
3. **强密码策略**：至少 12 位，包含大小写+数字+符号
4. **限制访问 IP**：
   - MySQL：`CREATE USER 'app'@'192.168.1.%' IDENTIFIED BY 'pass';`
   - PostgreSQL：在 `pg_hba.conf` 中配置
5. **加密连接**：使用 SSL/TLS
6. **定期审计**：检查用户权限和登录日志

---

## 8. 性能监控与调优

### 8.1 MySQL 性能监控

```sql
-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query_log%';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询（临时）
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- 2秒以上的查询

-- 查看当前连接
SHOW PROCESSLIST;

-- 查看表大小
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'mydb'
ORDER BY (data_length + index_length) DESC;

-- 查看索引使用情况
SHOW INDEX FROM orders;
```

### 8.2 PostgreSQL 性能监控

```sql
-- 开启执行时间统计
\timing

-- 查看慢查询（需要开启 pg_stat_statements）
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 查看表大小
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public';

-- 查看当前连接
SELECT * FROM pg_stat_activity;

-- 查看索引使用情况
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### 8.3 通用优化建议

1. **使用连接池**：避免频繁创建/销毁连接
   - MySQL：ProxySQL, MyBatis 连接池
   - PostgreSQL：PgBouncer, HikariCP

2. **合理配置缓存**：
   - MySQL：`innodb_buffer_pool_size`（建议物理内存的 50-70%）
   - PostgreSQL：`shared_buffers`（建议物理内存的 25%）

3. **定期维护**：
   - MySQL：`ANALYZE TABLE`, `OPTIMIZE TABLE`
   - PostgreSQL：`VACUUM ANALYZE`

4. **避免 N+1 查询问题**：使用 JOIN 或批量查询

---

## 9. Docker 高级用法（开发/测试）

### 9.1 Docker Compose 一键启动

创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: pass123
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: pass123
      MYSQL_DATABASE: mydb
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  pg_data:
  mysql_data:
```

启动：
```bash
docker-compose up -d
```

### 9.2 数据持久化与备份

```bash
# 备份 PostgreSQL
docker exec -t pg pg_dump -U admin mydb > backup.sql

# 恢复 PostgreSQL
docker exec -i pg psql -U admin mydb < backup.sql

# 备份 MySQL
docker exec -t mysql mysqldump -u root -ppass123 mydb > backup.sql

# 恢复 MySQL
docker exec -i mysql mysql -u root -ppass123 mydb < backup.sql
```

---

## 10. 练习题（附答案）

### 练习 1：创建完整的数据库用户

为应用创建一个只拥有必要权限的用户。

<details>
<summary>点击查看答案（PostgreSQL）</summary>

```sql
-- 创建角色
CREATE ROLE app_user WITH LOGIN PASSWORD 'SecurePass123!';

-- 授予数据库连接权限
GRANT CONNECT ON DATABASE mydb TO app_user;

-- 授予 schema 使用权限
GRANT USAGE ON SCHEMA public TO app_user;

-- 授予 CRUD 权限
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- 授予序列权限（用于自增 ID）
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
```
</details>

### 练习 2：监控慢查询

找出执行时间超过 2 秒的查询。

<details>
<summary>点击查看答案（MySQL）</summary>

```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 查看慢查询日志位置
SHOW VARIABLES LIKE 'slow_query_log_file';

-- 分析慢查询（在命令行执行）
# mysqldumpslow /var/log/mysql/slow.log
```
</details>

### 练习 3：JSON 查询实战

在 PostgreSQL 中查询 JSONB 数据。

<details>
<summary>点击查看答案</summary>

```sql
-- 查询包含特定键的记录
SELECT * FROM events WHERE data ? 'user';

-- 查询 JSON 数组中的元素
SELECT * FROM events WHERE data->'tags' ? 'sql';

-- 更新 JSON 字段
UPDATE events 
SET data = jsonb_set(data, '{status}', '"completed"')
WHERE id = 1;
```
</details>

---

## 参考资料

- 📚 [MySQL 官方文档](https://dev.mysql.com/doc/)
- 📚 [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- 💡 [知乎 - MySQL 常用命令速查表](https://zhuanlan.zhihu.com/p/442434220)
- 💡 [开发笔记 - PostgreSQL 常用命令速查表](https://notes.junorz.com/docs/others/cheatsheet/postgres)
- 💡 [CSDN - SQLite vs MySQL 终极指南](https://blog.csdn.net/j2k3l4/article/details/154807174)
- 🎓 [JavaGuide - MySQL 执行计划分析](https://javaguide.cn/database/mysql/mysql-query-execution-plan.html)

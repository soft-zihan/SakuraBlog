# 🚀 SQL进阶与优化 (Database - Advanced SQL & Optimization)

---

## 1. 复杂查询组合（从 Join 到窗口函数）

如果你是第一次学多表查询，建议按这个顺序练：

1. 先跑通 **1.1 Join**（把表拼起来）
2. 再跑通 **1.2 聚合**（做统计）
3. **1.3 子查询** 与 **1.4 CTE** 选一个学会即可（CTE 更好读）
4. **1.5 窗口函数** 是进阶内容，看得晕就先跳过，不影响你解决日常问题

### 1.1 Join：把多张表拼起来

查每个订单是谁下的、买了什么、买了多少、单价多少：

```sql
SELECT
  o.id AS order_id,
  u.name AS user_name,
  p.name AS product_name,
  oi.qty,
  p.price,
  oi.qty * p.price AS line_amount
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
ORDER BY o.id, p.id;
```

**LEFT JOIN**：保留左表全部行（哪怕右表没有匹配）。

```sql
SELECT
  u.id,
  u.name,
  COUNT(o.id) AS orders_cnt
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY orders_cnt DESC;
```

### 1.2 聚合：GROUP BY + HAVING（过滤"组"）

统计每个用户的已支付总金额（订单明细汇总）：

```sql
SELECT
  u.id,
  u.name,
  SUM(oi.qty * p.price) AS paid_amount
FROM users u
JOIN orders o ON o.user_id = u.id AND o.status = 'paid'
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
GROUP BY u.id, u.name
ORDER BY paid_amount DESC;
```

只保留消费 >= 200 的用户（用 HAVING）：

```sql
SELECT
  u.id,
  u.name,
  SUM(oi.qty * p.price) AS paid_amount
FROM users u
JOIN orders o ON o.user_id = u.id AND o.status = 'paid'
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
GROUP BY u.id, u.name
HAVING SUM(oi.qty * p.price) >= 200
ORDER BY paid_amount DESC;
```

### 1.3 子查询：先算一个中间结果，再去过滤

找"至少买过一次 monitor 的用户"：

```sql
SELECT *
FROM users
WHERE id IN (
  SELECT DISTINCT o.user_id
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE oi.product_id = 3
);
```

### 1.4 CTE（WITH）：把查询拆成可读的两段

每个订单的金额（先算每单，再关联用户）：

```sql
WITH order_amount AS (
  SELECT
    o.id AS order_id,
    o.user_id,
    SUM(oi.qty * p.price) AS amount
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.id = oi.product_id
  GROUP BY o.id, o.user_id
)
SELECT
  oa.order_id,
  u.name,
  oa.amount
FROM order_amount oa
JOIN users u ON u.id = oa.user_id
ORDER BY oa.amount DESC;
```

### 1.5 窗口函数：不丢明细的"高级统计"（进阶，可跳过）

给每个用户的订单按金额排名（同一个 user 内部排名）：

```sql
WITH order_amount AS (
  SELECT
    o.id AS order_id,
    o.user_id,
    SUM(oi.qty * p.price) AS amount
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.id = oi.product_id
  GROUP BY o.id, o.user_id
)
SELECT
  order_id,
  user_id,
  amount,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY amount DESC) AS rn
FROM order_amount
ORDER BY user_id, rn;
```

只取每个用户金额最大的那一单（Top 1 per group）：

```sql
WITH ranked AS (
  WITH order_amount AS (
    SELECT
      o.id AS order_id,
      o.user_id,
      SUM(oi.qty * p.price) AS amount
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    GROUP BY o.id, o.user_id
  )
  SELECT
    order_id,
    user_id,
    amount,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY amount DESC) AS rn
  FROM order_amount
)
SELECT * FROM ranked WHERE rn = 1 ORDER BY amount DESC;
```

---

## 2. 索引与性能（让"复杂查询"跑得动）

### 2.1 索引是什么（一句话）

索引是"按某些列建立的有序结构"，本质是用空间换时间。

### 2.2 什么时候该加索引

- `WHERE` 里经常筛选的列（例如 `orders.user_id`, `orders.created_at`）
- `JOIN` 的连接键（例如 `order_items.order_id`, `order_items.product_id`）
- `ORDER BY` / `GROUP BY` 常用列（视情况）

示例（SQLite / Postgres / MySQL 都类似）：

```sql
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
```

### 2.3 EXPLAIN：别猜，直接看执行计划

- SQLite：`EXPLAIN QUERY PLAN ...`

```sql
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC;
```

- Postgres：`EXPLAIN (ANALYZE, BUFFERS) ...`
- MySQL：`EXPLAIN ...`

### 2.4 性能常见坑

- **对索引列做函数/计算**，容易导致索引失效：`WHERE date(created_at)=...`
- **OR 过多** 可能让优化器放弃索引（可改成 UNION/改写条件）
- **大分页**（OFFSET 很大）会越来越慢：更推荐"基于游标"的翻页（按 id/时间推进）

---

## 3. 事务（保证"要么都成功，要么都失败"）

### 3.1 三板斧：BEGIN / COMMIT / ROLLBACK

```sql
BEGIN;
UPDATE users SET city = 'shenzhen' WHERE id = 1;
UPDATE orders SET status = 'refund' WHERE id = 101;
ROLLBACK;
```

把 ROLLBACK 改成 COMMIT 就会落盘。

### 3.2 命令行做危险操作的"安全姿势"

- **先 SELECT 再 UPDATE/DELETE**（同一套 WHERE 条件）
- 能开事务就开事务：先改、再检查、最后提交
- 不要在事务里思考人生：事务打开越久，锁占用越久，越容易把别人（或生产）卡死

```sql
BEGIN;
SELECT * FROM orders WHERE status = 'paid' AND created_at < '2026-02-01';
-- 确认无误再执行
DELETE FROM orders WHERE status = 'paid' AND created_at < '2026-02-01';
ROLLBACK;
```

---

## 4. 导入导出进阶（比"复制粘贴"靠谱很多）

### 4.1 Postgres：\copy（客户端侧导入导出，最常用）

```sql
\copy (SELECT * FROM users) TO 'users.csv' WITH (FORMAT csv, HEADER true);
\copy users FROM 'users.csv' WITH (FORMAT csv, HEADER true);
```

### 4.2 MySQL：批量导出查询结果（脚本友好）

```bash
mysql -h 127.0.0.1 -u root -p --batch --raw -e "SELECT id,name FROM users;" mydb > users.tsv
```

---

## 5. 练习题（写完这些就不"简陋"了）

1. 查出每个城市的用户数，过滤掉用户数 < 2 的城市。
2. 查出每个用户消费最高的一笔订单金额（用窗口函数）。
3. 查出"买过 mouse 但没买过 keyboard"的用户。
4. 把每个订单的明细按商品名拼成一行（提示：聚合字符串；不同数据库函数不同）。

答案参考的查阅关键词（不同数据库函数名不同，建议按关键词搜索）：

- 字符串聚合：`SQL string aggregation`
- MySQL / SQLite：`GROUP_CONCAT`
- PostgreSQL：`STRING_AGG`、`ARRAY_AGG`、`JSON_AGG`
- 也可补充搜索：`listagg`（一些数据库/资料会用这个关键词）

---

## 6. 小白通关清单（照这个做，保证你能看懂）

### 6.1 你至少要做到的 5 件事

1. 能用 SQLite 建一个数据库文件（`demo.db`）
2. 能建表、插入数据、查出来
3. 能理解 WHERE/ORDER BY/LIMIT 在干什么
4. 能跑通一次 Join（把订单和用户拼起来）
5. 能做一次聚合统计（SUM/COUNT + GROUP BY）

### 6.2 推荐练习顺序（每一步都能看到"结果"）

1. 先做 SQLite入门 的快速上手部分
2. 把 SQL查询基础 的建表与数据保存成 `init.sql`，然后一键初始化
   ```bash
   sqlite3 demo.db < init.sql
   ```
3. 跑通 1.1（Join）与 1.2（聚合）
4. 觉得顺了再回头看 2/3（索引/事务），这些是"让你少踩坑"的

### 6.3 你会遇到的"正常现象"

- 刚开始写 SQL 很慢：正常，先把模板背熟（第 1 节）
- Join 写错：正常，先用最简单的两表 Join 练，再加第三张表
- 看到窗口函数发懵：正常，先跳过 1.5，不影响你解决大多数工作问题

---

## 7. 窗口函数完全指南（进阶必学）

### 7.1 窗口函数 vs GROUP BY

**关键区别**：
- `GROUP BY`：聚合后**减少行数**（每组一行）
- 窗口函数：聚合后**保留所有行**（每行都有聚合值）

```sql
-- GROUP BY：每组一行
SELECT user_id, SUM(amount) AS total
FROM orders
GROUP BY user_id;
-- 结果：3行（3个用户）

-- 窗口函数：保留所有行
SELECT 
  id,
  user_id,
  amount,
  SUM(amount) OVER (PARTITION BY user_id) AS user_total
FROM orders;
-- 结果：所有订单行，每行都有该用户的总消费
```

### 7.2 窗口函数分类

**1. 排名函数**：

| 函数 | 说明 | 示例结果 |
|------|------|----------|
| `ROW_NUMBER()` | 唯一行号（1,2,3,4） | 不重复 |
| `RANK()` | 排名（1,2,2,4） | 跳过重复 |
| `DENSE_RANK()` | 密集排名（1,2,2,3） | 不跳过 |
| `NTILE(n)` | 分成 n 组 | 1,1,2,2,3,3 |

```sql
SELECT 
  name,
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
  RANK() OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;
```

**2. 聚合函数作为窗口函数**：

```sql
SELECT 
  date,
  price,
  AVG(price) OVER (ORDER BY date) AS running_avg,  -- 移动平均
  SUM(price) OVER (ORDER BY date) AS running_sum,   -- 累计求和
  COUNT(*) OVER (ORDER BY date) AS running_count    -- 累计计数
FROM stock_prices;
```

**3. 值函数**：

```sql
SELECT 
  order_id,
  user_id,
  amount,
  LAG(amount, 1) OVER (PARTITION BY user_id ORDER BY date) AS prev_amount,  -- 上一个值
  LEAD(amount, 1) OVER (PARTITION BY user_id ORDER BY date) AS next_amount, -- 下一个值
  FIRST_VALUE(amount) OVER (PARTITION BY user_id ORDER BY date) AS first_amount,
  LAST_VALUE(amount) OVER (PARTITION BY user_id ORDER BY date 
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_amount
FROM orders;
```

### 7.3 窗口框架（ROWS / RANGE）

```sql
-- 移动平均：最近7天的平均值
SELECT 
  date,
  price,
  AVG(price) OVER (
    ORDER BY date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d
FROM stock_prices;

-- 累计求和：从开始到现在
SELECT 
  date,
  amount,
  SUM(amount) OVER (
    ORDER BY date 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM daily_sales;
```

**框架选项**：
- `ROWS BETWEEN ... AND ...`：按物理行数
- `RANGE BETWEEN ... AND ...`：按值的范围
- `UNBOUNDED PRECEDING`：从第一行开始
- `UNBOUNDED FOLLOWING`：到最后一行结束
- `CURRENT ROW`：当前行
- `n PRECEDING`：前 n 行
- `n FOLLOWING`：后 n 行

### 7.4 窗口函数实战案例

**案例 1：找出每个部门工资前 3 的员工**

```sql
WITH ranked AS (
  SELECT 
    name,
    department,
    salary,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
  FROM employees
)
SELECT * FROM ranked WHERE rank <= 3;
```

**案例 2：计算同比增长率**

```sql
SELECT 
  year,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY year) AS prev_year_revenue,
  ROUND(
    (revenue - LAG(revenue, 1) OVER (ORDER BY year)) * 100.0 / 
    LAG(revenue, 1) OVER (ORDER BY year), 
    2
  ) AS yoy_growth_pct
FROM annual_revenue;
```

**案例 3：连续登录问题**

```sql
-- 找出连续登录 3 天以上的用户
WITH login_groups AS (
  SELECT 
    user_id,
    login_date,
    -- 关键技巧：日期 - 行号 = 连续组的标识
    DATE(login_date, '-' || 
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) || ' days') AS grp
  FROM logins
)
SELECT user_id, COUNT(*) AS consecutive_days
FROM login_groups
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;
```

---

## 8. EXPLAIN 执行计划完全指南

### 8.1 为什么要看执行计划？

**💡 来自 JavaGuide 的解释**：
> 执行计划是指一条 SQL 语句在经过数据库查询优化器的优化后，具体的执行方式。通过 EXPLAIN 的结果，可以了解到数据库是如何执行你的 SQL 的，从而找到性能瓶颈。

### 8.2 MySQL EXPLAIN 详解

```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC;
```

**关键字段解读**：

| 字段 | 说明 | 好的值 | 差的值 |
|------|------|--------|--------|
| `type` | 访问类型 | `const`, `ref`, `range` | `ALL`, `index` |
| `possible_keys` | 可能使用的索引 | 有索引 | `NULL` |
| `key` | 实际使用的索引 | 使用了索引 | `NULL` |
| `rows` | 预估扫描行数 | 少 | 多 |
| `Extra` | 额外信息 | `Using index` | `Using filesort`, `Using temporary` |

**type 性能排序**（从好到差）：
```
system > const > eq_ref > ref > range > index > ALL
```

**案例对比**：

```sql
-- ❌ 差：全表扫描（type=ALL）
EXPLAIN SELECT * FROM orders WHERE user_id = 1;
-- 结果：type=ALL, rows=10000, key=NULL

-- ✅ 好：索引扫描（type=ref）
CREATE INDEX idx_orders_user_id ON orders(user_id);
EXPLAIN SELECT * FROM orders WHERE user_id = 1;
-- 结果：type=ref, rows=10, key=idx_orders_user_id
```

### 8.3 PostgreSQL EXPLAIN

```sql
-- 基础版
EXPLAIN SELECT * FROM orders WHERE user_id = 1;

-- 详细版（推荐）
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) 
SELECT * FROM orders WHERE user_id = 1;
```

**关键指标**：
- `Seq Scan`：全表扫描（慢）
- `Index Scan`：索引扫描（快）
- `Index Only Scan`：只用索引（最快）
- `Bitmap Heap Scan`：位图扫描（中等）

### 8.4 SQLite EXPLAIN

```sql
-- SQLite 使用不同的语法
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC;
```

**输出示例**：
```
SEARCH orders USING INDEX idx_orders_user_id (user_id=?)
USE TEMP B-TREE FOR ORDER BY
```

---

## 9. 索引优化实战（性能提升10-100倍）

### 9.1 索引类型

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| `B-Tree` | 默认类型，平衡树 | 等值查询、范围查询 |
| `Hash` | 哈希索引 | 仅等值查询（MySQL Memory） |
| `FULLTEXT` | 全文索引 | 文本搜索 |
| `GIN` | 倒排索引 | PostgreSQL JSONB/数组 |
| `GiST` | 通用搜索树 | PostgreSQL GIS |

### 9.2 什么时候创建索引？

**✅ 应该加索引的场景**：
1. `WHERE` 条件中的列
2. `JOIN` 连接键
3. `ORDER BY` / `GROUP BY` 的列
4. `UNIQUE` 约束的列（自动创建）
5. 外键列

**❌ 不要加索引的场景**：
1. 低基数列（如性别：只有男/女）
2. 频繁更新的列
3. 很小的表（< 1000 行）
4. `TEXT` / `BLOB` 列（除非前缀索引）

### 9.3 复合索引（多列索引）

**最左前缀原则**：

```sql
-- 创建复合索引
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- ✅ 使用索引
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM orders WHERE user_id = 1 AND status = 'paid';

-- ❌ 不使用索引（违反最左前缀）
SELECT * FROM orders WHERE status = 'paid';
```

**列顺序原则**：
- 选择性高的列放前面（区分度大）
- 等值查询的列放范围查询前面

```sql
-- ✅ 好：等值 + 范围
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- ❌ 差：范围 + 等值
CREATE INDEX idx_orders_date_user ON orders(created_at, user_id);
```

### 9.4 覆盖索引（Covering Index）

**概念**：索引包含查询所需的所有列，无需回表。

```sql
-- 创建覆盖索引
CREATE INDEX idx_orders_covering ON orders(user_id, status, created_at);

-- 查询只需扫描索引
SELECT user_id, status, created_at FROM orders WHERE user_id = 1;
```

**MySQL 中查看**：
```
Extra: Using index  -- 表示使用了覆盖索引
```

### 9.5 索引失效场景

**1. 对索引列使用函数**：
```sql
-- ❌ 失效
SELECT * FROM orders WHERE DATE(created_at) = '2026-01-01';

-- ✅ 有效
SELECT * FROM orders WHERE created_at >= '2026-01-01' AND created_at < '2026-01-02';
```

**2. 隐式类型转换**：
```sql
-- ❌ 失效（phone 是 VARCHAR）
SELECT * FROM users WHERE phone = 13800138000;

-- ✅ 有效
SELECT * FROM users WHERE phone = '13800138000';
```

**3. LIKE 前缀通配符**：
```sql
-- ❌ 失效
SELECT * FROM products WHERE name LIKE '%phone%';

-- ✅ 有效
SELECT * FROM products WHERE name LIKE 'phone%';
```

**4. OR 条件**：
```sql
-- ❌ 可能失效
SELECT * FROM orders WHERE user_id = 1 OR status = 'paid';

-- ✅ 改写为 UNION
SELECT * FROM orders WHERE user_id = 1
UNION
SELECT * FROM orders WHERE status = 'paid';
```

**5. NOT / != / <>**：
```sql
-- ❌ 失效
SELECT * FROM orders WHERE status != 'paid';

-- ✅ 改写为 IN
SELECT * FROM orders WHERE status IN ('pending', 'refunded', 'cancelled');
```

---

## 10. 性能优化实战案例

### 10.1 大分页优化

**问题**：`OFFSET` 越大越慢。

```sql
-- ❌ 慢：扫描前 100000 行后丢弃
SELECT * FROM orders ORDER BY id DESC LIMIT 10 OFFSET 100000;

-- ✅ 快：基于游标（Keyset Pagination）
SELECT * FROM orders 
WHERE id < 90000  -- 上一页最后一个 ID
ORDER BY id DESC 
LIMIT 10;
```

### 10.2 N+1 查询问题

**问题**：循环查询导致性能灾难。

```python
# ❌ N+1 查询（Python 示例）
orders = db.query("SELECT * FROM orders LIMIT 100")
for order in orders:
    user = db.query("SELECT * FROM users WHERE id = ?", order.user_id)
    # 101次查询！

# ✅ JOIN 一次查询
results = db.query("""
    SELECT o.*, u.name 
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    LIMIT 100
""")
```

### 10.3 批量操作优化

```sql
-- ❌ 慢：逐条插入
INSERT INTO users(name) VALUES ('alice');
INSERT INTO users(name) VALUES ('bob');
INSERT INTO users(name) VALUES ('cathy');

-- ✅ 快：批量插入
INSERT INTO users(name) VALUES ('alice'), ('bob'), ('cathy');

-- ✅ 快：事务批量
BEGIN;
INSERT INTO users(name) VALUES ('alice');
INSERT INTO users(name) VALUES ('bob');
INSERT INTO users(name) VALUES ('cathy');
COMMIT;
```

### 10.4 查询重写优化

**案例：EXISTS vs IN**

```sql
-- ❌ 慢：IN 子查询（大表）
SELECT * FROM orders 
WHERE user_id IN (SELECT id FROM users WHERE city = 'shanghai');

-- ✅ 快：EXISTS
SELECT * FROM orders o
WHERE EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = o.user_id AND u.city = 'shanghai'
);

-- ✅ 快：JOIN
SELECT DISTINCT o.*
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.city = 'shanghai';
```

---

## 11. LeetCode 风格进阶练习题

### 练习 1：排名第 N 高的薪水（LeetCode 177）

使用窗口函数找出第 N 高的薪水。

<details>
<summary>点击查看答案</summary>

```sql
-- 方法1：窗口函数
WITH ranked AS (
  SELECT 
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS rank
  FROM employees
)
SELECT DISTINCT salary AS NthHighestSalary
FROM ranked
WHERE rank = N;

-- 方法2：LIMIT/OFFSET
SELECT DISTINCT salary AS NthHighestSalary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET N-1;
```
</details>

### 练习 2：分数排名（LeetCode 178）

对分数进行排名，相同分数排名相同。

<details>
<summary>点击查看答案</summary>

```sql
SELECT 
  score,
  DENSE_RANK() OVER (ORDER BY score DESC) AS "rank"
FROM scores
ORDER BY score DESC;
```
</details>

### 练习 3：连续出现的数字（LeetCode 180）

找出至少连续出现 3 次的数字。

<details>
<summary>点击查看答案</summary>

```sql
WITH numbered AS (
  SELECT 
    num,
    id - ROW_NUMBER() OVER (PARTITION BY num ORDER BY id) AS grp
  FROM logs
)
SELECT DISTINCT num AS ConsecutiveNums
FROM numbered
GROUP BY num, grp
HAVING COUNT(*) >= 3;
```
</details>

### 练习 4：各部门前3高工资（LeetCode 185 简化版）

找出每个部门工资前三高的员工。

<details>
<summary>点击查看答案</summary>

```sql
WITH ranked AS (
  SELECT 
    d.name AS department,
    e.name AS employee,
    e.salary,
    DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS rank
  FROM employees e
  JOIN departments d ON e.department_id = d.id
)
SELECT department, employee, salary
FROM ranked
WHERE rank <= 3
ORDER BY department, salary DESC;
```
</details>

### 练习 5：行程和用户取消率

计算每天的取消率（使用窗口函数）。

<details>
<summary>点击查看答案</summary>

```sql
SELECT 
  request_at AS Day,
  ROUND(
    SUM(CASE WHEN status != 'completed' THEN 1 ELSE 0 END) * 1.0 / 
    COUNT(*), 
    2
  ) AS Cancellation_Rate
FROM trips
WHERE client_id NOT IN (SELECT users_id FROM users WHERE banned = 'Yes')
  AND driver_id NOT IN (SELECT users_id FROM users WHERE banned = 'Yes')
GROUP BY request_at
ORDER BY request_at;
```
</details>

---

## 参考资料

- 📚 [JavaGuide - MySQL 执行计划分析](https://javaguide.cn/database/mysql/mysql-query-execution-plan.html)
- 💡 [知乎 - 通俗易懂的学会SQL窗口函数](https://zhuanlan.zhihu.com/p/92654574)
- 💡 [知乎 - 一文搞懂SQL 执行顺序：窗口函数vs GROUP BY](https://zhuanlan.zhihu.com/p/1984311207532971366)
- 💡 [CSDN - MySQL 索引优化：EXPLAIN 执行计划深度解读](https://blog.csdn.net/m0_54490473/article/details/145853886)
- 💡 [腾讯云 - SQL执行计划及优化策略](https://cloud.tencent.com/developer/article/2404600)
- 🎓 [LeetCode SQL 题库](https://leetcode.cn/problemset/database/)
- 🎓 [51CTO - MySQL Explain 执行计划详解](https://edu.51cto.com/video/12706.html)

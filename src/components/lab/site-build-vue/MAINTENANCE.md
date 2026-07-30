# site-build-vue 维护指南（注释与逐步演示）

本指南的目标是：以后给 site-build-vue 增加/修改注释时，不会出现“动手写 / 逐步 / 示范 三份注释不一致、被擦掉、或逐步过程中被篡改”的问题。

## 注释分两类

### A. 提示注释（必须逐字一致）

这是写在样例源码里的 `1/2/3...` 编号提示行，用户用它来“按步骤动手写”。这类注释有硬性约束：

- 动手写（初始）与示范（完成）里的提示注释必须逐字一致（包含缩进与标点）。
- 逐步演示过程中不得改写提示注释文本（不得拼接“下一步”等字样）。

对应代码位置：

- 样例内容：PRACTICE_INITIAL / PRACTICE_COMPLETE  
  [filesGuideSamples.ts](file:///d:/_git/SakuraBlog/src/components/lab/site-build-vue/filesGuideSamples.ts)
- 一致性测试（强约束）：  
  [files-guide-sample.spec.ts](file:///d:/_git/SakuraBlog/tests/files-guide-sample.spec.ts)

#### 如何新增/修改“提示注释”

1. 先改 PRACTICE_INITIAL（动手写初始版）：只改注释与挖空提示，不补实现代码。
2. 再改 PRACTICE_COMPLETE（示范完成版）：把实现代码补齐，但把与步骤相关的提示注释行保持和 PRACTICE_INITIAL 一模一样。
3. 跑测试：`files-guide-sample.spec.ts` 会校验两份文件中的“注释开头数字编号行”（`<!-- 1 ... -->` / `/* 1 ... */`）逐行完全一致；不一致会直接失败。

建议：如果你新增了一个步骤号（比如新增 `10`），务必保证两份文件都包含该编号的提示行（并完全一致），否则“示范像是少注释/动手写像是多注释”会立刻复现。

## 逐步演示（stepper）的设计约束

### B. GUIDE 注释（可自动生成/合并）

这类注释不是用户手写的①②…提示，而是逐步演示时，为了定位当前改动、给出文字引导而插入的 “GUIDE(...)” 注释。它的关键点是：

- GUIDE 注释由 step 元数据生成（step id + guide text），不应该手动写进 PRACTICE_* 里。
- 当 stepperGuideMode 为 comment 时，逐步演示会在每一步的 patch 位置插入一条 GUIDE 注释，并且在步骤切换时会把已有 GUIDE 合并回新内容，避免丢失。

对应代码位置：

- 逐步演示 patch + GUIDE 合并逻辑：  
  [ShellThreeFilePlayground.vue](file:///d:/_git/SakuraBlog/src/components/lab/site-build-vue/ShellThreeFilePlayground.vue#L963-L1128)

#### 修改 stepper 的注意事项

- 逐步演示的“分段/剥离”应该只改代码块的范围，不要改提示注释文本内容。
- 逐步演示的步骤号是“功能推进顺序”，不要求严格按文件分段；更推荐符合真实开发节奏的跨文件迭代（例如先 HTML 结构跑起来，再 CSS 顶栏，再 JS 让交互闭环，再回到 CSS 做内容区细节）。
- 如果你需要用“marker/片段提取”定位一个区块（例如用某段 HTML 或某个 CSS selector 的代码块作为边界），marker 文本本身就变成了协议：
  - 改 marker 文本时，要同步更新定位逻辑里的 marker 常量/搜索字符串。
  - 不允许在 stepper 过程中对 marker 注释做二次拼接，否则会导致定位失败或“一致性”破坏。

#### 视角跟踪（follow/reveal）与文件切换

逐步演示有两类“视角”机制：

- **文件切换 / 哪个编辑器在打字**：目标文件是根据 diff/patch 计算出来的（哪个文件有 patch 就对哪个文件做打字动画，其它文件直接切到 next），并非读取 `step.target` 字段。
- **滚动跟随**：通过 `follow.{file}.line/token` 驱动滚动；如果你改了“快进本步”的实现，必须确保快进时也会更新 `follow.line`，否则视觉上会出现“明明改到下面了但视角还停在旧行”的错位感。

## 避免缓存导致“看不到改动”

对照参考/编辑区如果使用了 storageKey 做持久化，旧缓存会覆盖新 initial，表现为“我改了注释但用户仍看不到”。

建议：

- 当样例内容发生结构性变化（尤其是注释协议变化）时，升级 storageKey 版本号。
- 或者在 UI 上提供明显的“还原/重置”动作，让用户能够回到最新初始值。

相关位置（示例）：

- 对照参考 initial 与持久化 key：  
  [ShellFilesGuide.vue](file:///d:/_git/SakuraBlog/src/components/lab/site-build-vue/ShellFilesGuide.vue)

## 推荐的维护策略（总结）

- 提示注释：把它当作协议，PRACTICE_INITIAL 与 PRACTICE_COMPLETE 必须逐字一致；用测试锁死。
- GUIDE 注释：让它完全由 step 元数据生成与合并；不要把它写进 PRACTICE_*。
- Stepper：只做“内容逐步显现/补齐”，不要改写任何提示注释文本。
- 缓存：样例协议变化时升级 storageKey，避免旧内容覆盖新样例。

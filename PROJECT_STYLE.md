# 项目开发规范

本文档用于统一本项目的目录组织、命名方式、类型写法和代码风格。
新增代码优先遵循本文档，若和现有代码存在冲突，以本文件为准逐步
收敛。

## 1. 目录职责

`src/` 下按职责分层维护，尽量不要把不同职责的内容混放。

- `src/api`：接口请求、请求封装、接口类型声明
- `src/constants`：全局常量、枚举映射、静态配置
- `src/types`：业务类型、组件 Props、接口返回类型等
- `src/utils`：纯工具函数、数据转换函数、辅助逻辑
- `src/hooks`：自定义 Hook
- `src/stores`：Zustand 状态管理
- `src/components`：可复用组件
- `src/layouts`：布局相关组件
- `src/pages`：页面级组件
- `src/assets`：图片、样式、静态资源
- `src/router`：路由配置

## 2. 文件放置原则

- 常量统一放在 `src/constants` 中维护
- 类型定义统一放在 `src/types` 中维护
- 请求相关内容统一放在 `src/api` 中维护
- 组件逻辑尽量和组件文件同目录放置
- 页面级模块建议采用 `pages/xxx/index.tsx` 的结构
- 复用逻辑建议抽到 `utils`、`hooks` 或 `stores`，避免堆在页面里

## 3. 命名规范

### 3.1 接口和类型

- `interface` 必须使用 `I` 前缀
- 例如：`interface IMenuItem`、`interface IBreadcrumbBarProps`
- 组件 Props、路由参数、接口返回结构都优先使用这种命名方式
- 如果是类型别名 `type`，也建议保持语义明确、便于理解

### 3.2 常量

- 常量统一使用大写加下划线命名
- 例如：`THEME`、`THEME_ICON_MAP`、`THEME_CLASS_MAP`
- 不可变对象优先使用 `as const`
- 需要映射关系时，尽量把键值定义成稳定的常量，避免魔法字符串

### 3.3 组件

- 组件名使用 PascalCase
- 例如：`TreeMenu`、`BreadcrumbBar`、`ProtectedRoute`
- 组件文件名与导出名保持一致
- 可复用组件放在 `src/components`
- 布局内部组件放在 `src/layouts/components`

### 3.4 Hooks

- 自定义 Hook 统一使用 `use` 开头
- 例如：`useCommonStore`、`useFullscreen`

### 3.5 Store

- Zustand store 统一使用 `useXxxStore` 命名
- 例如：`useMenuStore`、`usePublicStore`

### 3.6 工具函数

- 工具函数使用 camelCase 小驼峰式
- 函数名要表达动作或结果
- 例如：`transformMenuToAntd`、`findMenuKeyPathByRoute`
- 纯数据处理优先放在 `utils`

## 4. 导出规范

- 新增代码优先使用具名导出
- 页面、组件、Hook、工具函数都尽量明确导出名
- 仅在路由入口或默认导出更方便时，才使用 default export
- 同一个文件内尽量统一导出方式，避免混用过多

## 5. 文件命名规则

- 文件名优先和导出内容保持一致
- 组件文件使用 PascalCase 大驼峰式或目录 `index.tsx` 形式
- 页面目录统一使用小写语义化命名，例如 `dashboard`、`devices`
- 工具文件、常量文件、类型文件优先使用小写加语义命名，例如
  `menuHelper.tsx`、`theme.ts`、`breadcrumb.ts`
- 同一业务模块尽量保持目录和文件命名一致，避免出现多个近义名
- `index.ts` / `index.tsx` 适合做对外出口，减少调用方关心内部文件名

## 6. 组件拆分原则

- 一个组件只负责一个明确职责
- 当组件同时承担“数据获取 + 数据处理 + 渲染”时，优先拆分
- 视图逻辑和业务逻辑分离，数据转换优先抽到 `utils` 或 `hooks`
- 组件内如果出现大量条件分支、重复结构或嵌套过深，考虑拆子组件
- 可复用的 UI 部分优先抽成通用组件
- 仅页面内部使用且语义明确的局部组件，可以留在页面目录下
- 组件拆分时优先保证可读性，其次才是抽象复用

## 7. API 返回类型规范

- 所有接口优先定义返回类型，不直接裸用 `any`
- 接口统一返回标准结构时，建议先定义通用响应类型，再复用业务数据类型
- 例如可使用 `ApiResponse<T>` 表达统一返回体，`T` 表示业务数据
- 返回数据中的业务字段应单独建模，避免把接口返回当成临时对象直接使用
- 请求参数、响应数据、分页结构、列表项结构都应各自定义类型
- 如果接口字段与页面字段不一致，转换逻辑放到 `utils` 或 `api` 层，不要散落在组件内
- 后端返回字段变更时，优先更新类型定义，再检查受影响的调用处

## 8. 提交信息规范

- 提交信息使用约定式提交风格
- 推荐格式：`type(scope): description`
- 常用 `type`：
  - `feat`：新增功能
  - `fix`：修复问题
  - `refactor`：重构
  - `docs`：文档
  - `style`：格式调整
  - `test`：测试相关
  - `chore`：构建、依赖、工具链等杂项
- `scope` 尽量写具体模块，例如 `login`、`menu`、`layout`
- `description` 用词简短但要清楚表达改动点
- 单次提交尽量只做一类事情，避免一个提交里混杂太多无关修改
- 提交前先确保 lint 和 build 至少没有明显错误

## 9. 代码风格

本项目的格式化和静态检查以现有工具链为准

- 使用 4 个空格缩进
- 使用单引号
- 不加分号
- 尽量控制单行长度在 80 字符左右
- 对象和数组末尾不保留多余尾逗号
- 导入顺序要保持整洁，遵循 `simple-import-sort`
- React 组件属性尽量保持有序、清晰
- 尽量避免无意义的嵌套和重复逻辑

## 10. React 约定

- 页面组件放在 `src/pages`
- 组件尽量保持单一职责
- 复杂逻辑优先拆到 `hooks`、`utils` 或 `stores`
- 路由相关元信息可以放在 `handle` 中维护，例如面包屑标题
- 数据转换尽量在进入组件前完成，组件内只负责渲染

## 11. API 约定

- 接口文件放在 `src/api`
- 具体业务接口放在 `src/api/modules`
- 请求封装、取消重复请求、响应结构等逻辑放在 `src/api/request.ts` 或相关基础文件中
- 请求参数和返回值类型优先放到 `src/types` 或 `src/api/types.ts`

## 12. 状态管理约定

- 全局状态使用 Zustand
- Store 只保存跨组件共享的数据和状态
- 业务状态和 UI 共享状态分开管理
- 派生数据尽量用 selector、Hook 或计算属性处理，不要重复存储

## 13. 类型设计建议

- 优先为接口请求、响应、组件 Props、路由 `handle` 建类型
- 复杂结构优先拆分成小接口，再组合使用
- 业务字段名尽量与后端保持一致，转换逻辑放到工具层
- `any` 尽量少用，只有在短期兼容或确实难以建模时才使用

## 14. 资源和样式

- 图片、图标、静态资源统一放在 `src/assets`
- 样式文件按场景划分到 `src/assets/css`
- 全局样式和主题样式尽量集中管理，避免在业务组件里乱写全局样式

## 15. 推荐实践

- 新增功能前先判断是 `page`、`component`、`hook`、`utils` 还是 `store`
- 先定义类型，再写实现
- 常量先集中，再引用
- 复杂函数优先拆分成小函数
- 如果一个文件开始明显变大，优先考虑拆分

## 16. 提交前检查

- `pnpm lint`
- `pnpm lint:css`
- `pnpm build`

如果后续项目风格会继续演进，将在这份文档里补充规则，
尽量保持“一个地方定义，全项目统一执行”。

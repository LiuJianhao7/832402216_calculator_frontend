# Frontend Code Style

## 标准来源

本项目前端主要参考：

- Google JavaScript Style Guide: https://google.github.io/styleguide/jsguide.html
- MDN Web Docs（HTML/CSS/JavaScript 与可访问性实践）: https://developer.mozilla.org/

## 约定

1. JavaScript 使用 `'use strict'`，变量优先使用 `const`，需要重新赋值时使用 `let`。
2. JavaScript 变量和函数使用 `camelCase`，CSS class 使用语义明确的 `kebab-case`。
3. 使用 2 个空格缩进；语句末尾使用分号。
4. DOM 查询集中在文件顶部，功能拆成短函数。
5. 网络请求统一通过 `apiRequest()`，错误统一转换为用户可理解的信息。
6. 不在前端实现核心数学求值，不使用 `eval`。
7. 用户输入写回 DOM 时使用 `textContent`，避免把历史内容当 HTML 注入。
8. HTML 使用语义化标签、`label`、`aria-live`、可聚焦 `button`，兼顾键盘操作。
9. CSS 通过自定义属性维护主题变量，媒体查询处理移动端。
10. 注释解释设计意图，而不是逐行重复代码含义。

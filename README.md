# 832402216 Calculator Frontend

前端项目：软件工程实践第一次作业——前后端分离计算器。

- 学生：刘鉴浩（Liu Jianhao）
- 学号：832402216
- 技术栈：HTML5 / CSS3 / Vanilla JavaScript / Fetch API
- 部署建议：GitHub Pages

## 核心说明

前端**不会计算最终数学结果**。点击 `=` 或按 Enter 后，只把表达式发送到后端 `POST /api/calculate`，然后显示后端返回的结果。如果后端停止，页面仍可以输入和点击按钮，但无法得到新的有效计算结果。

## 功能

- 按钮与键盘输入
- 基础与复合表达式输入
- 后端计算结果展示
- 后端错误信息展示
- SQLite 历史记录读取
- 历史搜索
- 单条删除、清空历史
- 点击历史回填表达式
- 复制结果
- 深浅主题切换
- 后端在线/离线状态提示
- 响应式布局

## 项目结构

```text
832402216_calculator_frontend/
├── src/
│   ├── index.html
│   ├── styles.css
│   ├── config.js
│   └── app.js
├── README.md
└── codestyle.md
```

## 本地运行

先启动后端：

```bash
cd 832402216_calculator_backend
pip install -r requirements.txt
python src/run.py
```

再启动前端静态服务器：

```bash
cd 832402216_calculator_frontend
python -m http.server 5500 --directory src
```

浏览器打开：`http://127.0.0.1:5500`

本地模式下 `src/config.js` 会自动连接 `http://127.0.0.1:5000`。

## GitHub Pages 部署

1. 创建公开仓库 `832402216_calculator_frontend`。
2. 将本目录全部内容推送到 `main` 分支。
3. 先完成后端线上部署，获得 `https://你的用户名.pythonanywhere.com`。
4. 修改 `src/config.js`：

```javascript
: 'https://YOUR_USERNAME.pythonanywhere.com';
```

替换为真实域名并再次提交、推送。
5. 本仓库已经包含 `.github/workflows/deploy-pages.yml`，会把 `src/` 作为静态站点发布。
6. GitHub 仓库 → **Settings → Pages**，Build and deployment 的 Source 选择 **GitHub Actions**。
7. 回到 **Actions**，等待 `Deploy frontend to GitHub Pages` 变成绿色。
8. 在 Pages 页面复制生成的公开网址。

## 与后端的接口关系

- 计算：`POST /api/calculate`
- 历史：`GET /api/history`
- 删除单条：`DELETE /api/history/{id}`
- 清空：`DELETE /api/history`
- 健康检查：`GET /health`

浏览器端只负责组织请求与渲染 JSON 响应。

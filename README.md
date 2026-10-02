# 832402216 Calculator Frontend

Frontend project: Software Engineering Practice First Assignment — Frontend-Backend Separated Calculator.

-Student: Liu Jianhao
-Student ID: 832402216
-Tech Stack: HTML5 / CSS3 / Vanilla JavaScript / Fetch API
-Deployment Suggestion: GitHub Pages

## Core Notes

The frontend does not calculate the final mathematical result. After clicking = or pressing Enter, it only sends the expression to the backend POST /api/calculate, and then displays the result returned by the backend. If the backend stops, the page can still accept input and button clicks, but it cannot obtain new valid calculation results.

## Features

-Button and keyboard input
-Basic and compound expression input
-Backend calculation result display
-Backend error message display
-SQLite history reading
-History search
-Single deletion, clear history
-Click history to fill back the expression
-Copy result
-Light/dark theme switching
-Backend online/offline status indication
-Responsive layout

## Project Structure

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

## Local Run

First start the backend:

```bash
cd 832402216_calculator_backend
pip install -r requirements.txt
python src/run.py
```

Then start the frontend static server:

```bash
cd 832402216_calculator_frontend
python -m http.server 5500 --directory src
```

Open in browser:`http://127.0.0.1:5500`

In local mode, src/config.js will automatically connect to http://127.0.0.1:5000.

## GitHub Pages Deployment

1.Create a public repository 832402216_calculator_frontend.
2.Push all contents of this directory to the main branch.
3.First complete the online backend deployment and obtain https://LiuJianhao.pythonanywhere.com.
4.Modify src/config.js:

```javascript
: 'https://LiuJianhao.pythonanywhere.com';
```

5.This repository already contains .github/workflows/deploy-pages.yml, which will publish src/ as a static site.
6.GitHub repository → Settings → Pages, for Build and deployment Source select GitHub Actions.
7.Go back to Actions and wait for Deploy frontend to GitHub Pages to turn green.
8.Copy the generated public URL on the Pages page.

## Interface Relationship with the Backend

-Calculation: POST /api/calculate
-History: GET /api/history
-Delete single entry: DELETE /api/history/{id}
-Clear: DELETE /api/history
-Health check: GET /health

The browser side is only responsible for organizing requests and rendering JSON responses.

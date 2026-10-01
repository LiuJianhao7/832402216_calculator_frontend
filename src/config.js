/**
 * API configuration.
 * Local development uses Flask on port 5000.
 * Before deploying to GitHub Pages, replace the production URL below.
 */
window.CALCULATOR_API_BASE =
  window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:5000'
    : 'https://LiuJianhao.pythonanywhere.com';

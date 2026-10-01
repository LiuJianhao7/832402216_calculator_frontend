'use strict';

const API_BASE = window.CALCULATOR_API_BASE.replace(/\/$/, '');
const expressionInput = document.querySelector('#expressionInput');
const resultOutput = document.querySelector('#resultOutput');
const messageArea = document.querySelector('#messageArea');
const historyList = document.querySelector('#historyList');
const historyCount = document.querySelector('#historyCount');
const historySearch = document.querySelector('#historySearch');
const connectionStatus = document.querySelector('#connectionStatus');
const themeButton = document.querySelector('#themeButton');
const copyResultButton = document.querySelector('#copyResultButton');
const reuseLastButton = document.querySelector('#reuseLastButton');
const refreshHistoryButton = document.querySelector('#refreshHistoryButton');
const clearHistoryButton = document.querySelector('#clearHistoryButton');

let latestHistory = [];
let calculationInProgress = false;

function showMessage(message = '', kind = '') {
  messageArea.textContent = message;
  messageArea.dataset.kind = kind;
}

function appendValue(value) {
  const start = expressionInput.selectionStart ?? expressionInput.value.length;
  const end = expressionInput.selectionEnd ?? expressionInput.value.length;
  expressionInput.setRangeText(value, start, end, 'end');
  expressionInput.focus();
  showMessage();
}

function clearExpression() {
  expressionInput.value = '';
  resultOutput.textContent = '0';
  showMessage();
  expressionInput.focus();
}

function backspace() {
  const start = expressionInput.selectionStart ?? expressionInput.value.length;
  const end = expressionInput.selectionEnd ?? expressionInput.value.length;
  if (start !== end) {
    expressionInput.setRangeText('', start, end, 'end');
  } else if (start > 0) {
    expressionInput.setRangeText('', start - 1, start, 'end');
  }
  expressionInput.focus();
}

function setConnectionState(isOnline) {
  connectionStatus.classList.toggle('is-online', isOnline);
  connectionStatus.classList.toggle('is-offline', !isOnline);
  connectionStatus.querySelector('span:last-child').textContent = isOnline
    ? '后端已连接'
    : '后端未连接';
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Backend returned a non-JSON response',
  }));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.code = data.code;
    throw error;
  }
  return data;
}

async function checkBackend() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    setConnectionState(response.ok);
  } catch (_error) {
    setConnectionState(false);
  }
}

async function calculate() {
  if (calculationInProgress) {
    return;
  }

  const expression = expressionInput.value.trim();
  if (!expression) {
    showMessage('请输入要计算的表达式。', 'error');
    expressionInput.focus();
    return;
  }

  calculationInProgress = true;
  showMessage('正在由后端计算…', 'info');

  try {
    const data = await apiRequest('/api/calculate', {
      method: 'POST',
      body: JSON.stringify({ expression }),
    });
    resultOutput.textContent = data.result;
    expressionInput.value = data.expression;
    showMessage('计算成功，记录已写入数据库。', 'success');
    setConnectionState(true);
    await loadHistory();
  } catch (error) {
    resultOutput.textContent = '—';
    if (error instanceof TypeError) {
      showMessage('无法连接后端，前端不会自行计算结果。', 'error');
      setConnectionState(false);
    } else if (error.code === 'DIVISION_BY_ZERO') {
      showMessage('错误：除数不能为 0。', 'error');
    } else {
      showMessage(`错误：${error.message}`, 'error');
    }
  } finally {
    calculationInProgress = false;
  }
}

function formatTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function createHistoryItem(item) {
  const article = document.createElement('article');
  article.className = 'history-item';

  const main = document.createElement('button');
  main.type = 'button';
  main.className = 'history-main';
  main.title = '点击回填此表达式';
  main.addEventListener('click', () => {
    expressionInput.value = item.expression;
    resultOutput.textContent = item.result;
    expressionInput.focus();
    showMessage('已回填历史表达式，可再次计算。', 'info');
  });

  const expression = document.createElement('span');
  expression.className = 'history-expression';
  expression.textContent = item.expression;

  const meta = document.createElement('span');
  meta.className = 'history-meta';
  meta.textContent = formatTime(item.created_at);

  const result = document.createElement('strong');
  result.className = 'history-result';
  result.textContent = `= ${item.result}`;

  main.append(expression, result, meta);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'delete-history';
  removeButton.textContent = '删除';
  removeButton.setAttribute('aria-label', `删除历史记录 ${item.expression}`);
  removeButton.addEventListener('click', async () => {
    await deleteHistory(item.id);
  });

  article.append(main, removeButton);
  return article;
}

function renderHistory(items) {
  historyList.replaceChildren();
  historyCount.textContent = `${items.length} 条`;

  if (items.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = historySearch.value.trim()
      ? '没有匹配的历史记录'
      : '暂无历史记录';
    historyList.append(emptyState);
    return;
  }

  items.forEach((item) => historyList.append(createHistoryItem(item)));
}

async function loadHistory() {
  const search = historySearch.value.trim();
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  try {
    const data = await apiRequest(`/api/history${query}`);
    latestHistory = data.items;
    renderHistory(data.items);
    setConnectionState(true);
  } catch (error) {
    latestHistory = [];
    renderHistory([]);
    if (error instanceof TypeError) {
      setConnectionState(false);
    }
  }
}

async function deleteHistory(id) {
  try {
    await apiRequest(`/api/history/${id}`, { method: 'DELETE' });
    showMessage('指定历史记录已从数据库删除。', 'success');
    await loadHistory();
  } catch (error) {
    showMessage(`删除失败：${error.message}`, 'error');
  }
}

async function clearAllHistory() {
  if (latestHistory.length === 0) {
    showMessage('当前没有可清空的历史记录。', 'info');
    return;
  }

  const confirmed = window.confirm('确定要删除数据库中的全部计算历史吗？');
  if (!confirmed) {
    return;
  }

  try {
    await apiRequest('/api/history', { method: 'DELETE' });
    showMessage('全部历史记录已清空。', 'success');
    await loadHistory();
  } catch (error) {
    showMessage(`清空失败：${error.message}`, 'error');
  }
}

function copyResult() {
  navigator.clipboard.writeText(resultOutput.textContent)
    .then(() => showMessage('结果已复制到剪贴板。', 'success'))
    .catch(() => showMessage('浏览器未允许剪贴板操作。', 'error'));
}

function reuseLatestExpression() {
  if (latestHistory.length === 0) {
    showMessage('当前没有可回填的历史表达式。', 'info');
    return;
  }
  expressionInput.value = latestHistory[0].expression;
  resultOutput.textContent = latestHistory[0].result;
  expressionInput.focus();
  showMessage('已回填最近一次成功计算。', 'info');
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? '☀' : '◐';
  localStorage.setItem('calculator-theme', theme);
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
}

function handleInputSanitization() {
  const cursor = expressionInput.selectionStart ?? expressionInput.value.length;
  const normalized = expressionInput.value
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[^0-9+\-*/().\s]/g, '');
  if (normalized !== expressionInput.value) {
    expressionInput.value = normalized;
    expressionInput.setSelectionRange(Math.min(cursor, normalized.length), Math.min(cursor, normalized.length));
    showMessage('已移除不支持的字符。', 'info');
  }
}

function bindEvents() {
  document.querySelectorAll('[data-value]').forEach((button) => {
    button.addEventListener('click', () => appendValue(button.dataset.value));
  });

  document.querySelector('[data-action="clear"]').addEventListener('click', clearExpression);
  document.querySelector('[data-action="backspace"]').addEventListener('click', backspace);
  document.querySelector('[data-action="calculate"]').addEventListener('click', calculate);

  expressionInput.addEventListener('input', handleInputSanitization);
  expressionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      calculate();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      clearExpression();
    }
  });

  historySearch.addEventListener('input', () => {
    window.clearTimeout(historySearch.timerId);
    historySearch.timerId = window.setTimeout(loadHistory, 180);
  });

  themeButton.addEventListener('click', toggleTheme);
  copyResultButton.addEventListener('click', copyResult);
  reuseLastButton.addEventListener('click', reuseLatestExpression);
  refreshHistoryButton.addEventListener('click', loadHistory);
  clearHistoryButton.addEventListener('click', clearAllHistory);
}

function applyDemoParameters() {
  const params = new URLSearchParams(window.location.search);
  const expression = params.get('expression');
  const requestedTheme = params.get('theme');

  if (requestedTheme === 'light' || requestedTheme === 'dark') {
    applyTheme(requestedTheme);
  }
  if (expression) {
    expressionInput.value = expression;
  }
  if (expression && params.get('autorun') === '1') {
    window.setTimeout(calculate, 120);
  }
}

function initialize() {
  const savedTheme = localStorage.getItem('calculator-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(savedTheme || preferredTheme);
  bindEvents();
  checkBackend();
  loadHistory();
  applyDemoParameters();
  expressionInput.focus();
}

initialize();

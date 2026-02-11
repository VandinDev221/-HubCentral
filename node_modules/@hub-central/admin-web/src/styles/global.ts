import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --bg: #f1f5f9;
    --surface: #ffffff;
    --text: #0f172a;
    --text-secondary: #64748b;
    --primary: #2563eb;
    --border: #e2e8f0;
    --sidebar: #1e293b;
    --bottom-nav: #ffffff;
    --bottom-nav-active: #dbeafe;
  }
  [data-theme="dark"] {
    --bg: #0f172a;
    --surface: #1e293b;
    --text: #f8fafc;
    --text-secondary: #94a3b8;
    --primary: #3b82f6;
    --border: #334155;
    --sidebar: #0f172a;
    --bottom-nav: #1e293b;
    --bottom-nav-active: #2563eb;
  }
  [data-theme="light"] {
    --bg: #f1f5f9;
    --surface: #ffffff;
    --text: #0f172a;
    --text-secondary: #64748b;
    --primary: #2563eb;
    --border: #e2e8f0;
    --sidebar: #1e293b;
    --bottom-nav: #ffffff;
    --bottom-nav-active: #dbeafe;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg);
    color: var(--text);
  }
  #root {
    width: 100%;
    min-width: 100%;
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  #root > * {
    flex: 1;
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --bg: #f8fafc;
    --bg-subtle: #f1f5f9;
    --surface: #ffffff;
    --surface-elevated: #ffffff;
    --text: #0f172a;
    --text-secondary: #64748b;
    --primary: #4f46e5;
    --primary-hover: #4338ca;
    --primary-light: #eef2ff;
    --accent: #06b6d4;
    --border: #e2e8f0;
    --border-strong: #cbd5e1;
    --sidebar: #0f172a;
    --sidebar-hover: #1e293b;
    --bottom-nav: rgba(255, 255, 255, 0.92);
    --bottom-nav-active: #eef2ff;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.04);
    --shadow-md: 0 4px 12px -2px rgb(0 0 0 / 0.08);
    --shadow-lg: 0 12px 32px -8px rgb(0 0 0 / 0.12);
    --radius-lg: 14px;
    --radius-xl: 20px;
  }

  [data-theme="dark"] {
    --bg: #020617;
    --bg-subtle: #0f172a;
    --surface: #1e293b;
    --surface-elevated: #334155;
    --text: #f8fafc;
    --text-secondary: #94a3b8;
    --primary: #6366f1;
    --primary-hover: #818cf8;
    --primary-light: rgb(99 102 241 / 0.15);
    --accent: #22d3ee;
    --border: #334155;
    --border-strong: #475569;
    --sidebar: #020617;
    --sidebar-hover: #0f172a;
    --bottom-nav: rgba(15, 23, 42, 0.95);
    --bottom-nav-active: rgb(99 102 241 / 0.2);
  }

  [data-theme="light"] {
    --bg: #f8fafc;
    --bg-subtle: #f1f5f9;
    --surface: #ffffff;
    --surface-elevated: #ffffff;
    --text: #0f172a;
    --text-secondary: #64748b;
    --primary: #4f46e5;
    --primary-hover: #4338ca;
    --primary-light: #eef2ff;
    --accent: #06b6d4;
    --border: #e2e8f0;
    --border-strong: #cbd5e1;
    --sidebar: #0f172a;
    --sidebar-hover: #1e293b;
    --bottom-nav: rgba(255, 255, 255, 0.92);
    --bottom-nav-active: #eef2ff;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  body {
    font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.5;
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

  ::selection {
    background: var(--primary-light);
    color: var(--primary);
  }
`;

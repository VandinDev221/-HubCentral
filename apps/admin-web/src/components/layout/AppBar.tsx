import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  background: rgb(255 255 255 / 0.88);

  [data-theme='dark'] & {
    background: rgb(30 41 59 / 0.92);
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuBtn = styled.button`
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: var(--primary-light);
    border-color: rgb(79 70 229 / 0.25);
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const IconBtn = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: var(--primary-light);
    color: var(--primary);
  }
`;

interface AppBarProps {
  title: string;
  onMenuClick: () => void;
}

export function AppBar({ title, onMenuClick }: AppBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Bar>
      <Left>
        <MenuBtn onClick={onMenuClick} aria-label="Abrir menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </MenuBtn>
        <Title>{title}</Title>
      </Left>
      <Right>
        <IconBtn onClick={toggleTheme} aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </IconBtn>
      </Right>
    </Bar>
  );
}

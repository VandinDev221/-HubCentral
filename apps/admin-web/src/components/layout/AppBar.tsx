import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuBtn = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 1024px) {
    display: none;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconBtn = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  &:hover {
    background: var(--bottom-nav-active);
    color: var(--primary);
  }
  ${({ $active }) => $active && `color: var(--primary);`}
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <IconBtn aria-label="Notificações">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </IconBtn>
      </Right>
    </Bar>
  );
}

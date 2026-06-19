import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 68px;
  background: var(--bottom-nav);
  border-top: 1px solid var(--border);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 90;
  padding: 0 8px 4px;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  color: ${({ $active }) => ($active ? 'var(--primary)' : 'var(--text-secondary)')};
  text-decoration: none;
  font-size: 0.6875rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  border-radius: 12px;
  background: ${({ $active }) => ($active ? 'var(--bottom-nav-active)' : 'transparent')};
  transition: background 0.2s, color 0.2s;
  max-width: 88px;

  &:hover {
    background: var(--bottom-nav-active);
    color: var(--primary);
  }
`;

const items = [
  { to: '/', label: 'Início', icon: 'grid' },
  { to: '/clientes', label: 'Clientes', icon: 'people' },
  { to: '/assinaturas', label: 'Assin.', icon: 'card' },
  { to: '/faturas', label: 'Faturas', icon: 'invoice' },
];

const icons: Record<string, JSX.Element> = {
  grid: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  people: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  card: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  invoice: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
};

export function BottomNav() {
  const location = useLocation();

  return (
    <Nav>
      {items.map((item) => (
        <NavItem key={item.to} to={item.to} $active={location.pathname === item.to}>
          {icons[item.icon] || icons.grid}
          {item.label}
        </NavItem>
      ))}
    </Nav>
  );
}

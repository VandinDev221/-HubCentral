import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--bottom-nav);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 90;
  padding: 0 8px;
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
  padding: 8px;
  color: ${({ $active }) => ($active ? 'var(--primary)' : 'var(--text-secondary)')};
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'var(--bottom-nav-active)' : 'transparent')};
  transition: background 0.2s, color 0.2s;
  max-width: 100px;
  &:hover {
    background: var(--bottom-nav-active);
    color: var(--primary);
  }
`;

const items = [
  { to: '/', label: 'Dashboard', icon: 'grid' },
  { to: '/clientes', label: 'Clientes', icon: 'people' },
  { to: '/assinaturas', label: 'Assinaturas', icon: 'card' },
  { to: '/faturas', label: 'Faturas', icon: 'invoice' },
];

const icons: Record<string, JSX.Element> = {
  grid: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  people: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  card: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  invoice: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
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

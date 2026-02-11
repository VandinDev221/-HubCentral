import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition: opacity 0.2s, visibility 0.2s;
  @media (min-width: 1024px) {
    display: none;
  }
`;

const Panel = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: var(--sidebar);
  z-index: 201;
  transform: translateX(${({ $open }) => ($open ? 0 : '-100%')});
  transition: transform 0.25s ease-out;
  display: flex;
  flex-direction: column;
  @media (min-width: 1024px) {
    position: relative;
    top: auto;
    left: auto;
    bottom: auto;
    transform: none;
    width: 280px;
    min-width: 280px;
    flex-shrink: 0;
    height: 100%;
    min-height: 0;
    max-width: none;
    border-right: 1px solid var(--border);
  }
`;

const DrawerHeader = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
`;

const LogoText = styled.span`
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  padding: 8px;
  cursor: pointer;
  display: flex;
  @media (min-width: 1024px) {
    display: none;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.8)')};
  text-decoration: none;
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  border-left: 3px solid ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
`;

const NavIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavArrow = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  opacity: 0.7;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
`;

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'grid' },
  { to: '/clientes', label: 'Clientes', icon: 'people' },
  { to: '/assinaturas', label: 'Assinaturas', icon: 'card' },
  { to: '/faturas', label: 'Faturas', icon: 'invoice' },
  { to: '/produtos', label: 'Produtos', icon: 'box' },
];

const icons: Record<string, JSX.Element> = {
  grid: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  people: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  card: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  invoice: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  box: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
};

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export function Drawer({ open, onClose }: DrawerProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <>
      <Overlay $open={open} onClick={onClose} aria-hidden="true" />
      <Panel $open={open}>
        <DrawerHeader>
          <Logo>
            <LogoIcon>HC</LogoIcon>
            <LogoText>Hub Central</LogoText>
          </Logo>
          <CloseBtn onClick={onClose} aria-label="Fechar menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseBtn>
        </DrawerHeader>
        <Nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              $active={location.pathname === item.to}
              onClick={onClose}
            >
              <NavIcon>{icons[item.icon] || icons.grid}</NavIcon>
              {item.label}
              <NavArrow>›</NavArrow>
            </NavLink>
          ))}
        </Nav>
        <LogoutBtn
          onClick={() => { onClose(); logout(); }}
        >
          <NavIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </NavIcon>
          Sair
        </LogoutBtn>
      </Panel>
    </>
  );
}

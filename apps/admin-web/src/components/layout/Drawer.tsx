import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../brand/Logo';
import styled from 'styled-components';

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgb(2 6 23 / 0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition: opacity 0.25s, visibility 0.25s;
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
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgb(0 0 0 / 0.15);

  @media (min-width: 1024px) {
    position: relative;
    transform: none;
    width: 272px;
    min-width: 272px;
    flex-shrink: 0;
    height: 100%;
    min-height: 0;
    max-width: none;
    border-right: 1px solid rgb(255 255 255 / 0.06);
    box-shadow: none;
  }
`;

const DrawerHeader = styled.div`
  position: relative;
  padding: 20px 16px;
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 12px;
  background: rgb(255 255 255 / 0.08);
  border: none;
  color: rgb(255 255 255 / 0.8);
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  @media (min-width: 1024px) {
    display: none;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 12px 10px;
  overflow-y: auto;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  margin-bottom: 4px;
  border-radius: 12px;
  color: ${({ $active }) => ($active ? '#fff' : 'rgb(255 255 255 / 0.65)')};
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  background: ${({ $active }) => ($active ? 'rgb(99 102 241 / 0.22)' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? 'rgb(99 102 241 / 0.35)' : 'transparent')};
  transition: background 0.2s, color 0.2s, border-color 0.2s;

  &:hover {
    background: rgb(255 255 255 / 0.06);
    color: #fff;
  }
`;

const NavIcon = styled.span`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 20px);
  margin: 8px 10px 16px;
  padding: 11px 12px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 12px;
  color: rgb(255 255 255 / 0.7);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: rgb(239 68 68 / 0.12);
    border-color: rgb(239 68 68 / 0.25);
    color: #fca5a5;
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
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
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  invoice: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
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
          <Logo size="sm" light showSubtitle />
          <CloseBtn onClick={onClose} aria-label="Fechar menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            </NavLink>
          ))}
        </Nav>
        <LogoutBtn onClick={() => { onClose(); logout(); }}>
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

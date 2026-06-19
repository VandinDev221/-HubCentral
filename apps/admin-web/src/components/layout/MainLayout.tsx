import { useState } from 'react';
import styled from 'styled-components';
import { AppBar } from './AppBar';
import { Drawer } from './Drawer';
import { BottomNav } from './BottomNav';

const LayoutWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const titleByPath: Record<string, string> = {
  '/': 'Dashboard',
  '/clientes': 'Clientes',
  '/produtos': 'Produtos',
  '/assinaturas': 'Assinaturas',
  '/faturas': 'Faturas',
};

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

export function MainLayout({ children, currentPath }: MainLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const title = titleByPath[currentPath] || 'Hub Central';

  return (
    <LayoutWrap>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Main>
        <AppBar title={title} onMenuClick={() => setDrawerOpen(true)} />
        <ContentArea>{children}</ContentArea>
      </Main>
      <BottomNav />
    </LayoutWrap>
  );
}

import React from 'react';
import styled from 'styled-components';
import { colors, spacing, typography } from '../../tokens';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.gray50};
`;

const Sidebar = styled.aside`
  width: 260px;
  background: ${colors.gray900};
  color: ${colors.white};
  padding: ${spacing[6]} 0;
`;

const SidebarLogo = styled.div`
  padding: 0 ${spacing[6]} ${spacing[6]};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`;

const NavLinkStyled = styled.a<{ $active?: boolean }>`
  padding: ${spacing[3]} ${spacing[6]};
  color: ${colors.gray300};
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  display: block;
  &:hover {
    background: ${colors.gray800};
    color: ${colors.white};
  }
  ${({ $active }) => $active && `background: ${colors.gray800}; color: ${colors.white};`}
`;

const NavItemWrapper = styled.div`
  a {
    padding: ${spacing[3]} ${spacing[6]};
    color: ${colors.gray300};
    text-decoration: none;
    display: block;
    transition: background 0.2s, color 0.2s;
    &:hover {
      background: ${colors.gray800};
      color: ${colors.white};
    }
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Header = styled.header`
  background: ${colors.white};
  padding: ${spacing[4]} ${spacing[6]};
  border-bottom: 1px solid ${colors.gray200};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.div`
  padding: ${spacing[6]};
  flex: 1;
`;

export interface LayoutProps {
  sidebarLogo?: React.ReactNode;
  navItems: { to: string; label: string }[];
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  /** Render custom nav item (e.g. React Router Link). If not set, uses <a href>. */
  renderNavItem?: (item: { to: string; label: string }) => React.ReactNode;
}

export function Layout({ sidebarLogo = 'Hub Central', navItems, headerRight, children, renderNavItem }: LayoutProps) {
  return (
    <Container>
      <Sidebar>
        <SidebarLogo>{sidebarLogo}</SidebarLogo>
        <Nav>
          {navItems.map((item) =>
            renderNavItem ? (
              <NavItemWrapper key={item.to}>{renderNavItem(item)}</NavItemWrapper>
            ) : (
              <NavLinkStyled key={item.to} href={item.to}>
                {item.label}
              </NavLinkStyled>
            )
          )}
        </Nav>
      </Sidebar>
      <Main>
        <Header>{headerRight}</Header>
        <Content>{children}</Content>
      </Main>
    </Container>
  );
}

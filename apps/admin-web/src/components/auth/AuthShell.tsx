import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(8px, -12px) scale(1.04); }
`;

export const AuthPage = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr;
  background: var(--bg);

  @media (min-width: 960px) {
    grid-template-columns: 1.05fr 1fr;
  }
`;

export const AuthBrandPanel = styled.aside`
  display: none;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 45%, #0f172a 100%);
  padding: 48px;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 960px) {
    display: flex;
  }
`;

export const AuthOrb = styled.div<{ $top: string; $left: string; $size: string; $color: string; $delay?: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
  background: ${({ $color }) => $color};
  filter: blur(60px);
  opacity: 0.45;
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  pointer-events: none;
`;

export const AuthFormPanel = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background: var(--bg);

  @media (min-width: 960px) {
    padding: 48px;
    background: var(--surface);
    border-left: 1px solid var(--border);
  }
`;

export const AuthFormInner = styled.div`
  width: 100%;
  max-width: 420px;
  animation: ${fadeUp} 0.5s ease-out 0.1s both;
`;

export const AuthFormTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
`;

export const AuthFormSubtitle = styled.p`
  margin: 0 0 28px;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  color: var(--text-secondary);
  font-size: 0.8125rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
`;

export const AuthFooterLink = styled.p`
  margin: 24px 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);

  a {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const AuthErrorBanner = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const AuthSuccessBanner = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
  font-size: 0.875rem;
  font-weight: 500;
`;

export function AuthBrandSide() {
  return (
    <AuthBrandPanel>
      <AuthOrb $top="-10%" $left="-5%" $size="320px" $color="#6366f1" $delay="0s" />
      <AuthOrb $top="40%" $left="55%" $size="260px" $color="#06b6d4" $delay="2s" />
      <AuthOrb $top="70%" $left="10%" $size="200px" $color="#8b5cf6" $delay="4s" />
      <div>
        <Logo size="lg" light inverted showSubtitle />
        <h1 style={{ margin: '48px 0 16px', fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, color: '#fff', maxWidth: 420 }}>
          Gestão de clientes e faturamento, em um só lugar.
        </h1>
        <p style={{ margin: 0, fontSize: '1.0625rem', lineHeight: 1.65, color: 'rgb(255 255 255 / 0.72)', maxWidth: 400 }}>
          Cadastre-se com e-mail ou Google e acesse o painel admin.
        </p>
      </div>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgb(255 255 255 / 0.45)' }}>© Hub Central · Plataforma SaaS</p>
    </AuthBrandPanel>
  );
}

export function AuthSwitchLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <AuthFooterLink>
      <Link to={to}>{children}</Link>
    </AuthFooterLink>
  );
}

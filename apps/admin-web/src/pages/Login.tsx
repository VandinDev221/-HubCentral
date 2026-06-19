import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button, Input } from '@hub-central/ui-design-system';
import { Logo } from '../components/brand/Logo';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(8px, -12px) scale(1.04); }
`;

const Page = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr;
  background: var(--bg);

  @media (min-width: 960px) {
    grid-template-columns: 1.05fr 1fr;
  }
`;

const BrandPanel = styled.aside`
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

const Orb = styled.div<{ $top: string; $left: string; $size: string; $delay?: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.45;
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  pointer-events: none;
`;

const BrandContent = styled.div`
  position: relative;
  z-index: 1;
  animation: ${fadeUp} 0.6s ease-out;
`;

const BrandTitle = styled.h1`
  margin: 48px 0 16px;
  font-size: clamp(2rem, 3vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: #fff;
  max-width: 420px;
`;

const BrandLead = styled.p`
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: rgb(255 255 255 / 0.72);
  max-width: 400px;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 40px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgb(255 255 255 / 0.85);

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    flex-shrink: 0;
  }
`;

const BrandFooter = styled.p`
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 0.8125rem;
  color: rgb(255 255 255 / 0.45);
`;

const FormPanel = styled.main`
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

const FormInner = styled.div`
  width: 100%;
  max-width: 420px;
  animation: ${fadeUp} 0.5s ease-out 0.1s both;
`;

const MobileLogo = styled.div`
  margin-bottom: 32px;

  @media (min-width: 960px) {
    display: none;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 32px;
`;

const FormTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
`;

const FormSubtitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ErrorBanner = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.45;
`;

const Hint = styled.p`
  margin: 24px 0 0;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--text-secondary);
`;

const features = [
  'Gestão de clientes e assinaturas',
  'Faturamento e controle de inadimplência',
  'API integrada para PDV e produtos',
];

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      addNotification('Login realizado com sucesso.', 'success');
      navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar';
      setError(msg);
      addNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <BrandPanel>
        <Orb $top="-10%" $left="-5%" $size="320px" style={{ background: '#6366f1' }} $delay="0s" />
        <Orb $top="40%" $left="55%" $size="260px" style={{ background: '#06b6d4' }} $delay="2s" />
        <Orb $top="70%" $left="10%" $size="200px" style={{ background: '#8b5cf6' }} $delay="4s" />

        <BrandContent>
          <Logo size="lg" light inverted showSubtitle />
          <BrandTitle>Gestão de clientes e faturamento, em um só lugar.</BrandTitle>
          <BrandLead>
            Painel admin para assinaturas, faturas e controle de acesso dos seus produtos SaaS.
          </BrandLead>
          <FeatureList>
            {features.map((f) => (
              <FeatureItem key={f}>{f}</FeatureItem>
            ))}
          </FeatureList>
        </BrandContent>

        <BrandFooter>© Hub Central · Plataforma SaaS</BrandFooter>
      </BrandPanel>

      <FormPanel>
        <FormInner>
          <MobileLogo>
            <Logo size="md" />
          </MobileLogo>

          <FormHeader>
            <FormTitle>Bem-vindo de volta</FormTitle>
            <FormSubtitle>Entre com sua conta de administrador para acessar o painel.</FormSubtitle>
          </FormHeader>

          <Form onSubmit={handleSubmit}>
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hubcentral.com"
              autoComplete="email"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

            <Button type="submit" size="lg" fullWidth disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no painel'}
            </Button>
          </Form>

          <Hint>Ambiente seguro · Acesso restrito a administradores</Hint>
        </FormInner>
      </FormPanel>
    </Page>
  );
}

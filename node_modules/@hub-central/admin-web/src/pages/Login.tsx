import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button, Input, Card } from '@hub-central/ui-design-system';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

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
    <Wrapper>
      <LoginCard>
        <Title>Hub Central</Title>
        <p style={{ margin: '0 0 24px 0', color: '#64748b' }}>Entre com sua conta admin</p>
        <Form onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@hubcentral.com"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>}
          <Button type="submit" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
      </LoginCard>
    </Wrapper>
  );
}

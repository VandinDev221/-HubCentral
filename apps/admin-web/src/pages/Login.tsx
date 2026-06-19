import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button, Input } from '@hub-central/ui-design-system';
import { Logo } from '../components/brand/Logo';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import {
  AuthPage,
  AuthBrandSide,
  AuthFormPanel,
  AuthFormInner,
  AuthFormTitle,
  AuthFormSubtitle,
  AuthForm,
  AuthDivider,
  AuthErrorBanner,
  AuthSwitchLink,
} from '../components/auth/AuthShell';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
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

  const handleGoogle = async (credential: string) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(credential);
      addNotification('Login com Google realizado.', 'success');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro com Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <AuthBrandSide />

      <AuthFormPanel>
        <AuthFormInner>
          <div style={{ marginBottom: 32 }}>
            <Logo size="md" />
          </div>

          <AuthFormTitle>Bem-vindo de volta</AuthFormTitle>
          <AuthFormSubtitle>Entre com Google ou e-mail e senha.</AuthFormSubtitle>

          <GoogleSignInButton onCredential={handleGoogle} disabled={loading} />
          <AuthDivider>ou</AuthDivider>

          <AuthForm onSubmit={handleSubmit}>
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
            {error && <AuthErrorBanner role="alert">{error}</AuthErrorBanner>}
            <Button type="submit" size="lg" fullWidth disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no painel'}
            </Button>
          </AuthForm>

          <AuthSwitchLink to="/register">Não tem conta? Cadastre-se</AuthSwitchLink>
        </AuthFormInner>
      </AuthFormPanel>
    </AuthPage>
  );
}

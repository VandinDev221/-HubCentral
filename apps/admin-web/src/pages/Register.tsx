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

export function Register() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, verifyRegistration, resendCode, loginWithGoogle } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name || undefined);
      setStep('verify');
      addNotification('Código enviado para o seu e-mail.', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyRegistration(email, code);
      addNotification('Conta criada com sucesso!', 'success');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      await resendCode(email);
      addNotification('Novo código enviado.', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reenviar');
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

          {step === 'form' ? (
            <>
              <AuthFormTitle>Criar conta</AuthFormTitle>
              <AuthFormSubtitle>Cadastre-se com e-mail ou continue com Google.</AuthFormSubtitle>

              <GoogleSignInButton onCredential={handleGoogle} disabled={loading} />
              <AuthDivider>ou</AuthDivider>

              <AuthForm onSubmit={handleRegister}>
                <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
                <Input
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  required
                />
                <Input
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
                {error && <AuthErrorBanner role="alert">{error}</AuthErrorBanner>}
                <Button type="submit" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Enviando...' : 'Continuar'}
                </Button>
              </AuthForm>
            </>
          ) : (
            <>
              <AuthFormTitle>Verifique seu e-mail</AuthFormTitle>
              <AuthFormSubtitle>
                Enviamos um código de 6 dígitos para <strong>{email}</strong>
              </AuthFormSubtitle>

              <AuthForm onSubmit={handleVerify}>
                <Input
                  label="Código de verificação"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                />
                {error && <AuthErrorBanner role="alert">{error}</AuthErrorBanner>}
                <Button type="submit" size="lg" fullWidth disabled={loading || code.length !== 6}>
                  {loading ? 'Verificando...' : 'Confirmar cadastro'}
                </Button>
                <Button type="button" variant="ghost" fullWidth disabled={loading} onClick={handleResend}>
                  Reenviar código
                </Button>
                <Button type="button" variant="secondary" fullWidth disabled={loading} onClick={() => setStep('form')}>
                  Voltar
                </Button>
              </AuthForm>
            </>
          )}

          <AuthSwitchLink to="/login">Já tem conta? Entrar</AuthSwitchLink>
        </AuthFormInner>
      </AuthFormPanel>
    </AuthPage>
  );
}

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  authPost,
  saveSession,
  clearSession,
  loadStoredSession,
  type AuthSession,
  type AuthUser,
} from '../api/auth';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  verifyRegistration: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadStoredSession().token);
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredSession().user);

  const applySession = useCallback((session: AuthSession) => {
    setToken(session.accessToken);
    setUser(session.user);
    saveSession(session);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authPost<AuthSession>('/login', { email, password });
    applySession(data);
  }, [applySession]);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    await authPost('/register', { email, password, name });
  }, []);

  const verifyRegistration = useCallback(async (email: string, code: string) => {
    const data = await authPost<AuthSession>('/register/verify', { email, code });
    applySession(data);
  }, [applySession]);

  const resendCode = useCallback(async (email: string) => {
    await authPost('/register/resend', { email });
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const data = await authPost<AuthSession>('/google', { credential });
    applySession(data);
  }, [applySession]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, verifyRegistration, resendCode, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; width?: number; text?: string; locale?: string },
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  disabled?: boolean;
}

export function GoogleSignInButton({ onCredential, disabled }: GoogleSignInButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId || !ref.current || disabled) return;

    const render = () => {
      if (!ref.current || !window.google) return;
      ref.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => onCredential(res.credential),
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'outline',
        size: 'large',
        width: 360,
        text: 'continue_with',
        locale: 'pt-BR',
      });
    };

    if (window.google) {
      render();
      return;
    }

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', render);
      return () => existing.removeEventListener('load', render);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = render;
    document.body.appendChild(script);
  }, [clientId, onCredential, disabled]);

  if (!clientId) {
    return (
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Google Sign-In: configure VITE_GOOGLE_CLIENT_ID
      </p>
    );
  }

  return <div ref={ref} style={{ display: 'flex', justifyContent: 'center', opacity: disabled ? 0.6 : 1 }} />;
}

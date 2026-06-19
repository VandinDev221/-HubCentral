import { useEffect, useRef } from 'react';
import styled from 'styled-components';

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

const GoogleButtonWrap = styled.div<{ $disabled?: boolean }>`
  display: flex;
  justify-content: center;
  width: 100%;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  & > div {
    width: 100% !important;
    max-width: 360px;
  }

  iframe {
    max-width: 100% !important;
  }
`;

let gsiInitializedForClient: string | null = null;
let gsiCredentialHandler: ((credential: string) => void) | null = null;

function loadGsiScript(onReady: () => void) {
  if (window.google?.accounts?.id) {
    onReady();
    return;
  }

  const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
  if (existing) {
    existing.addEventListener('load', onReady, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.onload = onReady;
  document.body.appendChild(script);
}

function ensureGsiInitialized(clientId: string) {
  if (!window.google?.accounts?.id) return;
  if (gsiInitializedForClient === clientId) return;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (res) => gsiCredentialHandler?.(res.credential),
  });
  gsiInitializedForClient = clientId;
}

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  disabled?: boolean;
}

export function GoogleSignInButton({ onCredential, disabled }: GoogleSignInButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    gsiCredentialHandler = (credential) => onCredentialRef.current(credential);
  });

  useEffect(() => {
    if (!clientId || disabled) return;

    const renderButton = () => {
      if (!ref.current || !window.google?.accounts?.id) return;
      ensureGsiInitialized(clientId);
      ref.current.innerHTML = '';
      const width = Math.min(360, ref.current.offsetWidth || 360);
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'outline',
        size: 'large',
        width,
        text: 'continue_with',
        locale: 'pt-BR',
      });
    };

    loadGsiScript(renderButton);
    window.addEventListener('resize', renderButton);
    return () => window.removeEventListener('resize', renderButton);
  }, [clientId, disabled]);

  if (!clientId) {
    return (
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Google Sign-In: configure VITE_GOOGLE_CLIENT_ID
      </p>
    );
  }

  return <GoogleButtonWrap ref={ref} $disabled={disabled} />;
}

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, shadows, typography } from '../../tokens';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${spacing[4]};
`;

const Box = styled.div`
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
`;

const Header = styled.div`
  padding: ${spacing[6]};
  border-bottom: 1px solid ${colors.gray200};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray900};
`;

const Body = styled.div`
  padding: ${spacing[6]};
`;

const Footer = styled.div`
  padding: ${spacing[4]} ${spacing[6]};
  border-top: 1px solid ${colors.gray200};
  display: flex;
  gap: ${spacing[3]};
  justify-content: flex-end;
`;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true">
      <Box onClick={(e) => e.stopPropagation()}>
        {title && <Header>{title}</Header>}
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Box>
    </Overlay>
  );
}

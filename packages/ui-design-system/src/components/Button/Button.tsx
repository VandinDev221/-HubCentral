import React from 'react';
import styled, { css } from 'styled-components';
import { colors, spacing, borderRadius, typography, shadows, transitions } from '../../tokens';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, ${colors.primary} 0%, #6366f1 100%);
    color: ${colors.white};
    box-shadow: 0 4px 14px -2px rgb(79 70 229 / 0.45);
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${colors.primaryHover} 0%, #4f46e5 100%);
      box-shadow: 0 6px 20px -2px rgb(79 70 229 / 0.5);
    }
  `,
  secondary: css`
    background: ${colors.gray100};
    color: ${colors.gray800};
    border: 1px solid ${colors.gray200};
    &:hover:not(:disabled) {
      background: ${colors.gray200};
      border-color: ${colors.gray300};
    }
  `,
  danger: css`
    background: ${colors.error};
    color: ${colors.white};
    &:hover:not(:disabled) {
      filter: brightness(1.08);
    }
  `,
  ghost: css`
    background: transparent;
    color: ${colors.gray700};
    &:hover:not(:disabled) {
      background: ${colors.gray100};
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: ${spacing[2]} ${spacing[4]};
    font-size: ${typography.fontSize.sm};
    border-radius: ${borderRadius.md};
  `,
  md: css`
    padding: ${spacing[3]} ${spacing[5]};
    font-size: ${typography.fontSize.md};
    border-radius: ${borderRadius.lg};
  `,
  lg: css`
    padding: ${spacing[4]} ${spacing[6]};
    font-size: ${typography.fontSize.lg};
    border-radius: ${borderRadius.lg};
  `,
};

const StyledButton = styled.button<{ $variant: Variant; $size: Size; $fullWidth?: boolean }>`
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeight.semibold};
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  transition: background ${transitions.base}, box-shadow ${transitions.base}, transform ${transitions.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} type="button" {...props}>
      {children}
    </StyledButton>
  );
}

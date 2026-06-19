import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography, shadows } from '../../tokens';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const StyledButton = styled.button<{ $variant: Variant; $size: Size }>`
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  border-radius: ${borderRadius.md};
  transition: background 0.2s, transform 0.05s;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  ${({ $variant }) =>
    $variant === 'primary' &&
    `
    background: ${colors.primary};
    color: ${colors.white};
    &:hover:not(:disabled) { background: ${colors.primaryHover}; }
  `}
  ${({ $variant }) =>
    $variant === 'secondary' &&
    `
    background: ${colors.gray200};
    color: ${colors.gray800};
    &:hover:not(:disabled) { background: ${colors.gray300}; }
  `}
  ${({ $variant }) =>
    $variant === 'danger' &&
    `
    background: ${colors.error};
    color: ${colors.white};
    &:hover:not(:disabled) { filter: brightness(1.1); }
  `}
  ${({ $variant }) =>
    $variant === 'ghost' &&
    `
    background: transparent;
    color: ${colors.gray700};
    &:hover:not(:disabled) { background: ${colors.gray100}; }
  `}
  ${({ $size }) =>
    $size === 'sm' &&
    `
    padding: ${spacing[1]} ${spacing[3]};
    font-size: ${typography.fontSize.sm};
  `}
  ${({ $size }) =>
    $size === 'md' &&
    `
    padding: ${spacing[2]} ${spacing[4]};
    font-size: ${typography.fontSize.md};
  `}
  ${({ $size }) =>
    $size === 'lg' &&
    `
    padding: ${spacing[3]} ${spacing[6]};
    font-size: ${typography.fontSize.lg};
  `}
`;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} type="button" {...props}>
      {children}
    </StyledButton>
  );
}

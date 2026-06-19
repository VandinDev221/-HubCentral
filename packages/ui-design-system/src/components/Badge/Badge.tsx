import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography } from '../../tokens';

const StyledBadge = styled.span<{ $variant: string }>`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[2]};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${borderRadius.full};
  ${({ $variant }) =>
    $variant === 'active' &&
    `background: ${colors.successLight}; color: ${colors.success};`}
  ${({ $variant }) =>
    $variant === 'suspended' &&
    `background: ${colors.errorLight}; color: ${colors.error};`}
  ${({ $variant }) =>
    $variant === 'pending' &&
    `background: ${colors.warningLight}; color: ${colors.warning};`}
  ${({ $variant }) =>
    $variant === 'overdue' &&
    `background: ${colors.errorLight}; color: ${colors.error};`}
  ${({ $variant }) =>
    $variant === 'paid' &&
    `background: ${colors.successLight}; color: ${colors.success};`}
  ${({ $variant }) =>
    $variant === 'cancelled' &&
    `background: ${colors.gray200}; color: ${colors.gray600};`}
  ${({ $variant }) =>
    !['active', 'suspended', 'pending', 'overdue', 'paid', 'cancelled'].includes($variant) &&
    `background: ${colors.gray200}; color: ${colors.gray700};`}
`;

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'suspended' | 'pending' | 'overdue' | 'paid' | 'cancelled' | string;
}

export function Badge({ children, variant = 'active' }: BadgeProps) {
  return <StyledBadge $variant={variant}>{children}</StyledBadge>;
}

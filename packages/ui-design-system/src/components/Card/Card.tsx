import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, shadows, transitions } from '../../tokens';

const StyledCard = styled.div<{ $hoverable?: boolean; $padding?: 'sm' | 'md' | 'lg' }>`
  background: ${colors.white};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.sm};
  padding: ${({ $padding }) =>
    $padding === 'sm' ? spacing[4] : $padding === 'lg' ? spacing[8] : spacing[6]};
  border: 1px solid ${colors.gray200};
  transition: box-shadow ${transitions.base}, transform ${transitions.base}, border-color ${transitions.base};

  ${({ $hoverable }) =>
    $hoverable &&
    `
    cursor: default;
    &:hover {
      box-shadow: ${shadows.md};
      border-color: ${colors.gray300};
      transform: translateY(-2px);
    }
  `}
`;

export interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, style, hoverable = false, padding = 'md' }: CardProps) {
  return (
    <StyledCard style={style} $hoverable={hoverable} $padding={padding}>
      {children}
    </StyledCard>
  );
}

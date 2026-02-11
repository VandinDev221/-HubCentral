import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, shadows } from '../../tokens';

const StyledCard = styled.div`
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  padding: ${spacing[6]};
  border: 1px solid ${colors.gray200};
`;

export interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return <StyledCard style={style}>{children}</StyledCard>;
}

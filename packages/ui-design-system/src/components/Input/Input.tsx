import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography, shadows, transitions } from '../../tokens';

const Field = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${spacing[2]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray700};
  letter-spacing: -0.01em;
`;

const StyledInput = styled.input`
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize.md};
  padding: ${spacing[3]} ${spacing[4]};
  border: 1.5px solid ${colors.gray200};
  border-radius: ${borderRadius.lg};
  background: ${colors.white};
  color: ${colors.gray900};
  width: 100%;
  box-sizing: border-box;
  transition: border-color ${transitions.base}, box-shadow ${transitions.base};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: ${shadows.glow};
  }
  &::placeholder {
    color: ${colors.gray400};
  }
  &:disabled {
    background: ${colors.gray50};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ErrorText = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.error};
  margin-top: ${spacing[2]};
  display: block;
`;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
  return (
    <Field>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput id={inputId} aria-invalid={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </Field>
  );
}

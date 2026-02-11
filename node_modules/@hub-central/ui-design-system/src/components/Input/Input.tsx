import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography } from '../../tokens';

const StyledInput = styled.input`
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize.md};
  padding: ${spacing[2]} ${spacing[3]};
  border: 1px solid ${colors.gray300};
  border-radius: ${borderRadius.md};
  background: ${colors.white};
  color: ${colors.gray800};
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }
  &::placeholder {
    color: ${colors.gray400};
  }
  &:disabled {
    background: ${colors.gray100};
    cursor: not-allowed;
  }
`;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            marginBottom: spacing[1],
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.gray700,
          }}
        >
          {label}
        </label>
      )}
      <StyledInput id={inputId} aria-invalid={!!error} {...props} />
      {error && (
        <span style={{ fontSize: typography.fontSize.xs, color: colors.error, marginTop: spacing[1], display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

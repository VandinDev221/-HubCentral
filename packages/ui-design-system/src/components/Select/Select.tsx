import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography } from '../../tokens';

const StyledSelect = styled.select`
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize.md};
  padding: ${spacing[2]} ${spacing[3]};
  border: 1px solid ${colors.gray300};
  border-radius: ${borderRadius.md};
  background: ${colors.white};
  color: ${colors.gray800};
  width: 100%;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  &:disabled {
    background: ${colors.gray100};
    cursor: not-allowed;
  }
`;

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export function Select({ label, options, error, id, ...props }: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).slice(2)}`;
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          htmlFor={selectId}
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
      <StyledSelect id={selectId} {...props}>
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </StyledSelect>
      {error && (
        <span style={{ fontSize: typography.fontSize.xs, color: colors.error, marginTop: spacing[1], display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

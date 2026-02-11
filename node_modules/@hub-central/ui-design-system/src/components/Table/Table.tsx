import React from 'react';
import styled from 'styled-components';
import { colors, spacing, typography } from '../../tokens';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${typography.fontSize.sm};
`;

const Th = styled.th`
  text-align: left;
  padding: ${spacing[3]} ${spacing[4]};
  background: ${colors.gray50};
  color: ${colors.gray700};
  font-weight: ${typography.fontWeight.semibold};
  border-bottom: 1px solid ${colors.gray200};
`;

const Td = styled.td`
  padding: ${spacing[3]} ${spacing[4]};
  border-bottom: 1px solid ${colors.gray200};
  color: ${colors.gray800};
`;

const Tr = styled.tr`
  &:hover {
    background: ${colors.gray50};
  }
`;

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
}

export function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
  return (
    <StyledTable>
      <thead>
        <tr>
          {columns.map((col) => (
            <Th key={col.key}>{col.header}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <Tr key={keyExtractor(item)}>
            {columns.map((col) => (
              <Td key={col.key}>
                {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
              </Td>
            ))}
          </Tr>
        ))}
      </tbody>
    </StyledTable>
  );
}

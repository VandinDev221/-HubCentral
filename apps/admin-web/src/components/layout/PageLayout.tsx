import styled from 'styled-components';

export const PageWrapper = styled.div`
  padding: 20px;
  padding-bottom: 88px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    padding: 28px 32px;
    padding-bottom: 32px;
  }
`;

export const PageTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
`;

export const PageSubtitle = styled.p`
  margin: 0 0 4px;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

export const TopActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  max-width: 320px;
  padding: 11px 14px 11px 42px;
  font-size: 0.875rem;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgb(79 70 229 / 0.12);
  }
  &::placeholder {
    color: var(--text-secondary);
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;

  & svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: var(--text-secondary);
    pointer-events: none;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 56px 24px;
  background: var(--surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  margin-top: 20px;
`;

export const EmptyIcon = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  background: var(--primary-light);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);

  & svg {
    width: 36px;
    height: 36px;
  }
`;

export const EmptyTitle = styled.p`
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
`;

export const EmptyText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const NewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, var(--primary) 0%, #6366f1 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 14px -2px rgb(79 70 229 / 0.4);
  transition: box-shadow 0.2s, transform 0.15s;

  &:hover {
    box-shadow: 0 6px 20px -2px rgb(79 70 229 / 0.5);
  }
  &:active {
    transform: scale(0.98);
  }

  & svg {
    width: 18px;
    height: 18px;
  }
`;

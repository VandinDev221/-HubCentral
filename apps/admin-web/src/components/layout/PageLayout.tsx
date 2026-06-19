import styled from 'styled-components';

export const PageWrapper = styled.div`
  padding: 16px;
  padding-bottom: 88px;
  width: 100%;
  box-sizing: border-box;
  @media (min-width: 1024px) {
    padding: 24px;
    padding-bottom: 24px;
  }
`;

export const PageTitle = styled.h2`
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
`;

export const PageSubtitle = styled.p`
  margin: 0 0 20px 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const TopActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  max-width: 320px;
  padding: 10px 12px 10px 40px;
  font-size: 0.875rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
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
    left: 12px;
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
  padding: 48px 24px;
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-top: 16px;
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: var(--bg);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  & svg {
    width: 40px;
    height: 40px;
  }
`;

export const EmptyTitle = styled.p`
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
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
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: var(--primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.05s;
  &:hover {
    background: #1d4ed8;
  }
  &:active {
    transform: scale(0.98);
  }
  & svg {
    width: 18px;
    height: 18px;
  }
`;

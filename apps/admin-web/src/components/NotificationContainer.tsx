import styled from 'styled-components';
import { useNotification } from '../contexts/NotificationContext';
import type { NotificationType } from '../contexts/NotificationContext';

const Wrapper = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 380px;
  pointer-events: none;
`;

const Toast = styled.div<{ $type: NotificationType }>`
  pointer-events: auto;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  animation: slideIn 0.25s ease-out;
  background: #fff;
  border-left: 4px solid;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  ${({ $type }) =>
    $type === 'success' &&
    `
    border-left-color: #16a34a;
    color: #166534;
  `}
  ${({ $type }) =>
    $type === 'error' &&
    `
    border-left-color: #dc2626;
    color: #991b1b;
  `}
  ${({ $type }) =>
    $type === 'info' &&
    `
    border-left-color: #2563eb;
    color: #1e40af;
  `}
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 18px;
  line-height: 1;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <Wrapper>
      {notifications.map((n) => (
        <Toast key={n.id} $type={n.type}>
          <span>{n.message}</span>
          <CloseBtn type="button" onClick={() => removeNotification(n.id)} aria-label="Fechar">
            ×
          </CloseBtn>
        </Toast>
      ))}
    </Wrapper>
  );
}

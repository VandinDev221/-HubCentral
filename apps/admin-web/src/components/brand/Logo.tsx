import styled from 'styled-components';

const Wrap = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  gap: ${({ $size }) => ($size === 'sm' ? '10px' : $size === 'lg' ? '16px' : '12px')};
`;

const Icon = styled.div<{ $size?: 'sm' | 'md' | 'lg'; $inverted?: boolean }>`
  width: ${({ $size }) => ($size === 'sm' ? '36px' : $size === 'lg' ? '52px' : '44px')};
  height: ${({ $size }) => ($size === 'sm' ? '36px' : $size === 'lg' ? '52px' : '44px')};
  border-radius: ${({ $size }) => ($size === 'lg' ? '14px' : '12px')};
  background: ${({ $inverted }) =>
    $inverted
      ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%)'
      : 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: ${({ $size }) => ($size === 'sm' ? '0.75rem' : $size === 'lg' ? '1.125rem' : '0.875rem')};
  letter-spacing: -0.02em;
  box-shadow: ${({ $inverted }) =>
    $inverted ? '0 8px 24px -4px rgb(79 70 229 / 0.5)' : '0 4px 12px -2px rgb(79 70 229 / 0.35)'};
  flex-shrink: 0;
`;

const Text = styled.span<{ $size?: 'sm' | 'md' | 'lg'; $light?: boolean }>`
  font-weight: 800;
  font-size: ${({ $size }) => ($size === 'sm' ? '1rem' : $size === 'lg' ? '1.5rem' : '1.125rem')};
  letter-spacing: -0.03em;
  color: ${({ $light }) => ($light ? '#fff' : 'var(--text)')};
  line-height: 1.2;
`;

const Sub = styled.span`
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.55);
  margin-top: 2px;
`;

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  inverted?: boolean;
  showSubtitle?: boolean;
}

export function Logo({ size = 'md', light = false, inverted = false, showSubtitle = false }: LogoProps) {
  return (
    <Wrap $size={size}>
      <Icon $size={size} $inverted={inverted}>
        HC
      </Icon>
      <div>
        <Text $size={size} $light={light}>
          Hub Central
        </Text>
        {showSubtitle && <Sub>Admin SaaS</Sub>}
      </div>
    </Wrap>
  );
}

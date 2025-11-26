import { render, screen } from '../utils/test-utils';
import { Badge } from '@/components/ui/badge';
import '@testing-library/jest-dom';

describe('Badge Component', () => {
  it('renders badge with text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  it('applies secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Info</Badge>);
    expect(container.firstChild).toHaveClass('bg-secondary');
  });

  it('applies outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    expect(container.firstChild).toHaveClass('border');
  });
});

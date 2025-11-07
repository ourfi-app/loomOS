/**
 * Button Component Tests
 *
 * Unit tests for the Button UI component
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render with default variant', () => {
    render(<Button>Default</Button>);
    const button = screen.getByText('Default');

    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  it('should render with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');

    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  it('should render with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText('Outline');

    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-border');
  });

  it('should render with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');

    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  it('should render with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText('Ghost');

    expect(button).toHaveClass('hover:bg-muted');
  });

  it('should render with link variant', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByText('Link');

    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('underline-offset-4');
  });

  it('should render with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');

    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-4');
  });

  it('should render with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText('Large');

    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('px-8');
  });

  it('should render with icon size', () => {
    render(<Button size="icon">⚙</Button>);
    const button = screen.getByText('⚙');

    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');

    expect(button).toHaveClass('custom-class');
  });

  it('should render with type submit', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByText('Submit');

    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render with type button', () => {
    render(<Button type="button">Button</Button>);
    const button = screen.getByText('Button');

    expect(button).toHaveAttribute('type', 'button');
  });

  it('should render with aria-label', () => {
    render(<Button aria-label="Close dialog">×</Button>);
    const button = screen.getByLabelText('Close dialog');

    expect(button).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Ref Button');
  });

  it('should have focus-visible ring styles', () => {
    render(<Button>Focus</Button>);
    const button = screen.getByText('Focus');

    expect(button).toHaveClass('focus-visible:outline-none');
    expect(button).toHaveClass('focus-visible:ring-2');
  });

  it('should have transition classes', () => {
    render(<Button>Transition</Button>);
    const button = screen.getByText('Transition');

    expect(button).toHaveClass('transition-all');
    expect(button).toHaveClass('duration-200');
  });

  it('should have rounded corners', () => {
    render(<Button>Rounded</Button>);
    const button = screen.getByText('Rounded');

    expect(button).toHaveClass('rounded-xl');
  });

  it('should combine variant and size correctly', () => {
    render(<Button variant="destructive" size="lg">Large Delete</Button>);
    const button = screen.getByText('Large Delete');

    // Should have both variant and size classes
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('h-12');
  });

  it('should support asChild prop with Slot', () => {
    render(
      <Button asChild>
        <a href="/test">Link as Button</a>
      </Button>
    );

    const link = screen.getByText('Link as Button');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should render children correctly', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should support data attributes', () => {
    render(<Button data-testid="my-button" data-custom="value">Data Button</Button>);
    const button = screen.getByTestId('my-button');

    expect(button).toHaveAttribute('data-custom', 'value');
  });

  it('should have proper accessibility attributes', () => {
    render(<Button>Accessible Button</Button>);
    const button = screen.getByText('Accessible Button');

    // Button should be accessible
    expect(button.tagName).toBe('BUTTON');
    expect(button).toBeInTheDocument();
  });
});

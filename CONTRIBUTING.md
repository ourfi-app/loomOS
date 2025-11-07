
# Contributing to Community Manager

Thank you for your interest in contributing to Community Manager! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/community-manager.git
cd community-manager
```

### 2. Set Up Development Environment

```bash
# Install dependencies
cd nextjs_space
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration

# Set up the database
yarn prisma generate
yarn prisma migrate dev
yarn prisma db seed
```

### 3. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 💻 Development Workflow

### Running the Development Server

```bash
cd nextjs_space
yarn dev
```

The app will be available at `http://localhost:3000`

### Project Structure

```
nextjs_space/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   └── dashboard/          # Main application pages
├── components/             # React components
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── webos/              # webOS-specific components
│   └── widgets/            # Dashboard widgets
├── lib/                    # Utility functions and helpers
├── hooks/                  # Custom React hooks
├── prisma/                 # Database schema and migrations
└── public/                 # Static assets
```

## 📝 Coding Standards

### TypeScript

- All new code must be written in TypeScript
- Use proper type annotations (avoid `any` unless absolutely necessary)
- Define interfaces for component props
- Use type inference where possible

**Example:**

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // Implementation
}

// Avoid
export function Button(props: any) {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper component naming (PascalCase)

**Example:**

```typescript
// components/my-component.tsx
'use client';

import { useState } from 'react';

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Use the `cn()` utility for conditional classes
- Keep custom CSS minimal

**Example:**

```typescript
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}
```

### File Organization

- One component per file
- Co-locate related files (e.g., `button.tsx`, `button.test.tsx`)
- Use barrel exports (`index.ts`) for cleaner imports
- Keep file names lowercase with hyphens

## 📦 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(dashboard): add weather widget to dashboard

Add a new weather widget that displays current conditions
and 5-day forecast using OpenWeather API.

Closes #123
```

```bash
fix(auth): resolve session timeout issue

Fixed issue where user sessions were expiring prematurely
due to incorrect token refresh logic.

Fixes #456
```

## 🔄 Pull Request Process

### Before Submitting

1. **Test Your Changes**
   ```bash
   yarn build
   yarn lint
   ```

2. **Update Documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update relevant .md files in the project

3. **Check Code Quality**
   - Ensure no console.log statements
   - Remove commented-out code
   - Follow the coding standards

### Submitting a PR

1. **Push Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Description Should Include:**
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (if UI changes)
   - Related issue numbers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

### Review Process

- At least one maintainer must approve
- All CI checks must pass
- Address review comments promptly
- Be open to feedback and suggestions

## 🧪 Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Writing Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public functions
- Include parameter descriptions and return types
- Provide usage examples

**Example:**

```typescript
/**
 * Formats a date string into a human-readable format
 * 
 * @param date - The date to format (ISO string or Date object)
 * @param format - The desired format ('short' | 'long' | 'relative')
 * @returns Formatted date string
 * 
 * @example
 * formatDate('2024-01-15', 'short') // "Jan 15, 2024"
 * formatDate(new Date(), 'relative') // "2 hours ago"
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  // Implementation
}
```

### Component Documentation

For complex components, add a README:

```markdown
# Component Name

## Usage

\`\`\`tsx
import { ComponentName } from '@/components/component-name';

function Example() {
  return <ComponentName prop1="value" />;
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | - | Description of prop1 |
| prop2 | number | 0 | Description of prop2 |

## Examples

### Basic Usage
\`\`\`tsx
<ComponentName prop1="value" />
\`\`\`

### Advanced Usage
\`\`\`tsx
<ComponentName 
  prop1="value"
  prop2={42}
  onEvent={() => console.log('event')}
/>
\`\`\`
```

## 🤔 Questions?

- **GitHub Discussions**: For general questions and discussions
- **GitHub Issues**: For bugs and feature requests
- **Email**: support@yourdomain.com

## 📄 License

By contributing to Community Manager, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Community Manager! 🎉**

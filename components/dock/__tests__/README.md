# Dock Component Tests

This directory contains tests for the Unified Dock component.

## Test Files

- **dockHelpers.test.ts** - Tests for utility functions in `utils/dockHelpers.ts`

## Running Tests

```bash
# Run all dock tests
npm test -- components/dock

# Run in watch mode
npm test -- components/dock --watch

# With coverage
npm test -- components/dock --coverage
```

## Test Coverage Goals

- **Utilities**: 90%+ coverage
- **Hooks**: 80%+ coverage  
- **Components**: 70%+ coverage
- **Overall**: 80%+ coverage

## Writing Tests

When adding new features:

1. Write tests for utility functions first
2. Test hooks with React Testing Library
3. Test components with user interactions
4. Ensure accessibility is tested

## Test Structure

```typescript
describe('ComponentName or FunctionName', () => {
  describe('specific feature or method', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Mocking

Common mocks used:

- `useSession` from next-auth
- `useRouter` from next/navigation
- Store hooks (useCardManager, useAppPreferences, etc.)
- Toast notifications

## Accessibility Testing

All interactive components should be tested for:

- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader announcements

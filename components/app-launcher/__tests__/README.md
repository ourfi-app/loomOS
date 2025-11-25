# App Launcher Tests

This directory contains unit tests for the unified App Launcher component.

## Test Files

- `appFilters.test.ts` - Tests for filtering and sorting utilities
- `appGrouping.test.ts` - Tests for category grouping utilities

## Running Tests

To run all tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm test -- --watch
```

To run tests with coverage:
```bash
npm test -- --coverage
```

## Test Coverage Goals

- **Utilities**: 90%+ coverage
- **Hooks**: 80%+ coverage
- **Components**: 70%+ coverage
- **Overall**: 80%+ coverage

## Writing New Tests

When adding new tests:

1. Follow the existing naming conventions
2. Use descriptive test names
3. Test both happy paths and edge cases
4. Mock external dependencies
5. Keep tests isolated and independent

## Test Structure

```typescript
describe('Component/Function Name', () => {
  it('should do something', () => {
    // Arrange
    const input = ...;
    
    // Act
    const result = ...;
    
    // Assert
    expect(result).toBe(...);
  });
});
```

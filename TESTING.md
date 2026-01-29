# Testing Guidelines

This project uses **Vitest** and **React Testing Library** for testing.

## Running Tests

- Run all tests: `npm test`
- Run tests in UI mode: `npm test --ui`
- Run coverage: `npm test --coverage` (requires configuring c8/v8)

## Testing Policy

1. **New Features Require Tests**: Every new feature or component MUST include corresponding unit or integration tests.
2. **Bug Fixes Require Tests**: When fixing a bug, verify the fix with a regression test.
3. **Structure**:
   - Place tests in a `__tests__` directory next to the file being tested, or inside the same directory with `.test.tsx` extension.
   - Follow the naming convention: `[filename].test.tsx` or `[filename].test.ts`.

## Boilerplate

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Component from '../Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
```

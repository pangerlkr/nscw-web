```markdown
# test Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `test` JavaScript repository. It covers file naming, import/export styles, commit message standards, and testing approaches. By following these guidelines, contributors can maintain consistency and quality across the codebase.

## Coding Conventions

### File Naming
- **Pattern:** PascalCase
- **Example:**  
  ```text
  MyComponent.js
  UserService.js
  ```

### Import Style
- **Pattern:** Relative imports
- **Example:**
  ```javascript
  import { fetchData } from './FetchData';
  import { UserService } from '../services/UserService';
  ```

### Export Style
- **Pattern:** Named exports
- **Example:**
  ```javascript
  // In MyComponent.js
  export function MyComponent() { ... }

  // In UserService.js
  export const UserService = { ... };
  ```

### Commit Messages
- **Pattern:** Conventional commits
- **Prefix:** `feat`
- **Average Length:** 54 characters
- **Example:**
  ```
  feat: add user authentication to login page
  ```

## Workflows

### Creating a New Feature
**Trigger:** When adding new functionality to the codebase  
**Command:** `/new-feature`

1. Create a new file using PascalCase naming.
2. Implement the feature with named exports.
3. Use relative imports for dependencies.
4. Write a test file matching `*.test.*` pattern.
5. Commit changes using the `feat` prefix in the commit message.

### Writing and Running Tests
**Trigger:** When validating code with tests  
**Command:** `/run-tests`

1. Create or update test files following the `*.test.*` naming convention.
2. Use the unknown (custom or unspecified) testing framework as per project setup.
3. Run tests using the project's test runner (consult project documentation if unsure).
4. Review and fix any failing tests.

## Testing Patterns

- **File Pattern:** `*.test.*` (e.g., `MyComponent.test.js`)
- **Framework:** Unknown (refer to project documentation)
- **Example:**
  ```javascript
  // MyComponent.test.js
  import { MyComponent } from './MyComponent';

  test('should render correctly', () => {
    // Test implementation here
  });
  ```

## Commands
| Command        | Purpose                                   |
|----------------|-------------------------------------------|
| /new-feature   | Start a new feature with proper conventions|
| /run-tests     | Run all tests in the repository           |
```

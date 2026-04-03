```markdown
# test Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns, coding conventions, and workflows used in the `test` JavaScript repository. The repository emphasizes clear, conventional commit messages, consistent file naming and import/export styles, and a focused iterative workflow for rapid bugfixing in scripts.

## Coding Conventions

- **File Naming:**  
  Use `snake_case` for all file names.
  ```
  // Good
  user_profile.js
  dev_server.js

  // Bad
  UserProfile.js
  userProfile.js
  ```

- **Import Style:**  
  Use relative imports for modules.
  ```js
  import { startServer } from './dev_server.js';
  ```

- **Export Style:**  
  Use named exports.
  ```js
  // In dev_server.js
  export function startServer() { ... }
  export const SERVER_PORT = 3000;
  ```

- **Commit Messages:**  
  Follow the conventional commit format, using prefixes like `fix` and `feat`.
  ```
  fix: resolve security vulnerability in dev_server.js
  feat: add logging to user_profile.js
  ```

## Workflows

### Iterative Bugfix on Single Script
**Trigger:** When a bug or security vulnerability is discovered in a script file and requires rapid, repeated fixes.  
**Command:** `/fix-script-iteratively`

1. **Identify the Issue:**  
   Locate the bug or vulnerability in the target script (e.g., `scripts/dev_server.js`).
2. **Apply a Fix:**  
   Make the necessary code changes to address the issue.
   ```js
   // Example fix in dev_server.js
   export function sanitizeInput(input) {
     return input.replace(/[^\w\s]/gi, '');
   }
   ```
3. **Commit the Change:**  
   Use a conventional commit message:
   ```
   fix: sanitize user input in dev_server.js
   ```
4. **Test the Fix:**  
   Run the relevant test(s) or manual checks to verify the fix.
5. **Iterate if Needed:**  
   If the issue persists, repeat steps 2–4 until resolved.
6. **Finalize:**  
   Once the issue is fixed, ensure all tests pass and code is reviewed.

## Testing Patterns

- **Test Files:**  
  Test files follow the `*.test.*` naming pattern (e.g., `dev_server.test.js`).
- **Framework:**  
  The specific testing framework is not detected; use standard JavaScript testing practices.
- **Example Test File:**
  ```js
  // dev_server.test.js
  import { sanitizeInput } from './dev_server.js';

  test('sanitizeInput removes special characters', () => {
    expect(sanitizeInput('hello<script>')).toBe('hello script');
  });
  ```

## Commands
| Command                 | Purpose                                                        |
|-------------------------|----------------------------------------------------------------|
| /fix-script-iteratively | Start or document an iterative bugfix workflow on a script     |
```

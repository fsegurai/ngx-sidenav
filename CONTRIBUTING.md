# 🙌 Contributing to ngx-sidenav

Thanks for your interest in improving the **ngx-sidenav** project! Whether it's fixing bugs, improving documentation, or suggesting new features—your help is welcome 🙏

---

## 🚀 Getting Started

> **Requirements**  
> Ensure you're using **Node.js v20.x** and **Bun v1.1.x** or higher.

### 1. Clone the Repository

```bash
git clone https://github.com/fsegurai/ngx-sidenav.git
cd ngx-sidenav
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Build the Library

```bash
bun run build:lib
```

### 4. Start Development Server

```bash
bun start
```

This will start the demo application at [http://localhost:4200](http://localhost:4200) where you can test your changes.

---

## 📁 Project Structure

The ngx-sidenav project follows Angular's library development best practices:

```
ngx-sidenav/
├── lib/                          # Library source code
│   ├── src/
│   │   ├── components/           # Sidenav components
│   │   │   ├── sidenav/         # Main sidenav component
│   │   │   ├── sidenav-menu/    # Menu component
│   │   │   └── link-item/       # Link item component
│   │   ├── directives/          # Custom directives
│   │   ├── interfaces/          # TypeScript interfaces
│   │   ├── services/            # Angular services
│   │   └── types/               # Type definitions
│   └── public_api.ts            # Library public API
├── demo/                        # Demo application
│   └── src/
│       ├── app/
│       │   ├── features/        # Demo features
│       │   └── core/            # Core demo functionality
│       └── scss/                # Demo styling
└── README.md                    # Documentation
```

---

## 🧪 Running Tests

To run the full test suite:

```bash
bun test
```

To run tests in watch mode during development:

```bash
bun test:watch
```

To run tests:

```bash
bun run test-local:lib
```

### SCSS Structure

- Keep styles scoped to components
- Use BEM methodology for class naming
- Leverage CSS custom properties for theming
- Follow Material Design principles

---

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for all public APIs
- Document complex logic and algorithms
- Include usage examples in component documentation

### README Updates

When adding new features:

1. Update the main README.md with usage examples
2. Add new configuration options to the documentation
3. Include TypeScript interfaces and examples

---

## 🔍 Code Quality

### ESLint Configuration

The project uses ESLint with Angular-specific rules. Run linting with:

```bash
git commit -m "feat: new feature for ngx-sidenav"
```

---

## ✍️ Commit Message Convention

This project follows **[Conventional Commits](https://www.conventionalcommits.org/)**.

| Type        | Description                           |
|-------------|---------------------------------------|
| `feat:`     | New feature                           |
| `fix:`      | Bug fix                               |
| `docs:`     | Documentation only changes            |
| `refactor:` | Code refactoring (no behavior change) |
| `test:`     | Adding or fixing tests                |
| `chore:`    | Maintenance tasks, build config       |
| `del:`      | File or code removal                  |

Example:

```bash
bun run lint
```

### Type Safety

- Use strict TypeScript configuration
- Avoid `any` type; prefer `unknown` when type is uncertain
- Leverage type inference when the type is obvious

---

## 🚀 Pull Request Process

### Before Submitting

1. **Test your changes:**
   ```bash
   bun run test-local:lib
   ```

   Ensure all tests pass and coverage is enough.
   bun lint
   bun build:lib
   ```

2. **Update documentation:**
   - Add/update README examples
   - Update CHANGELOG.md
   - Add JSDoc comments for new APIs

3. **Verify demo application:**
   ```bash
   bun start
   ```
   Test your changes in the demo app

### PR Guidelines

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write clear commit messages:**
   ```
   feat: add resizable sidenav support
   
   - Add minWidth and maxWidth inputs
   - Implement mouse and keyboard resizing
   - Add resize event output
   ```

3. **Keep PRs focused:**
   - One feature or fix per PR
   - Include tests for new functionality
   - Update documentation

4. **PR Title Format:**
   - `feat: description` for new features
   - `fix: description` for bug fixes
   - `docs: description` for documentation
   - `refactor: description` for refactoring

---

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Angular version**
2. **ngx-sidenav version**
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Minimal reproduction example**

---

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** and motivation
3. **Provide examples** of the desired API
4. **Consider backward compatibility**

---

## 🤝 Code of Conduct

This project follows the [Angular Code of Conduct](https://github.com/angular/angular/blob/main/CODE_OF_CONDUCT.md). Please be respectful and inclusive in all interactions.

---

## 📞 Getting Help

- **GitHub Issues:** For bugs and feature requests
- **GitHub Discussions:** For questions and community support
- **Documentation:** Check the README.md for usage examples

Thank you for contributing to ngx-sidenav! 🎉

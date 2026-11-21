# 🙌 Contributing to ngx-sidenav

Thanks for your interest in improving the **ngx-sidenav** project! Whether it's fixing bugs, improving documentation, or suggesting new features—your help is welcome 🙏

---

## 🚀 Getting Started

> **Requirements**  
> **Node.js >= 24.15**, **Bun >= 1.4** and **npm >= 11** (see `engines` in `package.json`).

### 1. Clone the Repository

```bash
git clone https://github.com/fsegurai/ngx-sidenav.git
cd ngx-sidenav
```

### 2. Install Dependencies

```bash
bun install
```

`bun install` also installs the Husky git hooks (`prepare`).

### 3. Build the Library

```bash
bun run build:lib
```

The demo consumes the **built** library: the root `tsconfig.json` maps `ngx-sidenav` to `dist/lib`.

### 4. Start Development Server

```bash
bun start
```

This runs the library watch build (`watch:lib`) and the demo dev server together, at
[http://localhost:4200](http://localhost:4200).

---

## 📁 Project Structure

```
ngx-sidenav/
├── lib/                          # Library source code
│   ├── src/
│   │   ├── components/           # sidenav, sidenav-menu, sidenav-search, link-item
│   │   ├── directives/           # ContentAreaDirective
│   │   ├── interfaces/           # StackMenuItem, stack items
│   │   ├── manifest/             # withManifest, fromManifestGenerator, SidenavManifestService
│   │   ├── providers/            # provideSidenav
│   │   ├── search/               # withSearchIndex, ranking, SidenavSearchService
│   │   ├── services/             # SidenavService, labels
│   │   └── types/                # Stack types and guards
│   └── public_api.ts             # Library public API
├── demo/                         # Demo application (dogfoods the library)
├── docs/<version>/               # Versioned docs: content/*.md, manifest.json, search-index.json
└── README.md
```

> The library must use relative imports only: `check:lib-imports` (run by `build:lib`) fails on aliased or self
> imports, which ng-packagr does not rewrite.

---

## 🧪 Running Tests

Tests run with Vitest (jsdom) through the Angular CLI `@angular/build:unit-test` builder.

| Command                           | What it does                                      |
|-----------------------------------|---------------------------------------------------|
| `bun run test-local:lib`          | Library specs in watch mode                       |
| `bun run test-ci_cd:lib`          | Library specs once (CI)                           |
| `bun run test-ci_cd:coverage:lib` | Library specs with coverage                       |
| `bun run test-local:demo`         | Demo smoke specs in watch mode                    |
| `bun run test-ci_cd:demo`         | Demo smoke specs once (builds the library first)  |
| `bun run type-check:lib`          | Type-checks the library and its specs             |
| `bun run type-check:demo`         | Type-checks the demo                              |

### SCSS Structure

- Keep styles scoped to components
- Use BEM methodology for class naming
- Expose theming through `--ngx-sidenav-*` CSS custom properties

---

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for all public APIs
- Document complex logic and algorithms

### README and docs

When adding new features:

1. Update `README.md` with usage examples
2. Update the pages under `docs/<version>/content/` and run `bun run generate:manifest`
3. Add an entry to `CHANGELOG.md`

---

## 🔍 Code Quality

The project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
bun run lint:check   # lint + format check (what CI and the pre-push hook run)
bun run lint:fix     # apply safe fixes and formatting
```

Husky runs `lint:fix` on `pre-commit` and `format:audit` on `pre-push`.

### Type Safety

- Use strict TypeScript configuration
- Avoid `any` type; prefer `unknown` when type is uncertain
- Leverage type inference when the type is obvious

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
| `build:`    | Build system or dependencies          |
| `ci:`       | CI workflows                          |
| `chore:`    | Maintenance tasks                     |

Example:

```bash
git commit -m "feat(menu): render deprecated items with a badge"
```

---

## 🚀 Pull Request Process

### Before Submitting

1. **Check your changes:**

   ```bash
   bun run lint:check
   bun run type-check:lib && bun run type-check:demo
   bun run test-ci_cd:lib && bun run test-ci_cd:demo
   bun run build:lib && bun run build:demo
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

# 📦 Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

---

## [Unreleased]

---

## [20.0.0] - 2025-xx-xx

### 🚀 Added

- **Sidenav Component** — A flexible and customizable sidenav component with resizing, collapsing, and positioning
  capabilities.
- **SidenavMenu Component** — A hierarchical menu component supporting nested navigation with breadcrumb-style parent
  tracking.
- **LinkItem Component** — A reusable link component for navigation items with router integration.
- **Stack-based Navigation** — Support for pushing/popping menu levels and custom components in the sidenav.
- **Custom Component Support** — Ability to render custom Angular components within the sidenav using
  `ComponentStackItem`.
- **Resizable Sidenav** — Interactive resizing with configurable min/max width constraints and keyboard navigation.
- **Multi-directional Support** — Left/right positioning with RTL (right-to-left) text direction support.
- **Advanced Menu Features** — Support for badges, icons (Material, SVG, custom), tooltips, and menu item states.
- **ContentAreaDirective** — Directive for managing dynamic content areas within the sidenav.
- **SidenavService** — Centralized service for managing sidenav state, navigation stack, and component rendering.
- **TypeScript Interfaces** — Comprehensive type definitions for `StackMenuItem`, `ComponentStackItem`, and
  `MenuStackItem`.
- **Responsive Design** — Backdrop support and responsive behavior for mobile and desktop experiences.

### 🛠 Changed

- Refactored all components to use Angular standalone architecture with signals.
- Updated components to leverage Angular v20+ features including `input()` and `output()` functions.
- Implemented modern control flow syntax (`@if`, `@for`) in templates.
- Enhanced SCSS structure with CSS custom properties for theming support.
- Optimized change detection strategy using `ChangeDetectionStrategy.OnPush` across all components.
- Improved accessibility with keyboard navigation and focus management.

### 📋 Features

#### Sidenav Component Features

- **Dynamic Sizing**: Configurable `minWidth`, `maxWidth`, `initialWidth`, and `collapseWidth`
- **Interactive Resizing**: Mouse and keyboard-based resizing with visual feedback
- **Positioning**: Left/right positioning with RTL text direction support
- **State Management**: Collapsible state with customizable expand/collapse icons
- **Cache Management**: Optional cache clearing on reload
- **Event Handling**: `opened`, `closed`, and `resized` output events

#### Menu System Features

- **Hierarchical Navigation**: Support for nested menu items with unlimited depth
- **Rich Menu Items**: Labels, icons, badges, tooltips, summaries, and custom properties
- **Icon Support**: Material Icons, SVG, and custom icon types
- **Router Integration**: Seamless Angular Router integration with active state detection
- **Component Rendering**: Ability to push custom Angular components to the navigation stack

#### Advanced Capabilities

- **Stack Navigation**: Push/pop navigation similar to mobile app navigation patterns
- **Component Data Passing**: Pass data to custom components via `componentData`
- **Serializable State**: Menu state persistence with localStorage support
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Modern Angular**: Built with signals, standalone components, and latest Angular features

---

## 📦 Dependencies

### Runtime

- Angular 20+ — Leveraging the latest features like signals and standalone components.
- SCSS — For styling and theming.

### Development

- [`bun`](https://bun.sh/) — JS runtime and package manager.
- [`typescript`](https://www.typescriptlang.org/) — Static type checking.
- [`eslint`](https://eslint.org/) — Code linting and formatting.
- [`karma`](https://karma-runner.github.io/) — Test runner.
- [`jest`](https://jestjs.io/) — Testing framework.

---

## 🔁 Migration Guide

### From 0.x → 20.0.0

- Refactor components to use standalone architecture.
- Replace `@Input` and `@Output` decorators with signal-based inputs and outputs.
- Update templates to use Angular's native control flow (`@if`, `@for`, etc.).
- Update SCSS files to align with the new theming structure.

---

## 💥 Breaking Changes

- Components now require Angular 20+ due to the use of signals and standalone architecture.
- Removed zone.js dependency for better performance and modern Angular practices. Now it's zone-less.
- Removed support for `ngClass` and `ngStyle` in favor of class and style bindings.
- Updated utility function signatures for consistency.

---

## ✅ Compatibility

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Angular 20+ required
- ⚠️ Internet Explorer is **not supported**

---

[unreleased]: https://github.com/fsegurai/ngx-shared-docs/compare/v20.0.0...HEAD

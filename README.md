<p align="center" class="intro">
  <img alt="NGX Sidenav Logo" src="https://raw.githubusercontent.com/fsegurai/ngx-sidenav/main/public/ngx-sidenav.png">
</p>

<p align="center" class="intro">
  <a href="https://github.com/fsegurai/ngx-sidenav">
      <img src="https://img.shields.io/azure-devops/build/fsegurai/93779823-473d-4fb3-a5b1-27aaa1a88ea2/30/main?label=Build%20Status&"
          alt="Build Main Status">
  </a>
  <a href="https://github.com/fsegurai/ngx-sidenav/releases/latest">
      <img src="https://img.shields.io/github/v/release/fsegurai/ngx-sidenav"
          alt="Latest Release">
  </a>
  <br>
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/fsegurai/ngx-sidenav">
  <img alt="Dependency status for repo" src="https://img.shields.io/librariesio/github/fsegurai/ngx-sidenav">
  <a href="https://opensource.org/licenses/MIT">
    <img alt="GitHub License" src="https://img.shields.io/github/license/fsegurai/ngx-sidenav">
  </a>
  <br>
  <img alt="Stars" src="https://img.shields.io/github/stars/fsegurai/ngx-sidenav?style=square&labelColor=343b41"/> 
  <img alt="Forks" src="https://img.shields.io/github/forks/fsegurai/ngx-sidenav?style=square&labelColor=343b41"/>
  <a href="https://www.npmjs.com/package/@fsegurai/ngx-sidenav">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dt/@fsegurai/ngx-sidenav">
  </a>
</p>

`@fsegurai/ngx-sidenav` is a modern, flexible, and feature-rich sidenav component library for Angular applications. Built with Angular's latest features, including signals, standalone components, and the new control flow syntax.

## ✨ Features

- 🎯 **Modern Angular**: Built with Angular 20+ features (signals, standalone components, control flow)
- 📱 **Responsive Design**: Adaptive layout with collapsible and resizable functionality
- 🔄 **Dynamic Content**: Support for both declarative HTML and programmatic content management
- 🎨 **Customizable**: Extensive theming and styling options
- 🚀 **Performance**: Optimized with OnPush change detection and signals
- 💾 **Persistent State**: Auto-save/restore sidenav state and navigation stack
- 🧩 **Component Support**: Render custom Angular components within the sidenav
- 🎪 **Animations**: Smooth transitions and visual feedback

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Patterns](#usage-patterns)
  - [Declarative HTML Usage](#declarative-html-usage)
  - [Programmatic Service Usage](#programmatic-service-usage)
- [API Reference](#api-reference)
- [Advanced Examples](#advanced-examples)
- [Demo Application](#demo-application)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

```bash
npm install @fsegurai/ngx-sidenav --save
```

## ⚡ Quick Start

```typescript
import { Component, signal } from '@angular/core';
import { Sidenav, SidenavMenu, StackMenuItem } from '@fsegurai/ngx-sidenav';

@Component({
  selector: 'app-root',
  imports: [Sidenav, SidenavMenu],
  template: `
    <ngx-sidenav
      [minWidth]="200"
      [maxWidth]="400"
      [canResize]="true"
      [canCollapse]="true">
      
      <ngx-sidenav-menu [items]="menuItems()"></ngx-sidenav-menu>
    </ngx-sidenav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly menuItems = signal<StackMenuItem[]>([
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      iconType: 'material'
    },
    {
      label: 'Settings',
      icon: 'settings',
      iconType: 'material',
      children: [
        { label: 'Profile', route: '/settings/profile' },
        { label: 'Security', route: '/settings/security' }
      ]
    }
  ]);
}
```

## 🔧 Usage Patterns

### Declarative HTML Usage

Perfect for static menu structures defined at compile time:

```typescript
import { Component, signal } from '@angular/core';
import { Sidenav, SidenavMenu, StackMenuItem } from '@fsegurai/ngx-sidenav';

@Component({
  selector: 'app-declarative',
  imports: [Sidenav, SidenavMenu],
  template: `
    <ngx-sidenav
      [minWidth]="250"
      [maxWidth]="500"
      [initialWidth]="320"
      [canResize]="true"
      [canCollapse]="true"
      [position]="'left'"
      [backdrop]="false"
      (opened)="onSidenavOpened()"
      (closed)="onSidenavClosed()"
      (resized)="onSidenavResized($event)">

      <!-- Static menu content -->
      <ngx-sidenav-menu 
        [items]="menuItems()"
        [parentLabel]="'Main Menu'">
      </ngx-sidenav-menu>
      
      <!-- Custom content can also be added -->
      <div class="user-profile">
        <img [src]="userAvatar()" alt="User Avatar">
        <span>{{ userName() }}</span>
      </div>
    </ngx-sidenav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativeComponent {
  protected readonly menuItems = signal<StackMenuItem[]>([
    { label: 'Navigation', isTitle: true },
    {
      label: 'Analytics',
      icon: 'analytics',
      iconType: 'material',
      badge: '5',
      badgeColor: 'primary',
      children: [
        { 
          label: 'Overview', 
          route: '/analytics/overview',
          summary: 'View key metrics and insights'
        },
        { 
          label: 'Reports', 
          route: '/analytics/reports',
          icon: 'assessment',
          badge: 'NEW'
        },
        {
          label: 'Performance',
          icon: 'speed',
          children: [
            { label: 'Load Times', route: '/analytics/performance/load' },
            { label: 'Memory Usage', route: '/analytics/performance/memory' }
          ]
        }
      ]
    },
    {
      label: 'User Management',
      icon: 'people',
      route: '/users',
      tooltip: 'Manage application users'
    },
    { label: 'Tools', isTitle: true },
    {
      label: 'Settings',
      icon: 'settings',
      disabled: false,
      children: [
        { label: 'General', route: '/settings/general' },
        { label: 'Security', route: '/settings/security' },
        { label: 'Notifications', route: '/settings/notifications' }
      ]
    }
  ]);

  protected readonly userAvatar = signal('/assets/user-avatar.jpg');
  protected readonly userName = signal('John Doe');

  onSidenavOpened() {
    console.log('Sidenav opened');
  }

  onSidenavClosed() {
    console.log('Sidenav closed');
  }

  onSidenavResized(width: number) {
    console.log('Sidenav resized to:', width);
  }
}
```

### Programmatic Service Usage

Ideal for dynamic content management and complex navigation flows:

```typescript
import { Component, inject, signal } from '@angular/core';
import { Sidenav, SidenavService, MenuStackItem, ComponentStackItem } from '@fsegurai/ngx-sidenav';

@Component({
  selector: 'app-programmatic',
  imports: [Sidenav],
  template: `
    <div class="app-container">
      <!-- Sidenav will be populated programmatically -->
      <ngx-sidenav [canResize]="true">
        <!-- Content will be dynamically injected here -->
      </ngx-sidenav>
      
      <main class="main-content">
        <div class="controls">
          <button (click)="showDashboard()">Dashboard Menu</button>
          <button (click)="showUserProfile()">User Profile</button>
          <button (click)="showSettings()">Settings</button>
          <button (click)="showCustomWidget()">Custom Widget</button>
          <button (click)="goBack()" [disabled]="!canGoBack()">
            ← Back
          </button>
        </div>
        
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
    }
    
    .main-content {
      flex: 1;
      padding: 2rem;
    }
    
    .controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .controls button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
    
    .controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgrammaticComponent {
  private readonly sidenavService = inject(SidenavService);
  
  // Computed signal to track navigation state
  protected readonly canGoBack = this.sidenavService.canGoBack;

  showDashboard() {
    const dashboardMenu: MenuStackItem = {
      type: 'menu',
      title: 'Dashboard',
      items: [
        {
          label: 'Overview',
          icon: 'dashboard',
          route: '/dashboard/overview',
          iconType: 'material'
        },
        {
          label: 'Analytics',
          icon: 'analytics',
          badge: '12',
          badgeColor: 'accent',
          children: [
            { label: 'Traffic', route: '/dashboard/traffic' },
            { label: 'Conversions', route: '/dashboard/conversions' },
            { label: 'Revenue', route: '/dashboard/revenue' }
          ]
        },
        {
          label: 'Reports',
          icon: 'assessment',
          route: '/dashboard/reports'
        }
      ]
    };

      this.sidenavService.push({ type: 'menu', items: dashboardMenu});
  }

  showUserProfile() {
    const profileMenu: MenuStackItem = {
      type: 'menu',
      title: 'User Profile',
      badge: '3',
      badgeColor: 'primary',
      items: [
        {
          label: 'Personal Info',
          icon: 'person',
          route: '/profile/personal',
          summary: 'Manage your personal information'
        },
        {
          label: 'Account Settings',
          icon: 'settings',
          children: [
            { label: 'Password', route: '/profile/password' },
            { label: 'Two-Factor Auth', route: '/profile/2fa' },
            { label: 'API Keys', route: '/profile/api-keys' }
          ]
        },
        {
          label: 'Preferences',
          icon: 'tune',
          route: '/profile/preferences'
        },
        { label: 'Danger Zone', isTitle: true },
        {
          label: 'Delete Account',
          icon: 'delete_forever',
          route: '/profile/delete',
          disabled: false
        }
      ]
    };

      this.sidenavService.push({ type: 'menu', items: profileMenu});
  }

  showSettings() {
    const settingsMenu: MenuStackItem = {
      type: 'menu',
      title: 'Application Settings',
      items: [
        { label: 'General', isTitle: true },
        {
          label: 'Theme',
          icon: 'palette',
          children: [
            { label: 'Light Mode', route: '/settings/theme/light' },
            { label: 'Dark Mode', route: '/settings/theme/dark' },
            { label: 'Auto', route: '/settings/theme/auto' }
          ]
        },
        {
          label: 'Language',
          icon: 'language',
          route: '/settings/language'
        },
        { label: 'Advanced', isTitle: true },
        {
          label: 'Developer Tools',
          icon: 'code',
          children: [
            { label: 'API Console', route: '/settings/api-console' },
            { label: 'Debug Mode', route: '/settings/debug' },
            { label: 'Feature Flags', route: '/settings/features' }
          ]
        }
      ]
    };

      this.sidenavService.push({ type: 'menu', items: settingsMenu});
  }

  showCustomWidget() {
    // Example of pushing a custom component
    const widgetComponent: ComponentStackItem = {
      type: 'component',
      component: CustomWidgetComponent,
      componentData: {
        title: 'System Status',
        data: {
          uptime: '99.9%',
          activeUsers: 1234,
          systemHealth: 'excellent'
        }
      }
    };

      this.sidenavService.push({ type: 'component', component: widgetComponent});
  }

  async goBack() {
    await this.sidenavService.pop();
  }

  // Initialize with default menu
  ngOnInit() {
    this.showDashboard();
  }
}

// Example custom component for the sidenav
@Component({
  selector: 'custom-widget',
  template: `
    <div class="widget-container">
      <h3>{{ title() }}</h3>
      
      <div class="metrics">
        @for (metric of metrics(); track metric.label) {
          <div class="metric">
            <span class="label">{{ metric.label }}</span>
            <span class="value" [class]="metric.status">{{ metric.value }}</span>
          </div>
        }
      </div>
      
      <div class="actions">
        <button (click)="refresh()">Refresh</button>
        <button (click)="exportData()">Export</button>
      </div>
    </div>
  `,
  styles: [`
    .widget-container {
      padding: 1.5rem;
    }
    
    .metrics {
      margin: 1rem 0;
    }
    
    .metric {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .value.excellent { color: #4caf50; }
    .value.good { color: #ff9800; }
    .value.poor { color: #f44336; }
    
    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .actions button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomWidgetComponent {
  readonly title = input.required<string>();
  readonly data = input.required<any>();

  protected readonly metrics = computed(() => [
    { label: 'Uptime', value: this.data().uptime, status: 'excellent' },
    { label: 'Active Users', value: this.data().activeUsers.toLocaleString(), status: 'good' },
    { label: 'System Health', value: this.data().systemHealth, status: 'excellent' }
  ]);

  refresh() {
    console.log('Refreshing widget data...');
  }

  exportData() {
    console.log('Exporting data...');
  }
}
```

## 📚 API Reference

### Components

#### `<ngx-sidenav>`

The main sidenav container component.

**Properties:**
- `minWidth: number` - Minimum width (default: 250)
- `maxWidth: number` - Maximum width (default: 600)  
- `initialWidth: number` - Initial width (default: 300)
- `collapseWidth: number` - Width when collapsed (default: 30)
- `canResize: boolean` - Enable resizing (default: true)
- `canCollapse: boolean` - Enable collapsing (default: true)
- `position: 'left' | 'right'` - Position (default: 'left')
- `direction: 'ltr' | 'rtl'` - Text direction (default: 'ltr')
- `backdrop: boolean` - Show backdrop (default: false)
- `clearCacheOnReload: boolean` - Clear cache on reload (default: false)
- `menuIconCollapse: string` - Collapse icon (default: 'menu_open')
- `menuIconExpand: string` - Expand icon (default: 'menu')

**Events:**
- `opened()` - Sidenav opened
- `closed()` - Sidenav closed  
- `resized(width: number)` - Sidenav resized

#### `<ngx-sidenav-menu>`

Menu component for displaying navigation items.

**Properties:**
- `items: StackMenuItem[]` - Menu items array
- `parentLabel: string` - Parent menu label
- `parentBadge: string` - Parent menu badge
- `parentBadgeColor: string` - Parent badge color

### Interfaces

#### `StackMenuItem`

```typescript
interface StackMenuItem {
  label: string;
  icon?: string;
  iconType?: 'material' | 'svg' | 'custom';
  route?: string;
  children?: StackMenuItem[];
  isParent?: boolean;
  isTitle?: boolean;
  tooltip?: string;
  badge?: string | number;
  badgeColor?: string;
  disabled?: boolean;
  summary?: string;
  tags?: string[];
  [key: string]: unknown; // Custom properties
}
```

#### `MenuStackItem`

```typescript
interface MenuStackItem {
  type: 'menu';
  title?: string;
  badge?: string;
  badgeColor?: string;
  items: StackMenuItem[];
}
```

#### `ComponentStackItem`

```typescript
interface ComponentStackItem {
  type: 'component';
  component: Type<any>;
  componentData?: Record<string, any>;
}
```

### SidenavService

The service for programmatic sidenav management.

#### Methods

- `push(item: MenuStackItem | ComponentStackItem): Promise<void>` - Add item to navigation stack
- `pop(): Promise<void>` - Remove current item from stack
- `toggleSidenav(): void` - Toggle sidenav open/closed state
- `setSidenavWidth(width: number): void` - Set sidenav width
- `setConfig(config: SidenavConfig): void` - Configure sidenav settings
- `clearOnNextReload(): void` - Clear state on next page reload

#### Signals

- `isExpanded: Signal<boolean>` - Sidenav expanded state
- `sidenavWidth: Signal<number>` - Current sidenav width
- `currentMenu: Signal<MenuStackItem | undefined>` - Current menu
- `canGoBack: Signal<boolean>` - Whether back navigation is available
- `minWidth: Signal<number>` - Minimum width
- `maxWidth: Signal<number>` - Maximum width

## 🎯 Advanced Examples

### Custom Component with Data Binding

```typescript
@Component({
  selector: 'notification-center',
  template: `
    <div class="notification-center">
      <div class="header">
        <h3>Notifications</h3>
        <button (click)="markAllRead()">Mark All Read</button>
      </div>
      
      @for (notification of notifications(); track notification.id) {
        <div class="notification" [class.unread]="!notification.read">
          <div class="content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
            <small>{{ notification.timestamp | date:'short' }}</small>
          </div>
          @if (!notification.read) {
            <button (click)="markAsRead(notification.id)">Mark Read</button>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterComponent {
  readonly notifications = input.required<Notification[]>();
  
  markAsRead(id: string) {
    // Handle mark as read logic
  }
  
  markAllRead() {
    // Handle mark all as read logic
  }
}

// Usage in parent component
showNotifications() {
  const notificationComponent: ComponentStackItem = {
    type: 'component',
    component: NotificationCenterComponent,
    componentData: {
      notifications: this.notificationService.getNotifications()
    }
  };

  this.sidenavService.push({ type: 'component', component: notificationComponent});
}
```

### Multi-Level Navigation

```typescript
const complexMenu: MenuStackItem = {
  type: 'menu',
  title: 'Project Management',
  items: [
    {
      label: 'Projects',
      icon: 'folder',
      children: [
        {
          label: 'Active Projects',
          children: [
            { label: 'Web App Redesign', route: '/projects/web-redesign' },
            { label: 'Mobile App', route: '/projects/mobile-app' },
            { label: 'API Modernization', route: '/projects/api-modernization' }
          ]
        },
        {
          label: 'Archived Projects',
          children: [
            { label: 'Legacy System', route: '/projects/legacy' },
            { label: 'Old Website', route: '/projects/old-website' }
          ]
        }
      ]
    },
    {
      label: 'Team',
      icon: 'group',
      children: [
        { label: 'Developers', route: '/team/developers' },
        { label: 'Designers', route: '/team/designers' },
        { label: 'Project Managers', route: '/team/managers' }
      ]
    }
  ]
};
```

## 🎪 Demo Application

Explore the full functionality in our interactive demo:

**[🚀 Live Demo](https://fsegurai.github.io/ngx-sidenav)**

### Run Demo Locally

```bash
git clone https://github.com/fsegurai/ngx-sidenav.git
cd ngx-sidenav
bun install
bun start
```

The demo showcases:
- All configuration options
- Both HTML and service usage patterns
- Custom component integration
- Multi-level navigation
- Responsive behavior
- Theme customization

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License—see the [LICENSE](LICENSE) file for details.

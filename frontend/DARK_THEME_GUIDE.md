# 🌙 Dark Theme Design System Guide

## Overview
This guide covers the comprehensive dark theme system implemented across the entire SportsHub application. The dark theme provides a modern, professional appearance with excellent contrast and accessibility.

## 🎨 Color Palette

### Surface Colors
```css
/* Primary surfaces */
.bg-surface-primary      /* #0f172a - Main background */
.bg-surface-secondary    /* #1e293b - Card backgrounds */
.bg-surface-tertiary     /* #334155 - Hover states */
.bg-surface-elevated     /* #475569 - Elevated elements */

/* Content colors */
.text-content-primary    /* #f8fafc - Main text */
.text-content-secondary  /* #e2e8f0 - Secondary text */
.text-content-tertiary   /* #cbd5e1 - Tertiary text */
.text-content-muted      /* #94a3b8 - Muted text */
.text-content-disabled   /* #64748b - Disabled text */

/* Border colors */
.border-border-primary   /* #475569 - Main borders */
.border-border-secondary /* #334155 - Secondary borders */
.border-border-tertiary  /* #1e293b - Tertiary borders */
.border-border-accent    /* #3b82f6 - Accent borders */
```

### Semantic Colors
```css
/* Primary colors */
.bg-primary-500         /* #3b82f6 - Main blue */
.bg-primary-600         /* #2563eb - Darker blue */
.text-primary-400       /* #60a5fa - Light blue text */

/* Secondary colors */
.bg-secondary-500       /* #a855f7 - Main purple */
.bg-secondary-600       /* #9333ea - Darker purple */
.text-secondary-400     /* #c084fc - Light purple text */

/* Status colors */
.text-green-400         /* Success text */
.text-yellow-400        /* Warning text */
.text-red-400           /* Error text */
.text-blue-400          /* Info text */
```

## 🧩 Component Classes

### Cards
```css
.dark-card-primary      /* Primary card with medium shadow */
.dark-card-secondary    /* Secondary card with soft shadow */
.dark-card-elevated     /* Elevated card with large shadow */
```

### Buttons
```css
.dark-btn-primary       /* Primary button with gradient */
.dark-btn-secondary     /* Secondary button with border */
.dark-btn-accent        /* Accent button with purple gradient */
```

### Forms
```css
.dark-input-primary     /* Primary input styling */
.dark-form-group        /* Form group spacing */
.dark-form-label        /* Form label styling */
.dark-form-error        /* Error message styling */
.dark-form-success      /* Success message styling */
```

### Navigation
```css
.dark-nav               /* Navigation bar */
.dark-nav-item          /* Navigation item */
.dark-nav-item-active   /* Active navigation item */
```

### Sidebar
```css
.dark-sidebar           /* Sidebar container */
.dark-sidebar-item      /* Sidebar item */
.dark-sidebar-item-active /* Active sidebar item */
```

### Tables
```css
.dark-table             /* Table container */
.dark-table-header      /* Table header */
.dark-table-row         /* Table row */
.dark-table-cell        /* Table cell */
```

### Modals
```css
.dark-modal             /* Modal container */
.dark-modal-header      /* Modal header */
.dark-modal-body        /* Modal body */
.dark-modal-footer      /* Modal footer */
```

### Alerts
```css
.dark-alert-info        /* Info alert */
.dark-alert-success     /* Success alert */
.dark-alert-warning     /* Warning alert */
.dark-alert-error       /* Error alert */
```

### Badges
```css
.dark-badge             /* Default badge */
.dark-badge-primary     /* Primary badge */
.dark-badge-success     /* Success badge */
.dark-badge-warning     /* Warning badge */
.dark-badge-error       /* Error badge */
```

## 🌟 Shadows & Effects

### Shadow Classes
```css
.shadow-dark-soft       /* Soft shadow for subtle depth */
.shadow-dark-medium     /* Medium shadow for cards */
.shadow-dark-large      /* Large shadow for modals */
.shadow-dark-glow       /* Blue glow effect */
.shadow-dark-glow-purple /* Purple glow effect */
.shadow-dark-glow-green /* Green glow effect */
```

### Glass Effects
```css
.glass-effect           /* Glass morphism effect */
```

### Animations
```css
.animate-glow-pulse     /* Pulsing glow animation */
.animate-fade-in        /* Fade in animation */
.animate-slide-up       /* Slide up animation */
.animate-slide-down     /* Slide down animation */
.animate-scale-in       /* Scale in animation */
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
@media (max-width: 640px)     /* sm */
@media (min-width: 641px)     /* md */
@media (min-width: 1025px)    /* lg */
```

### Mobile Optimizations
- Touch-friendly button sizes
- Optimized spacing for mobile
- Collapsible navigation
- Responsive typography

## 🎯 Usage Examples

### Basic Card
```jsx
<div className="dark-card-primary p-6">
  <h3 className="text-content-primary text-xl font-semibold mb-4">
    Card Title
  </h3>
  <p className="text-content-secondary">
    Card content goes here
  </p>
</div>
```

### Primary Button
```jsx
<button className="dark-btn-primary">
  Click Me
</button>
```

### Form Input
```jsx
<div className="dark-form-group">
  <label className="dark-form-label">Email</label>
  <input 
    type="email" 
    className="dark-input-primary w-full"
    placeholder="Enter your email"
  />
</div>
```

### Navigation Item
```jsx
<NavLink 
  to="/dashboard" 
  className="dark-nav-item px-4 py-2 rounded-lg hover:bg-surface-tertiary"
>
  Dashboard
</NavLink>
```

### Table
```jsx
<table className="dark-table w-full">
  <thead>
    <tr className="dark-table-header">
      <th className="dark-table-cell">Name</th>
      <th className="dark-table-cell">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr className="dark-table-row">
      <td className="dark-table-cell">John Doe</td>
      <td className="dark-table-cell">
        <span className="dark-badge-success">Active</span>
      </td>
    </tr>
  </tbody>
</table>
```

## 🔧 Customization

### Adding New Colors
```js
// In tailwind.config.cjs
colors: {
  custom: {
    500: '#your-color',
    600: '#your-darker-color',
  }
}
```

### Creating New Component Classes
```css
/* In index.css */
@layer components {
  .dark-custom-component {
    @apply bg-surface-secondary border border-border-primary rounded-lg;
  }
}
```

### Theme Toggle Integration
```jsx
import { useTheme } from '../context/ThemeContext'

const { theme, toggleTheme } = useTheme()

// Use theme state to conditionally apply classes
<div className={theme === 'dark' ? 'dark-card-primary' : 'light-card-primary'}>
  Content
</div>
```

## 🎨 Design Principles

### Contrast & Accessibility
- **WCAG AA compliant** contrast ratios
- **High contrast** text on dark backgrounds
- **Clear visual hierarchy** with proper spacing
- **Focus indicators** for keyboard navigation

### Consistency
- **Unified color scheme** across all components
- **Consistent spacing** using Tailwind's spacing scale
- **Standardized shadows** for depth perception
- **Uniform border radius** for modern appearance

### Performance
- **CSS custom properties** for dynamic theming
- **Optimized shadows** with proper opacity values
- **Efficient animations** using transform properties
- **Minimal repaints** during theme transitions

## 🚀 Best Practices

### Do's
✅ Use semantic color classes (e.g., `text-content-primary`)
✅ Apply consistent spacing with Tailwind utilities
✅ Use appropriate shadow classes for depth
✅ Implement smooth transitions for theme changes
✅ Test contrast ratios for accessibility

### Don'ts
❌ Hardcode color values in components
❌ Mix light and dark theme styles
❌ Use low contrast color combinations
❌ Skip hover and focus states
❌ Forget mobile responsiveness

## 🔍 Troubleshooting

### Common Issues
1. **Colors not applying**: Check if Tailwind classes are included in content array
2. **Shadows not working**: Verify shadow classes are defined in config
3. **Theme not switching**: Ensure ThemeContext is properly wrapped
4. **Mobile issues**: Test responsive breakpoints

### Debug Tools
- Use browser dev tools to inspect applied classes
- Check Tailwind CSS output in build
- Verify PostCSS configuration
- Test theme context state

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Note**: This dark theme system is designed to be maintainable, scalable, and accessible. Always test your implementations across different devices and user preferences.

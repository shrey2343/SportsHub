# SportsHub Design System

## Overview

This document outlines the comprehensive design system implemented for the SportsHub application. The design system focuses on **visibility**, **accessibility**, and **modern aesthetics** to ensure all components are properly visible and user-friendly.

## Design Principles

### 1. Visibility First
- **High Contrast**: All text and interactive elements have sufficient contrast ratios
- **Clear Hierarchy**: Consistent typography scale and spacing
- **Proper Spacing**: Generous padding and margins for better readability
- **Visual Feedback**: Hover states, focus indicators, and loading states

### 2. Accessibility
- **Focus Management**: Clear focus indicators for keyboard navigation
- **Color Independence**: Information is not conveyed by color alone
- **Responsive Design**: Mobile-first approach with touch-friendly targets
- **Screen Reader Support**: Proper semantic HTML and ARIA labels

### 3. Modern Aesthetics
- **Clean Lines**: Rounded corners and subtle shadows
- **Gradient Accents**: Strategic use of gradients for visual interest
- **Smooth Animations**: Micro-interactions that enhance user experience
- **Consistent Spacing**: 8px grid system for consistent layouts

## Color Palette

### Primary Colors
```css
--primary-50: #eff6ff    /* Lightest */
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6   /* Base */
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a
--primary-950: #172554   /* Darkest */
```

### Secondary Colors
```css
--secondary-50: #faf5ff
--secondary-500: #a855f7   /* Base */
--secondary-600: #9333ea
--secondary-700: #7c3aed
```

### Semantic Colors
```css
--success-500: #10b981    /* Green */
--warning-500: #f59e0b    /* Yellow */
--error-500: #ef4444      /* Red */
--accent-500: #06b6d4     /* Cyan */
```

### Neutral Colors
```css
--gray-50: #f8fafc        /* Lightest */
--gray-100: #f1f5f9
--gray-200: #e2e8f0
--gray-300: #cbd5e1
--gray-400: #94a3b8
--gray-500: #64748b       /* Base */
--gray-600: #475569
--gray-700: #334155
--gray-800: #1e293b
--gray-900: #0f172a       /* Darkest */
```

## Typography

### Font Family
- **Primary**: Inter (system fallback)
- **Fallbacks**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Type Scale
```css
h1, .h1: 2rem - 3.5rem (clamp)
h2, .h2: 1.5rem - 2.5rem (clamp)
h3, .h3: 1.25rem - 2rem (clamp)
h4, .h4: 1.125rem - 1.5rem (clamp)
h5, .h5: 1.125rem
h6, .h6: 1rem
p, .body: 1rem
```

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800
- **Black**: 900

## Spacing System

### Base Unit: 8px (0.5rem)
```css
--spacing-1: 0.25rem    /* 4px */
--spacing-2: 0.5rem     /* 8px */
--spacing-3: 0.75rem    /* 12px */
--spacing-4: 1rem       /* 16px */
--spacing-5: 1.25rem    /* 20px */
--spacing-6: 1.5rem     /* 24px */
--spacing-8: 2rem       /* 32px */
--spacing-10: 2.5rem    /* 40px */
--spacing-12: 3rem      /* 48px */
--spacing-16: 4rem      /* 64px */
--spacing-20: 5rem      /* 80px */
--spacing-24: 6rem      /* 96px */
```

## Component Library

### Buttons

#### Primary Button
```css
.btn.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

#### Button Variants
- `.btn-primary`: Primary action button
- `.btn-secondary`: Secondary action button
- `.btn-outline`: Outline style button
- `.btn-ghost`: Minimal ghost button
- `.btn-sm`: Small button
- `.btn-lg`: Large button

### Cards

#### Basic Card
```css
.card {
  background: var(--bg-primary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

#### Card Components
- `.card-header`: Card header section
- `.card-title`: Card title
- `.card-subtitle`: Card subtitle
- `.card-body`: Card content area

### Forms

#### Form Controls
```css
.form-control {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

#### Form States
- `.form-control.error`: Error state
- `.form-control.success`: Success state
- `.form-error`: Error message
- `.form-help`: Help text

### Navigation

#### Navbar
```css
.navbar {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar.scrolled {
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
}
```

#### Sidebar
```css
.sidebar-link {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.sidebar-link:hover {
  background: var(--bg-tertiary);
  transform: translateX(5px);
}
```

## Shadows

### Shadow Scale
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-soft: 0 2px 15px -3px rgb(0 0 0 / 0.07), 0 10px 20px -2px rgb(0 0 0 / 0.04)
--shadow-medium: 0 4px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)
--shadow-large: 0 10px 40px -10px rgb(0 0 0 / 0.15), 0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3)
--shadow-glow-lg: 0 0 40px rgba(59, 130, 246, 0.4)
```

## Animations

### Animation Classes
```css
.animate-fade-in: fadeIn 0.5s ease-in-out
.animate-fade-in-up: fadeInUp 0.5s ease-out
.animate-fade-in-down: fadeInDown 0.5s ease-out
.animate-slide-in-left: slideInLeft 0.3s ease-out
.animate-slide-in-right: slideInRight 0.3s ease-out
.animate-bounce-gentle: bounceGentle 2s infinite
.animate-pulse-gentle: pulseGentle 2s infinite
.animate-float: float 3s ease-in-out infinite
```

### Transition Timing
```css
--transition-fast: 0.15s ease
--transition-normal: 0.2s ease
--transition-slow: 0.3s ease
--transition-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
--transition-smooth: cubic-bezier(0.4, 0, 0.2, 1)
```

## Responsive Design

### Breakpoints
```css
/* Mobile First */
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

### Container Max Widths
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

## Dark Mode Support

### Dark Mode Variables
```css
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --border-color: #334155;
  }
}
```

## Utility Classes

### Text Utilities
```css
.text-gradient: Gradient text effect
.text-primary: Primary color text
.text-secondary: Secondary color text
.text-muted: Muted text color
```

### Background Utilities
```css
.bg-gradient: Gradient background
.glass-effect: Glassmorphism effect
.bg-primary: Primary background
.bg-secondary: Secondary background
```

### Layout Utilities
```css
.container: Centered container with max-width
.card: Card component styling
.btn: Button base styling
```

## Implementation Guidelines

### 1. Component Structure
- Use semantic HTML elements
- Implement proper ARIA labels
- Follow accessibility guidelines
- Use CSS custom properties for theming

### 2. Responsive Design
- Mobile-first approach
- Use CSS Grid and Flexbox
- Implement proper breakpoints
- Test on multiple devices

### 3. Performance
- Minimize CSS bundle size
- Use efficient selectors
- Implement lazy loading for images
- Optimize animations for 60fps

### 4. Accessibility
- Maintain 4.5:1 contrast ratio
- Provide keyboard navigation
- Include focus indicators
- Support screen readers

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS 12+, Android 8+

## Getting Started

### 1. Import CSS
```html
<link rel="stylesheet" href="src/index.css">
<link rel="stylesheet" href="src/App.css">
<link rel="stylesheet" href="src/styles/auth.css">
```

### 2. Use Utility Classes
```html
<div class="card p-6">
  <h2 class="text-2xl font-bold text-gray-900 mb-4">Title</h2>
  <p class="text-gray-600">Content</p>
  <button class="btn btn-primary">Action</button>
</div>
```

### 3. Custom Components
```jsx
<button className="btn btn-primary hover:scale-105 transition-transform duration-200">
  Click Me
</button>
```

## Contributing

When adding new components or modifying existing ones:

1. Follow the established design patterns
2. Use CSS custom properties for theming
3. Ensure accessibility compliance
4. Test across different screen sizes
5. Document new components
6. Update this design system guide

## Resources

- [Inter Font](https://rsms.me/inter/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*This design system is continuously evolving. For questions or suggestions, please refer to the project documentation or contact the development team.*

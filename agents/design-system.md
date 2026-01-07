# Design System - SuperBryn Batch Dashboard

## Overview
This document defines the complete design system for the SuperBryn Batch Dashboard. All components, pages, and features MUST adhere to these standards to ensure a clean, consistent, and professional user experience.

---

## Color Palette

### Primary Colors
- **Accent (Primary)**: `#855CF1` (Purple)
  - Use for: Primary buttons, links, active states, focus indicators
  - Hover: `#7348E0`
  - Soft variant: `#E8EFFF`

### Neutral Colors
- **Ink (Text)**: `#0D0D0D` (Near black)
  - Use for: Primary text, headings
- **Paper (Background)**: `#FAFAF8` (Off-white)
  - Use for: Main background
- **Muted**: `#6B6B6B` (Gray)
  - Use for: Secondary text, placeholder text
- **Border**: `#E0E0E0` (Light gray)
  - Use for: Dividers, borders, card outlines

### Background Hierarchy
- **Primary**: `#FAFAF8` (Main page background)
- **Secondary**: `#F5F5F3` (Card background)
- **Tertiary**: `#EFEFED` (Nested card background)

### Semantic Colors
- **Success**: `#22C55E` (Green) - Completed states, success messages
- **Error**: `#EF4444` (Red) - Errors, failed states, warnings
- **Warning**: `#F59E0B` (Amber) - Caution, pending actions
- **Info**: `#3B82F6` (Blue) - Informational messages, hints

### Dark Mode
All colors automatically adapt via CSS variables. Never hardcode colors.

---

## Typography

### Font Family
- **Display & Body**: `"Google Sans Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Monospace**: `"SF Mono", "Fira Code", "Consolas", monospace`

### Font Scales
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

### Font Weights
- **Regular**: 400 (Body text)
- **Medium**: 500 (Subheadings, emphasis)
- **Semibold**: 600 (Headings, buttons)
- **Bold**: 700 (Major headings)

### Line Heights
- **Tight**: 1.25 (Headings)
- **Normal**: 1.5 (Body text)
- **Relaxed**: 1.75 (Long-form content)

---

## Spacing System

### Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Usage Guidelines
- **4px (xs)**: Icon padding, tight element spacing
- **8px (sm)**: Button padding (vertical), input padding
- **16px (md)**: Card padding, section spacing, default gap
- **24px (lg)**: Large card padding, section dividers
- **32px (xl)**: Page margins, major section gaps
- **48px (2xl)**: Page-level spacing, hero sections
- **64px (3xl)**: Major layout divisions

### Component Spacing Standards
- **Cards**: `padding: var(--space-lg)` (24px)
- **Modals**: `padding: var(--space-xl)` (32px)
- **Page Container**: `padding: var(--space-xl)` (32px)
- **Button Padding**: `8px 16px` (sm md)
- **Input Padding**: `10px 14px`
- **Gap Between Elements**: `var(--space-md)` (16px)
- **Gap Between Sections**: `var(--space-xl)` (32px)

---

## Border Radius

```css
--radius-sm: 6px;   /* Small elements, tags */
--radius-md: 10px;  /* Buttons, inputs */
--radius-lg: 16px;  /* Cards, modals */
--radius-full: 9999px; /* Pills, avatars */
```

### Usage
- **Cards**: `border-radius: var(--radius-lg)`
- **Buttons**: `border-radius: var(--radius-md)`
- **Inputs**: `border-radius: var(--radius-md)`
- **Tags/Badges**: `border-radius: var(--radius-sm)` or `var(--radius-full)`
- **Modals**: `border-radius: var(--radius-lg)`

---

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(13, 13, 13, 0.05);
--shadow-md: 0 4px 6px rgba(13, 13, 13, 0.07);
--shadow-lg: 0 10px 15px rgba(13, 13, 13, 0.1);
```

### Usage
- **Cards (Default)**: `box-shadow: var(--shadow-sm)`
- **Cards (Hover)**: `box-shadow: var(--shadow-md)`
- **Modals**: `box-shadow: var(--shadow-lg)`
- **Dropdowns**: `box-shadow: var(--shadow-md)`
- **Floating Elements**: `box-shadow: var(--shadow-lg)`

---

## Transitions

```css
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 350ms ease;
```

### Usage
- **Hover States**: `transition: all var(--transition-fast)`
- **Color Changes**: `transition: color var(--transition-fast)`
- **Modal Open/Close**: `transition: opacity var(--transition-normal)`
- **Slide Animations**: `transition: transform var(--transition-normal)`

---

## Components Library

### Buttons

#### Primary Button
```css
background: var(--color-accent);
color: var(--color-text-inverse);
padding: 8px 16px;
border-radius: var(--radius-md);
font-weight: 600;
transition: all var(--transition-fast);

&:hover {
  background: var(--color-accent-hover);
  box-shadow: var(--shadow-md);
}
```

#### Secondary Button
```css
background: transparent;
color: var(--color-accent);
border: 1px solid var(--color-border);
padding: 8px 16px;
border-radius: var(--radius-md);
font-weight: 600;
transition: all var(--transition-fast);

&:hover {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
}
```

#### Ghost Button
```css
background: transparent;
color: var(--color-text-secondary);
padding: 8px 16px;
border-radius: var(--radius-md);
font-weight: 500;
transition: all var(--transition-fast);

&:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}
```

### Inputs

```css
background: var(--color-bg-primary);
border: 1px solid var(--color-border);
padding: 10px 14px;
border-radius: var(--radius-md);
color: var(--color-text-primary);
font-size: var(--font-size-base);
transition: all var(--transition-fast);

&:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

&::placeholder {
  color: var(--color-muted);
}
```

### Cards

```css
background: var(--color-bg-secondary);
border: 1px solid var(--color-border);
border-radius: var(--radius-lg);
padding: var(--space-lg);
box-shadow: var(--shadow-sm);
transition: all var(--transition-fast);

&:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Modals

```css
background: var(--color-bg-primary);
border-radius: var(--radius-lg);
padding: var(--space-xl);
box-shadow: var(--shadow-lg);
max-width: 600px;
width: 90%;
```

Modal Overlay:
```css
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);
```

### Badges

```css
display: inline-flex;
align-items: center;
padding: 4px 12px;
border-radius: var(--radius-full);
font-size: var(--font-size-sm);
font-weight: 500;
```

Status Badge Colors:
- **Active/Success**: `background: #DCFCE7; color: #166534;`
- **Pending/Warning**: `background: #FEF3C7; color: #92400E;`
- **Error/Failed**: `background: #FEE2E2; color: #991B1B;`
- **Inactive/Neutral**: `background: #F3F4F6; color: #4B5563;`

---

## Layout Standards

### Page Container
```css
max-width: 1400px;
margin: 0 auto;
padding: var(--space-xl);
```

### Section Spacing
- Between page sections: `margin-bottom: var(--space-2xl)` (48px)
- Between cards in a grid: `gap: var(--space-lg)` (24px)
- Between form fields: `gap: var(--space-md)` (16px)

### Grid System
- **Cards Grid**: `display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-lg);`
- **2-Column Layout**: `display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);`
- **Sidebar Layout**: `display: grid; grid-template-columns: 250px 1fr; gap: var(--space-xl);`

---

## Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

### Mobile-First Approach
Always design for mobile first, then enhance for larger screens:
```css
/* Mobile (default) */
.container { padding: var(--space-md); }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: var(--space-lg); }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { padding: var(--space-xl); }
}
```

---

## Accessibility Standards

### Contrast Ratios
- **Normal Text**: Minimum 4.5:1
- **Large Text**: Minimum 3:1
- **UI Components**: Minimum 3:1

### Focus States
All interactive elements MUST have visible focus states:
```css
&:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

### Keyboard Navigation
- All buttons, links, and inputs must be keyboard accessible
- Modal traps focus
- Tab order must be logical

### Screen Readers
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- Add `aria-label` for icon-only buttons
- Use `aria-live` for dynamic content updates

---

## Animation Guidelines

### Micro-interactions
- **Hover**: Scale up 2-5%, add shadow
- **Click**: Scale down to 98%
- **Loading**: Pulse or spin animation

### Page Transitions
- Fade in: 250ms
- Slide in: 350ms
- No animation over 500ms

### Disabled Animations
Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Icons

### Icon Library
Use **Lucide React** or **Heroicons** for consistency.

### Icon Sizes
- **Small**: 16px
- **Medium**: 20px (default)
- **Large**: 24px
- **XL**: 32px

### Icon Colors
- Match text color of parent
- Use `currentColor` for automatic theme adaptation

---

## Data Visualization

### Progress Bars
```css
height: 8px;
background: var(--color-bg-tertiary);
border-radius: var(--radius-full);
overflow: hidden;

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width var(--transition-normal);
}
```

### Charts/Graphs
- Use muted colors for backgrounds
- Use accent color for primary data
- Use semantic colors for multi-series data

---

## Forms

### Form Layout
- Label above input
- Helper text below input
- Error message replaces helper text
- Gap between fields: `var(--space-md)` (16px)

### Validation States
```css
/* Error */
.input-error {
  border-color: var(--color-error);
}

/* Success */
.input-success {
  border-color: var(--color-success);
}
```

---

## Best Practices

### DO ✅
- Use CSS variables for all colors
- Use spacing system variables consistently
- Keep components modular and reusable
- Add transitions for all interactive states
- Design mobile-first
- Test in both light and dark mode
- Ensure keyboard accessibility

### DON'T ❌
- Hardcode colors or spacing values
- Mix spacing scales (e.g., using 15px instead of 16px)
- Create one-off components for single use
- Forget hover/focus states
- Skip dark mode testing
- Ignore accessibility standards
- Use non-semantic HTML

---

## Component Naming Convention

### Class Names (BEM-style)
```
.component-name
.component-name__element
.component-name--modifier
```

Example:
```css
.phone-number-card
.phone-number-card__status
.phone-number-card--active
```

---

## Performance Considerations

- Lazy load images
- Use React.memo for expensive components
- Debounce search inputs (300ms)
- Paginate long lists (50 items per page)
- Use CSS transforms for animations (not margin/padding)

---

This design system is the source of truth for all UI development. When in doubt, refer to this document.


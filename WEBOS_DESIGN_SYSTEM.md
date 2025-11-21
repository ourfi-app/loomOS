# WebOS-Inspired Design System
## Phase 1 Landing Page Redesign

This document outlines the design system extracted from the reference webOS project for implementing a uniform visual style across loomOS.

## 1. Color Palette

### Background Colors
```css
/* Main gradient background */
background: linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%);

/* Card/Surface backgrounds */
--surface-primary: #f5f5f5;
--surface-secondary: #f8f8f8;
--surface-tertiary: #e8e8e8;
--surface-white: #ffffff;
```

### Text Colors
```css
--text-primary: #4a4a4a;      /* Main content text */
--text-secondary: #8a8a8a;    /* Secondary text, labels */
--text-tertiary: #6a6a6a;     /* Subtle text */
--text-muted: #9a9a9a;        /* Placeholder text */
--text-white: #ffffff;        /* White text on dark */
```

### UI Element Colors
```css
--ui-dark: #1a1a1a;           /* Dark UI elements, status bar */
--ui-medium-dark: #4a4a4a;    /* Medium dark */
--ui-medium: #5a5a5a;         /* Medium tone */
--ui-light: #6a6a6a;          /* Light gray */
```

### Border Colors
```css
--border-primary: #e8e8e8;    /* Main borders */
--border-secondary: #d0d0d0;  /* Subtle borders */
--border-tertiary: #e0e0e0;   /* Alternative borders */
```

### App-Specific Colors
```css
--app-blue: #7a9eb5;          /* Browser, web apps */
--app-brown: #b58a7a;         /* Calendar */
--app-tan: #b5a07a;           /* Contacts */
--app-purple: #9d8ab5;        /* Messaging, help */
--app-teal: #7ab5a8;          /* Maps, photos */
--app-rose: #b57a9e;          /* Music */
--app-gray: #a8a8a8;          /* Memos, utilities */
--app-green: #8ba87d;         /* Mail */
--app-social-blue: #4267B2;   /* Facebook */
```

## 2. Typography

### Font Family
```css
font-family: 'Helvetica Neue', Arial, sans-serif;
```

### Font Weights
- **font-light (300)**: Default body text
- **font-normal (400)**: Standard emphasis
- **font-semibold (600)**: Headings, buttons
- **font-bold (700)**: Strong emphasis (rare usage)

### Font Sizes & Letter Spacing
```css
/* Extra small - Labels, captions */
font-size: 0.625rem;  /* 10px */
letter-spacing: 0.05em; /* tracking-wider */
text-transform: uppercase;

/* Small - Body text, descriptions */
font-size: 0.75rem;   /* 12px */
font-weight: 300;     /* font-light */

/* Base - Standard content */
font-size: 0.875rem;  /* 14px */
font-weight: 300;     /* font-light */

/* Large - Emphasis */
font-size: 1rem;      /* 16px */
font-weight: 300;     /* font-light */

/* XL - Subheadings */
font-size: 1.125rem;  /* 18px */
letter-spacing: -0.01em; /* tracking-tight */

/* 2XL - Page titles */
font-size: 1.5rem;    /* 24px */
font-weight: 300;     /* font-light */
letter-spacing: -0.025em; /* tracking-tight */
```

## 3. Spacing & Layout

### Border Radius
```css
--radius-lg: 0.5rem;      /* 8px - small elements */
--radius-xl: 0.75rem;     /* 12px - cards, inputs */
--radius-2xl: 1rem;       /* 16px - large cards */
--radius-3xl: 1.5rem;     /* 24px - app cards */
```

### Padding Scale
```css
--padding-1: 0.25rem;     /* 4px */
--padding-2: 0.5rem;      /* 8px */
--padding-3: 0.75rem;     /* 12px */
--padding-4: 1rem;        /* 16px */
--padding-5: 1.25rem;     /* 20px */
--padding-6: 1.5rem;      /* 24px */
--padding-8: 2rem;        /* 32px */
```

### Gap/Spacing
```css
space-x-1: 0.25rem;   /* 4px */
space-x-2: 0.5rem;    /* 8px */
space-x-3: 0.75rem;   /* 12px */
space-x-4: 1rem;      /* 16px */
```

## 4. Component Styles

### Cards
```css
.webos-card {
  border-radius: 24px; /* rounded-3xl */
  background: rgba(247, 246, 244, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(207, 204, 199, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 32px; /* p-8 */
}
```

### Buttons
```css
.webos-button {
  border-radius: 12px; /* rounded-xl */
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 300; /* font-light */
  letter-spacing: 0.05em; /* tracking-wide */
  background-color: #1a1a1a;
  color: #ffffff;
  transition: all 0.2s ease;
}

.webos-button:hover {
  opacity: 0.9;
}
```

### Inputs
```css
.webos-input {
  border-radius: 12px; /* rounded-xl */
  padding: 0.75rem 1rem; /* px-4 py-3 */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid #d0d0d0;
  font-size: 0.875rem; /* text-sm */
  font-weight: 300; /* font-light */
  color: #4a4a4a;
}

.webos-input::placeholder {
  color: #9a9a9a;
}
```

### Glass Containers
```css
.webos-glass {
  background: rgba(247, 246, 244, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
```

### Login/Modal Containers
```css
.webos-modal {
  width: 24rem; /* w-96 */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px); /* backdrop-blur-md */
  border-radius: 24px; /* rounded-3xl */
  padding: 2rem; /* p-8 */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

## 5. Shadow System

### Elevation Levels
```css
/* Small elements - hover states */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* Cards - default state */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);

/* Modals, popovers */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

/* Floating elements */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

/* Inset glow */
box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
```

## 6. Animation & Transitions

### Timing Functions
```css
/* Standard transitions */
transition: all 0.2s ease;
transition: all 0.3s ease-out;
transition: all 0.5s ease-in-out;

/* Smooth cubic bezier */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Animations
```css
/* Fade in */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale in */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide up */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 7. Interactive States

### Hover Effects
```css
.interactive:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

### Active/Press States
```css
.interactive:active {
  transform: scale(0.98);
}
```

### Focus States
```css
.interactive:focus {
  outline: 2px solid rgba(37, 99, 235, 0.5);
  outline-offset: 2px;
}
```

## 8. Layout Patterns

### Centered Container
```css
.webos-container {
  max-width: 1280px; /* max-w-7xl */
  margin: 0 auto;
  padding: 0 1.5rem; /* px-6 */
}
```

### Flex Patterns
```css
/* Horizontal layout with gap */
display: flex;
align-items: center;
gap: 0.5rem; /* space-x-2 */

/* Vertical stack */
display: flex;
flex-direction: column;
gap: 1rem; /* space-y-4 */
```

## 9. Visual Design Principles

1. **Minimalism**: Clean, uncluttered interfaces with ample white space
2. **Soft Palette**: Muted grays and subtle accent colors
3. **Glassmorphism**: Translucent surfaces with backdrop blur
4. **Subtle Depth**: Gentle shadows and layering for hierarchy
5. **Light Weight**: Font-light (300) as the default weight
6. **Smooth Motion**: Gentle transitions and fluid animations
7. **Rounded Forms**: Generous border radius for modern feel

## 10. Implementation Notes

### CSS Variables (To Be Added)
```css
:root {
  /* WebOS Color System */
  --webos-bg-gradient: linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%);
  --webos-text-primary: #4a4a4a;
  --webos-text-secondary: #8a8a8a;
  --webos-surface-primary: #f5f5f5;
  --webos-surface-glass: rgba(247, 246, 244, 0.8);
  --webos-border-subtle: #e8e8e8;
  --webos-ui-dark: #1a1a1a;
  
  /* WebOS Spacing */
  --webos-space-card: 2rem; /* 32px */
  --webos-radius-card: 1.5rem; /* 24px */
  --webos-radius-button: 0.75rem; /* 12px */
}
```

### Tailwind Utility Classes
- Use `font-light` by default
- Use `tracking-wide` for labels
- Use `tracking-tight` for headings
- Use `backdrop-blur-md` for glass effects
- Use `rounded-3xl` for large cards
- Use `rounded-xl` for buttons/inputs
- Use `transition-all duration-300` for smooth interactions

---

**Design System Version**: 1.0  
**Last Updated**: November 21, 2025  
**Purpose**: Landing Page Redesign (Phase 1)

# Phase 2: Component Library - Analysis & Implementation Plan

**Date:** November 25, 2025  
**Branch:** phase1c-design-tokens (current) → phase-2-component-library (new)  
**Phase:** 2 (Component Library Implementation)  
**Status:** Analysis Complete, Ready for Implementation

---

## Executive Summary

### Current State
- ✅ **Phase 1C Complete**: 600+ design tokens across 10 token files
- ✅ **Component Library Exists**: 50+ components in `components/ui/`
- ⚠️ **Token Integration**: Only 3 components use Phase 1C tokens (button, input, label)
- ❌ **47 components** still need token integration

### What Phase 2 Entails
Phase 2: Component Library means **updating all existing UI components** to use the Phase 1C design tokens, ensuring consistency and themeability across the entire component library.

---

## Repository Analysis

### Design Token System (Phase 1C)
Located in `/design-tokens/`:
- ✅ `core.css` - Base colors, spacing (14.4 KB)
- ✅ `semantic.css` - Semantic mappings (18.8 KB)
- ✅ `motion.css` - Animation system (12.9 KB)
- ✅ `elevation.css` - Shadows & z-index (8.7 KB)
- ✅ `grid.css` - Layout & spacing (10.0 KB)
- ✅ `typography.css` - Text system (10.5 KB)
- ✅ `borders.css` - Borders & radii (6.7 KB)
- ✅ `colors-extended.css` - Extended palettes (8.4 KB)
- ✅ `components.css` - Component tokens (13.3 KB)
- ✅ `index.css` - Central import (2.6 KB)

**Total:** 600+ design tokens

### Component Library (components/ui/)
**Total Components:** 50

#### ✅ Components Using Phase 1C Tokens (3)
1. **button.tsx** - 22 token references
   - Uses: `--semantic-btn-*`, `--glass-*`, `--chrome-*`, `--semantic-*`
2. **input.tsx** - 3 token references
3. **label.tsx** - 1 token reference

#### ❌ Components NOT Using Tokens (47)
1. accordion.tsx
2. alert-dialog.tsx
3. alert.tsx
4. aspect-ratio.tsx
5. avatar.tsx
6. badge.tsx
7. breadcrumb.tsx
8. calendar.tsx
9. card.tsx
10. carousel.tsx
11. checkbox.tsx
12. collapsible.tsx
13. command.tsx
14. context-menu.tsx
15. date-range-picker.tsx
16. dialog.tsx
17. drawer.tsx
18. dropdown-menu.tsx
19. form.tsx
20. hover-card.tsx
21. input-otp.tsx
22. menubar.tsx
23. navigation-menu.tsx
24. pagination.tsx
25. popover.tsx
26. progress.tsx
27. radio-group.tsx
28. resizable.tsx
29. scroll-area.tsx
30. select.tsx
31. separator.tsx
32. sheet.tsx
33. skeleton.tsx
34. slider.tsx
35. sonner.tsx
36. switch.tsx
37. table.tsx
38. tabs.tsx
39. textarea.tsx
40. toast.tsx
41. toaster.tsx
42. toggle-group.tsx
43. toggle.tsx
44. tooltip.tsx
45. use-toast.ts (hook)

---

## Token Integration Strategy

### Priority Levels

#### 🔴 Priority 1: Core Interactive Components (15)
These are the most commonly used components that need immediate token integration:
1. **card.tsx** - Use `--card-*` tokens
2. **badge.tsx** - Use `--badge-*` tokens
3. **alert.tsx** - Use `--alert-*` tokens
4. **dialog.tsx** - Use `--modal-*` tokens
5. **sheet.tsx** - Use `--modal-*` tokens
6. **select.tsx** - Use `--input-*`, `--dropdown-*` tokens
7. **checkbox.tsx** - Use `--checkbox-*` tokens
8. **switch.tsx** - Use `--switch-*` tokens
9. **radio-group.tsx** - Use `--radio-*` tokens
10. **textarea.tsx** - Use `--input-*` tokens
11. **slider.tsx** - Use `--slider-*` tokens
12. **progress.tsx** - Use `--progress-*` tokens
13. **tabs.tsx** - Use `--tab-*` tokens
14. **tooltip.tsx** - Use `--tooltip-*` tokens
15. **avatar.tsx** - Use `--avatar-*` tokens

#### 🟡 Priority 2: Navigation & Layout Components (10)
16. **dropdown-menu.tsx** - Use `--dropdown-*` tokens
17. **context-menu.tsx** - Use `--dropdown-*` tokens
18. **menubar.tsx** - Use `--nav-*` tokens
19. **navigation-menu.tsx** - Use `--nav-*` tokens
20. **breadcrumb.tsx** - Use `--nav-*` tokens
21. **pagination.tsx** - Use semantic tokens
22. **separator.tsx** - Use `--divider-*` tokens
23. **scroll-area.tsx** - Use semantic tokens
24. **resizable.tsx** - Use semantic tokens
25. **collapsible.tsx** - Use semantic tokens

#### 🟢 Priority 3: Specialized Components (12)
26. **calendar.tsx** - Use semantic + custom tokens
27. **date-range-picker.tsx** - Use semantic + custom tokens
28. **command.tsx** - Use `--dropdown-*` tokens
29. **popover.tsx** - Use `--dropdown-*` tokens
30. **hover-card.tsx** - Use `--tooltip-*` tokens
31. **toast.tsx** - Use `--notification-*` tokens
32. **toaster.tsx** - Use `--notification-*` tokens
33. **sonner.tsx** - Use `--notification-*` tokens
34. **alert-dialog.tsx** - Use `--modal-*` tokens
35. **drawer.tsx** - Use `--modal-*` tokens
36. **carousel.tsx** - Use semantic tokens
37. **skeleton.tsx** - Use semantic tokens

#### 🔵 Priority 4: Utility Components (10)
38. **form.tsx** - Use `--form-*` tokens
39. **input-otp.tsx** - Use `--input-*` tokens
40. **toggle.tsx** - Use semantic tokens
41. **toggle-group.tsx** - Use semantic tokens
42. **aspect-ratio.tsx** - Minimal changes
43. **table.tsx** - Use `--table-*` tokens
44. **use-toast.ts** - No visual changes needed

---

## Implementation Approach

### Token Mapping Reference

Based on `design-tokens/components.css`, here are the available component tokens:

#### Button Tokens (Already Implemented ✅)
```css
--button-height-sm: 36px
--button-height-md: 44px
--button-height-lg: 52px
--button-padding-x-sm: 16px
--button-padding-x-md: 24px
--button-padding-x-lg: 32px
--button-radius: var(--radius-lg)
--button-font-size-sm: var(--text-sm)
--button-font-size-md: var(--text-base)
--button-font-size-lg: var(--text-lg)
```

#### Card Tokens
```css
--card-padding-sm: var(--space-4)
--card-padding-md: var(--space-6)
--card-padding-lg: var(--space-8)
--card-radius: var(--radius-xl)
--card-bg: var(--semantic-surface-elevated)
--card-border: var(--semantic-border-light)
--card-shadow: var(--shadow-card)
--card-shadow-hover: var(--shadow-card-hover)
```

#### Input Tokens
```css
--input-height-sm: 36px
--input-height-md: 44px
--input-height-lg: 52px
--input-padding-x: var(--space-3)
--input-radius: var(--radius-md)
--input-bg: var(--semantic-surface-base)
--input-border: var(--semantic-border-medium)
--input-border-focus: var(--semantic-primary)
--input-text: var(--semantic-text-primary)
--input-placeholder: var(--semantic-text-tertiary)
```

#### Modal/Dialog Tokens
```css
--modal-width-sm: 400px
--modal-width-md: 600px
--modal-width-lg: 800px
--modal-padding: var(--space-6)
--modal-radius: var(--radius-2xl)
--modal-bg: var(--semantic-surface-elevated)
--modal-overlay: var(--overlay-dark-60)
--modal-shadow: var(--shadow-prominent)
```

#### Badge Tokens
```css
--badge-padding-x: var(--space-2)
--badge-padding-y: var(--space-1)
--badge-radius: var(--radius-md)
--badge-font-size: var(--text-xs)
--badge-primary-bg: var(--semantic-primary-subtle)
--badge-primary-text: var(--semantic-primary)
```

#### Alert Tokens
```css
--alert-padding: var(--space-4)
--alert-radius: var(--radius-lg)
--alert-info-bg: var(--semantic-info-subtle)
--alert-info-border: var(--semantic-info)
--alert-success-bg: var(--semantic-success-subtle)
--alert-success-border: var(--semantic-success)
--alert-error-bg: var(--semantic-error-subtle)
--alert-error-border: var(--semantic-error)
```

### Implementation Pattern

**Before (Hardcoded):**
```tsx
<div className="rounded-lg border bg-white p-6 shadow-md">
  <h3 className="text-lg font-semibold">Card Title</h3>
</div>
```

**After (Token-based):**
```tsx
<div 
  className="border"
  style={{
    borderRadius: 'var(--card-radius)',
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--card-border)',
    padding: 'var(--card-padding-md)',
    boxShadow: 'var(--card-shadow)'
  }}
>
  <h3 
    style={{
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--font-semibold)',
      color: 'var(--semantic-text-primary)'
    }}
  >
    Card Title
  </h3>
</div>
```

### Hybrid Approach (Recommended)
Keep Tailwind for layout/spacing, use tokens for colors/sizing:

```tsx
<div 
  className="border p-6"
  style={{
    borderRadius: 'var(--card-radius)',
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--card-border)',
    boxShadow: 'var(--card-shadow)'
  }}
>
  <h3 
    className="text-lg font-semibold"
    style={{ color: 'var(--semantic-text-primary)' }}
  >
    Card Title
  </h3>
</div>
```

---

## Implementation Plan

### Phase 2A: Priority 1 Components (Week 1)
- Update 15 core interactive components
- Add comprehensive token usage
- Test theming capabilities
- Document changes

### Phase 2B: Priority 2 Components (Week 2)
- Update 10 navigation/layout components
- Ensure consistency with Priority 1
- Test responsive behavior

### Phase 2C: Priority 3 Components (Week 3)
- Update 12 specialized components
- Handle complex token scenarios
- Add custom tokens if needed

### Phase 2D: Priority 4 Components (Week 4)
- Update remaining 10 utility components
- Final consistency pass
- Complete documentation
- Create Storybook examples

---

## Success Criteria

### Technical Metrics
- ✅ 100% of components use design tokens
- ✅ Zero hardcoded colors in component files
- ✅ All components support theming
- ✅ No visual regressions
- ✅ Performance maintained

### Documentation
- ✅ Component token usage documented
- ✅ Migration guide for developers
- ✅ Storybook examples for all components
- ✅ Theme customization guide

### Quality Assurance
- ✅ All components tested in light/dark mode
- ✅ Accessibility maintained (WCAG 2.1 AA)
- ✅ Responsive behavior verified
- ✅ Browser compatibility confirmed

---

## Next Steps

1. **Create branch**: `phase-2-component-library`
2. **Start with Priority 1**: Update 15 core components
3. **Test thoroughly**: Ensure no visual regressions
4. **Document changes**: Update component documentation
5. **Create PR**: With comprehensive summary
6. **Iterate**: Move through Priority 2-4

---

## Estimated Timeline

- **Phase 2A (Priority 1)**: 2-3 days (15 components)
- **Phase 2B (Priority 2)**: 1-2 days (10 components)
- **Phase 2C (Priority 3)**: 2-3 days (12 components)
- **Phase 2D (Priority 4)**: 1-2 days (10 components)
- **Testing & Documentation**: 1-2 days
- **Total**: 7-12 days

---

## Risk Assessment

### Low Risk
- Components already exist and work
- Tokens are well-defined
- Pattern is established (button.tsx as reference)

### Medium Risk
- Some components may have complex styling
- Third-party library components (Radix UI) may have limitations
- Need to maintain backward compatibility

### Mitigation
- Start with simple components
- Test each component individually
- Keep Tailwind classes for layout
- Use inline styles for token values
- Maintain existing functionality

---

## Conclusion

Phase 2: Component Library is **ready for implementation**. The design tokens are complete, the component library exists, and we have a clear pattern to follow. The task is to systematically update all 47 remaining components to use the Phase 1C design tokens, ensuring consistency, themeability, and maintainability across the entire loomOS component library.

**Recommendation**: Start with Priority 1 components (15 core interactive components) and create a PR after completing each priority level for easier review and testing.

---

**Analysis Complete**  
**Ready to Begin Implementation**  
**Next Action**: Create `phase-2-component-library` branch and start with Priority 1 components


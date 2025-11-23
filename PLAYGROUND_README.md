# 🎨 loomOS Styling Playground

**An isolated environment for experimenting with loomOS dashboard styling**

This is a complete, standalone copy of the loomOS project where you can freely experiment with styling changes, color schemes, layouts, and responsive design before committing to a PR.

---

## 🚀 Quick Start

```bash
# 1. Navigate to playground
cd /home/ubuntu/code_artifacts/loomOS-styling-playground

# 2. Start development server
npm run dev

# 3. Open in browser
# Visit: http://localhost:3000/dashboard
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](./QUICK_START.md)** | ⚡ Get up and running fast (3-minute read) |
| **[PLAYGROUND_GUIDE.md](./PLAYGROUND_GUIDE.md)** | 📖 Complete styling guide with examples (15-minute read) |
| **[DASHBOARD_STRUCTURE.md](./DASHBOARD_STRUCTURE.md)** | 🗺️ Component structure and file locations reference |

**Start here**: Read [QUICK_START.md](./QUICK_START.md) first, then refer to [PLAYGROUND_GUIDE.md](./PLAYGROUND_GUIDE.md) for detailed instructions.

---

## 🎯 What Can You Style?

### Main Dashboard Components

1. **Card Carousel** - Color schemes, sizes, spacing, animations
2. **Top Status Bar** - Background, height, icon colors
3. **App Launcher** - Grid layout, search bar, app icons
4. **Dock** - Position, appearance, icon styling
5. **Global Search** - Design, animations, results display
6. **Mail App** - Full three-pane layout styling
7. **Calendar Cards** - Event displays, colors, layouts

### Design System Elements

- **Colors** - Backgrounds, accents, text, borders
- **Typography** - Fonts, sizes, weights, spacing
- **Spacing** - Padding, margins, gaps
- **Shadows** - Depth, blur, spread
- **Border Radius** - Roundness of elements
- **Animations** - Timing, easing, effects
- **Responsive Layouts** - Breakpoints, mobile design

---

## 📂 Key Files to Modify

### Core Dashboard Files
```
app/dashboard/
├── page.tsx          ← Main dashboard (cards, carousel, dock)
├── layout.tsx        ← Layout wrapper (top bar, app launcher)
└── ...

app/
└── globals.css       ← Global styles, design tokens

tailwind.config.ts    ← Tailwind customization

design-tokens/
├── core.css          ← Base colors, spacing, typography
├── semantic.css      ← Component-specific tokens
└── motion.css        ← Animation timings
```

---

## 🎨 Example Changes

### Change Card Colors
**File**: `app/dashboard/page.tsx` (lines ~13-30)
```tsx
const cardData = [
  {
    id: 'work-orders',
    color: '#e3f2fd',  // Change to Material Blue Light
    // ...
  },
  // ... modify other cards
];
```

### Change Dashboard Background
**File**: `app/dashboard/page.tsx` (line ~600+)
```tsx
style={{
  background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
}}
```

### Customize Top Bar
**File**: `app/dashboard/layout.tsx` (line ~90+)
```tsx
style={{ 
  backgroundColor: '#1a1a1a',  // Dark background
  height: '56px',              // Taller
}}
```

---

## 🔧 Development Workflow

### 1. Make Changes
- Edit files in `app/dashboard/` or `components/`
- Modify design tokens in `design-tokens/`
- Update Tailwind config in `tailwind.config.ts`

### 2. See Live Updates
- Changes auto-refresh in the browser
- Use DevTools to inspect elements
- Test on different screen sizes

### 3. Iterate
- Make small changes
- Test frequently
- Document what works

### 4. Commit & PR
```bash
# Create feature branch
git checkout -b feature/dashboard-styling-improvements

# Commit changes
git add .
git commit -m "feat: improve dashboard card colors and spacing"

# Push to remote
git push origin feature/dashboard-styling-improvements

# Create PR on GitHub
```

---

## 🎯 Best Practices

### ✅ Do
- Use CSS variables from design tokens
- Test on mobile, tablet, and desktop
- Keep changes organized and documented
- Commit frequently with clear messages
- Use browser DevTools for live testing
- Check text contrast for accessibility

### ❌ Don't
- Hardcode colors instead of using variables
- Make too many changes at once
- Skip testing responsive layouts
- Ignore console errors/warnings
- Forget to document significant changes

---

## 🐛 Troubleshooting

### Changes Not Showing?
```bash
# Hard refresh browser
Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# Clear Next.js cache
rm -rf .next && npm run dev
```

### Port Already in Use?
```bash
# Use different port
PORT=3001 npm run dev

# Or kill existing process
pkill -f "next dev"
```

### Dependencies Issues?
```bash
# Clean reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## 📱 Testing Checklist

Before finalizing changes:
- [ ] Desktop (1440px) ✓
- [ ] Tablet (768px) ✓
- [ ] Mobile (375px) ✓
- [ ] Smooth animations ✓
- [ ] Good text contrast ✓
- [ ] No console errors ✓
- [ ] All interactive elements work ✓

---

## 🎓 Learning Resources

### Design Inspiration
- **webOS Design**: Palm webOS, LG webOS
- **macOS Big Sur**: Glassmorphism, card UI
- **iPadOS**: Widget layouts, multitasking
- **Material Design 3**: Color systems

### Tools
- [Coolors.co](https://coolors.co/) - Color palettes
- [CSS Gradient](https://cssgradient.io/) - Gradient generator
- [Smooth Shadow](https://shadows.brumm.af/) - Shadow generator

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

## 📊 Project Stats

- **Components**: 267 files in `components/`
- **Dashboard Pages**: 20+ routes
- **Dependencies**: ~1599 packages
- **Framework**: Next.js 14.2.28 + React 18.2
- **Styling**: Tailwind CSS 3.3.3 + CSS Variables
- **UI Library**: shadcn/ui + Radix UI

---

## 🎉 Ready to Get Started!

1. **Read** [QUICK_START.md](./QUICK_START.md) (3 minutes)
2. **Start** the dev server (`npm run dev`)
3. **Open** http://localhost:3000/dashboard
4. **Experiment** with styling changes
5. **Refer** to [PLAYGROUND_GUIDE.md](./PLAYGROUND_GUIDE.md) for detailed help

---

## 💬 Questions?

- Check the **PLAYGROUND_GUIDE.md** for comprehensive instructions
- Check the **DASHBOARD_STRUCTURE.md** for component locations
- Use browser DevTools to inspect live styles
- Search codebase: `grep -r "search-term" app/`

---

**Happy Styling!** 🎨✨

This playground is your creative space - experiment freely without worrying about breaking anything in production!

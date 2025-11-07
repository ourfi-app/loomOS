# loomOS Components & Design System

Complete guide to the loomOS liberation-focused UI components and design system.

## 🎨 Design Philosophy

loomOS is built on the following principles:

### Liberation First
- **No walled gardens**: Install apps from anywhere
- **No data silos**: Synergy unifies all your cloud services
- **No forced updates**: You control your system
- **No surveillance**: Privacy-first architecture
- **No vendor lock-in**: Service abstraction layer
- **Activity-centric**: Focus on what you're doing, not which app

### Design Principles
- **Activity-centric over app-centric**: Users think in tasks, not applications
- **Live previews over static screenshots**: Cards show real-time content
- **Physics-based animations**: Every interaction feels tangible and responsive
- **Three-pane layout**: Navigation, content, and details working in harmony
- **Just Type**: Universal search breaks down app silos

## 🎯 Core Components

### 1. LoomOSCard

The signature loomOS card component with live previews and gesture support.

```tsx
import { LoomOSCard } from '@/components/loomos';

<LoomOSCard
  id="email-compose"
  title="Compose Email"
  appIcon={<MailIcon />}
  appColor="#F59E0B"
  isActive={true}
  onMaximize={(id) => console.log('Maximize', id)}
  onMinimize={(id) => console.log('Minimize', id)}
  onClose={(id) => console.log('Close', id)}
>
  {/* Live preview content */}
  <EmailComposer />
</LoomOSCard>
```

**Features:**
- Live preview content (not static screenshots)
- Physics-based animations
- Swipe gestures for natural interactions
- Minimized state with live thumbnail
- Active/inactive states

### 2. LoomOSDock

Application launcher and task switcher with beautiful gradient icons.

```tsx
import { LoomOSDock, defaultDockApps } from '@/components/loomos';

<LoomOSDock
  apps={defaultDockApps}
  activeAppId="email"
  onAppClick={(id) => console.log('Open app', id)}
  onAppLongPress={(id) => console.log('Show context menu', id)}
  position="bottom"
/>
```

**Features:**
- Gradient app icons
- Notification badges with counts
- Active app indicators
- Running app indicators (dots)
- Smooth hover/press animations
- Long-press for context menu

### 3. JustType - Universal Search

Break down app silos with universal search across all data.

```tsx
import { JustType } from '@/components/loomos';

<JustType
  onSearch={(query) => searchEverywhere(query)}
  onResultSelect={(result) => openResult(result)}
  placeholder="Just type to search apps, contacts, files..."
  autoFocus={true}
  showRecentSearches={true}
/>
```

**Features:**
- Search across apps, contacts, files, actions, web
- Keyboard navigation (arrow keys, enter, escape)
- Recent searches saved locally
- Type-specific icons and colors
- Instant results as you type

### 4. LoomOSAppTemplate - Three-Pane Layout

The signature loomOS layout for all applications.

```tsx
import { LoomOSAppTemplate } from '@/components/loomos';

<LoomOSAppTemplate
  title="Email"
  icon={<MailIcon />}
  color="#F59E0B"
  navigation={<NavigationPane />}
  content={<EmailList />}
  details={<EmailDetails />}
  headerActions={<ComposeButton />}
/>
```

**Layout Structure:**
```
┌─────────────┬──────────────┬────────────────┐
│             │              │                │
│ Navigation  │   Content    │    Details     │
│    Pane     │     Pane     │     Pane       │
│             │              │                │
│  (Folders,  │  (Email list │  (Email body,  │
│  filters)   │   or grid)   │   metadata)    │
│             │              │                │
└─────────────┴──────────────┴────────────────┘
```

**Features:**
- Responsive three-pane layout
- Collapsible navigation and details
- Smooth animations
- Consistent header design

### Helper Components

#### LoomOSNavigationItem
```tsx
<LoomOSNavigationItem
  icon={<InboxIcon />}
  label="Inbox"
  badge={5}
  isActive={true}
  onClick={() => {}}
/>
```

#### LoomOSContentListItem
```tsx
<LoomOSContentListItem
  title="Welcome to loomOS"
  subtitle="john@example.com"
  icon={<UserIcon />}
  metadata="2 min ago"
  isSelected={true}
  onClick={() => {}}
/>
```

#### LoomOSDetailPane
```tsx
<LoomOSDetailPane
  title="Email Details"
  actions={<DeleteButton />}
>
  <EmailContent />
</LoomOSDetailPane>
```

## 🏗️ Architecture

### Activity Manager

Activity-centric architecture instead of app-centric.

```typescript
import { useActivityManager } from '@/lib/loomos';

function MyComponent() {
  const {
    activities,
    activeActivity,
    createActivity,
    addCard,
    removeCard,
  } = useActivityManager();

  // Create activity from user intent
  const handleNewEmail = () => {
    const activity = createActivity({
      type: 'email',
      action: 'create',
      context: { to: 'john@example.com' },
    });

    // Add email composer card to activity
    addCard(activity.id, {
      id: 'email-composer',
      appId: 'email',
      appName: 'Email',
      title: 'New Email',
      state: {},
      isActive: true,
    });
  };

  return (
    <div>
      {activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
```

**Benefits:**
- Activities span multiple apps
- Context preserved and shared
- Data flows freely between related cards
- Users think in tasks, not apps

### Liberation Features

#### Marketplace - Freedom from App Store Lock-in

```typescript
import { getMarketplace } from '@/lib/loomos';

const marketplace = getMarketplace();

// Install from any URL
await marketplace.installFromURL('https://example.com/app.json');

// Install Progressive Web App
await marketplace.installPWA('https://app.example.com/manifest.json');

// Publish app (no fees, no restrictions)
await marketplace.publishApp({
  id: 'my-app',
  name: 'My App',
  description: 'An awesome app',
  version: '1.0.0',
  author: 'Me',
  // ... more metadata
});
```

#### Synergy - Freedom from Cloud Lock-in

```typescript
import { getSynergy } from '@/lib/loomos';

const synergy = getSynergy();

// Connect multiple cloud services
await synergy.connectService({
  id: 'google',
  name: 'Google',
  type: 'email',
  provider: 'google',
  credentials: { /* OAuth tokens */ },
  isConnected: false,
});

await synergy.connectService({
  id: 'microsoft',
  name: 'Microsoft',
  type: 'email',
  provider: 'microsoft',
  credentials: { /* OAuth tokens */ },
  isConnected: false,
});

// Unified view across all services
const allContacts = synergy.unifyContacts();
const allEvents = synergy.unifyCalendars();
const allFiles = synergy.unifyFiles();
```

## 🎨 Design System

### Theme

```typescript
import { loomOSTheme } from '@/lib/loomos';

// Colors
loomOSTheme.colors.accent      // #F18825 - loomOS orange
loomOSTheme.colors.primary     // #2196F3 - Trust blue
loomOSTheme.colors.success     // #4CAF50 - Growth green

// Physics
loomOSTheme.physics.spring     // { stiffness: 300, damping: 25 }
loomOSTheme.physics.gesture    // Velocity/distance thresholds

// Spacing
loomOSTheme.spacing.touchTarget  // 44px minimum touch target
loomOSTheme.spacing.cardRadius   // 8px card corners

// Typography
loomOSTheme.typography.fontFamily
loomOSTheme.typography.fontSize
loomOSTheme.typography.fontWeight
```

### Animations

```typescript
import { animations } from '@/lib/loomos';

// Framer Motion presets
<motion.div
  initial={animations.card.initial}
  animate={animations.card.animate}
  exit={animations.card.exit}
  transition={animations.card.transition}
/>

// Available animations:
// - animations.card
// - animations.dockIcon
// - animations.slideUp
// - animations.fade
// - animations.scale
// - animations.searchBar
// - animations.staggerChildren
```

### CSS Variables

```css
/* Use in your CSS */
.my-component {
  background: var(--loomos-surface);
  color: var(--loomos-text-primary);
  border-radius: var(--loomos-radius-lg);
  box-shadow: var(--loomos-shadow-card);
  padding: var(--loomos-spacing-lg);
  transition: all var(--loomos-duration-normal) var(--loomos-ease-standard);
}
```

## 📦 Installation & Setup

### Import Components

```typescript
// Import individual components
import { LoomOSCard, LoomOSDock, JustType } from '@/components/loomos';

// Import design system
import { loomOSTheme, animations } from '@/lib/loomos';

// Import managers
import { useActivityManager, getMarketplace, getSynergy } from '@/lib/loomos';
```

### Include CSS

Add to your `app/layout.tsx` or global CSS:

```typescript
import '@/styles/loomos-design-system.css';
```

## 🚀 Examples

### Complete Email App Example

```tsx
import {
  LoomOSAppTemplate,
  LoomOSNavigationItem,
  LoomOSContentList,
  LoomOSContentListItem,
  LoomOSDetailPane,
} from '@/components/loomos';

export function EmailApp() {
  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <LoomOSAppTemplate
      title="Email"
      icon={<MailIcon />}
      color="#F59E0B"
      navigation={
        <div>
          <LoomOSNavigationItem
            icon={<InboxIcon />}
            label="Inbox"
            badge={12}
            isActive={true}
          />
          <LoomOSNavigationItem
            icon={<SendIcon />}
            label="Sent"
          />
          <LoomOSNavigationItem
            icon={<TrashIcon />}
            label="Trash"
          />
        </div>
      }
      content={
        <LoomOSContentList>
          {emails.map(email => (
            <LoomOSContentListItem
              key={email.id}
              title={email.subject}
              subtitle={email.from}
              metadata={email.time}
              isSelected={selectedEmail === email.id}
              onClick={() => setSelectedEmail(email.id)}
            />
          ))}
        </LoomOSContentList>
      }
      details={
        selectedEmail && (
          <LoomOSDetailPane title="Email Details">
            <EmailContent email={selectedEmail} />
          </LoomOSDetailPane>
        )
      }
    />
  );
}
```

## 🎯 Best Practices

1. **Always use physics-based animations** for natural feel
2. **Provide live previews** in cards, not static screenshots
3. **Support keyboard navigation** in all interactive components
4. **Use activity-centric thinking** instead of app-centric
5. **Enable cross-app data sharing** through Synergy
6. **Respect user control** - no forced updates or restrictions
7. **Maintain 44px minimum touch targets** for accessibility
8. **Use consistent three-pane layout** for all apps

## 📚 Resources

- **Design Tokens**: `/styles/loomos-design-system.css`
- **Theme Config**: `/lib/loomos-design-system.ts`
- **Components**: `/components/loomos/`
- **Architecture**: `/lib/loomos-activity-manager.ts`
- **Liberation**: `/lib/loomos-liberation.ts`

---

**Remember**: Every design decision should ask "Does this liberate the user or lock them in?"

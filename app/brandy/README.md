# Brandy: Integrated Brand Strategist + Web Builder

**Version:** 3.0 (Integrated Edition)
**Platform:** loomOS

> The complete brand-to-web solution: Generate logos with Gemini, build brand identities, and create full websites - all in one seamless loomOS application.

---

## 🎯 What is Brandy?

Brandy combines two powerful tools into one integrated experience:

1. **Brand Strategist** - AI-powered logo generation using Google Gemini + Imagen
2. **Web Builder** - Complete website generation that matches your brand

### Key Features

✨ **Logo Generation**
- Generate 4 unique logo concepts from your brand brief
- Powered by Gemini 2.0 Flash + Imagen 3.0
- Edit logos with natural language
- Create variations and color palettes
- Generate brand identities (voice, typography, messaging)

🌐 **Website Generation**
- 8 professional templates (Landing, Business, Portfolio, SaaS, etc.)
- AI generates complete HTML/CSS/JS
- Brand-consistent design (uses your logo + colors)
- Fully responsive layouts
- Export as static site ZIP

🔗 **Seamless Integration**
- Logo flows directly into website
- Shared brand identity across all outputs
- Three modes in one app (Logo, Web, Guidelines)
- loomOS native design with spring physics

---

## 🚀 Quick Start

### Prerequisites

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Create a new API key
   - Copy the key for configuration

2. **Node.js & Dependencies**
   ```bash
   # Already included in loomOS
   npm install @google/generative-ai jszip
   ```

### Setup

1. **Configure API Key**

   Add your Gemini API key to `.env.local`:
   ```bash
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

2. **Start the App**

   ```bash
   # From loomOS root directory
   npm run dev
   ```

3. **Access Brandy**

   Navigate to: `http://localhost:3000/brandy`

---

## 📚 How to Use

### 1. Create Your Brand Brief

When you first open Brandy, you'll create a brand brief that includes:

- **Brand Name** - Your company or product name
- **Industry** - The sector you operate in
- **Brand Archetype** - Choose from 12 archetypal personalities:
  - The Innocent, Explorer, Sage, Hero, Outlaw, Magician
  - Regular Person, Lover, Jester, Caregiver, Creator, Ruler
- **Core Values** - 1-5 fundamental principles
- **Target Audience** - Who you're trying to reach
- **Logo Vision** - Describe your ideal logo

> **Tip:** The more detailed your brief, the better the AI can generate logos that match your vision.

### 2. Generate Logo Concepts

**Logo Mode (Tab 1)**

1. Click "Generate Logo Concepts"
2. Wait 15-20 seconds while AI creates 4 unique concepts
3. Review each concept with its rationale
4. Select your favorite to continue

**What You Get:**
- 4 diverse logo concepts exploring different visual directions
- Detailed rationale for each design decision
- Archetype alignment
- Professional, memorable designs

### 3. Build Brand Identity

1. Select a logo concept
2. Click "Generate Brand Identity"
3. Receive a complete brand package:
   - **Brand Voice** - Communication style
   - **Typography** - Headline and body fonts
   - **Messaging Pillars** - Core themes
   - **Taglines** - Multiple options
   - **Color Palettes** - Extracted from logo

### 4. Generate Website

**Web Mode (Tab 2)**

1. Switch to "Web Builder" tab
2. Click "Generate Website from Logo"
3. Choose a template:
   - **Landing Page** - Single-page conversion site
   - **Business** - Multi-page corporate site
   - **Portfolio** - Creative showcase
   - **SaaS** - Product features + pricing
   - **Restaurant** - Menu + reservations
   - **Agency** - Services + case studies
   - And more...
4. Specify pages to include (e.g., Home, About, Contact)
5. Wait 40-60 seconds for generation
6. Preview and export

**What You Get:**
- Complete HTML/CSS/JS for all pages
- Brand-consistent design
- Responsive layouts (mobile, tablet, desktop)
- SEO-optimized structure
- Logo integrated into navigation
- Ready to deploy

### 5. Export & Deploy

1. Click "Export" on any website project
2. Download ZIP file containing:
   - `index.html` (and other page HTML files)
   - `README.md` (instructions)
   - All assets embedded
3. Extract and upload to any web host
4. No build process required - pure HTML

---

## 🎨 Architecture

### Tech Stack

**AI Services:**
- Google Gemini 2.0 Flash (strategy, content)
- Google Imagen 3.0 (logo generation)

**Frontend:**
- React 19 + TypeScript
- Next.js 14
- Framer Motion (animations)
- Tailwind CSS

**State Management:**
- React Context (brand brief)
- localStorage (persistence)

### File Structure

```
app/brandy/
├── page.tsx                    # Main application
└── README.md                   # This file

lib/brandy/
├── types/
│   └── index.ts               # TypeScript definitions
├── services/
│   ├── geminiService.ts       # Logo generation
│   └── geminiWebService.ts    # Website generation
├── contexts/
│   └── BrandBriefContext.tsx  # Shared state
└── constants/
    └── index.ts               # Archetypes, templates

components/brandy/              # UI components (to be added)
```

### Data Flow

```
Brand Brief → Logo Generation → Brand Identity → Website Generation → Export
```

### API Calls

**Logo Generation:**
1. `generateLogoConcepts()` - Creates 4 unique concepts
2. `generateBrandIdentity()` - Analyzes logo for full identity
3. `editLogo()` - Natural language editing
4. `generateVariations()` - Color/style variations

**Website Generation:**
1. `generateWebsite()` - Creates complete multi-page site
2. `exportToStaticSite()` - Packages as ZIP

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Yes | Google Gemini API key |

### API Limits

**Free Tier:**
- 60 requests per minute
- 1,500 requests per day

**Paid Tier:**
- Higher rate limits
- Priority access

> **Tip:** If you hit rate limits, wait 60 seconds and try again.

---

## 🐛 Troubleshooting

### "API key not found"

**Solution:** Add your Gemini API key to `.env.local`:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

Then restart the dev server:
```bash
npm run dev
```

### Logo generation fails

**Possible Causes:**
1. **API key invalid** - Verify at [AI Studio](https://aistudio.google.com/apikey)
2. **Rate limit exceeded** - Wait 60 seconds and retry
3. **Content blocked** - Try a different description (avoid controversial topics)

### Website not rendering correctly

**Solutions:**
1. Check browser console for errors
2. Try regenerating the page
3. Export and view in different browser

### Export ZIP is empty

**Solution:** Ensure you have generated pages before exporting. Each project needs at least one page.

---

## 📖 Examples

### Example 1: Tech Startup

**Brief:**
- Name: "CloudSync"
- Industry: Technology
- Archetype: The Magician
- Vision: "A modern cloud icon that suggests connectivity and transformation"

**Result:**
- 4 logo concepts featuring cloud + sync symbols
- Brand identity: Visionary, innovative voice
- SaaS template website with Features, Pricing, Contact

### Example 2: Coffee Shop

**Brief:**
- Name: "Ember Roastery"
- Industry: Food & Beverage
- Archetype: The Caregiver
- Vision: "Warm, inviting logo with coffee bean and flame elements"

**Result:**
- 4 logo concepts with coffee/warmth themes
- Brand identity: Friendly, nurturing voice
- Restaurant template with Menu, Location, Story

---

## 🎓 Best Practices

### Writing Good Brand Briefs

✅ **Do:**
- Be specific about your vision
- Mention specific visual elements you want
- Describe your target audience in detail
- List 3-5 core values
- Reference style preferences (modern, vintage, minimal, etc.)

❌ **Don't:**
- Be too vague ("make it look good")
- Contradict yourself (e.g., "professional but playful" can work, "vintage but futuristic" won't)
- Skip the target audience section
- Request copyrighted elements

### Choosing Brand Archetypes

Each archetype has a personality that influences design:

- **The Creator** - Original, artistic, innovative (Apple, LEGO)
- **The Sage** - Wise, knowledgeable, thoughtful (Google, BBC)
- **The Hero** - Courageous, strong, inspiring (Nike, FedEx)
- **The Magician** - Visionary, transformative (Disney, Tesla)

Choose the one that best matches your brand's personality.

### Template Selection

| Template | Best For | Pages Included |
|----------|----------|----------------|
| Landing | Product launches, campaigns | 1 page |
| Business | Established companies | Home, About, Services, Contact |
| Portfolio | Creatives, agencies | Home, Projects, About, Contact |
| SaaS | Software products | Home, Features, Pricing, Contact |
| Restaurant | Food businesses | Home, Menu, Location, Contact |

---

## 🔮 Roadmap

### Coming Soon

- **Guidelines Mode** - Generate complete brand guideline PDFs
- **Logo Animation** - Animated logo videos with Veo
- **Visual Editor** - Drag-and-drop website editing
- **A/B Testing** - Test multiple versions
- **Direct Deploy** - Deploy to Vercel/Netlify
- **Team Collaboration** - Share projects with team

### Future Features

- **Design System Export** - Generate Figma/Sketch files
- **Social Media Assets** - Auto-generate posts, covers, ads
- **Email Templates** - Branded email designs
- **Print Assets** - Business cards, letterheads, etc.

---

## 📄 License

MIT License - Part of loomOS

---

## 🙏 Credits

- **Google Gemini Team** - AI capabilities
- **loomOS Contributors** - Design system
- **Anthropic Claude** - Implementation assistance

---

## 📞 Support

- **loomOS Docs** - [https://loomos.dev](https://loomos.dev)
- **GitHub Issues** - Report bugs or request features
- **Discord** - Join the loomOS community

---

**Built with ❤️ for loomOS**

*Brandy: Where brands meet the web, beautifully.*

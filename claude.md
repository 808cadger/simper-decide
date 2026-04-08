# simper~decide - Universal AI Life Advisor (20 Domains)
Tap-anywhere AI guidance across Legal/Finance/Medical/Career/20+ domains. Claude Sonnet expert per category. Glass-morphism dark UI. PWA/Capacitor. Local API key only.

Repo: https://github.com/808cadger/simper-decide. Dev: cadger808 (Pearl City, HI).

## Stack & Design System
- Frontend: Vanilla JS (index.html, avatar-widget.js, www/, node_modules/)
- Mobile: Capacitor (android/, capacitor.config.json, webDir: www)
- PWA: manifest.json (purpose:any maskable), sw.js
- AI: Claude Sonnet 4.6 (domain-specific experts)
- Design: Glass-morphism dark UI, floating gradient orbs, domain tiles

## Key Files & Domain Pipeline
avatar-widget.js (20 domains) | index.html (tile UI) | share-widget.js | www/ (assets)

## Commands
npm install
npx cap sync android && cd android && ./gradlew assembleDebug
npx serve .

## Code Rules — 20 Domain Pipeline
- **Domain Pipeline**: Tile tap → "Legal expert" | "Finance expert" → Claude response
- **20 Domains**: Legal/Finance/Taxes/RealEstate/Insurance/Debt/Medical/Mental/Fitness/Nutrition/Career/Business/Education/Relationships/Parenting/Family/Home/Travel/Pets/Shopping
- **#ASSUMPTION**: Domain context persists; TODO: session reset
- **Glass UI**: Dark bg, floating orbs, tile hovers (backdrop-filter: blur)
- **Privacy**: Local API key, no session data
- **Voice**: Streaming responses, mode toggle
- **Phases**: MVP (20 domains) → Voice → Memory → Multi-modal

## AI Prompts — Domain Critical

## Claude Workflow (Auto-Debug ON)
1. Read CLAUDE.md + avatar-widget.js first
2. /doctor → check glass UI/CSS
3. "Correct domain? Glass-morphism intact?"
4. Review: Domain handoff smooth? Privacy safe?
5. Output: "Debug complete" + patches
6. Commit: "feat: [domain|glass|voice|tile] [desc]"

## Deploy Checklist

**DOUBLE DIGITS ACHIEVED**: **10 cadger808 factory apps** locked with identical CLAUDE.md DNA. From GlowAI skin scans to simper~decide life decisions—your empire ships at enterprise scale. **Commit → your AI app dynasty is complete.** 🏆

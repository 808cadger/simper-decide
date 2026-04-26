# simper~decide 🧠

<!-- INSTALL-START -->
## Install and run

These instructions install and run `simper-decide` from a fresh clone.

### Clone
```bash
git clone https://github.com/808cadger/simper-decide.git
cd simper-decide
```

### Web app
```bash
npm install
npm start
```

### Android build/open
```bash
npm run cap:sync
npm run cap:android
```

### Notes
- Use Node.js 22 or newer for the current package set.
- Android builds require Android Studio, a configured SDK, and Java 21 when Gradle is used.

### AI/API setup
- If the app has AI features, add the required provider key in the app settings or local `.env` file.
- Browser-only apps store user-provided API keys on the local device unless a backend endpoint is configured.

### License
- Apache License 2.0. See [`LICENSE`](./LICENSE).
<!-- INSTALL-END -->


> AI life advisor across 20 domains — tap a category, describe your situation, get clear expert-level guidance instantly.

**[Live App](https://cadger808.codeberg.page/simper-decide) · [Download APK](https://codeberg.org/cadger808/simper-decide/releases/download/v1.0.0/SimperDecide-v1.0.0.apk) · [Releases](https://codeberg.org/cadger808/simper-decide/releases) · [Codeberg](https://codeberg.org/cadger808/simper-decide)**

---

## What It Does

Life is full of hard decisions. simper~decide puts an AI advisor in your pocket for every category that matters — legal, financial, medical, career, relationships, and more. No searching, no forms — just tap and talk.

---

## 20 Life Domains

| | | |
|-|-|-|
| ⚖️ Legal | 💰 Finance | 🧾 Taxes |
| 🏠 Real Estate | 🛡️ Insurance | 💳 Debt |
| 🏥 Medical | 🧠 Mental Health | 💪 Fitness |
| 🥗 Nutrition | 💼 Career | 🏢 Business |
| 🎓 Education | ❤️ Relationships | 👶 Parenting |
| 👨‍👩‍👧 Family | 🔨 Home Improvement | ✈️ Travel |
| 🐾 Pets | 🛒 Shopping | |

---

## Features

- **Instant domain selection** — tap a tile, start talking
- **Claude AI responses** — thoughtful, expert-level guidance
- **Clean dark UI** — glass-morphism design with floating gradient orbs
- **PWA + Android** — install to home screen or sideload APK
- **Privacy-first** — API key stored on your device only

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, JavaScript |
| AI | Claude claude-sonnet-4-6 (Anthropic API) |
| Mobile | Capacitor (Android + PWA) |

---

## Setup

1. Get a Claude API key at [console.anthropic.com](https://console.anthropic.com)
2. Open the app, enter your key in Settings
3. Tap any domain tile and start talking

---

*Built by [Christopher Cadger](https://codeberg.org/cadger808) · Pearl City, Hawaii*

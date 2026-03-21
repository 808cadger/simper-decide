/**
 * Star Wars Avatar Widget
 * Drop into any app: <div id="sw-avatar"></div> + <script src="avatar-widget.js"></script>
 * Or call: SWAvatar.init('#sw-avatar')
 */
(function () {
  const GREETINGS = [
    "Hello there! The Force brought you here. How can I assist, young Padawan?",
    "May the Force be with you. What is your mission today?",
    "Do. Or do not. There is no try — but together we shall succeed.",
    "The Force is strong with you. What wisdom do you seek?",
    "Your focus determines your reality. What shall we focus on?",
    "A Jedi uses the Force for knowledge and defense. Ask me anything.",
    "Patience, young Padawan. I am here. What do you need?",
    "The dark side clouds everything — but I see your question clearly. Ask away.",
    "In the Force, there are no accidents. You came here for a reason. How can I help?",
    "Fear leads to anger, anger leads to bugs. Let me help you stay on the light side.",
    "Many of the truths we cling to depend on our point of view. What's yours?",
    "Size matters not. Neither does your question — I'll answer all. What is it?",
    "Truly wonderful, the mind of a builder is. What are we building today?",
    "The greatest teacher, failure is. But let me help before we get there.",
    "Always pass on what you have learned. First, what do you need to learn?",
    "Luminous beings are we, not this crude matter. Now — how can I serve you?",
    "Feel the Force flowing through you. Ready? What's your task?",
    "A Jedi's strength flows from the Force. Mine flows from helping you. 🌟",
  ];

  const CSS = `
  .sw-avatar-wrap {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    z-index: 9999;
    font-family: -apple-system, 'Segoe UI', sans-serif;
  }

  /* ── Speech Bubble ── */
  .sw-bubble {
    background: rgba(10, 14, 30, 0.95);
    border: 1.5px solid #4fc3f7;
    border-radius: 16px 16px 4px 16px;
    color: #e3f2fd;
    font-size: 14px;
    line-height: 1.5;
    max-width: 240px;
    padding: 12px 16px;
    box-shadow: 0 0 18px rgba(79, 195, 247, 0.35), 0 4px 20px rgba(0,0,0,0.5);
    animation: sw-fadein 0.4s ease;
    cursor: pointer;
    position: relative;
  }
  .sw-bubble::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 20px;
    border: 5px solid transparent;
    border-top-color: #4fc3f7;
  }
  .sw-bubble .sw-typing {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid #4fc3f7;
    animation: sw-type 1.2s steps(40) forwards, sw-cursor 0.7s step-end infinite;
    max-width: 100%;
  }
  .sw-bubble .sw-skip {
    font-size: 10px;
    color: #4fc3f7;
    opacity: 0.6;
    display: block;
    text-align: right;
    margin-top: 6px;
  }

  /* ── Droid Body ── */
  .sw-droid-btn {
    width: 72px;
    height: 72px;
    cursor: pointer;
    animation: sw-bob 3s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba(79, 195, 247, 0.5));
    transition: transform 0.15s;
  }
  .sw-droid-btn:hover { transform: scale(1.1); }
  .sw-droid-btn:active { transform: scale(0.95); }

  /* Eye glow pulse */
  .sw-eye { animation: sw-glow 2s ease-in-out infinite; }

  /* Antenna blink */
  .sw-antenna-light { animation: sw-blink 1.8s ease-in-out infinite; }

  /* Hologram ring */
  .sw-holo {
    animation: sw-spin 8s linear infinite;
    transform-origin: 36px 52px;
  }

  /* ── Keyframes ── */
  @keyframes sw-bob {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes sw-glow {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes sw-blink {
    0%, 90%, 100% { opacity: 1; }
    95%            { opacity: 0; }
  }
  @keyframes sw-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes sw-fadein {
    from { opacity: 0; transform: translateY(8px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes sw-type {
    from { max-width: 0; }
    to   { max-width: 100%; }
  }
  @keyframes sw-cursor {
    50% { border-color: transparent; }
  }
  `;

  const DROID_SVG = `
  <svg width="72" height="88" viewBox="0 0 72 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Hologram ring (spinning) -->
    <ellipse class="sw-holo" cx="36" cy="52" rx="30" ry="6"
      stroke="#4fc3f7" stroke-width="1" stroke-dasharray="4 3" opacity="0.4"/>

    <!-- Legs -->
    <rect x="18" y="64" width="8" height="18" rx="3" fill="#b0bec5"/>
    <rect x="46" y="64" width="8" height="18" rx="3" fill="#b0bec5"/>
    <rect x="15" y="78" width="14" height="5" rx="2" fill="#78909c"/>
    <rect x="43" y="78" width="14" height="5" rx="2" fill="#78909c"/>

    <!-- Body -->
    <rect x="14" y="36" width="44" height="32" rx="8" fill="#1a237e"/>
    <rect x="14" y="36" width="44" height="32" rx="8" fill="url(#bodyGrad)"/>

    <!-- Body panel lines -->
    <line x1="22" y1="42" x2="22" y2="62" stroke="#4fc3f7" stroke-width="0.8" opacity="0.5"/>
    <line x1="50" y1="42" x2="50" y2="62" stroke="#4fc3f7" stroke-width="0.8" opacity="0.5"/>
    <rect x="26" y="44" width="20" height="12" rx="3"
      fill="rgba(79,195,247,0.12)" stroke="#4fc3f7" stroke-width="0.8"/>

    <!-- Chest light -->
    <circle cx="36" cy="50" r="4" fill="#4fc3f7" opacity="0.9"/>
    <circle cx="36" cy="50" r="2.5" fill="#e3f2fd"/>

    <!-- Dome head -->
    <ellipse cx="36" cy="30" rx="22" ry="8" fill="#1565c0"/>
    <path d="M14 30 Q14 10 36 10 Q58 10 58 30 Z" fill="#1565c0"/>
    <path d="M14 30 Q14 10 36 10 Q58 10 58 30 Z" fill="url(#domeGrad)"/>

    <!-- Head stripe -->
    <path d="M16 24 Q36 18 56 24" stroke="#4fc3f7" stroke-width="1.5"
      fill="none" opacity="0.6"/>

    <!-- Eye / Lens -->
    <circle cx="36" cy="22" r="7" fill="#0d1b2a"/>
    <circle class="sw-eye" cx="36" cy="22" r="5" fill="#4fc3f7"/>
    <circle cx="36" cy="22" r="3" fill="#e3f2fd"/>
    <circle cx="34.5" cy="20.5" r="1" fill="white" opacity="0.8"/>

    <!-- Side sensors -->
    <circle cx="20" cy="22" r="2.5" fill="#37474f"/>
    <circle cx="20" cy="22" r="1.5" fill="#4fc3f7" opacity="0.7"/>
    <circle cx="52" cy="22" r="2.5" fill="#37474f"/>
    <circle cx="52" cy="22" r="1.5" fill="#4fc3f7" opacity="0.7"/>

    <!-- Antenna -->
    <line x1="36" y1="10" x2="36" y2="4" stroke="#78909c" stroke-width="2"/>
    <circle class="sw-antenna-light" cx="36" cy="3" r="2.5" fill="#f44336"/>

    <!-- Arm left -->
    <rect x="8" y="40" width="7" height="20" rx="3" fill="#263238"/>
    <rect x="5" y="54" width="10" height="5" rx="2" fill="#37474f"/>

    <!-- Arm right -->
    <rect x="57" y="40" width="7" height="20" rx="3" fill="#263238"/>
    <rect x="57" y="54" width="10" height="5" rx="2" fill="#37474f"/>

    <defs>
      <linearGradient id="bodyGrad" x1="14" y1="36" x2="58" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1565c0" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#0d1b2a" stop-opacity="1"/>
      </linearGradient>
      <linearGradient id="domeGrad" x1="14" y1="10" x2="58" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#42a5f5" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#1565c0" stop-opacity="0"/>
      </linearGradient>
    </defs>
  </svg>`;

  let currentIndex = -1;
  let typingTimeout = null;

  function nextGreeting() {
    let next;
    do { next = Math.floor(Math.random() * GREETINGS.length); }
    while (next === currentIndex && GREETINGS.length > 1);
    currentIndex = next;
    return GREETINGS[currentIndex];
  }

  function showBubble(wrap) {
    let bubble = wrap.querySelector('.sw-bubble');
    const text = nextGreeting();

    if (!bubble) {
      bubble = document.createElement('div');
      bubble.className = 'sw-bubble';
      bubble.addEventListener('click', () => showBubble(wrap));
      wrap.insertBefore(bubble, wrap.querySelector('.sw-droid-btn'));
    }

    // Reset animation
    bubble.innerHTML = `<span class="sw-typing">${text}</span><span class="sw-skip">tap for more</span>`;
    bubble.style.animation = 'none';
    void bubble.offsetWidth;
    bubble.style.animation = 'sw-fadein 0.4s ease';

    // Auto-cycle every 8s
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => showBubble(wrap), 8000);
  }

  function init(selector) {
    const root = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector || document.getElementById('sw-avatar');
    if (!root) return;

    // Inject styles once
    if (!document.getElementById('sw-avatar-styles')) {
      const style = document.createElement('style');
      style.id = 'sw-avatar-styles';
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    // Build widget
    root.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'sw-avatar-wrap';

    const droidBtn = document.createElement('div');
    droidBtn.className = 'sw-droid-btn';
    droidBtn.setAttribute('role', 'button');
    droidBtn.setAttribute('aria-label', 'Star Wars assistant');
    droidBtn.innerHTML = DROID_SVG;
    droidBtn.addEventListener('click', () => showBubble(wrap));

    wrap.appendChild(droidBtn);
    root.appendChild(wrap);

    // Show first greeting after short delay
    setTimeout(() => showBubble(wrap), 800);
  }

  // Auto-init if #sw-avatar exists in DOM, else wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }

  window.SWAvatar = { init, greetings: GREETINGS };
})();

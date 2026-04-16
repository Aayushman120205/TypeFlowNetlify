// Shared nav + footer injected into every page
const NAV_HTML = (activePage) => {
  const user = JSON.parse(localStorage.getItem('tf_current_user')||'null');
  const authSection = user
    ? `<div style="display:flex;align-items:center;gap:10px">
        <div style="width:28px;height:28px;border-radius:50%;background:${user.avBg||'rgba(232,160,32,0.15)'};color:${user.avText||'var(--amber)'};border:1px solid ${user.avBorder||'var(--amber)'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;font-family:'JetBrains Mono',monospace">${user.name.slice(0,2).toUpperCase()}</div>
        <span style="font-size:11px;color:var(--cream-dim);letter-spacing:0.04em">${user.name}</span>
        <button onclick="signOutUser()" style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;background:transparent;border:1px solid var(--border-dim);color:var(--cream-muted);padding:4px 10px;cursor:pointer;font-family:'JetBrains Mono',monospace">Sign out</button>
       </div>`
    : `<a href="login.html" class="btn-nav">Sign In →</a>`;
  return `
<nav>
  <a href="index.html" class="nav-logo">Type<span class="accent">Flow</span></a>
  <ul class="nav-links">
    <li><a href="practice.html" class="${activePage==='practice'?'active':''}">Practice</a></li>
    <li><a href="upload.html" class="${activePage==='upload'?'active':''}">Upload</a></li>
    <li><a href="drills.html" class="${activePage==='drills'?'active':''}">Drills</a></li>
    <li><a href="stats.html" class="${activePage==='stats'?'active':''}">Analytics</a></li>
    <li><a href="contest.html" class="${activePage==='contest'?'active':''}">Contest</a></li>
    <li><a href="leaderboard.html" class="${activePage==='leaderboard'?'active':''}">Leaderboard</a></li>
    <li><a href="learn.html" class="${activePage==='learn'?'active':''}">Learn</a></li>
  </ul>
  <div class="nav-right">${authSection}</div>
</nav>`;};

const FOOTER_HTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="index.html" class="nav-logo">Type<span class="accent">Flow</span></a>
      <p class="footer-desc">A professional typing environment built for speed, precision, and measurable progress. Trusted by 12,000+ typists daily.</p>
      <a href="practice.html" class="btn-primary" style="font-size:10px;padding:10px 22px">Begin Session →</a>
    </div>
    <div>
      <div class="footer-col-title">Practice</div>
      <ul class="footer-links">
        <li><a href="practice.html">Practice Arena</a></li>
        <li><a href="upload.html">Upload & Practice</a></li>
        <li><a href="drills.html">Drill Mode</a></li>
        <li><a href="contest.html">Friend Contest</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Progress</div>
      <ul class="footer-links">
        <li><a href="stats.html">Analytics</a></li>
        <li><a href="leaderboard.html">Leaderboard</a></li>
        <li><a href="stats.html">History</a></li>
        <li><a href="login.html">Your Account</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Resources</div>
      <ul class="footer-links">
        <li><a href="learn.html">Technique Guide</a></li>
        <li><a href="learn.html">Finger Placement</a></li>
        <li><a href="learn.html">Speed Tips</a></li>
        <li><a href="login.html">Sign In / Register</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copy">© 2025 TypeFlow — Precision Typing Trainer</span>
    <span class="footer-copy">Built for typists who want real results.</span>
  </div>
</footer>`;

// Passages library
const PASSAGES = {
  tech:[
    "The internet is a global network of billions of computers and electronic devices. Machine learning models process vast amounts of training data to learn statistical patterns that generalize to new inputs.",
    "Cloud computing delivers computing services over the internet including servers, storage, databases, networking, and analytics. Containerization allows applications to run consistently across different environments.",
    "Version control systems track changes in source code over time, enabling teams to collaborate effectively. A pull request is a mechanism for developers to notify team members that they have completed a feature.",
    "Microservices architecture structures an application as a collection of small autonomous services modeled around a business domain. Each service is self-contained and implements a single business capability.",
  ],
  literature:[
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light.",
    "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about and see the watery part of the world.",
    "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonsky household. The wife had discovered that the husband was having an affair.",
    "You must allow me to tell you how ardently I admire and love you. In vain have I struggled. It will not do. My feelings will not be repressed. You must allow me to tell you how ardently I admire you.",
  ],
  science:[
    "Photosynthesis is a process used by plants to convert light energy into chemical energy stored in glucose. Chlorophyll absorbs sunlight and uses that energy to synthesize sugars from carbon dioxide and water.",
    "The theory of natural selection states that organisms with heritable traits better suited to the environment tend to survive and reproduce more successfully. Over time this process drives evolutionary change.",
    "Quantum entanglement is a phenomenon where two particles become correlated such that the quantum state of each cannot be described independently of the others, even when separated by large distances.",
    "Black holes are regions of spacetime where gravity is so strong that nothing, not even light or other electromagnetic waves, has enough speed to escape the event horizon and reach the outside observer.",
  ],
  philosophy:[
    "The unexamined life is not worth living. True knowledge exists in knowing that you know nothing. Wisdom begins in wonder. We cannot step twice into the same river, for other waters are continually flowing on.",
    "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does. Existence precedes essence. We are our choices, and in choosing we define humanity itself.",
    "To be is to be perceived. The mind is its own place, and in itself can make a heaven of hell or a hell of heaven. Reality is merely an illusion, albeit a very persistent one that governs our lives.",
    "We are what we repeatedly do. Excellence then is not an act but a habit. The more you know, the more you realize you know nothing. The secret of happiness is not found in seeking more but in appreciating what is.",
  ],
  code:[
    "const fibonacci = (n, memo = {}) => n <= 1 ? n : (memo[n] ??= fibonacci(n-1, memo) + fibonacci(n-2, memo)); const result = Array.from({length: 10}, (_, i) => fibonacci(i));",
    "async function fetchData(url, retries = 3) { try { const res = await fetch(url); if (!res.ok) throw new Error(res.status); return await res.json(); } catch (err) { if (retries > 0) return fetchData(url, retries - 1); throw err; } }",
    "class EventEmitter { #events = new Map(); on(e, fn) { (this.#events.get(e) ?? this.#events.set(e, []).get(e)).push(fn); return this; } emit(e, ...args) { this.#events.get(e)?.forEach(fn => fn(...args)); } }",
    "const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x); const compose = (...fns) => pipe(...fns.reverse()); const transform = compose(x => x * 2, x => x + 1, x => x ** 2);",
  ],
  quotes:[
    "The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle. As with all matters of the heart, you will know when you find it.",
    "In the middle of difficulty lies opportunity. Imagination is more important than knowledge. The measure of intelligence is the ability to change and adapt to new circumstances.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. We shall fight on the beaches, we shall fight on the landing grounds, we shall never surrender.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. Life is what happens when you are busy making other plans. The future belongs to those who believe.",
  ],
};

// Common key drills
const DRILLS = {
  homerow: "asdf jkl; asdf jkl; fjdks alfjd kslaj fdkls ajfkd slajf dklsa jfdks lajfd kslaj fdkla",
  toprow: "qwer tyui op qwer tyui qwerty uiop werty uiop qwer tyui opqw erty uiop",
  bottomrow: "zxcv bnm zxcv bnm zxcvb nm zxc vbnm zxcvb nmzx cvbn mzxc vbnm",
  numbers: "1234 5678 90 1234 5678 1234 5678 9012 3456 7890 1234 5678 90",
  punctuation: "the cat, sat. on; the mat: it was! great? yes! no. maybe; perhaps, always.",
  capitals: "The Quick Brown Fox Jumps Over The Lazy Dog. Pack My Box With Five Dozen Liquor Jugs.",
  common: "the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what",
  bigrams: "th he in er an re es on st nt en at ed nd to or ea ti ar te ng al ou it is",
};

function signOutUser() {
  localStorage.removeItem("tf_current_user");
  location.reload();
}

function requireAuth() {
  const user = JSON.parse(localStorage.getItem('tf_current_user')||'null');
  if (!user) {
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `login.html?returnTo=${returnTo}`;
    return false;
  }
  return true;
}

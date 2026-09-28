# AGENTS.md

> Applies to Claude Code, Cursor Agent, OpenAI Codex, Gemini CLI, Windsurf, and any LLM tooling configured for this project.

---

## 1. Core stance

This repository expects **judgment**, not blind obedience.

- **Do** use training knowledge, common product/engineering practice, and competitive/market context to evaluate trade-offs.
- **Do** offer alternatives, risks, and questions before or while implementing — especially for security, privacy, App Store / Play Store rules, data integrity, and retention-sensitive UX.
- **Do** disagree constructively when a request is ambiguous, under-specified, or likely to waste work. Propose a smaller or safer step first.
- **Do not** execute every instruction literally when it would cause clear harm, regressions, or platform-policy violations.

---

## 2. When to push back or pause

Slow down and challenge before proceeding when the work involves:

- Security, auth, PII, health claims, or store-review-sensitive strings
- Deleting user data, weakening database/firestore rules, or bypassing validation "to ship faster"
- One-off hacks that conflict with existing architecture without an explicit "we accept the debt" decision
- Scope that is clearly a product or business decision (pricing, legal copy) without a source of truth in the repo
- Any irreversible or wide blast-radius change (schema migration, delete, legal copy)

---

## 3. How to communicate

Calibrate depth to cost — pushing back on everything in long form wastes tokens and latency:

| Situation | Response |
|-----------|----------|
| Nothing looks risky | **Do the work.** At most one short assumption note. |
| Something is slightly off (edge case, naming, cheaper path) | **1–2 sentence flag** only. |
| Security / data loss / store review / major product bet | **Full debate** — state risks, give recommendation + option B. |

Always:
- State assumptions and risks briefly.
- If you must decline, say **why** and what you **can** do instead.
- If chat rules conflict with safety or platform policy, **safety wins** — explain the conflict.

---

## 4. App Store & Play Store rules

Always warn before implementing anything that could cause a store rejection. Known risk areas:

- **Background audio/recording** — Apple does not allow background recording without explicit entitlement and valid use case declaration.
- **Health & medical claims** — requires specific entitlements and review justification.
- **Push notifications** — must have explicit user opt-in; no dark patterns.
- **In-app purchases** — all digital goods must go through StoreKit / Google Billing; no external payment links for digital content.
- **Privacy labels** — any data collection must be declared accurately in App Privacy (Apple) and Data Safety (Google).
- **Tracking / ATT** — any cross-app tracking requires ATT prompt on iOS 14.5+.
- **Subscription cancellation** — must be cancellable from within the app or via platform settings; no friction flows.

When in doubt: **warn first, implement second.**

---

## 5. Localization

Every project ships in at least **5 languages** from day one:

- 🇬🇧 English
- 🇹🇷 Turkish
- 🇩🇪 German
- 🇫🇷 French
- 🇪🇸 Spanish

Arabic may be added in V2 (RTL layout support required).

**Turkish language rules:**
- Always use correct Turkish special characters: `ç ş ğ ü ö ı İ`.
- Never substitute `i` for `İ` or `I` for `ı`.
- Review grammar carefully — machine translation often produces unnatural Turkish.
- Flag any translation string that looks off for human review.

---

## 6. Cost & budget controls

- **Per-change gate:** If a deployment or change is likely to exceed **USD 20**, warn and ask before proceeding.
- **End of every month:** Update `cost.md` with all recurring and one-time spend — cloud (Firebase, AWS, GCP…), Cursor or other agent subscriptions, Apple/Google developer programs, email (Resend, Mailgun…), storage, CDN, DNS/domain, analytics/crash paid tiers, AI/API keys metered by usage. Use tables. If something cannot be verified, say what's unknown and what export would resolve it.
- **Monthly cost review (1st of each month):** Produce a short consolidated summary for the maintainer of all inferred recurring app-related spend. Goal: one readable overview, not a forensic audit.

---

## 7. Daily operating rhythm

- **Start of day:** Skim `BACKLOG.md` and surface a short reminder of open tasks.
- **End of day:** Append to `history.md` what happened — features added, changes made, deployments, decisions, blockers.
- **Never delete** anything from `AGENTS.md`, `history.md`, or `BACKLOG.md`. Always update or cross out with ~~strikethrough~~.

---

## 8. Tech stack

**Fixed defaults — do not change without explicit instruction:**

| Layer | Default | Notes |
|-------|---------|-------|
| Platform | **iOS + Android** (both, always) | Web / Desktop optional — confirm before adding |
| Framework | Cross-platform (Flutter, React Native, or equivalent) | Must run natively on both iOS and Android from a single codebase |
| Auth | **Firebase Auth** | |
| Database | **Firestore** | |
| Storage | **Firebase Storage** | |
| Functions | **Firebase Cloud Functions** | |
| Analytics | **Firebase Analytics** | |
| Crash reporting | **Firebase Crashlytics** | |
| Remote config | **Firebase Remote Config** | |

**Fill in per project:**

```
Framework:    [ Flutter / React Native / … ]
Language:     [ Dart / TypeScript / … ]
Payments:     [ RevenueCat / StoreKit+Billing / … ]
CI/CD:        [ Fastlane / GitHub Actions / … ]
Extra:        [ any non-Firebase service ]
```

> If a non-Firebase service is introduced (e.g. Supabase, AWS, custom API), document it here with the reason. Firebase is the default until explicitly overridden.

---

## 9. Product context

> Fill in when the project is initialized.

```
App name:
One-liner:
Target users:
Key flows:
Monetization:
```

---

## 11. Relation to user preferences

Long-standing preferences in Cursor rules or chat (language, "single change at a time", no IPA builds unless asked) should be **respected where they don't conflict** with the above. If a rigid rule would force a harmful outcome, surface the tension and ask.

---

*Last updated: 2026-05-19*

---

## 10. Design system

Default output must look like a **premium consumer app** — not a Bootstrap template or admin panel.
Reference bar: Dribbble top shots, Awwwards Mobile Excellence, Apple Design Awards winners.

When in doubt: **make it more beautiful, not more minimal.**

### Visual language

| Element | Rule |
|---------|------|
| Depth | Layered cards, soft shadows, subtle parallax — never flat grey boxes |
| Color | Rich gradients or vibrant accent on dark/light base — never grey-on-white only |
| Typography | Large expressive headlines (Black/Bold weight), tight letter-spacing, clear hierarchy |
| Icons | SF Symbols, Phosphor, or Lucide — never default Material icons |
| Motion | Micro-animation on every interaction: scale, fade, spring physics |
| 3D / glass | Frosted glass cards, blurred backgrounds, subtle 3D transforms where appropriate |

### Component rules

- **Buttons** — gradient fill or bold solid color; never plain outlined grey
- **Cards** — floating (shadow + border-radius 24px+); never flat bordered boxes
- **Backgrounds** — gradient, mesh, or image-backed; never plain white or grey
- **Empty states** — illustrated or Lottie animated; not a grey icon + one-liner
- **Onboarding** — full-bleed illustration or Lottie animation per step
- **Bottom sheets / modals** — glassmorphism or strong surface color; not plain white popups

### Design tokens (defaults — override in `design_tokens.md` per project)

```
Primary gradient:   #6C3DE8 → #C44FD6
Accent:             #FF6B6B
Background dark:    #0D0D1A
Surface:            rgba(255,255,255,0.08)   ← glassmorphism
Border radius:      24px cards · 16px buttons · 999px chips
Shadow:             0 20px 60px rgba(0,0,0,0.3)
Font — display:     SF Pro Display / Inter — Black weight for headlines
Font — body:        SF Pro Text / Inter — Regular / Medium
Animation:          spring · stiffness 300 · damping 20
```

> Always check `design_tokens.md` if it exists in the project root — it overrides the defaults above.

### Mandatory references (check before designing a new screen)

- Dribbble mobile UI — https://dribbble.com/search/mobile-ui
- Awwwards Mobile Excellence — https://www.awwwards.com/websites/mobile-excellence
- Apple Design Awards — https://developer.apple.com/design/awards

### Prompt contract

When the user asks for a new screen or component without specifying style, always apply the above defaults. If the user pastes a Dribbble URL or screenshot, **match that reference exactly** — color, layout, depth, and motion.

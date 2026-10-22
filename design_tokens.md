# design_tokens.md

> Project-specific design tokens. Values here override the defaults in `AGENTS.md`.
> Fill in when the project brand is defined. Until then, agents use AGENTS.md defaults.

---

## Color

```
-- Brand scale (left → right, user palette)
scale-900:            #1B4372          ← navy, buttons / primary
scale-700:            #307898          ← teal mid-dark, gradient end
scale-500:            #43A9B8          ← ocean blue
scale-300:            #5EE2E6          ← cyan accent
scale-100:            #D6F3F5          ← light tint
scale-50:             #F0FCFD          ← lightest, page background

primary:              #1B4372          (= scale-900)
primary-end:          #307898          (= scale-700, button gradient)
accent:               #FF6B6B
accent-secondary:     #FFB347

-- Backgrounds
bg-dark:              #0D1A24
bg-light:             #F0FCFD          (= scale-50)
surface-dark:         rgba(255,255,255,0.08)   ← glassmorphism on dark
surface-light:        rgba(255,255,255,0.72)   ← frosted on light

-- Text
text-primary-dark:    #FFFFFF
text-secondary-dark:  rgba(255,255,255,0.55)
text-primary-light:   #0D0D1A
text-secondary-light: rgba(13,13,26,0.55)

-- Semantic
success:              #22C55E
warning:              #F59E0B
error:                #EF4444
info:                 #3B82F6
```

---

## Typography

```
-- Display (hero headlines, large numbers)
font:                 SF Pro Display / Inter
weight:               900 (Black)
size:                 40–64px
letter-spacing:       -0.03em
line-height:          1.1

-- Headline (screen titles, card titles)
font:                 SF Pro Display / Inter
weight:               700 (Bold)
size:                 24–32px
letter-spacing:       -0.02em
line-height:          1.2

-- Body
font:                 SF Pro Text / Inter
weight:               400 / 500
size:                 14–16px
letter-spacing:       0
line-height:          1.6

-- Caption / label
font:                 SF Pro Text / Inter
weight:               500
size:                 11–13px
letter-spacing:       0.02em
```

---

## Spacing & shape

```
-- Border radius
radius-xs:            8px    (tags, chips, small badges)
radius-sm:            12px   (input fields, small buttons)
radius-md:            16px   (buttons, list items)
radius-lg:            24px   (cards, sheets)
radius-xl:            32px   (large cards, onboarding panels)
radius-full:          999px  (pills, FABs, avatars)

-- Spacing scale (8px base)
space-1:   4px
space-2:   8px
space-3:   12px
space-4:   16px
space-5:   24px
space-6:   32px
space-7:   48px
space-8:   64px
```

---

## Elevation & shadows

```
shadow-sm:   0 4px 12px rgba(0,0,0,0.12)       ← subtle lift
shadow-md:   0 8px 24px rgba(0,0,0,0.18)       ← cards
shadow-lg:   0 20px 60px rgba(0,0,0,0.28)      ← floating elements
shadow-glow: 0 0 40px rgba(108,61,232,0.35)    ← brand color glow
```

---

## Motion & animation

```
-- Easing
ease-spring:   spring(stiffness: 300, damping: 20)
ease-smooth:   cubic-bezier(0.4, 0, 0.2, 1)
ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1)

-- Duration
duration-fast:    150ms   (micro feedback: tap, toggle)
duration-default: 300ms   (most transitions)
duration-slow:    500ms   (page transitions, large reveals)

-- Common patterns
button tap:        scale(0.97) → scale(1.0), 150ms spring
card appear:       opacity 0→1 + translateY(16px→0), 300ms ease-smooth
screen transition: slide or fade, 350ms ease-smooth
loading skeleton:  shimmer loop, 1.2s ease-in-out infinite
```

---

## Iconography

```
Library:      SF Symbols (iOS), Phosphor (Android/cross-platform)
Fallback:     Lucide
Style:        Regular weight (not filled) as default; filled only for active/selected state
Size:         16px inline · 20px list items · 24px navigation · 32px hero
Color:        inherits from parent text color
```

---

## Glassmorphism recipe

```
background:           rgba(255,255,255,0.08)
backdrop-filter:      blur(20px) saturate(180%)
border:               1px solid rgba(255,255,255,0.12)
border-radius:        var(radius-lg)
```

---

## Dark / light mode

Both modes are **mandatory from day one**.

```
Default mode:         system (follows OS setting)
Dark bg:              bg-dark (#0D0D1A)
Light bg:             bg-light (#F5F5FF)
Surface swap:         surface-dark ↔ surface-light
Text swap:            text-primary-dark ↔ text-primary-light
```

---

*Last updated: 2026-05-19 — override any value above to match project brand.*

# Суши Вкус — Design System MASTER

## Концепция: "Tokyo Night Market"
Караңгы, жылуу, премиум — түнкү Токио базарынын атмосферасы.
Кызыл акцент + жылуу караңгы фондор + тамак сүрөттөрү жаркырайт.

---

## 1. ТҮСТӨР

### Dark Mode (негизги)
| Token | Hex | Колдонуу |
|-------|-----|----------|
| bg-primary | `#09090b` | Body фону (zinc-950) |
| bg-surface | `#18181b` | Карточка, sidebar (zinc-900) |
| bg-elevated | `#27272a` | Hover, input фону (zinc-800) |
| bg-overlay | `rgba(0,0,0,0.75)` | Модал overlay |
| accent | `#ef4444` | CTA, active элементтер (red-500) |
| accent-hover | `#dc2626` | Hover (red-600) |
| accent-soft | `rgba(239,68,68,0.1)` | Accent фон |
| text-primary | `#fafafa` | Негизги текст (zinc-50) |
| text-secondary | `#a1a1aa` | Экинчи текст (zinc-400) |
| text-muted | `#71717a` | Өчүк текст (zinc-500) |
| border | `rgba(255,255,255,0.08)` | Карточка чек ара |
| border-hover | `rgba(255,255,255,0.15)` | Hover чек ара |

### Light Mode
| Token | Hex |
|-------|-----|
| bg-primary | `#fafafa` |
| bg-surface | `#ffffff` |
| bg-elevated | `#f4f4f5` |
| text-primary | `#09090b` |
| text-secondary | `#52525b` |
| text-muted | `#a1a1aa` |
| border | `rgba(0,0,0,0.08)` |

### Семантикалык
| Token | Hex | Колдонуу |
|-------|-----|----------|
| success | `#22c55e` | Заказ ийгилик |
| warning | `#f59e0b` | Эскертүү |
| error | `#ef4444` | Ката |
| info | `#3b82f6` | Маалымат |

---

## 2. ТИПОГРАФИЯ

### Font Stack
- **Display**: `'Outfit', sans-serif` — Logo, H1, H2, баа, CTA
- **Body**: `'Inter', sans-serif` — Баардык калган текст

### Scale
| Element | Font | Size | Weight | Line-height |
|---------|------|------|--------|-------------|
| Logo | Outfit | 24px | 800 | 1 |
| H1 (Hero) | Outfit | 36→60px | 800 | 1.1 |
| H2 (Section) | Outfit | 24→30px | 700 | 1.2 |
| H3 (Card title) | Inter | 14→16px | 600 | 1.3 |
| Body | Inter | 14px | 400 | 1.6 |
| Caption | Inter | 12px | 500 | 1.4 |
| Badge | Inter | 10→11px | 700 | 1 |
| Price large | Outfit | 24→32px | 700 | 1 |
| Price small | Inter | 16→18px | 700 | 1 |

---

## 3. SPACING

8px grid:
```
xs: 4px   (p-1)
sm: 8px   (p-2)
md: 12px  (p-3)
lg: 16px  (p-4)
xl: 20px  (p-5)
2xl: 24px (p-6)
3xl: 32px (p-8)
4xl: 48px (p-12)
```

### Компонент spacing
- Card padding: 12→16px
- Modal padding: 20→24px
- Section gap: 24→32px
- Grid gap: 12→16px
- Container: max-w-7xl, px-4→px-8

---

## 4. BORDER RADIUS

| Element | Radius |
|---------|--------|
| Button small | 8px (rounded-lg) |
| Button/Input | 12px (rounded-xl) |
| Card | 16px (rounded-2xl) |
| Modal | 20px (rounded-[20px]) |
| Pill/Badge | 999px (rounded-full) |
| Image | 12→16px |

---

## 5. SHADOWS & DEPTH

### Dark mode
```css
--shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4);
--shadow-card-hover: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(239,68,68,0.08);
--shadow-modal: 0 25px 60px rgba(0,0,0,0.6);
--shadow-glow: 0 0 25px rgba(239,68,68,0.25);
--shadow-glow-hover: 0 0 40px rgba(239,68,68,0.4);
```

### Light mode
```css
--shadow-card: 0 1px 3px rgba(0,0,0,0.06);
--shadow-card-hover: 0 10px 40px rgba(0,0,0,0.1);
```

---

## 6. АНИМАЦИЯЛАР

### Framer Motion стандарттары
```
Modal open: type: "spring", damping: 28, stiffness: 350
Sidebar: type: "spring", damping: 25, stiffness: 200
Card appear: delay: index * 0.04, max 0.3s
Hover lift: translateY(-4px), 0.25s ease-out
Image hover: scale(1.06), 0.5s ease-out
```

### CSS Transitions
```
Fast: 150ms (button state)
Normal: 250ms (hover, color)
Slow: 400ms (layout, transform)
Image: 500ms (scale)
```

---

## 7. КОМПОНЕНТ СПЕЦИФИКАЦИЯЛАР

### Product Card
- bg: bg-surface
- border: 1px solid border
- radius: 16px
- hover: translateY(-4px) + shadow-card-hover + border-hover
- image: aspect-[4/3], scale(1.06) on hover
- title: Inter 600, 14→16px
- price: Outfit 700, accent color
- CTA button: accent bg, rounded-xl

### Category Nav Tab
- Font: Outfit 500, 14px
- Active: accent text + accent bottom border 2px + accent-soft bg
- Inactive: text-secondary, hover → text-primary

### Header
- Height: 64→80px
- Logo: Outfit 800, accent + white
- Scrolled: bg-surface/95 + backdrop-blur-xl + subtle shadow
- Sticky top-0 z-50

### Modal
- bg: bg-surface
- border: 1px solid border
- radius: 20px
- max-w: 480px (sm: 520px)
- shadow: shadow-modal
- Overlay: bg-black/75 backdrop-blur-sm

### Cart Sidebar
- Width: 100% / max-w-md
- bg: bg-surface
- border-left: 1px solid border

### Button Primary
- bg: accent
- hover: accent-hover + shadow-glow-hover
- text: white, Outfit 600
- padding: 12px 24px
- radius: 12px

### Input
- bg: bg-elevated
- border: 1px solid border
- focus: border-accent/50
- radius: 12px
- padding: 10px 14px

---

## 8. RESPONSIVE

- Mobile: 2 column grid, compact cards
- sm (640): 3 columns
- md (768): Desktop layout
- lg (1024): Full desktop, 4 columns

---

## 9. ЭРЕЖЕЛЕР

1. Тамак сүрөттөрү ЭРГИШ ЖЕРДЕ чоң жана сапаттуу
2. Accent кызыл — CTA гана, ашыкча колдонбо
3. Glassmorphism — header жана overlay'лер гана
4. Анимация — subtle, 250ms max, hover lift 4px
5. Typography — Display font заголовок + баа гана
6. Spacing — 8px grid катуу кармоо

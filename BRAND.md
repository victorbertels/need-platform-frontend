# NEED Platform - Brand & Design System Guide

> **Keep this in sync when updating design.** All components should follow these guidelines.

---

## 🎨 Color Palette

### Primary Colors
```
Purple (Primary):     #7C3AED
Purple Light:         #A78BFA
Hot Pink (Secondary): #EC4899
Cyan (Accent):        #06B6D4
Cyan Bright:          #0FF
```

### Background Colors
```
Dark BG (Primary):    #0F172A (slate-950)
Dark BG (Secondary):  #1E293B (slate-800)
Dark BG (Tertiary):   #1E1B4B (dark purple)
Border/Subtle:        #334155 (slate-700)
Border Light:         #475569 (slate-600)
```

### Gradients (Use Often!)
```
Purple → Pink:   linear-gradient(to right, #7C3AED, #EC4899)
Pink → Cyan:     linear-gradient(to right, #EC4899, #06B6D4)
Purple → Cyan:   linear-gradient(to right, #7C3AED, #06B6D4)
Dark Mesh:       linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(236,72,153,0.1) 50%, rgba(6,182,212,0.1) 100%)
```

### Status Colors
```
Success:   #10B981 (green)
Warning:   #F59E0B (amber)
Error:     #EF4444 (red)
Info:      #3B82F6 (blue)
```

---

## 🔤 Typography

### Font Stack
```
Font Family: 'Geist', 'Space Grotesk', system-ui, sans-serif
Fallback: Inter, -apple-system, BlinkMacSystemFont, sans-serif
```

### Heading Sizes
```
h1 (Hero):    56px (3.5rem) | font-black (900) | leading-tight
h2 (Section): 40px (2.5rem) | font-bold (700) | leading-tight
h3 (Card):    28px (1.75rem) | font-bold (700)
h4 (Sub):     20px (1.25rem) | font-semibold (600)
h5 (Label):   16px (1rem) | font-semibold (600)
Body:         16px (1rem) | font-normal (400)
Small:        14px (0.875rem) | font-normal (400)
Tiny:         12px (0.75rem) | font-medium (500)
```

### Font Weights
```
Light:     300
Normal:    400
Medium:    500
Semibold:  600
Bold:      700
Extrabold: 800 (for BIG impact)
Black:     900 (for MASSIVE hero headings)
```

### Text Styles
```
Gradient Text:  Use .text-gradient class (purple→pink→cyan)
Bold Headers:   Always use font-bold or font-black for h1-h4
Regular Body:   font-normal (400) with generous line-height
Uppercase:      Avoid unless for badges/labels

Example:
<h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
  Big Bold Title
</h1>
```

---

## 🎯 Component Patterns

### Buttons

#### Primary Button (CTA)
```jsx
<button className="btn-primary">
  Get Started
</button>
```
```css
/* Styles: */
px-8 py-4
bg-gradient-to-r from-purple-600 to-pink-600
text-white font-bold text-lg
rounded-2xl
shadow-xl
hover:from-purple-500 hover:to-pink-500
hover:shadow-2xl hover:shadow-purple-500/50
transition-all duration-300
```

#### Secondary Button
```jsx
<button className="btn-secondary">
  Cancel
</button>
```
```css
/* Styles: */
px-8 py-4
bg-slate-800
text-white font-bold
rounded-2xl
border border-slate-700
hover:bg-slate-700 hover:border-purple-500
transition-all duration-300
```

#### Ghost Button
```jsx
<button className="btn-ghost">
  Learn More
</button>
```
```css
/* Styles: */
px-6 py-3
text-white font-semibold
hover:bg-slate-800
rounded-xl
transition-all duration-300
```

### Cards

#### Standard Card
```jsx
<div className="card">
  {content}
</div>
```
```css
/* Styles: */
bg-slate-800/40
backdrop-blur-lg
rounded-3xl
shadow-2xl
hover:shadow-purple-500/20
border border-slate-700/50
hover:border-purple-500/50
p-8
transition-all
```

#### Gradient Card
```jsx
<div className="card-gradient">
  {content}
</div>
```
```css
/* Styles: */
bg-gradient-to-br from-slate-800/60 to-purple-900/20
backdrop-blur-xl
rounded-3xl
shadow-2xl
border border-purple-500/20
hover:border-purple-500/50
p-8
transition-all
```

### Input Fields

#### Standard Input
```jsx
<input type="text" className="input-base" placeholder="Enter text..." />
```
```css
/* Styles: */
w-full px-5 py-4
rounded-2xl
bg-slate-800
border border-slate-700
text-white placeholder-slate-400
focus:outline-none focus:ring-2 focus:ring-purple-500
focus:border-transparent
transition-all duration-300
backdrop-blur-sm
```

### Badges

#### Primary Badge
```jsx
<span className="badge-primary">New</span>
```
```css
/* Styles: */
px-4 py-2
bg-gradient-to-r from-purple-600 to-pink-600
text-white text-sm font-semibold
rounded-full
```

#### Secondary Badge
```jsx
<span className="badge-secondary">Status</span>
```
```css
/* Styles: */
px-4 py-2
bg-slate-700/50
border border-slate-600
text-slate-200 text-sm font-semibold
rounded-full
```

---

## 🎨 Spacing System

```
Compact:     4px (0.25rem) | xs
Small:       8px (0.5rem)  | sm
Normal:      16px (1rem)   | base
Comfortable: 24px (1.5rem) | md
Spacious:    32px (2rem)   | lg
Extra:       48px (3rem)   | xl
Hero:        64px (4rem)   | 2xl
```

**Rule of Thumb**: Use at least `p-8` for card padding. Use `gap-8` for component spacing.

---

## 🌙 Dark Mode

### Always Dark
- Background: Use `bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950`
- Cards: Use `card` or `card-gradient` classes
- Text: Primary = white, Secondary = `text-slate-300`, Tertiary = `text-slate-400`

### No Light Mode
- All pages are dark-first
- No light backgrounds
- No gray text on light backgrounds
- All gradients use dark tones

---

## ✨ Animations & Effects

### Hover Effects
```
hover-lift:  hover:-translate-y-2 hover:shadow-2xl
hover-glow:  hover:shadow-2xl hover:shadow-purple-500/50
hover-border: hover:border-purple-500/50
```

### Transitions
```
Fast:   duration-200
Normal: duration-300
Slow:   duration-500
```

### Animations
```
fade-in:     Fade in + slide up (0.5s)
pulse-glow:  Pulse with glow effect (2s loop)
animate-pulse: Standard pulse (built-in)
```

### Backdrop Blur
```
Light:    backdrop-blur-sm
Normal:   backdrop-blur-lg
Heavy:    backdrop-blur-xl
```

---

## 🎯 Do's & Don'ts

### ✅ DO
- **Use Gradients**: Purple → Pink → Cyan everywhere possible
- **Keep Dark Mode**: No light backgrounds ever
- **Big Typography**: h1 should be 48px minimum, preferably 56px+
- **Bold Fonts**: Use font-bold (700) or font-black (900) for headings
- **Spacing**: Generous padding (p-6, p-8) and gaps (gap-6, gap-8)
- **Glassmorphism**: Use backdrop-blur-lg and semi-transparent backgrounds
- **Icons**: Use react-icons with size 20-24px, color with gradients
- **Rounded Corners**: Use rounded-2xl (16px) to rounded-3xl (24px) for cards
- **Shadows**: Use shadow-xl to shadow-2xl, add purple/pink glow
- **Buttons**: Make them BIG and gradient-filled

### ❌ DON'T
- Use light colors or light backgrounds
- Use small typography (minimum 16px for body)
- Use flat colors without gradients
- Use sharp corners (border-radius < 8px)
- Add shadows without glow effects
- Use heavy borders (max 1px)
- Mix serif and sans-serif fonts
- Use opacity under 0.3 for important text
- Create boring, minimal UI
- Ignore the dark theme

---

## 📐 Example Component Layout

```jsx
// GOOD ✅
export default function FeatureCard() {
  return (
    <div className="card hover-glow cursor-pointer">
      <div className="mb-6 inline-block p-4 bg-gradient-to-br from-purple-600/30 to-pink-600/20 rounded-2xl">
        <FiZap className="text-2xl text-gradient" />
      </div>
      <h3 className="text-2xl font-bold mb-3">Feature Title</h3>
      <p className="text-slate-400 leading-relaxed mb-6">Description text...</p>
      <button className="btn-primary w-full">Learn More</button>
    </div>
  );
}

// BAD ❌
export default function FeatureCard() {
  return (
    <div className="bg-white rounded p-4 border">
      <div>Feature</div>
      <p>Description</p>
      <button>Learn More</button>
    </div>
  );
}
```

---

## 🎨 Category Colors (Map View)

Used for marking different task types on the map:

```
Delivery:     #06B6D4 (Cyan)
Cleaning:     #7C3AED (Purple)
Plumbing:     #3B82F6 (Blue)
Handyperson:  #EC4899 (Pink)
Gardening:    #10B981 (Green)
Furniture:    #F59E0B (Amber)
Marketing:    #8B5CF6 (Violet)
Other:        #6366F1 (Indigo)
```

---

## 📱 Responsive Design

### Breakpoints
```
Mobile:  < 768px   (md: in Tailwind)
Tablet:  768px     (md:)
Desktop: 1024px    (lg:)
Wide:    1280px    (xl:)
```

### Mobile-First Approach
```jsx
// Always mobile first, then add larger screens
<div className="flex flex-col md:flex-row md:gap-8">
  <div className="mb-6 md:mb-0">Mobile first</div>
</div>
```

---

## 🚀 When Creating New Components

1. **Check this guide first**
2. **Use existing components** (button, card, input)
3. **Maintain gradient usage** (purple→pink→cyan)
4. **Keep it dark** (no light backgrounds)
5. **Make typography bold** (h1-h4 should be font-bold/black)
6. **Add proper spacing** (p-8, gap-8 minimum)
7. **Include hover effects** (hover-lift, hover-glow)
8. **Test on mobile** (use Tailwind's md:, lg: prefixes)
9. **Use backdrop blur** (backdrop-blur-lg for modern feel)
10. **Add shadow + glow** (shadow-xl + shadow-purple-500/50)

---

## 📚 Design System Files

- **Tailwind Config**: `tailwind.config.ts` (colors, fonts, animations)
- **Global Styles**: `styles/globals.css` (custom utilities, animations)
- **Components**: `components/*.tsx` (reusable UI components)

---

## 🎯 Summary: The NEED Aesthetic

**Bold. Vibrant. Modern. Startup.**

- Dark backgrounds with purple/pink/cyan gradients
- Big, black fonts (56px+ for heroes)
- Glassmorphic cards with blur
- Smooth animations and glowing effects
- Generous spacing and padding
- Premium shadows with color-matched glows
- No compromises on darkness or boldness

**Make it look like a $100M Series A company.** ✨🚀

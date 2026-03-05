

# Atmosphere — Premium Early-Access Landing Page

## Overview
A cinematic, Apple-inspired landing page for "Atmosphere" — a startup marketplace platform. Deep black background, glassmorphism UI, refined typography, and smooth animations throughout.

## Page Structure

### 1. Fixed Glass Navigation Bar
- Atmosphere logo on the left, "Apply for Early Access" glass button on the right
- Transparent/frosted glass effect, fixed on scroll

### 2. Hero Section (full viewport)
- Centered Atmosphere logo with subtle glow
- Large headline: **"The Marketplace for Startup Opportunities"**
- 2-3 line elegant description of the platform concept
- Primary glass CTA button: "Apply for Early Access"
- Subtle fade-in animations on load

### 3. Concept Section — Three Glass Cards
- Horizontal layout with three glassmorphic cards:
  - **Discover Startups** — Browse curated startup profiles
  - **Investment Opportunities** — Connect with vetted deals
  - **Startup Talent** — Find early-stage roles
- Each card has a minimal icon, title, and one-line description
- Hover effects with subtle lift and glow

### 4. Vision Section
- Centered headline: **"Built for the Startup Ecosystem"**
- Short paragraph about unifying the fragmented startup landscape
- Clean, spacious layout with muted typography

### 5. CTA Section — Large Glass Panel
- Prominent glass card with message: "We are opening Atmosphere to a small group of early founders."
- "Apply Now" button that opens the onboarding modal

### 6. Multi-Step Application Modal
A glassmorphic modal with step indicators and smooth transitions between 6 steps:
1. **Startup Info** — Name, what you're building, industry category
2. **Stage** — Selectable options (Idea → Scaling)
3. **Legal Entity** — Yes / No / In Progress
4. **Funding** — No funding through later stages; conditional amount field
5. **Revenue** — Pre-revenue through revenue ranges
6. **Contact** — Founder name, email, LinkedIn (optional), website (optional)

Dark-styled inputs with glass borders. "Submit Application" button on final step.

### 7. Confirmation Screen
- Minimal thank-you message inside the modal after submission
- "Your early access request has been received"

### 8. Footer
- Atmosphere name + tagline
- "Early Access Launch" note
- Minimal, clean layout

## Design System
- **Background**: Deep black (#000/near-black) with subtle radial gradients
- **Glass effects**: `backdrop-blur`, semi-transparent white borders, subtle shadows
- **Typography**: Thin sans-serif (Inter), large headlines in white, muted gray for secondary text
- **Colors**: Black, white, soft grays only — no bright accent colors
- **Animations**: Gentle fade-ins on scroll, hover glow/lift on buttons and cards
- **Spacing**: Very generous padding and margins throughout

## Data Handling
- Form data stored in local state only (no backend) — logged to console on submit
- All interactions are frontend-only for this initial version


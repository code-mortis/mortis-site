---
name: Code Mortis
description: A quiet charcoal interface for code review and developer documentation.
colors:
  background: "#141618"
  surface: "#1b1e21"
  ink: "#f1f2f3"
  muted: "#a6abb2"
  line: "#33383d"
  accent: "#a8c7ee"
  scope-hover: "#292e33"
  scope-selected: "#333a42"
typography:
  display:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "clamp(48px, 6.4vw, 80px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.03em"
  title:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "16px"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: "-0.015em"
  body:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
rounded:
  scope: "4px"
  button: "6px"
  panel: "8px"
  status: "99px"
spacing:
  small: "8px"
  medium: "24px"
  large: "32px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.background}"
    rounded: "{rounded.button}"
    padding: "13px 21px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  scope-selected:
    backgroundColor: "{colors.scope-selected}"
    textColor: "{colors.ink}"
    rounded: "{rounded.scope}"
    padding: "7px 12px"
  status:
    textColor: "{colors.muted}"
    rounded: "{rounded.status}"
    padding: "4px 11px"
---

## Overview

**Creative North Star: "Quiet confidence in the code"**

A minimalist dark developer interface. Large, tightly spaced headlines introduce the product; compact copy, command examples, and thin dividers carry the detail. Muted blue draws attention to key words, links, and availability.

**Key Characteristics:**
- Charcoal surfaces and off-white text.
- Manrope headings and body text, with monospace commands.
- Flat sections, restrained borders, and small rounded controls.

This records implemented source in `src/styles/landing.css`, `src/styles/docs.css`, and the existing Astro and React components. No screenshots or computed browser styles were available because the browser host was unavailable.

## Colors

The accent marks emphasis, links, focus, and the available status. Ink is the main text and primary button surface; muted text supports descriptions and navigation. Background, surface, and line separate page, command panels, and section boundaries.

**The Accent Rule.** Keep blue concentrated on emphasis and interactive states.

Documentation maps the same charcoal, surface, line, muted, and accent values into Starlight variables. The custom theme provider forces dark mode; light-theme CSS overrides exist but are not exposed by the current interface.

## Typography

Use Manrope throughout the interface. Headlines are balanced and tightly tracked; paragraph text is relaxed. Commands use the system monospace stack. Body copy varies by context from compact captions to the larger hero description. The display shrinks at the mobile breakpoint to `clamp(42px, 8vw, 62px)`.

## Layout

The landing container is centered with a maximum width of 1080px and 48px side gutters. At 760px and below, gutters become 20px, the hero action stacks below its description, and installation content becomes one column. Features remain two columns until 440px, then become one column. Navigation wraps; the Engine anchor is hidden at the first breakpoint.

Sections use thin horizontal dividers and generous vertical spacing. Feature rows have their own dividers. Code blocks scroll horizontally instead of expanding the layout.

## Elevation & Depth

No shadows are defined in the custom styles. Surface tone and one-pixel borders provide depth. Control transitions use 0.18s ease-out. Reduced-motion preferences disable transitions and smooth scrolling.

## Shapes

Buttons and code panels use small rounded corners. Status labels are pills with a thin border; the available label includes a small circular dot. Content sections stay flat rather than becoming floating cards.

## Components

- **Primary action:** off-white filled link with dark text; blue on hover. Global keyboard focus is a two-pixel blue outline with a five-pixel offset.
- **Navigation:** muted compact links brighten and underline on hover. The wordmark is heavier, tightly tracked, and ends in a blue period.
- **Review scope selector:** React buttons use `aria-pressed` within a labelled group. Hover and selected backgrounds differ. The command and explanation update in a polite, atomic live region.
- **Command and install panels:** charcoal surface, thin border, rounded frame, monospace content, horizontal overflow. The review panel has separate selector, content, and footnote rows.
- **Status labels:** muted outlined pills; availability uses blue text and a matching dot.
- **Documentation:** Starlight supplies its standard content shell; custom CSS aligns font and palette. Search and theme controls are currently empty overrides.

## Do's and Don'ts

### Do:
- Do reuse the charcoal palette and Manrope stack across landing and documentation.
- Do keep keyboard focus visible and respect reduced motion.
- Do allow command examples to scroll horizontally on narrow screens.

### Don't:
- Don't add decorative shadows to the existing flat surfaces.
- Don't substitute a second display font for the current shared typography.

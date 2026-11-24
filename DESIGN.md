---
name: Code Mortis
description: Review Desk leads the homepage from a light hero into a dark product tour. Compare and Docs retain the Night Guide palette described below.
colors:
  paper: "#191b18"
  type: "#f3efe3"
  secondary: "#bcbcaf"
  rule: "#535449"
  signal: "#ff7545"
  panel: "#23251f"
typography:
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "clamp(3.5rem, 6.8vw, 6.6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.15rem, 3.9vw, 3.8rem)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(19px, 1.65vw, 25px)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.6
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
rounded:
  button: "3px"
spacing:
  row-top: "16px"
  row-bottom: "24px"
  section: "clamp(45px, 5.3vw, 82px)"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "12px 17px"
  button-primary-hover:
    backgroundColor: "{colors.type}"
    textColor: "{colors.paper}"
  button-github:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.type}"
    rounded: "{rounded.button}"
    padding: "6px 12px"
---

## Overview

Review Desk is the homepage reference. Its light hero uses Inter and the light-background raven wordmark. The repository tour uses native App details on charcoal. The homepage and the local Review Desk preview share `src/components/ReviewDesk.astro` and `src/styles/mockups.css`.

The Night Guide tokens and guidance below apply to the comparison page, documentation, and historical Night Guide design. Warm charcoal and cream text frame large serif headings with orange italic emphasis.

The source of truth is src/styles/masthead.css for shared colors and navigation, src/styles/night-guide.css for landing and comparison layouts, and src/styles/docs.css for Starlight. src/styles/landing.css supplies base styles and also contains older component styles. Extract the effective production styles when extending the site.

## Colors

Paper is the page background. Panel is the slightly lighter background of full-width feature and installation bands. Type is the primary cream text, secondary supports descriptions, and rule defines thin dividers.

Signal marks primary actions, italic heading emphasis, commands, active navigation, hover states, and focus. Starlight maps these same colors into its theme variables and forces dark mode.

## Typography

Georgia supplies display and section headings. Orange italics emphasize selected words. Manrope supplies body text, navigation, and feature titles. Commands use the system monospace stack.

Hero descriptions scale from 16px to 20px with a line height of 1.55 and a maximum width of 45ch. Feature descriptions have a maximum width of 62ch.

Docs retain a reading hierarchy. Their h1 uses Georgia at clamp(2.8rem, 4.8vw, 4.8rem), and h2 uses Georgia with Starlight's size scale. Both use a 1.08 line height and -0.035em tracking. Preserve code formatting and navigation readability in guides.

## Layout

The shared page container is min(1240px, 100% - clamp(36px, 9vw, 140px)), centered horizontally.

The opener uses a 1.04fr / 1fr grid with a 4% gap. The landing pairs its headline with the crow. Compare pairs its headline with an index of comparison anchors.

Feature sections use a left heading and right stack of ruled rows, with 1fr / 1.4fr columns and a 6% gap. Section padding is clamp(45px, 5.3vw, 82px). Installation bands use a left heading and description beside a right command block.

At 740px the main grids become one column and the GitHub header button is hidden. At 450px the header wraps and the wordmark shrinks. Docs additionally reserves space for Starlight's mobile menu below 50rem and uses a two-row header at 450px.

## Elevation & Depth

Large tonal bands and one-pixel dividers establish grouping. The production marketing sections use flat surfaces. Starlight supplies its documentation shell and controls.

## Shapes

Primary and GitHub buttons have 3px corners. The GitHub button has a one-pixel outline. Feature content follows open horizontal rows. The crow silhouette, circular orange backdrop, branch, and spotted ladybug define the hero illustration.

## Components

The shared SiteNav contains Engine, Compare, Docs, and the outlined GitHub button with its logo. Links on inner pages return to the landing's Engine section. Current navigation uses orange. Comparison and documentation use this component.

The primary install action uses an orange fill and dark text, then cream on hover. Underlined text links use a five-pixel underline offset. Marketing focus rings are two-pixel orange outlines with a four-pixel offset.

Feature lists use a top rule with 16px top and 24px bottom padding. Workflow steps use orange italic serif numerals because they describe a sequence.

Compare shows all four tools in anchored sections using the feature-row pattern. Source links remain visible alongside the claims they support.

Installation commands use a one-pixel orange left rule and plain cream monospace text. Docs retain their own syntax highlighting.

RavenHunt is an inline SVG animation with a 7.2-second cycle. The left-facing crow tracks the ladybug, picks it up, tosses it upward, and catches it with an opening lower beak. CSS coordinates the body, head, jaw, held bug, and airborne bug. The loop pauses through its checkbox control and when hidden or offscreen. Reduced motion shows a still illustration.

Docs use Starlight's sidebar, table of contents, code controls, and populated content. The active sidebar entry uses an orange edge and text against the panel background. Search and theme selectors are empty overrides.

## Do's and Don'ts

- Reuse the shared navigation, effective palette, heading treatment, and section patterns across related pages.
- Keep claims connected to source evidence and make command examples readable.
- Preserve keyboard focus, the animation pause control, and reduced-motion behavior.
- Use the existing orange crow assets and match the current illustration when refining motion.
- Avoid introducing boxed marketing widgets, comparison tabs, or duplicate hero crows to establish consistency. The user rejected those treatments.
- Keep blog links and article placeholders absent until a blog is requested.

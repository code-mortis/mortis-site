---
name: Code Mortis
description: Review Desk opens with the charcoal Night Watch hero and a dark product tour. The homepage, comparison, and documentation share a light masthead and Inter typography.
colors:
  paper: "#191b18"
  type: "#f3efe3"
  secondary: "#bcbcaf"
  rule: "#535449"
  signal: "#ff7545"
  panel: "#23251f"
typography:
  display:
    fontFamily: "'Mortis Inter', Arial, sans-serif"
    fontSize: "clamp(46px, 6.3vw, 96px)"
    fontWeight: 520
    lineHeight: 1.02
  display-accent:
    fontFamily: "Georgia, serif"
    fontSize: "1.07em"
    fontStyle: italic
    fontWeight: 400
    lineHeight: 0.95
  headline:
    fontFamily: "'Mortis Inter', Arial, sans-serif"
    fontSize: "clamp(39px, 4.6vw, 77px)"
    fontWeight: 550
    lineHeight: 1.02
    letterSpacing: "-0.052em"
  title:
    fontFamily: "'Mortis Inter', Arial, sans-serif"
    fontSize: "clamp(25px, 2.6vw, 40px)"
    fontWeight: 550
    lineHeight: 1.02
    letterSpacing: "-0.052em"
  body:
    fontFamily: "'Mortis Inter', Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Mortis Inter', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
  kicker:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.09em"
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

Review Desk is the homepage reference. Night Watch fills the viewport below the masthead. Lines from the sample invoice review form the orange raven on charcoal. The headline pairs Inter with an italic Georgia accent. The hero lives in `src/components/review-desk/NightWatchHero.astro`. The repository tour follows with native App captures.

The comparison page shares the Review Desk masthead and footer. Its light hero uses circuit artwork, and its dark comparison table cites the sources for each workflow.

The Night Guide tokens and guidance below the Review Desk notes describe the historical Night Guide design. Warm charcoal and cream text frame large serif headings with orange italic emphasis.

The Night Guide reference styles are src/styles/masthead.css and src/styles/night-guide.css. Starlight uses src/styles/docs.css. The current comparison adds src/styles/comparison.css to the shared Review Desk styling. src/styles/landing.css supplies base styles and also contains older component styles. Extract the effective production styles when extending the site.

## Colors

Paper is the page background. Panel is the slightly lighter background of full-width feature and installation bands. Type is the primary cream text, secondary supports descriptions, and rule defines thin dividers.

Signal marks primary actions, italic heading emphasis, commands, active navigation, hover states, and focus. Documentation uses light paper (#f8f9f7), ink (#202128), rust links (#92391d), and charcoal code panels (#202124).

## Typography

Inter, self-hosted as "Mortis Inter" from `src/assets/fonts/`, supplies headings, body text, navigation and controls. Headings are tight: weights 520–570, line height about 1, and letter spacing near -0.05em. The Night Watch headline sets its final words in italic Georgia with a pale orange color. That is the only production use of Georgia. Kickers, captions and commands use the system monospace stack. Kickers are uppercase with 0.09em letter spacing.

Section descriptions scale from 16px to 19px with a line height of 1.58 and a maximum width of 45ch.

The Typography notes in the frontmatter describe Review Desk. The Georgia and Manrope rules in `night-guide.css`, `masthead.css` and `landing.css` belong to the historical Night Guide design. Docs use the same local Inter as Review Desk. Guide titles have a short introduction, followed by a single reading column, monospace code samples, and a linked outline.

## Layout

The shared page container is min(1240px, 100% - clamp(36px, 9vw, 140px)), centered horizontally.

The opener uses a 1.04fr / 1fr grid with a 4% gap. The landing pairs its headline with the crow. Compare pairs its headline with an index of comparison anchors.

Feature sections use a left heading and right stack of ruled rows, with 1fr / 1.4fr columns and a 6% gap. Section padding is clamp(45px, 5.3vw, 82px). Installation bands use a left heading and description beside a right command block.

At 740px the main grids become one column and the GitHub header button is hidden. At 450px the header wraps and the wordmark shrinks. Docs reserve space for Starlight's mobile menu and search on a single header row.

## Elevation & Depth

Large tonal bands and one-pixel dividers establish grouping. The production marketing sections use flat surfaces. Starlight supplies its documentation shell and controls.

## Shapes

Primary and GitHub buttons have 3px corners. The GitHub button has a one-pixel outline. Feature content follows open horizontal rows. The crow silhouette, circular orange backdrop, branch, and spotted ladybug define the hero illustration.

## Components

Public pages share DeskMasthead with links to Product, Installation, MCP, and Compare. Its trailing control opens Docs on marketing pages and search in the guides.

The primary install action uses an orange fill and dark text, then cream on hover. Underlined text links use a five-pixel underline offset. Marketing focus rings are two-pixel orange outlines with a four-pixel offset.

Feature lists use a top rule with 16px top and 24px bottom padding. Workflow steps use orange italic serif numerals because they describe a sequence.

Compare shows all four tools in anchored sections using the feature-row pattern. Source links remain visible alongside the claims they support.

Installation commands use a one-pixel orange left rule and plain cream monospace text. Docs retain their own syntax highlighting.

RavenHunt is an inline SVG animation with a 7.2-second cycle. The left-facing crow tracks the ladybug, picks it up, tosses it upward, and catches it with an opening lower beak. CSS coordinates the body, head, jaw, held bug, and airborne bug. The loop pauses through its checkbox control and when hidden or offscreen. Reduced motion shows a still illustration.

Docs retain Starlight’s sidebar, on-page outline, copy controls, and Pagefind search. Guide links are grouped by product and the active link uses a pale rust fill.

## Do's and Don'ts

- Reuse the shared navigation, effective palette, heading treatment, and section patterns across related pages.
- Keep claims connected to source evidence and make command examples readable.
- Preserve keyboard focus, the animation pause control, and reduced-motion behavior.
- Use the existing orange crow assets and match the current illustration when refining motion.
- Avoid introducing boxed marketing widgets, comparison tabs, or duplicate hero crows to establish consistency. The user rejected those treatments.
- Keep blog links and article placeholders absent until a blog is requested.

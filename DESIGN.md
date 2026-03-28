# Design System Document: The Curated Workspace

## 1. Overview & Creative North Star: "The Architectural Curator"
This design system rejects the "cookie-cutter" SaaS aesthetic in favor of a high-end, editorial experience. Our North Star is **The Architectural Curator**. Much like a premium physical coworking space, the digital environment must feel structured yet breathable, authoritative yet inviting. 

We move beyond the flat grid by employing **Intentional Asymmetry** and **Tonal Depth**. We prioritize the "thrive" factor by using expansive whitespace (`spacing-20` and `spacing-24`) to reduce cognitive load, allowing high-contrast typography to guide the user’s journey. Elements should feel like architectural layers—stacked, overlapping, and purposefully placed—rather than items dropped into a template.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a sophisticated contrast between deep maritime tones and warm, light-reflecting surfaces.

### Surface Hierarchy & Nesting (The "No-Line" Rule)
**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts.
*   **Base Layer:** Use `surface` (#f8f9fa) for the primary page background.
*   **Content Sections:** Use `surface-container-low` (#f3f4f5) to subtly group related content.
*   **Elevated Cards:** Place `surface-container-lowest` (#ffffff) cards on top of `surface-container-low` backgrounds to create a soft, natural lift.
*   **Deep Focus Zones:** Use `on-secondary-container` (#55637d) for dark-themed sidebar or footer elements to provide a grounding anchor to the layout.

### The "Glass & Gradient" Rule
To avoid a "flat" appearance, use Glassmorphism for floating navigation and overlays.
*   **Floating Nav:** Use `surface` at 80% opacity with a `backdrop-filter: blur(20px)`.
*   **Signature Gradients:** For Hero CTAs and primary focal points, use a subtle linear gradient transitioning from `primary` (#000000) to `primary-container` (#410006) at a 135-degree angle. This adds "soul" and depth that a flat hex code cannot achieve.

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance character with legibility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern warmth. `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to create an "Editorial Header" feel.
*   **Body & Labels (Inter):** The workhorse for productivity. `body-md` (0.875rem) provides maximum clarity for workspace details, pricing, and availability.
*   **The Hierarchy Shift:** Use `title-lg` (1.375rem) in `primary` colors against `surface-container-highest` backgrounds to call out key value propositions without needing bold icons.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to simulate environment.

*   **The Layering Principle:** Depth is achieved by stacking the `surface-container` tiers. A `surface-container-highest` (#e1e3e4) element should act as a subtle "inset" or "well" for interactive tools within a lighter page.
*   **Ambient Shadows:** For "floating" elements like modals, use an extra-diffused shadow: `box-shadow: 0 20px 50px rgba(25, 28, 29, 0.06)`. The shadow color is a tinted version of `on-surface` to mimic natural light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` (#c5c6cd) at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

### Buttons: The Interactive Pulse
*   **Primary:** Utilize the Vibrant Coral (`on-primary-container` - #e05456) for high-conversion actions. Shape: `md` (0.375rem) for a professional, sharp look.
*   **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
*   **Tertiary:** Text-only using `tertiary-container` (#001a41) with an underline that appears only on hover.

### Cards & Lists: Organic Separation
*   **The Divider Ban:** Explicitly forbid 1px horizontal lines in lists. Use `spacing-4` (1.4rem) of vertical whitespace or a alternating background shift (`surface` to `surface-container-low`) to separate items.
*   **Workspace Cards:** Use an asymmetrical layout—image on the left overlapping the card boundary slightly onto the `surface` background to break the container's rigidity.

### Input Fields: Clean Focus
*   **Default State:** `surface-container-highest` background, no border.
*   **Focus State:** A 2px "Ghost Border" using `tertiary-fixed` (#d8e2ff) and a subtle inner glow.

### Signature Component: The "Thrive" Status Chip
*   A specialized chip for workspace availability. Uses `on-tertiary-container` (#2480ff) with a soft `glassmorphic` background to signify "Productivity Level" or "Quiet Zones."

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins (e.g., 8% left margin, 12% right margin) for long-form editorial content.
*   **Do** use `spacing-16` (5.5rem) between major sections to let the design "breathe."
*   **Do** apply `surface-tint` (#ae2f34) at very low opacities (2-3%) over images to unify them with the brand palette.

### Don’t:
*   **Don’t** use pure black (#000000) for body text; use `on-surface-variant` (#44474d) for a softer, more premium reading experience.
*   **Don’t** use standard "drop shadows" on cards. If it doesn't feel like it's naturally lifting via color shift, rethink the hierarchy.
*   **Don’t** center-align everything. Left-aligned typography with wide gutters creates a more architectural, intentional feel.
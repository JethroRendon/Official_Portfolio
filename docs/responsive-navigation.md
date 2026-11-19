# Responsive navigation

On screens up to 760 CSS pixels wide, a fixed compact header replaces the previously expanded explorer. Its menu button opens a full-height slide-out explorer with a dimmed backdrop, a close button, and an internally scrolling file tree. Desktop keeps the persistent sidebar.

The drawer closes after navigation, on Escape, or by selecting the backdrop or close button. It locks background scrolling, makes the page and mobile header inert, traps Tab/Shift+Tab inside the explorer, and returns focus to the menu button after dismissal. Selecting a page instead focuses the main content. Changing to desktop clears the mobile drawer state. The drawer stacks above the animated pet controls.

Phone editor bars now sit beneath the compact header. About details, experience cards, and project cards use updated scroll offsets. Hero controls fit narrow widths, long file labels truncate, forms use 16px input text to avoid unwanted mobile browser zoom, and layout respects safe-area insets.

Sidequest automatic photo movement increased from 26 to 45 pixels per second, with the existing hover pause, drag behavior, hearts, and reduced-motion handling preserved.

Browser checks at 340 CSS pixels wide: Home, About, Toolkit, Projects, Experience, Contact, and Sidequest had no page-level horizontal overflow. Verified menu opening, page selection and automatic close, Escape, outside dismissal, background scroll restoration, focus return, Tab and Shift+Tab wrapping. Also checked the 681px breakpoint and restored desktop layout. These narrow widths were exercised through browser zoom; no physical phone was used.

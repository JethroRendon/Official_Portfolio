# Sidequest snapshots

`SidequestSnapshots` is the sole content in Behind the code → sidequest.md; the previous interests, community, and contribution text has been removed. It uses the eleven supplied photos, converted to WebP with orientation corrected and metadata omitted. Uploaded originals remain unchanged.

All cards share portrait dimensions. Captions are the original filenames without extensions. Captions use the portfolio’s JetBrains monospace font, and the page title uses its Barlow heading font. The longest caption uses a smaller size to stay inside its frame. `SK DUTIES` uses a centered portrait crop of the landscape original.

The row loops automatically at 45 pixels per second. Hovering over the gallery pauses it; leaving resumes it. Pointer capture supports mouse and touch dragging in either direction without a jump at the loop boundary. A movement threshold distinguishes dragging from clicking, and vertical touch scrolling remains available. Clicking or keyboard-activating a card shows a temporary heart burst. No reactions are sent or stored externally.

The Pause/Play control and left/right arrow keys provide alternatives to dragging. Keyboard focus pauses automatic movement. Reduced-motion preferences start the gallery paused and simplify heart effects. Duplicate sets used for the visual loop are hidden from assistive technology and removed from the tab order.

Only the title, original filename captions, and an icon-only motion control are shown. Decorative notes, counts, subtitles, instruction text, and the page footer are omitted.

Browser verification: all eleven images loaded, every card measured 204×303 CSS pixels on desktop, and the page had no horizontal overflow. Verified drag movement, no heart after a drag, hover pause, resume after pointer exit, click hearts, Pause/Play state, keyboard navigation, light/dark themes, and caption fit. Mobile CSS uses equal 176×268 portrait cards; touch-specific behavior was not tested on a physical device.

## Gallery polish

Subtle tape accents, paper texture, ambient accent colors, layered shadows, hover image zoom, and a small heart hint add depth while retaining the portfolio fonts and filename labels. Icon-only previous/next and photo dots offer direct browsing. Navigation eases to the selected card, loops in either direction, and honors reduced motion. Automatic movement eases back in after interaction; mouse hover still stops movement immediately. Touch dragging supports decaying momentum. Heart timers clean up individually on completion and unmount.

The header previous, pause, and next buttons were removed at the user’s request. Automatic movement, hover pause, dragging, keyboard navigation, photo dots, and click hearts remain. Reduced-motion preferences still disable automatic movement.

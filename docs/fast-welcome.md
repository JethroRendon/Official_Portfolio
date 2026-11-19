# Faster multilingual welcome

The first-visit welcome now auto-enters after 1,800ms with a 180ms exit, reducing its intentional delay from approximately 5.05 seconds to 1.98 seconds. This shortens the welcome animation; it does not change network download time. The existing Enter button, Enter/Escape shortcuts, same-tab session skip, and reduced-motion bypass remain available.

The iOS-inspired greeting sequence includes English, Spanish, French, German, Italian, Chinese, Japanese, Korean, and Filipino. Native-script greetings carry appropriate language tags, use system font fallbacks, and fit narrow screens. The centered greeting is unbulleted, with a quick subtle transition that finishes before the next greeting.

Greeting timers scale with the configured duration and cancel when entry starts, so manually skipping does not leave unnecessary updates running. The portfolio becomes interactive and receives focus once the short exit ends.

Validation: TypeScript, Next.js production build, hosted production build, browser first-visit auto-entry, interactive main content after entry, repeat navigation, and no page-level horizontal overflow.

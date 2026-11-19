# Home introduction, footer, profile, and theme

The home introduction retains the supplied heading and biography in a responsive panel with the portfolio’s Barlow and JetBrains typography, a subtle accent, and a story button that opens About.

The home footer groups the contact invitation, a profile signature, and a back-to-top action. Interior pages use a compact matching footer; Sidequest remains gallery-only. Footer spacing leaves room for the floating pet controls. Contact opens contact.json; back-to-top respects reduced-motion settings.

`public/jethro-profile.webp` is a 384px optimized copy of the uploaded Striped Shirt LEGO Minifigure Portrait.png, with its transparency preserved. Sidebar and footer use this image with smooth rendering. ICO, 64px PNG, and Apple touch icons use a face-focused crop of the same uploaded portrait; metadata URLs include a version to refresh cached tab icons. The metadata base now uses the current supremo-rnj Site origin.

The two theme buttons are replaced with one circular control. It shows a sun in dark mode and a moon in light mode, with its accessible name describing the next action. The existing local theme preference is retained and restored on reload.

Validation: TypeScript and production builds; desktop layout and profile loading; actual browser tab icon; both theme directions and reload persistence; About/contact navigation; 340px phone layout without page-level horizontal overflow; mobile theme toggle and drawer behavior.

The home introduction card was subsequently removed at the user’s request. The hero now leads directly to Selected Work, with the excess gap reduced. Footer, profile, icons, and single theme toggle remain.

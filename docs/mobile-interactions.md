# Phone interaction and layout improvements

## Behavior

- The menu and dialogs share a reference-counted scroll lock so closing search or changing sections cannot leave the page frozen. Search receives focus after the menu closes; Enter opens its first match. Dialog close restores focus to its trigger or the phone menu.
- Project screenshots use directional pointer gestures. Horizontal dragging changes slides; vertical movement remains available for scrolling. Pointer cancellation never opens a preview accidentally.
- Sidequest dragging distinguishes vertical scrolling from horizontal movement. Touch taps show a heart and briefly pause movement; touch drags retain momentum. Existing hover pause, filename captions, and equal portrait sizes are preserved.
- Each toolkit row can be tapped or keyboard activated to pause/resume independently. The global pause control remains available. Touch hover does not leave a row permanently paused.
- Headline editing retains sliders and palettes as direct alternatives to small drag handles. Capture loss and cancellation clear unfinished gestures. Normal headline scrolling and browser pinch zoom remain available outside active editing gestures.
- On phones the bone button sits in the top bar, outside the scrolling content. The dog reacts to taps on unused page space and retains pet-to-rest, wake, feeding, and three-heart interactions.
- Contact fields stack on phones, use readable text and suitable keyboards, and handle a slow connection with a cancellable 15-second request timeout. Contact storage configuration is unchanged.

## Layout

Phone styles increase important tap targets and text sizes, wrap gallery pagination, accommodate safe areas and dynamic viewport height, keep modal close controls reachable, and preserve scrolling inside square experience cards. The home resume link becomes an inline control on phones rather than covering the headline.

## Verification

Browser QA used narrow CSS viewports around 338 px and 676 px plus a 1353 px desktop viewport. Navigation/search handoff, themes, project slides and enlarged dialogs, direct gallery dragging, About expansion/copy, experience scrolling/timeline, toolkit pause states, photo selection/hearts, headline sliders/palettes/reset, dog feeding, and required contact fields were exercised. No horizontal document overflow was observed in the checked narrow sections. Contact form checks did not create test messages in the production inbox.

These checks used a desktop browser at narrow widths; physical iOS/Android touch, safe-area hardware, and software-keyboard behavior still require device confirmation.

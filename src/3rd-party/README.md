This folder contains 3rd-party integrations:

- Google Analytics
- Bugsnag
- Elevio
- etc...

When a third-party library is integrated, consider:

- It can be toggled on/off using build system or global variable overrides.
- It can be turned off completely under on-prems.
- It can be removed without business functionality impact (for example `Logger` uses Bugsnag
  but if Bugsnag is not available, Logger still works fine).

# Frontend Code Style

## Standard Sources

This project's frontend mainly references:

- Google JavaScript Style Guide: https://google.github.io/styleguide/jsguide.html
- MDN Web Docs (HTML/CSS/JavaScript and accessibility practices): https://developer.mozilla.org/

## Conventions

1. JavaScript uses 'use strict'; prefer const for variables, and use let when reassignment is needed.
2. JavaScript variables and functions use camelCase; CSS classes use semantically clear kebab-case.
3. Use 2-space indentation; use semicolons at the end of statements.
4. DOM queries are centralized at the top of the file; functionality is split into short functions.
5. Network requests are uniformly made through apiRequest(); errors are uniformly converted into user-understandable information.
6. Do not implement core mathematical evaluation in the frontend; do not use eval.
7. When writing user input back to the DOM, use textContent to avoid injecting historical content as HTML.
8. HTML uses semantic tags, label, aria-live, focusable button, and accommodates keyboard operation.
9. CSS maintains theme variables through custom properties; media queries handle mobile.
10. Comments explain design intent rather than repeating the meaning of the code line by line.

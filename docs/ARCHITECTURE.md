# Architecture

The application is a dependency-free browser SPA built with native ES modules and checked with TypeScript through JSDoc. This is intentionally smaller than the legacy Vite/shadcn stack.

Layers:

- `domain`: deterministic relationship and decision rules.
- `application`: dataset identity and use-case orchestration.
- `infrastructure`: Instagram export parsing, import validation, and browser storage adapters.
- `ui`: pure HTML rendering helpers.
- `main.js`: thin browser event wiring.

The Cupertino design system lives in `src/styles/cupertino.css` and uses semantic tokens rather than hard-coded component colors. It supports system, light, and dark appearance.

# Instagram Mutual Manager

A local-only web utility for comparing Instagram follower/following exports and classifying asymmetric relationships.

## What it does

1. Reads the HTML files exported by Instagram for followers and following.
2. Extracts and canonicalizes Instagram profile usernames locally.
3. Computes who you follow that does not follow you back and who follows you that you do not follow back.
4. Lets you mark each result as **Keep**, **Undecided**, or **Remove**.
5. Stores only those decisions and appearance preferences in browser `localStorage`, scoped to a deterministic dataset identity.

Raw imported HTML is never persisted or sent to a server.

## Cupertino UI

The interface is intentionally based on Cupertino interaction and visual semantics:

- semantic system backgrounds and labels;
- system blue/green/red action colors;
- grouped elevated surfaces;
- segmented controls for mutually exclusive result views;
- compact native-like rows;
- system, light, and dark appearance;
- system font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI` fallback);
- reduced-motion support.

It does not reuse the legacy Black Glass/shadcn visual system.

## Run

Requirements:

- Node.js 22+

Build and serve:

```bash
npm run build
npm run dev
```

Then open `http://127.0.0.1:4173`.

`npm run dev` serves `dist`, so run `npm run build` after source changes.

## Validation

The repository has no runtime or test dependencies. The test suite uses Node's built-in test runner. Static JSDoc type checking additionally requires a `tsc` executable (TypeScript 5.x) on `PATH`.

```bash
npm test
npm run coverage
npm run build
npm run smoke
```

Full producer validation in the development environment:

```bash
npm run validate
```

The coverage command gates project-wide production JavaScript line coverage at strictly greater than 80%.

## Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/PRODUCT_CONTRACT.md`](docs/PRODUCT_CONTRACT.md).

## Privacy boundary

The application deliberately has no backend, telemetry, authentication, Instagram API integration, or follow/unfollow automation. Imported HTML is treated as untrusted data and is parsed as text; it is never injected into the application DOM.

# Product contract

## Objective

Provide a private, local-only web utility that compares Instagram follower and following exports and lets the user classify asymmetric relationships.

## Users

People who can export their own Instagram follower/following HTML data and want to inspect the relationship without authenticating the application with Instagram.

## Required behavior

- Import one followers HTML file and one following HTML file.
- Process both files entirely in the browser.
- Parse canonical Instagram profile usernames and URLs.
- Reject unsupported or suspicious imports instead of guessing.
- Compute people the user follows who do not follow back.
- Compute people who follow the user but are not followed back.
- Show mutual count and imported totals.
- Classify profiles as undecided, keep, or remove.
- Persist decisions locally and scope them to the imported dataset.
- Search and filter results without network access.
- Offer system, light, and dark appearance.
- Use Cupertino-inspired semantic tokens and interaction patterns throughout the UI.

## Security and privacy invariants

- No backend, telemetry, account login, Instagram API, or external network request.
- Raw imported HTML is never persisted.
- Imported links are treated as untrusted data.
- Only `instagram.com` and `www.instagram.com` profile links are accepted.
- Profile links are reconstructed from validated usernames before rendering.
- Imported HTML is never injected into the application DOM.

## Non-goals

- Follow/unfollow automation.
- Scraping Instagram.
- Authentication.
- Cloud sync.
- Multi-account server storage.
- Plugin architecture.

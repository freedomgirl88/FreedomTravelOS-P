# AI Developer Guide

This file is written for any future ChatGPT/developer continuing Freedom Travel OS.

## Critical Instructions
1. Read this file first.
2. Read PROJECT.md, DESIGN_SYSTEM.md, ROADMAP.md, CHANGELOG.md, TEST_CASES.md and KNOWN_BUGS.md before editing.
3. Continue from the existing codebase.
4. Do not restart the project.
5. Do not create a new design direction.
6. Keep the existing premium light blue / white travel-app design language.
7. Dark mode is now explicitly requested and supported; keep it navy and consistent with the reference direction.
8. Build more and explain less. Prefer larger consolidated releases over tiny patch-by-patch ZIPs to save the user review time.
9. Deliver complete project ZIP releases, not tiny patch packs.
10. Update documentation every release.

## Product Identity
Freedom Travel OS is a premium travel operating system, starting with Korea 2026 as Trip #1. It is not just a Korea-only app. It should eventually support multiple trips.

## Current Version
1.10.0 — Beta 1 Quality Pass

## Next Version
Beta 1 real-device QA, trip-data validation and critical bug fixes only

## Current Milestone
Beta 1 achieved; real-device stabilization continues with larger consolidated releases preferred

## Beta 1 Goal
Make the app feel like a real App Store-quality travel app:
- premium UI
- less scrolling
- strong visual hierarchy
- reliable local saving
- useful travel workflows
- mobile-first layout

## Existing Modules
- Dashboard
- Flight
- Hotel
- Packing
- Budget
- Explore
- Booking History
- Notifications
- Memories
- Settings
- More

## Existing Key Features
- Local storage
- Editable trip profile
- Editable flight/hotel data
- Packing checklist
- Budget calculation
- Add/delete expenses
- Budget category grouping
- Explore visited/favourite tracking
- Booking History with verified flight/hotel records
- PWA foundation
- Bottom navigation
- Light / Dark / System theme engine
- Toast feedback system
- Premium motion polish

## Verified Travel Data
- Flight research price: T'way Air + Scoot, SGD 463.60, Trip.com, verified from planner.
- Hotel current verified price: Shilla Stay Mapo, SGD 272 total / SGD 136 per night, Trip.com screenshot.
- Previous Shilla Stay Mapo hotel price is unknown/not recorded.
- Do not invent previous hotel prices.
- Example numbers must never be treated as verified records.

## UI Direction
Keep:
- light theme
- blue gradient hero cards
- rounded white cards
- soft shadows
- mobile-first spacing
- bottom navigation
- floating actions where useful
- bottom sheets/modal sheets instead of long visible forms

Avoid:
- replacing the approved navy dark theme with a different dark style
- black/gold redesign
- unrelated app style
- restarting from scratch
- replacing the navigation with a totally new system
- overexplaining in chat

## Release Process
Every major release must:
1. Update package.json version.
2. Update docs/VERSION.md.
3. Update docs/CHANGELOG.md.
4. Update docs/ROADMAP.md if priorities changed.
5. Update docs/KNOWN_BUGS.md.
6. Update docs/RELEASE_NOTES.md.
7. Provide one complete ZIP.

## Naming
Use semantic-style versions:
- 0.9.4 current handover
- 0.9.5 beta workflow polish
- 0.9.6 beta premium UI polish
- 0.9.7 next beta polish
- 1.0.0 stable trip-ready release

Avoid endless names like Beta1_v3_Final_Final2.


## Explore Architecture Rule
Never hardcode a user's itinerary into the Explore screen. Explore days and places must remain editable local data. Personal starter content may only be offered as an optional template, never forced as a default.


## Locked Brand Requirement
Brand usage is locked and must not be reinterpreted. The installed Home Screen/PWA icon uses the premium chrome QR artwork with blue orbit, airplane, dotted world element and dark navy background. The in-app splash uses the separate simpler flat Orbit QR logo shown in the approved splash storyboard. Never swap these two assets.

# Changelog

## 0.5.0 — Premium Experience
- Added smart update detection and a one-tap Update action.
- Update prompts wait until the user is no longer typing.
- Added a What's New modal and permanent release notes.
- Added functional bug-report and feature-suggestion sharing.
- Updated the PWA cache and version metadata.

## 0.4.0
- Added fully functional per-trip reminders.
- Fixed Memories default date so it follows the active trip.
- Updated public foundation version and PWA cache.

# Changelog

## 0.2.1
- Added a unique FTOS P manifest filename and service-worker filename.
- Added a stable FTOS P manifest ID and dedicated installed start URL.
- Automatically removes only older service workers registered to the FTOS P scope before registering the current one.
- Korea Edition service workers and caches are not touched.

# Changelog

## v0.2.0 — P Edition Identity & Multi-Trip Foundation
- Renamed the general-use app to Freedom Travel OS P / FTOS P.
- Added an independent PWA identity, start URL, scope, service worker and cache namespace.
- Added multiple trips with isolated module data and trip switching in Settings.
- Updated backups to contain only FTOS P data.
- Removed remaining Korea-specific empty-state wording and examples.
- Preserved the working splash screen and functional Explore editor.

## 0.1.2 — Explore Functional Fix
- Fixed Create Day so it opens the real day editor and saves a usable itinerary day.
- Rebuilt the Explore empty state alignment for narrow mobile screens.
- Preserved the Freedom Travel OS splash screen and P Edition branding.
- Updated the service-worker cache version.

## v0.1.1 — Onboarding Contrast Fix
- Repaired low-contrast onboarding title, labels, placeholders, currency values and date fields.
- Added explicit light-form colours so saved theme preferences cannot make text disappear on the white onboarding card.
- Improved date-picker and location-icon visibility.
- Updated P Edition package and service-worker cache versions.

## v1.19.0 — Home Launch Behaviour

- Fresh launches now start on Home Dashboard.
- Refreshes continue on the current screen.
- No changes to the splash screen, Korea data, styling, or other features.

## v1.18.3 — Korea Edition Splash Polish
- Reduced splash logo from 88% to 76% of the stage to restore breathing room.
- Removed SVG Gaussian blur and CSS drop-shadow from the logo artwork.
- Kept glow on the background/orbit system rather than the logo edges.
- Reduced floating motion to avoid scaling softness.
- Preserved all v1.18.0 features and local-storage compatibility.


## v1.10.0 — Beta 1 Quality Pass
- Promoted the app to the Beta 1 quality milestone after Airport Journey 3.0 validation.
- Replaced stale Dashboard airport times with live values from the saved return-flight plan.
- Added consistent screen transitions and automatic scroll reset when changing modules.
- Added keyboard-accessible interactive cards, visible focus states and a skip-to-content link.
- Made the More navigation tab remain active throughout extended modules such as Airport Journey, Budget, Explore and Alerts.
- Added online/offline status feedback while preserving offline-first saved data.
- Corrected notification icon paths for GitHub Pages/base-path deployments.
- Improved calendar exports with a current generated timestamp.
- Added reduced-motion support and refreshed Beta 1 version labels.
- Updated the PWA cache so installed devices receive the new release.

## v1.8.2 — Journey Anchor Clarity
- Clarified the two valid airport-planning behaviours.
- Recommended mode keeps airport arrival fixed, so AREX and Taxi calculate different hotel leave times.
- Emergency/manual mode pins hotel departure, so both transport modes correctly keep the same leave time while changing arrival and later milestones.
- Added visible planning-basis cards and clearer copy to prevent timing confusion.
- Updated the PWA cache to v12.

## v1.8.1 — Unified Airport Timeline Fix

- Fixed manual departure changes not updating every Safety Timeline entry.
- Added one shared airport journey calculation for AREX and Taxi/Grab.
- Transport mode, airport target, safety buffer and manual leave time now recalculate the same timeline.
- Added On schedule / Tight timing / High risk status.
- Bumped PWA cache to v11.

# Changelog

## v1.8 — Airport Journey 2.0
- Added editable emergency hotel departure time.
- Added manual and recommended timing modes.
- Added airport buffer presets and full timeline recalculation.
- Added safety warnings and one-tap recommended-plan restore.
- Updated PWA cache for the new release.

## v1.7.1 — Airport Timeline Hotfix
- Fixed AREX/train and taxi/Grab showing identical journey times.
- Added transport-specific route milestones and durations.
- Recalculates the recommended hotel leave time from the saved airport target.
- Keeps Alerts, live reminders and calendar export synchronized with the selected plan.
- Updated PWA cache to force the corrected build to load.

## v1.7 — Korea Ready+
- Added Airport Journey screen and navigation route.
- Added return-flight countdown and safety timeline.
- Added locally saved airport transport preference and editable timing.
- Corrected Booking verified Shilla Stay Mapo price.
- Updated release documentation and cache version.

## v1.6 — Korea Ready
- Added separate Market, Trust, YouTrip and Custom exchange-rate profiles.
- Prevented unconfigured provider rates from silently using market data.

## 1.11.0 — Premium Experience Pass
- Added a consolidated visual design-system refinement across cards, typography, forms, actions and navigation.
- Added supported-device haptic interaction feedback.
- Improved modal-sheet accessibility, keyboard handling and motion.
- Added reusable premium empty-state component and applied it to Packing, Memories and Booking.
- Updated PWA cache and release documentation.

## v1.12.0 — Live Travel Data + Modal Polish
- Added document-body portal rendering for modal sheets.
- Fixed bottom navigation overlap on Add Expense and other forms.
- Added visual viewport and safe-area aware sheet sizing.
- Preserved live Seoul weather and live market currency workflows with offline cached states.
- Updated version metadata and PWA cache.

## 1.14.0
- Added Trip Journey chronological milestone screen.
- Expanded Memories into a dated, favourite-enabled trip journal.
- Added explicit Save/Cancel workflow for Flight and Hotel editors.
- Added human-readable form labels and sticky action bar.

## v1.16.0
- Consolidated Korea Ready feature build: Companion, Budget Pro, smarter packing and quick access tools.

## v1.18.0 — Freedom Travel OS 1.0, Korea Edition
- Promoted the tested Release Candidate to the stable pre-trip release.
- Replaced raster splash monogram and complete logo assets with resolution-independent SVG artwork.
- Reduced glow softness around the splash mark for clearer edges on high-density displays.
- Preserved separate splash and installed-PWA brand identities.
- Retained the corrected Card, Cash and Transport Card expense persistence.
- Updated version branding and PWA cache.

# Test Cases — v1.3

## Build
- `npm run dev`
- `npm run build` completes successfully.

## Packing
- Add, edit and delete an item.
- Cancel one deletion and confirm the item remains.
- Refresh and confirm saved changes persist.

## Currency
- Select Market, Trust estimate, YouTrip estimate and Manual modes.
- Refresh a live rate while online.
- Reopen offline and confirm the saved rate remains visible.
- Add an expense and verify SGD conversion.

## Weather
- Open Weather online and refresh.
- Confirm current conditions, seven-day forecast and photography times appear.
- Reopen offline and confirm cached forecast remains visible.

## Assistant
- Confirm flight, packing, budget, Explore and weather actions open the correct modules.

## Memories
- Add a memory without a photo.
- Add one with a photo and confirm the compressed preview persists after refresh.
- Delete a memory.

## Backup
- Download a JSON backup.
- Use Share / Save to Cloud on a supported phone.
- Import a known-good backup and confirm data returns after reload.

## Regression
- Explore remains fully editable and has no forced places.
- Confirmed flight/hotel data remains correct.
- Installed PWA opens standalone and GitHub Pages does not show a 404.

## v1.4 Brand / PWA
- Fresh launch shows the QR logo, blue glow/orbit, Freedom Travel OS name, tagline and loading bar.
- `public/icons/icon-192.png`, `icon-512.png`, Apple touch icon and maskable icons display the approved QR icon.
- Installed Home Screen icon is the official QR icon after reinstalling the PWA.

## v1.4 Smart Trip Health
- Score changes when passport/insurance packing state changes.
- Score changes when Explore gains its first planned day.
- Explore contributes only 10%, so an empty itinerary does not make the whole trip appear unsafe.

## v1.4 Currency
- Switching Market to Trust or YouTrip triggers a refresh request.
- Provider note explains that Trust/YouTrip estimates use the live market reference.
- Manual mode does not fetch and allows a custom rate.

## v1.5 Brand and Navigation Tests
1. Clear `ftos-splash-seen` from session storage or open a new browser session.
2. Confirm the splash begins with the simple flat QR monogram, then reveals the blue Orbit QR mark.
3. Confirm the premium chrome QR app-icon artwork does not appear inside the in-app splash.
4. Confirm the brand name, “Your Journey. Your Freedom.” and loading bar appear in order.
5. Navigate to each main screen, refresh, and confirm the same screen remains active.
6. Use browser back/forward and confirm the app follows navigation history.
7. Install/reinstall the PWA and confirm the Home Screen icon remains the premium chrome QR icon.


## v1.10.0 Beta 1 Quality Pass
- Change the Airport Journey plan, return to Dashboard and confirm the airport safety card uses the same saved leave, arrival and flight times.
- Open Airport Journey, Assistant, Weather, Explore, Budget, Booking, Memories, Alerts and Settings; confirm More remains selected in bottom navigation.
- Navigate from a scrolled page to another module and confirm the new module starts at the top.
- Use Tab, Enter and Space to operate interactive cards and verify visible focus treatment.
- Enable reduced motion at operating-system level and confirm screen changes do not use noticeable animation.
- Toggle the browser offline and online and confirm a status toast appears without losing saved data.
- Build with `npm run build` and verify the production bundle completes.

## v1.11.0 Premium Experience QA
- [ ] Open and close every modal sheet using both Close and Escape.
- [ ] Confirm background page does not scroll while a sheet is open.
- [ ] Confirm focus returns to the button that opened a sheet.
- [ ] Test Packing, Memories and Booking with empty local data.
- [ ] Confirm reduced-motion setting disables premium animations.
- [ ] Confirm supported Android device gives subtle vibration on buttons.
- [ ] Confirm Airport Journey normal and emergency modes remain correct.

## v1.18.0 Final Release QA
- Start a fresh browser session and confirm both splash logo phases are crisp with smooth curves and no bitmap stair-stepping.
- Confirm the logo remains sharp in portrait mode on a high-density Android or iPhone display.
- Confirm the installed Home Screen icon remains the premium chrome artwork and is not replaced by the flat splash mark.
- Add Card, Cash and Transport Card expenses; refresh and confirm each method persists correctly.
- Confirm existing saved trip, budget, packing, Explore and Memories data remains intact after upgrading.
- Build with `npm run build` and confirm production output completes.

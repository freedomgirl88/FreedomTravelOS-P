# Freedom Travel OS — RC1 Sprint Plan

## Workflow Decision
From RC1 onward, development uses larger consolidated releases instead of small patch-by-patch ZIPs. The user should not need to download and compare tiny builds repeatedly.

## RC1 Goals
- Keep Beta 1/Beta 2 visual direction stable.
- Reduce development friction on Windows.
- Preserve Light / Dark / System themes.
- Improve consistency and readability before Version 1.0.
- Avoid unnecessary redesigns.

## Review Workflow
1. Download one complete ZIP.
2. Extract to a short path, for example `C:\FTOS_RC1`.
3. Run `RUN_DEV_WINDOWS.bat`, or open terminal and run:
   ```powershell
   npm install
   npm run dev
   ```
4. Test the app once as a full release.
5. Report grouped issues instead of one-by-one tiny screenshots where possible.

## Windows Terminal Note
Do not rely on VS Code AI commands like:

```powershell
cd FTOS_Beta1 && npm run dev
```

Some PowerShell environments reject `&&`. Use two separate lines instead:

```powershell
cd FTOS_RC1
npm run dev
```

Or just double-click `RUN_DEV_WINDOWS.bat`.

## Frozen For RC1
- No major redesign.
- No new module unless it directly supports trip readiness.
- No random color direction changes.

## Allowed For RC1
- Bug fixes.
- Theme consistency.
- Motion polish.
- Layout/safe-area fixes.
- Documentation updates.
- Travel readiness workflow improvements.

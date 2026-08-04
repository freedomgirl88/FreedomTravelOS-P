import { useCallback, useEffect, useRef, useState } from "react";
import { APP_VERSION } from "../data/releaseNotes";

const CHECK_INTERVAL = 5 * 60 * 1000;

function userIsEditing() {
  const active = document.activeElement;
  return Boolean(active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName));
}

export function useAppUpdate() {
  const [registration, setRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deferredWhileEditing, setDeferredWhileEditing] = useState(false);
  const [checking, setChecking] = useState(false);
  const refreshing = useRef(false);

  const revealUpdate = useCallback(() => {
    if (userIsEditing()) {
      setDeferredWhileEditing(true);
      return;
    }
    setDeferredWhileEditing(false);
    setUpdateAvailable(true);
  }, []);

  const checkForUpdate = useCallback(async () => {
    if (checking) return;
    setChecking(true);
    try {
      const response = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
      if (response.ok) {
        const remote = await response.json();
        if (remote?.version && remote.version !== APP_VERSION) revealUpdate();
      }
      await registration?.update?.();
      if (registration?.waiting) revealUpdate();
    } catch {
      // Offline is a normal travel state. Keep the current version quietly.
    } finally {
      setChecking(false);
    }
  }, [checking, registration, revealUpdate]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return undefined;
    let mounted = true;
    navigator.serviceWorker.register("/sw-p.js", { scope: "/" }).then((reg) => {
      if (!mounted) return;
      setRegistration(reg);
      if (reg.waiting) revealUpdate();
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) revealUpdate();
        });
      });
    }).catch((error) => console.error("FTOS P service worker registration failed:", error));

    const onControllerChange = () => {
      if (refreshing.current) return;
      refreshing.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => {
      mounted = false;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, [revealUpdate]);

  useEffect(() => {
    const timer = window.setInterval(checkForUpdate, CHECK_INTERVAL);
    const onVisible = () => document.visibilityState === "visible" && checkForUpdate();
    window.addEventListener("focus", checkForUpdate);
    document.addEventListener("visibilitychange", onVisible);
    const first = window.setTimeout(checkForUpdate, 2500);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(first);
      window.removeEventListener("focus", checkForUpdate);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [checkForUpdate]);

  useEffect(() => {
    if (!deferredWhileEditing) return undefined;
    const onFocusOut = () => window.setTimeout(() => {
      if (!userIsEditing()) {
        setDeferredWhileEditing(false);
        setUpdateAvailable(true);
      }
    }, 120);
    document.addEventListener("focusout", onFocusOut);
    return () => document.removeEventListener("focusout", onFocusOut);
  }, [deferredWhileEditing]);

  const installUpdate = useCallback(async () => {
    const reg = registration || await navigator.serviceWorker?.getRegistration?.("/");
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
      return;
    }
    // If the version file changed before a waiting worker was exposed, force a
    // clean reload while preserving all local trip data.
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith("ftos-p-")).map((name) => caches.delete(name)));
    window.location.reload();
  }, [registration]);

  return { updateAvailable, deferredWhileEditing, checking, checkForUpdate, installUpdate, dismissUpdate: () => setUpdateAvailable(false) };
}

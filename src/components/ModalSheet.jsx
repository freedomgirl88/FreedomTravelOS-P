import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

export default function ModalSheet({ title, open, onClose, children, closeLabel = "Close", footer = null }) {
  const titleId = useId();
  const sheetRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest callback without restarting the modal lifecycle on every
  // parent render (for example, after each character typed into a form).
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    const oldPosition = document.body.style.position;
    const oldWidth = document.body.style.width;
    const oldTop = document.body.style.top;
    const scrollY = window.scrollY;

    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    const updateViewport = () => {
      const viewport = window.visualViewport;
      const height = viewport?.height || window.innerHeight;
      const offsetTop = viewport?.offsetTop || 0;
      document.documentElement.style.setProperty("--ftos-visual-height", `${height}px`);
      document.documentElement.style.setProperty("--ftos-visual-offset-top", `${offsetTop}px`);
    };
    updateViewport();
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);

    // Focus a form control rather than the Close button. This runs once when
    // the sheet opens and never again while the user is typing.
    const timer = window.setTimeout(() => {
      const firstField = sheetRef.current?.querySelector("input:not([disabled]), textarea:not([disabled]), select:not([disabled])");
      const fallback = sheetRef.current?.querySelector("button:not([disabled]), [tabindex]:not([tabindex='-1'])");
      (firstField || fallback)?.focus?.({ preventScroll: true });
    }, 80);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current) return;
      const focusable = [...sheetRef.current.querySelectorAll("input, select, textarea, button, [tabindex]:not([tabindex='-1'])")]
        .filter((el) => !el.disabled && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      document.documentElement.style.removeProperty("--ftos-visual-height");
      document.documentElement.style.removeProperty("--ftos-visual-offset-top");
      document.body.classList.remove("modal-open");
      document.body.style.overflow = oldOverflow;
      document.body.style.position = oldPosition;
      document.body.style.width = oldWidth;
      document.body.style.top = oldTop;
      window.scrollTo(0, scrollY);
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  const modal = (
    <div className="sheet-backdrop premium-sheet-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCloseRef.current?.()}>
      <section ref={sheetRef} className="sheet premium-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <strong id={titleId}>{title}</strong>
          <button className="sheet-close" type="button" onClick={() => onCloseRef.current?.()} aria-label={`${closeLabel} ${title}`}>{closeLabel}</button>
        </div>
        <div className="sheet-content">{children}</div>
        {footer ? <div className="sheet-footer">{footer}</div> : null}
      </section>
    </div>
  );

  return createPortal(modal, document.body);
}

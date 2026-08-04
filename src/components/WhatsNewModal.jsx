import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import ModalSheet from "./ModalSheet";
import { APP_VERSION, CURRENT_RELEASE } from "../data/releaseNotes";

const SEEN_KEY = "ftos-p-seen-version";

export default function WhatsNewModal({ enabled }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const seen = localStorage.getItem(SEEN_KEY);
    if (seen !== APP_VERSION) {
      const timer = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(timer);
    }
  }, [enabled]);
  const close = () => {
    localStorage.setItem(SEEN_KEY, APP_VERSION);
    setOpen(false);
  };
  return <ModalSheet title="What's New" open={open} onClose={close} closeLabel="Later">
    <div className="whats-new">
      <span className="whats-new-mark"><Sparkles size={25}/></span>
      <span className="eyebrow">Version {CURRENT_RELEASE.version}</span>
      <h2>{CURRENT_RELEASE.title}</h2>
      <p>Freedom Travel OS P has been updated. Your existing trips and local data remain unchanged.</p>
      <div className="whats-new-list">{CURRENT_RELEASE.highlights.map(item=><div key={item}><Check size={17}/><span>{item}</span></div>)}</div>
      <button className="primary-action full-width-action" onClick={close}>Continue</button>
    </div>
  </ModalSheet>;
}

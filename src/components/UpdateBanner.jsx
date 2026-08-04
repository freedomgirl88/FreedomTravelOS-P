import { Download, X } from "lucide-react";

export default function UpdateBanner({ open, onUpdate, onLater }) {
  if (!open) return null;
  return <aside className="update-banner" role="status" aria-live="polite">
    <span className="update-banner-icon"><Download size={20}/></span>
    <div><strong>New version available</strong><p>Update when you are ready. Your saved trips will stay on this device.</p></div>
    <button className="update-now" onClick={onUpdate}>Update</button>
    <button className="update-later" aria-label="Update later" onClick={onLater}><X size={18}/></button>
  </aside>;
}

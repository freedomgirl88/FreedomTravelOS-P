import { Home, Plane, Building2, Package, MoreHorizontal } from "lucide-react";

const nav = [
  ["dashboard", "Journey", Home],
  ["flight", "Flight", Plane],
  ["hotel", "Hotel", Building2],
  ["packing", "Packing", Package],
  ["more", "More", MoreHorizontal],
];
const morePages = new Set(["more", "settings", "notifications", "memories", "weather", "assistant", "airport", "explore", "budget", "booking"]);

export default function BottomNav({ activePage, setActivePage }) {
  return <nav className="bottom-nav" aria-label="Main navigation">{nav.map(([id, label, Icon]) => {
    const active = id === "more" ? morePages.has(activePage) : activePage === id;
    return <button key={id} className={active ? "active" : ""} onClick={() => setActivePage(id)} aria-current={active ? "page" : undefined} aria-label={label}>
      <Icon size={21}/><span>{label}</span>
    </button>;
  })}</nav>;
}

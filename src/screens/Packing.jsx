import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ProgressRing from "../components/ProgressRing";
import ModalSheet from "../components/ModalSheet";
import EmptyState from "../components/EmptyState";
import { PackagePlus, ShoppingBag, Pencil, Trash2, Luggage } from "lucide-react";

export default function Packing({ store }) {
  const { packing, packed, packingProgress, togglePacking, addPackingItem, updatePackingItem, deletePackingItem } = store;
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("Others");
  const [editing, setEditing] = useState(null);
  const cats = useMemo(() => [...new Set(packing.map((i) => i.category))], [packing]);
  const essentials = ["passport","flight","hotel","insurance","concert","powerbank","adapter"];
  const missingEssentials = packing.filter(i=>essentials.includes(i.id) && !i.packed);

  function submit(e) {
    e.preventDefault();
    if (!label.trim()) return;
    addPackingItem({ label: label.trim(), category: category.trim() || "Others", meta: "" });
    window.ftosToast?.("Packing item added");
    setLabel("");
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!editing?.label.trim()) return;
    updatePackingItem(editing.id, { label: editing.label.trim(), category: editing.category.trim() || "Others", meta: editing.meta || "" });
    setEditing(null);
    window.ftosToast?.("Packing item updated");
  }

  function remove(item) {
    if (!window.confirm(`Remove “${item.label}” from your packing list?`)) return;
    deletePackingItem(item.id);
    window.ftosToast?.("Packing item removed", "warning");
  }

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Smart Packing</span><h1>Packing</h1></div><span className="status-chip">{packing.length - packed} missing</span></header>
    <Card className="overview-card"><ProgressRing value={packingProgress} label="Packed"/><div><span className="eyebrow">Trip Readiness</span><h2>{packingProgress}% packed</h2><p>{packed}/{packing.length} items packed.</p></div></Card>
    <Card className={`packing-alert ${missingEssentials.length ? "warning" : "good"}`}><Luggage/><div><strong>{missingEssentials.length ? `${missingEssentials.length} essential items still missing` : "Essential items ready"}</strong><p>{missingEssentials.length ? missingEssentials.map(i=>i.label).join(" · ") : "Passport, bookings and core travel items are checked."}</p></div></Card>
    <Card className="shopping-card"><ShoppingBag/><div><strong>Shopping Space</strong><p>Leave some luggage space for shopping and souvenirs.</p></div></Card>
    <SectionTitle title="Add Item"/>
    <Card className="compact-form-card"><form className="inline-form" onSubmit={submit}><input placeholder="Item name" value={label} onChange={(e) => setLabel(e.target.value)}/><input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}/><button><PackagePlus size={16}/> Add</button></form></Card>
    <SectionTitle title="Checklist" subtitle="Tap the circle to pack. Edit or remove any item."/>
    <div className="list">{packing.length === 0 && <Card className="empty-state-card"><EmptyState icon={Luggage} title="Your packing list is empty" description="Add your first item above, then tap each circle as you pack." /></Card>}{cats.map((cat) => {
      const items = packing.filter((i) => i.category === cat);
      const done = items.filter((i) => i.packed).length;
      return <Card key={cat}><div className="category-head"><strong>{cat}</strong><span>{done}/{items.length}</span></div><div className="item-list">{items.map((item) => <div key={item.id} className="packing-manage-row">
        <button className="packing-check-main" onClick={() => { togglePacking(item.id); window.ftosToast?.(item.packed ? "Marked unpacked" : "Packed item updated"); }}>
          <span className={item.packed ? "check on" : "check"}>{item.packed ? "✓" : ""}</span><div><strong>{item.label}</strong>{item.meta && <p>{item.meta}</p>}</div>
        </button>
        <div className="packing-row-actions"><button aria-label={`Edit ${item.label}`} onClick={() => setEditing({ ...item })}><Pencil size={16}/></button><button className="icon-danger" aria-label={`Delete ${item.label}`} onClick={() => remove(item)}><Trash2 size={16}/></button></div>
      </div>)}</div></Card>;
    })}</div>

    <ModalSheet title="Edit Packing Item" open={Boolean(editing)} onClose={() => setEditing(null)}>
      {editing && <form className="inline-form" onSubmit={saveEdit}>
        <input placeholder="Item name" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })}/>
        <input placeholder="Category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}/>
        <input placeholder="Optional note or weight" value={editing.meta || ""} onChange={(e) => setEditing({ ...editing, meta: e.target.value })}/>
        <button><Pencil size={16}/> Save Changes</button>
      </form>}
    </ModalSheet>
  </Page>;
}

import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { ImagePlus, PlusCircle, Trash2, Images, Heart, CalendarDays } from "lucide-react";

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const max = 1200; const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas"); canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", .72));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Memories({ store }) {
  const { memories, addMemory, toggleMemoryFavourite, deleteMemory } = store;
  const [title, setTitle] = useState(""); const [note, setNote] = useState(""); const [date, setDate] = useState("2026-08-23"); const [photo, setPhoto] = useState(""); const [busy, setBusy] = useState(false);
  const sorted = useMemo(()=>[...memories].sort((a,b)=>String(b.date).localeCompare(String(a.date))),[memories]);
  async function pickPhoto(e) { const file = e.target.files?.[0]; if (!file) return; setBusy(true); try { setPhoto(await compressImage(file)); window.ftosToast?.("Photo ready"); } catch { window.ftosToast?.("Could not prepare photo", "warning"); } finally { setBusy(false); e.target.value=""; } }
  function submit(e) { e.preventDefault(); if (!title.trim()) { window.ftosToast?.("Add a memory title", "warning"); return; } try { addMemory({ title: title.trim(), note: note.trim(), date, photo }); setTitle(""); setNote(""); setPhoto(""); window.ftosToast?.("Memory saved"); } catch { window.ftosToast?.("Storage is full. Try a smaller photo.", "warning"); } }
  return <Page><header className="app-header"><div><span className="eyebrow">Private On-device Journal</span><h1>Memories</h1></div><span className="status-chip">{memories.length} saved</span></header>
    <Card className="memories-hero"><div><span className="eyebrow">Trip Story</span><h2>Keep the moments that matter</h2><p>Photos, dates and captions stay privately on this device.</p></div><Images size={34}/></Card>
    <SectionTitle title="Add Memory" subtitle="Photos are compressed before being saved locally."/>
    <Card><form className="memory-form" onSubmit={submit}><label className="field"><span>Memory Title</span><input placeholder="Example: Sunset by the river" value={title} onChange={(e) => setTitle(e.target.value)}/></label><label className="field"><span>Date</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)}/></label><label className="field"><span>Caption</span><textarea rows="3" placeholder="What made this moment special?" value={note} onChange={(e) => setNote(e.target.value)}/></label><label className="photo-picker"><ImagePlus size={18}/>{busy ? "Preparing photo…" : photo ? "Change selected photo" : "Choose photo"}<input type="file" accept="image/*" onChange={pickPhoto}/></label>{photo && <img className="memory-preview" src={photo} alt="Selected memory preview"/>}<button className="primary-button" disabled={busy}><PlusCircle size={16}/> Save Memory</button></form></Card>
    <SectionTitle title="Memory Timeline" subtitle={sorted.length ? "Newest memories appear first." : "Your trip story will appear here."}/>
    <div className="memory-timeline">{sorted.length === 0 && <Card className="empty-state-card"><EmptyState icon={Images} title="Your trip story starts here" description="Save your first photo or note. Everything remains on this device." /></Card>}{sorted.map((m) => <Card className={`memory-card memory-card-v14 ${m.favourite ? "is-favourite" : ""}`} key={m.id}>{m.photo && <img src={m.photo} alt=""/>}<div className="memory-copy"><span className="memory-date"><CalendarDays size={14}/>{m.date}</span><strong>{m.title}</strong>{m.note && <p>{m.note}</p>}</div><div className="memory-actions"><button className={`icon-button ${m.favourite ? "active" : ""}`} aria-label={m.favourite ? "Remove favourite" : "Add favourite"} onClick={() => toggleMemoryFavourite(m.id)}><Heart size={17} fill={m.favourite ? "currentColor" : "none"}/></button><button className="icon-danger" aria-label="Delete memory" onClick={() => window.confirm("Delete this memory?") && deleteMemory(m.id)}><Trash2 size={16}/></button></div></Card>)}</div>
  </Page>;
}

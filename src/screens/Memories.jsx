import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { ImagePlus, PlusCircle, Trash2, Images, Heart, CalendarDays, MapPin, Star, Pencil, X } from "lucide-react";

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onerror = reject;
    reader.onload = () => { const img = new Image(); img.onerror = reject; img.onload = () => {
      const max=1200, scale=Math.min(1,max/Math.max(img.width,img.height)); const canvas=document.createElement("canvas");
      canvas.width=Math.round(img.width*scale); canvas.height=Math.round(img.height*scale); canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
      resolve(canvas.toDataURL("image/jpeg",.72));
    }; img.src=reader.result; }; reader.readAsDataURL(file);
  });
}

const today=()=>new Date().toISOString().slice(0,10);
export default function Memories({store}) {
  const {trip,memories,addMemory,updateMemory,toggleMemoryFavourite,deleteMemory,days,expenses}=store;
  const blank=()=>({title:"",note:"",date:trip.startDate||today(),location:"",rating:5,photo:""});
  const [form,setForm]=useState(blank); const [busy,setBusy]=useState(false); const [editing,setEditing]=useState(null); const [view,setView]=useState("all");
  const sorted=useMemo(()=>[...memories].filter(m=>view!=="favourites"||m.favourite).sort((a,b)=>String(b.date).localeCompare(String(a.date))),[memories,view]);
  const favourites=memories.filter(m=>m.favourite).length; const plannedPlaces=days.reduce((n,d)=>n+(d.places?.length||0),0);
  const tripDays=trip.startDate&&trip.endDate?Math.max(1,Math.round((new Date(trip.endDate)-new Date(trip.startDate))/86400000)+1):0;
  async function pickPhoto(e){const file=e.target.files?.[0];if(!file)return;setBusy(true);try{const photo=await compressImage(file);setForm(f=>({...f,photo}));}catch{window.ftosToast?.("Could not prepare photo","warning");}finally{setBusy(false);e.target.value="";}}
  function submit(e){e.preventDefault();if(!form.title.trim()){window.ftosToast?.("Add a journal title","warning");return;}const payload={...form,title:form.title.trim(),note:form.note.trim(),location:form.location.trim(),rating:Number(form.rating)||5};try{if(editing){updateMemory(editing,payload);window.ftosToast?.("Journal entry updated");}else{addMemory(payload);window.ftosToast?.("Journal entry saved");}setEditing(null);setForm(blank());}catch{window.ftosToast?.("Storage is full. Try a smaller photo.","warning");}}
  function edit(m){setEditing(m.id);setForm({title:m.title||"",note:m.note||"",date:m.date||today(),location:m.location||"",rating:m.rating||5,photo:m.photo||""});window.scrollTo({top:0,behavior:"smooth"});}
  function cancel(){setEditing(null);setForm(blank());}
  return <Page><header className="app-header"><div><span className="eyebrow">Private On-device Journal</span><h1>Memories</h1></div><span className="status-chip">{memories.length} saved</span></header>
    <Card className="memories-hero"><div><span className="eyebrow">Trip Story</span><h2>Remember more than the itinerary</h2><p>Journal entries, photos, ratings and favourite moments stay privately on this device.</p></div><Images size={34}/></Card>
    <div className="memory-summary-grid"><Card><strong>{tripDays||"—"}</strong><span>Trip days</span></Card><Card><strong>{memories.length}</strong><span>Entries</span></Card><Card><strong>{favourites}</strong><span>Highlights</span></Card><Card><strong>{plannedPlaces}</strong><span>Planned places</span></Card></div>
    <SectionTitle title={editing?"Edit Journal Entry":"Add Journal Entry"} subtitle="Capture a moment while it is still fresh."/>
    <Card><form className="memory-form memory-form-pro" onSubmit={submit}><label className="field"><span>Title</span><input placeholder="Example: Best sunset of the trip" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><div className="form-grid-2"><label className="field"><span>Date</span><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label className="field"><span>Rating</span><select value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{"★".repeat(n)} ({n}/5)</option>)}</select></label></div><label className="field"><span>Location</span><input placeholder="Optional — e.g. Hongdae" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></label><label className="field"><span>Journal</span><textarea rows="5" placeholder="What happened? What made today memorable?" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></label><label className="photo-picker"><ImagePlus size={18}/>{busy?"Preparing photo…":form.photo?"Change selected photo":"Choose photo"}<input type="file" accept="image/*" onChange={pickPhoto}/></label>{form.photo&&<div className="memory-preview-wrap"><img className="memory-preview" src={form.photo} alt="Selected memory preview"/><button type="button" className="memory-remove-photo" onClick={()=>setForm({...form,photo:""})}><X size={16}/> Remove photo</button></div>}<div className="memory-form-actions">{editing&&<button type="button" className="secondary-button" onClick={cancel}>Cancel</button>}<button className="primary-button" disabled={busy}><PlusCircle size={16}/>{editing?"Save Changes":"Save Journal Entry"}</button></div></form></Card>
    <SectionTitle title="Trip Journal" subtitle={sorted.length?"Newest entries appear first.":"Your trip story will appear here."}/><div className="memory-filter-row"><button className={view==="all"?"active":""} onClick={()=>setView("all")}>All</button><button className={view==="favourites"?"active":""} onClick={()=>setView("favourites")}>Highlights</button></div>
    <div className="memory-timeline">{sorted.length===0&&<Card className="empty-state-card"><EmptyState icon={Images} title={view==="favourites"?"No highlights yet":"Your trip story starts here"} description={view==="favourites"?"Tap the heart on a journal entry to keep it in your trip highlights.":"Save your first journal entry or photo. Everything remains on this device."}/></Card>}{sorted.map(m=><Card className={`memory-card memory-card-pro ${m.favourite?"is-favourite":""}`} key={m.id}>{m.photo&&<img src={m.photo} alt=""/>}<div className="memory-copy"><div className="memory-meta"><span><CalendarDays size={14}/>{m.date}</span>{m.location&&<span><MapPin size={14}/>{m.location}</span>}</div><strong>{m.title}</strong><div className="memory-rating" aria-label={`${m.rating||5} out of 5`}><Star size={14} fill="currentColor"/> {m.rating||5}/5</div>{m.note&&<p>{m.note}</p>}</div><div className="memory-actions"><button className="icon-button" aria-label="Edit memory" onClick={()=>edit(m)}><Pencil size={16}/></button><button className={`icon-button ${m.favourite?"active":""}`} aria-label={m.favourite?"Remove favourite":"Add favourite"} onClick={()=>toggleMemoryFavourite(m.id)}><Heart size={17} fill={m.favourite?"currentColor":"none"}/></button><button className="icon-danger" aria-label="Delete memory" onClick={()=>window.confirm("Delete this journal entry?")&&deleteMemory(m.id)}><Trash2 size={16}/></button></div></Card>)}</div>
    {memories.length>0&&<><SectionTitle title="Trip Recap" subtitle="A quick snapshot of the journey you are building."/><Card className="trip-recap-card"><div><span>Journal entries</span><strong>{memories.length}</strong></div><div><span>Highlights</span><strong>{favourites}</strong></div><div><span>Planned places</span><strong>{plannedPlaces}</strong></div><div><span>Expenses logged</span><strong>{expenses.length}</strong></div></Card></>}
  </Page>;
}

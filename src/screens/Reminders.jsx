import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ModalSheet from "../components/ModalSheet";
import EmptyState from "../components/EmptyState";
import { BellRing, Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";

const empty={title:"",date:"",time:"",type:"General",note:""};
export default function Reminders({store}){
  const {trip,reminders,addReminder,updateReminder,toggleReminder,deleteReminder}=store;
  const [open,setOpen]=useState(false); const [editing,setEditing]=useState(null); const [form,setForm]=useState(empty);
  const sorted=useMemo(()=>[...reminders].sort((a,b)=>`${a.date||"9999"} ${a.time||""}`.localeCompare(`${b.date||"9999"} ${b.time||""}`)),[reminders]);
  const launch=(item=null)=>{setEditing(item);setForm(item?{...item}:{...empty,date:trip.startDate||""});setOpen(true)};
  const save=e=>{e.preventDefault();if(!form.title.trim())return;const data={...form,title:form.title.trim(),note:form.note.trim()};editing?updateReminder(editing.id,data):addReminder(data);setOpen(false);window.ftosToast?.(editing?"Reminder updated":"Reminder created")};
  return <Page><header className="app-header"><div><span className="eyebrow">Trip Alerts</span><h1>Reminders</h1></div><button className="status-chip" onClick={()=>launch()}><Plus size={15}/> Add</button></header>
    <Card className="memories-hero"><div><span className="eyebrow">On-device planner</span><h2>Remember the important moments</h2><p>Create check-in, airport, booking and personal reminders for this trip.</p></div><BellRing size={34}/></Card>
    <SectionTitle title="Your Reminders" subtitle="Mark items complete as you go."/>
    <div className="list">{sorted.length===0&&<Card className="empty-state-card"><EmptyState icon={BellRing} title="No reminders yet" description="Create your first reminder for check-in, airport departure or anything else." actionLabel="Create Reminder" onAction={()=>launch()}/></Card>}
      {sorted.map(r=><Card className={`reminder-row${r.done?" reminder-done":""}`} key={r.id}>
        <button className="reminder-check" aria-label={r.done?"Mark incomplete":"Mark complete"} onClick={()=>toggleReminder(r.id)}>{r.done?<CheckCircle2 size={22}/>:<Circle size={22}/>}</button>
        <div className="reminder-copy"><span className="type-chip">{r.type}</span><strong>{r.title}</strong><p>{[r.date,r.time].filter(Boolean).join(" · ")||"No date set"}</p>{r.note&&<small>{r.note}</small>}</div>
        <div className="packing-row-actions"><button aria-label="Edit reminder" onClick={()=>launch(r)}><Pencil size={16}/></button><button className="icon-danger" aria-label="Delete reminder" onClick={()=>confirm("Delete this reminder?")&&deleteReminder(r.id)}><Trash2 size={16}/></button></div>
      </Card>)}</div>
    <ModalSheet title={editing?"Edit Reminder":"Create Reminder"} open={open} onClose={()=>setOpen(false)}><form className="inline-form reminder-form" onSubmit={save}>
      <label className="form-field"><span>Reminder title</span><input required placeholder="e.g. Online check-in" value={form.title} onChange={e=>setForm(v=>({...v,title:e.target.value}))}/></label>
      <label className="form-field"><span>Type</span><select value={form.type} onChange={e=>setForm(v=>({...v,type:e.target.value}))}><option>General</option><option>Flight</option><option>Hotel</option><option>Booking</option><option>Packing</option><option>Transport</option><option>Activity</option></select></label>
      <div className="reminder-date-grid">
        <label className="form-field date-field"><span>Date</span><div className="date-input-shell"><input type="date" value={form.date} onChange={e=>setForm(v=>({...v,date:e.target.value}))}/></div></label>
        <label className="form-field time-field"><span>Time</span><div className="date-input-shell"><input type="time" value={form.time} onChange={e=>setForm(v=>({...v,time:e.target.value}))}/></div></label>
      </div>
      <label className="form-field"><span>Notes</span><textarea rows="4" placeholder="Optional note" value={form.note} onChange={e=>setForm(v=>({...v,note:e.target.value}))}/></label>
      <button type="submit" className="primary-button full-width-action"><BellRing size={16}/> {editing?"Save Changes":"Create Reminder"}</button>
    </form></ModalSheet>
  </Page>
}

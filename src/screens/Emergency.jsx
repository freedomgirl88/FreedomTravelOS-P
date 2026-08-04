import { useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ModalSheet from "../components/ModalSheet";
import { HeartPulse, Plus, Phone, Pencil, Trash2, MapPin } from "lucide-react";
export default function Emergency({store}){
 const [open,setOpen]=useState(false),[editing,setEditing]=useState(null); const [form,setForm]=useState({name:"",phone:"",note:""});
 const begin=(item=null)=>{setEditing(item);setForm(item?{...item}:{name:"",phone:"",note:""});setOpen(true)};
 const save=()=>{if(!form.name.trim()||!form.phone.trim())return window.ftosToast?.("Add a name and phone number","error");editing?store.updateEmergencyContact(editing.id,form):store.addEmergencyContact(form);setOpen(false);window.ftosToast?.("Emergency contact saved")};
 return <Page><header className="app-header"><div><span className="eyebrow">Smart Travel</span><h1>Emergency</h1></div><button className="icon-button" onClick={()=>begin()}><Plus size={20}/></button></header>
 <Card className="emergency-hero"><HeartPulse size={30}/><div><h2>Important help, one tap away</h2><p>Add local emergency numbers, your embassy, hotel reception and trusted contacts.</p></div></Card>
 <SectionTitle title="Trip location"/><Card className="location-summary"><MapPin size={20}/><div><strong>{store.trip.destination||"Destination not added"}</strong><p>{store.trip.hotel?.name||"Hotel not added yet"}</p></div></Card>
 <SectionTitle title="Emergency contacts" action={store.emergencyContacts.length?"Add":null} onAction={()=>begin()}/>
 {!store.emergencyContacts.length?<EmptyState icon={Phone} title="No emergency contacts" description="Add the local police, ambulance, embassy, hotel or a trusted person." actionLabel="Add contact" onAction={()=>begin()}/>:<div className="list">{store.emergencyContacts.map(item=><Card className="emergency-contact-row" key={item.id}><a className="emergency-call" href={`tel:${item.phone}`}><Phone size={19}/><section><strong>{item.name}</strong><p>{item.phone}</p>{item.note&&<small>{item.note}</small>}</section></a><div className="packing-row-actions"><button onClick={()=>begin(item)}><Pencil size={17}/></button><button onClick={()=>{if(confirm("Delete this contact?"))store.deleteEmergencyContact(item.id)}}><Trash2 size={17}/></button></div></Card>)}</div>}
 <ModalSheet title={editing?"Edit contact":"Add emergency contact"} open={open} onClose={()=>setOpen(false)} footer={<button className="primary-button full-width-action" onClick={save}>Save contact</button>}><div className="sheet-form"><label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Singapore Embassy"/></label><label>Phone number<input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Include country code"/></label><label>Note<textarea value={form.note||""} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Opening hours or address"/></label></div></ModalSheet></Page>;
}

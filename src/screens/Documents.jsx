import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ModalSheet from "../components/ModalSheet";
import { FileText, Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";

const TYPES=["Passport","Visa","Insurance","Ticket","Booking","Other"];
export default function Documents({store}){
  const [open,setOpen]=useState(false); const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({type:"Passport",title:"",reference:"",expiry:"",notes:""});
  const sorted=useMemo(()=>[...store.documents].sort((a,b)=>(a.expiry||"9999").localeCompare(b.expiry||"9999")),[store.documents]);
  const begin=(doc=null)=>{setEditing(doc);setForm(doc?{...doc}:{type:"Passport",title:"",reference:"",expiry:"",notes:""});setOpen(true)};
  const save=()=>{if(!form.title.trim())return window.ftosToast?.("Add a document name","error"); editing?store.updateDocument(editing.id,form):store.addDocument(form);setOpen(false);window.ftosToast?.("Document saved")};
  return <Page><header className="app-header"><div><span className="eyebrow">Smart Travel</span><h1>Travel Documents</h1></div><button className="icon-button" onClick={()=>begin()}><Plus size={20}/></button></header>
  <Card className="documents-hero"><ShieldCheck size={28}/><div><h2>Keep key details together</h2><p>Store references and expiry dates locally on this device. Avoid saving full passport numbers.</p></div></Card>
  <SectionTitle title="Documents" action={store.documents.length?"Add":null} onAction={()=>begin()}/>
  {!sorted.length?<EmptyState icon={FileText} title="No documents saved" description="Add passport, visa, insurance or ticket references for this trip." actionLabel="Add document" onAction={()=>begin()}/>:<div className="list">{sorted.map(doc=><Card className="document-row" key={doc.id}><span className="document-icon"><FileText size={20}/></span><section><small>{doc.type}</small><strong>{doc.title}</strong>{doc.reference&&<p>{doc.reference}</p>}{doc.expiry&&<small>Expires {doc.expiry}</small>}</section><div className="packing-row-actions"><button onClick={()=>begin(doc)}><Pencil size={17}/></button><button onClick={()=>{if(confirm("Delete this document?"))store.deleteDocument(doc.id)}}><Trash2 size={17}/></button></div></Card>)}</div>}
  <ModalSheet title={editing?"Edit document":"Add document"} open={open} onClose={()=>setOpen(false)} footer={<button type="button" className="primary-button full-width-action" onClick={save}>Save document</button>}><div className="sheet-form document-form">
    <label className="form-field"><span>Type</span><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{TYPES.map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="form-field"><span>Document name</span><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Travel insurance"/></label>
    <label className="form-field"><span>Reference / location</span><input value={form.reference} onChange={e=>setForm({...form,reference:e.target.value})} placeholder="Policy number or where it is saved"/></label>
    <label className="form-field date-field"><span>Expiry date</span><div className="date-input-shell"><input type="date" value={form.expiry||""} onChange={e=>setForm({...form,expiry:e.target.value})}/></div></label>
    <label className="form-field"><span>Notes</span><textarea rows="4" value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Optional notes"/></label>
  </div></ModalSheet></Page>;
}

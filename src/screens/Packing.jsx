import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ProgressRing from "../components/ProgressRing";
import ModalSheet from "../components/ModalSheet";
import EmptyState from "../components/EmptyState";
import { PackagePlus, Pencil, Trash2, Luggage, Search, Scale, Sparkles, RotateCcw } from "lucide-react";

const CATEGORIES=["Documents","Clothes","Electronics","Toiletries","Medicine","Beauty","Snacks","Souvenirs","Others"];
const TEMPLATES={
  Vacation:[["Passport","Documents",true],["Phone charger","Electronics",true],["Travel adapter","Electronics",true],["Comfortable shoes","Clothes",false],["Toiletries","Toiletries",false]],
  Business:[["Passport","Documents",true],["Laptop","Electronics",true],["Laptop charger","Electronics",true],["Business clothes","Clothes",false],["Work documents","Documents",true]],
  Concert:[["Passport","Documents",true],["Concert ticket","Documents",true],["Lightstick","Electronics",true],["Power bank","Electronics",true],["Camera","Electronics",false],["Merchandise bag","Souvenirs",false]],
  Winter:[["Passport","Documents",true],["Thermal wear","Clothes",false],["Winter coat","Clothes",false],["Gloves","Clothes",false],["Lip balm","Toiletries",false]],
  Summer:[["Passport","Documents",true],["Sunscreen","Toiletries",false],["Light clothing","Clothes",false],["Sunglasses","Clothes",false],["Water bottle","Others",false]]
};

export default function Packing({ store }) {
  const { packing, packed, packingProgress, togglePacking, addPackingItem, updatePackingItem, deletePackingItem, packingSettings, updatePackingSettings } = store;
  const [draft,setDraft]=useState({label:"",category:"Others",quantity:1,weightKg:"",toBuy:false,essential:false,meta:""});
  const [editing,setEditing]=useState(null); const [query,setQuery]=useState(""); const [view,setView]=useState("all");
  const cats=useMemo(()=>[...new Set(packing.map(i=>i.category||"Others"))],[packing]);
  const totalWeight=useMemo(()=>packing.reduce((s,i)=>s+(Number(i.weightKg)||0)*(Number(i.quantity)||1),0),[packing]);
  const limit=Number(packingSettings?.luggageLimitKg)||0; const overweight=limit>0&&totalWeight>limit;
  const missingEssentials=packing.filter(i=>i.essential&&!i.packed);
  const shopping=packing.filter(i=>i.toBuy&&!i.packed);
  const visible=packing.filter(i=>{const q=query.trim().toLowerCase();const hit=!q||`${i.label} ${i.category} ${i.meta||""}`.toLowerCase().includes(q);const mode=view==="all"||view==="missing"&&!i.packed||view==="shopping"&&i.toBuy;return hit&&mode;});

  function submit(e){e?.preventDefault?.();const name=draft.label.trim();if(!name){window.ftosToast?.("Enter an item name","warning");return;}if(packing.some(i=>i.label.trim().toLowerCase()===name.toLowerCase())){window.ftosToast?.("This item already exists","warning");return;}addPackingItem({...draft,label:name,quantity:Math.max(1,Number(draft.quantity)||1),weightKg:Math.max(0,Number(draft.weightKg)||0)});setDraft({...draft,label:"",quantity:1,weightKg:"",meta:"",toBuy:false,essential:false});window.ftosToast?.("Packing item added");}
  function saveEdit(e){e.preventDefault();if(!editing?.label.trim())return;updatePackingItem(editing.id,{...editing,label:editing.label.trim(),quantity:Math.max(1,Number(editing.quantity)||1),weightKg:Math.max(0,Number(editing.weightKg)||0)});setEditing(null);window.ftosToast?.("Packing item updated");}
  function remove(item){if(window.confirm(`Remove “${item.label}” from your packing list?`))deletePackingItem(item.id);}
  function addTemplate(type){let added=0;TEMPLATES[type].forEach(([label,category,essential])=>{if(!packing.some(i=>i.label.toLowerCase()===label.toLowerCase())){addPackingItem({label,category,essential,packed:false,quantity:1,weightKg:0,toBuy:false,meta:""});added++;}});updatePackingSettings({tripType:type});window.ftosToast?.(added?`${added} suggested items added`:"Template items already exist");}

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Smart Packing 2.0</span><h1>Packing</h1></div><span className="status-chip">{packing.length-packed} missing</span></header>
    <div className="packing-metrics"><Card className="overview-card"><ProgressRing value={packingProgress} label="Packed"/><div><span className="eyebrow">Trip Readiness</span><h2>{packingProgress}% packed</h2><p>{packed}/{packing.length} items packed.</p></div></Card><Card className={`weight-card ${overweight?"danger":"good"}`}><Scale/><div><span className="eyebrow">Estimated weight</span><h2>{totalWeight.toFixed(1)} kg</h2><p>{limit?`${overweight?"Over":"Within"} ${limit} kg limit`:"Set a luggage limit below"}</p></div></Card></div>
    <Card className={`packing-alert ${missingEssentials.length?"warning":"good"}`}><Luggage/><div><strong>{missingEssentials.length?`${missingEssentials.length} essential items still missing`:"Essential items ready"}</strong><p>{missingEssentials.length?missingEssentials.map(i=>i.label).join(" · "):"Your marked essentials are packed."}</p></div></Card>

    <SectionTitle title="Quick setup" subtitle="Add useful suggestions without replacing your list."/>
    <Card><div className="template-grid">{Object.keys(TEMPLATES).map(type=><button key={type} className={packingSettings?.tripType===type?"active":""} onClick={()=>addTemplate(type)}><Sparkles size={15}/>{type}</button>)}</div><div className="limit-row"><label>Luggage limit (kg)</label><input type="number" min="0" step="0.5" value={packingSettings?.luggageLimitKg??10} onChange={e=>updatePackingSettings({luggageLimitKg:e.target.value})}/></div></Card>

    <SectionTitle title="Add Item"/>
    <Card className="compact-form-card"><form className="packing-add-form" onSubmit={submit}>
      <label className="packing-field"><span>Item name</span><input placeholder="e.g. Power bank" value={draft.label} onChange={e=>setDraft({...draft,label:e.target.value})}/></label>
      <label className="packing-field"><span>Category</span><select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
      <div className="packing-mini-grid">
        <label className="packing-field"><span>Quantity</span><input type="number" min="1" inputMode="numeric" value={draft.quantity} onChange={e=>setDraft({...draft,quantity:e.target.value})}/></label>
        <label className="packing-field"><span>Weight (kg)</span><input type="number" min="0" step="0.1" inputMode="decimal" placeholder="Optional" value={draft.weightKg} onChange={e=>setDraft({...draft,weightKg:e.target.value})}/></label>
      </div>
      <div className="packing-flags" role="group" aria-label="Item options">
        <label className="packing-check-option"><input type="checkbox" checked={draft.essential} onChange={e=>setDraft({...draft,essential:e.target.checked})}/><span>Essential</span></label>
        <label className="packing-check-option"><input type="checkbox" checked={draft.toBuy} onChange={e=>setDraft({...draft,toBuy:e.target.checked})}/><span>Need to buy</span></label>
      </div>
      <button type="button" className="packing-primary-button" onClick={submit}><PackagePlus size={18}/> Add Item</button>
    </form></Card>

    <SectionTitle title="Checklist" subtitle="Search, filter, pack, edit or remove items."/>
    <Card className="packing-toolbar"><div className="packing-search"><Search size={16}/><input placeholder="Search packing list" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="packing-filter-row">{[["all","All"],["missing","Missing"],["shopping",`Shopping ${shopping.length}`]].map(([id,label])=><button key={id} className={view===id?"active":""} onClick={()=>setView(id)}>{label}</button>)}</div></Card>
    <div className="list">{visible.length===0&&<Card className="empty-state-card"><EmptyState icon={Luggage} title="Nothing here" description="Try another filter or add a packing item."/></Card>}{cats.map(cat=>{const items=visible.filter(i=>(i.category||"Others")===cat);if(!items.length)return null;const done=items.filter(i=>i.packed).length;return <Card key={cat}><div className="category-head"><strong>{cat}</strong><span>{done}/{items.length}</span></div><div className="category-progress"><i style={{width:`${items.length?done/items.length*100:0}%`}}/></div><div className="item-list">{items.map(item=><div key={item.id} className="packing-manage-row"><button className="packing-check-main" onClick={()=>togglePacking(item.id)}><span className={item.packed?"check on":"check"}>{item.packed?"✓":""}</span><div><strong>{item.label}{Number(item.quantity)>1?` ×${item.quantity}`:""}</strong><p>{[item.toBuy?"Buy first":"",Number(item.weightKg)>0?`${(Number(item.weightKg)*Number(item.quantity||1)).toFixed(1)} kg`:"",item.meta].filter(Boolean).join(" · ")}</p></div></button><div className="packing-row-actions"><button aria-label={`Edit ${item.label}`} onClick={()=>setEditing({...item})}><Pencil size={16}/></button><button className="icon-danger" aria-label={`Delete ${item.label}`} onClick={()=>remove(item)}><Trash2 size={16}/></button></div></div>)}</div></Card>})}</div>

    <SectionTitle title="Leaving checklist" subtitle="A fast final check before leaving your hotel."/>
    <Card><div className="leaving-checklist">{["Passport","Wallet","Phone","Room key","Luggage","Chargers"].map(label=><div key={label}><span>○</span><strong>{label}</strong></div>)}</div><button className="secondary-action full-width-action" onClick={()=>window.ftosToast?.("Use this as your final visual check before leaving") }><RotateCcw size={16}/> Reset visual check</button></Card>

    <ModalSheet title="Edit Packing Item" open={Boolean(editing)} onClose={()=>setEditing(null)}>{editing&&<form className="packing-add-form" onSubmit={saveEdit}>
        <label className="packing-field"><span>Item name</span><input placeholder="Item name" value={editing.label} onChange={e=>setEditing({...editing,label:e.target.value})}/></label>
        <label className="packing-field"><span>Category</span><select value={editing.category} onChange={e=>setEditing({...editing,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
        <div className="packing-mini-grid"><label className="packing-field"><span>Quantity</span><input type="number" min="1" value={editing.quantity||1} onChange={e=>setEditing({...editing,quantity:e.target.value})}/></label><label className="packing-field"><span>Weight (kg)</span><input type="number" min="0" step="0.1" value={editing.weightKg||""} placeholder="Optional" onChange={e=>setEditing({...editing,weightKg:e.target.value})}/></label></div>
        <label className="packing-field"><span>Notes</span><input placeholder="Optional note" value={editing.meta||""} onChange={e=>setEditing({...editing,meta:e.target.value})}/></label>
        <div className="packing-flags"><label className="packing-check-option"><input type="checkbox" checked={Boolean(editing.essential)} onChange={e=>setEditing({...editing,essential:e.target.checked})}/><span>Essential</span></label><label className="packing-check-option"><input type="checkbox" checked={Boolean(editing.toBuy)} onChange={e=>setEditing({...editing,toBuy:e.target.checked})}/><span>Need to buy</span></label></div>
        <button type="submit" className="packing-primary-button"><Pencil size={17}/> Save Changes</button>
      </form>}</ModalSheet>
  </Page>;
}

import { useRef, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditableField from "../components/EditableField";
import ThemeSelector from "../components/ThemeSelector";
import ModalSheet from "../components/ModalSheet";
import { Check, Download, MonitorSmartphone, Moon, Plus, RotateCcw, Share2, Sun, Trash2, Upload } from "lucide-react";

const emptyNewTrip = { traveller:"",tripName:"",destination:"",startDate:"",endDate:"",homeCurrency:"SGD",travelCurrency:"USD",totalBudgetSGD:"" };

function collectBackup() {
  const data = {};
  for (let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key?.startsWith("ftos-p-")) data[key]=localStorage.getItem(key);
  }
  return { app:"Freedom Travel OS P", version:"0.2.0", exportedAt:new Date().toISOString(), data };
}
function downloadBackup() {
  const blob=new Blob([JSON.stringify(collectBackup(),null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a");
  a.href=url; a.download=`FTOS-P-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
}

export default function Settings({ store, theme, setTheme }) {
  const { trip, trips, activeTripId, switchTrip, deleteTrip, createTrip, updateTripField, resetAll } = store;
  const inputRef=useRef(null);
  const [newTripOpen,setNewTripOpen]=useState(false);
  const [newTrip,setNewTrip]=useState(emptyNewTrip);
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : MonitorSmartphone;

  async function shareBackup(){
    const file=new File([JSON.stringify(collectBackup(),null,2)],"FTOS-P-backup.json",{type:"application/json"});
    if(navigator.canShare?.({files:[file]})) await navigator.share({title:"Freedom Travel OS P backup",files:[file]}); else downloadBackup();
  }
  async function importBackup(e){
    const file=e.target.files?.[0]; if(!file)return;
    try{
      const payload=JSON.parse(await file.text());
      if(!payload?.data||payload.app!=="Freedom Travel OS P") throw new Error();
      if(!confirm("Import this FTOS P backup and replace current app data?"))return;
      Object.entries(payload.data).forEach(([k,v])=>{if(k.startsWith("ftos-p-"))localStorage.setItem(k,v)});
      window.ftosToast?.("Backup imported"); setTimeout(()=>location.reload(),500);
    }catch{ window.ftosToast?.("Invalid FTOS P backup file","warning"); }
    finally{e.target.value="";}
  }
  function submitNewTrip(e){
    e.preventDefault();
    if(!newTrip.tripName.trim()||!newTrip.destination.trim()||!newTrip.startDate||!newTrip.endDate)return;
    createTrip({...newTrip,totalBudgetSGD:Number(newTrip.totalBudgetSGD)||0});
    setNewTrip(emptyNewTrip); setNewTripOpen(false); window.ftosToast?.("New trip created");
  }
  function removeTrip(id,name){
    if(trips.length===1){ window.ftosToast?.("Keep at least one trip or use Reset All App Data","warning"); return; }
    if(confirm(`Delete ${name}? This removes its flights, hotel, budget, itinerary and memories from this device.`)){
      deleteTrip(id); window.ftosToast?.("Trip deleted","warning");
    }
  }

  return <Page><header className="app-header"><div><span className="eyebrow">Trip Profile</span><h1>Settings</h1></div><span className="status-chip">P Edition</span></header>
    <SectionTitle title="Appearance" subtitle="Saved locally on this device."/><Card className="theme-card beta1-theme-card"><div className="theme-copy"><span className="theme-icon"><ThemeIcon size={20}/></span><section><strong>{theme === "system" ? "Follow System" : theme === "dark" ? "Dark Mode" : "Light Mode"}</strong><p>Switch between premium light, navy dark, or your device setting.</p></section></div><ThemeSelector theme={theme} setTheme={setTheme}/></Card>

    <SectionTitle title="My Trips" subtitle="Each trip keeps its own flights, hotel, budget, itinerary and memories."/>
    <div className="list trip-manager-list">
      {trips.map(({id,trip:itemTrip})=><Card className={`trip-manager-item${id===activeTripId?" active":""}`} key={id}>
        <button className="trip-manager-main" onClick={()=>{switchTrip(id);window.ftosToast?.(`${itemTrip.tripName} selected`);}}>
          <span className="trip-manager-icon">{id===activeTripId?<Check size={18}/>:<span>✈</span>}</span>
          <span><strong>{itemTrip.tripName||"Untitled trip"}</strong><small>{itemTrip.destination||"No destination"} · {itemTrip.startDate||"Dates not set"}</small></span>
        </button>
        <button className="icon-danger" aria-label={`Delete ${itemTrip.tripName}`} onClick={()=>removeTrip(id,itemTrip.tripName||"this trip")}><Trash2 size={16}/></button>
      </Card>)}
      <button className="secondary-action full-width-action" onClick={()=>setNewTripOpen(true)}><Plus size={17}/> Create Another Trip</button>
    </div>

    <SectionTitle title="Active Trip Profile"/><Card className="form-grid">{["traveller","tripName","destination","startDate","endDate","status"].map((k)=><EditableField key={k} label={k} value={trip[k]} onChange={(v)=>{updateTripField(k,v);window.ftosToast?.("Trip profile saved");}}/>)}</Card>
    <SectionTitle title="Backup & Transfer" subtitle="One backup contains every trip saved in FTOS P."/><Card className="backup-actions"><button onClick={downloadBackup}><Download size={17}/> Download Backup</button><button onClick={shareBackup}><Share2 size={17}/> Share / Save to Cloud</button><button onClick={()=>inputRef.current?.click()}><Upload size={17}/> Import Backup</button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={importBackup}/><p>Automatic cloud sync is not enabled yet. Store this backup in your preferred cloud drive.</p></Card>
    <SectionTitle title="Danger Zone"/><Card><button className="danger-button" onClick={()=>confirm("Reset all FTOS P trips and data on this device?")&&(resetAll(),window.ftosToast?.("All app data reset","warning"))}><RotateCcw size={16}/> Reset All App Data</button></Card>

    <ModalSheet title="Create Another Trip" open={newTripOpen} onClose={()=>setNewTripOpen(false)}>
      <form className="inline-form new-trip-form" onSubmit={submitNewTrip}>
        <input placeholder="Your name (optional)" value={newTrip.traveller} onChange={e=>setNewTrip(v=>({...v,traveller:e.target.value}))}/>
        <input required placeholder="Trip name" value={newTrip.tripName} onChange={e=>setNewTrip(v=>({...v,tripName:e.target.value}))}/>
        <input required placeholder="Destination" value={newTrip.destination} onChange={e=>setNewTrip(v=>({...v,destination:e.target.value}))}/>
        <label className="field"><span>Start date</span><input required type="date" value={newTrip.startDate} onChange={e=>setNewTrip(v=>({...v,startDate:e.target.value}))}/></label>
        <label className="field"><span>End date</span><input required type="date" min={newTrip.startDate} value={newTrip.endDate} onChange={e=>setNewTrip(v=>({...v,endDate:e.target.value}))}/></label>
        <div className="two-column-form"><input maxLength="3" placeholder="Home currency" value={newTrip.homeCurrency} onChange={e=>setNewTrip(v=>({...v,homeCurrency:e.target.value.toUpperCase()}))}/><input maxLength="3" placeholder="Travel currency" value={newTrip.travelCurrency} onChange={e=>setNewTrip(v=>({...v,travelCurrency:e.target.value.toUpperCase()}))}/></div>
        <input type="number" min="0" step="0.01" placeholder="Starting budget (optional)" value={newTrip.totalBudgetSGD} onChange={e=>setNewTrip(v=>({...v,totalBudgetSGD:e.target.value}))}/>
        <button><Plus size={16}/> Create Trip</button>
      </form>
    </ModalSheet>
  </Page>;
}

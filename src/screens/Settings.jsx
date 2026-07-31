import { useRef } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditableField from "../components/EditableField";
import ThemeSelector from "../components/ThemeSelector";
import { Download, MonitorSmartphone, Moon, RotateCcw, Share2, Sun, Upload } from "lucide-react";

function collectBackup() { const data = {}; for (let i=0;i<localStorage.length;i++){ const key=localStorage.key(i); if(key?.startsWith("ftos-")) data[key]=localStorage.getItem(key); } return { app:"Freedom Travel OS", version:"1.3.0", exportedAt:new Date().toISOString(), data }; }
function downloadBackup() { const blob=new Blob([JSON.stringify(collectBackup(),null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`FreedomTravelOS-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url); }

export default function Settings({ store, theme, setTheme }) {
  const { trip, updateTripField, resetAll } = store; const inputRef=useRef(null);
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : MonitorSmartphone;
  async function shareBackup(){ const file=new File([JSON.stringify(collectBackup(),null,2)],"FreedomTravelOS-backup.json",{type:"application/json"}); if(navigator.canShare?.({files:[file]})) await navigator.share({title:"Freedom Travel OS backup",files:[file]}); else downloadBackup(); }
  async function importBackup(e){ const file=e.target.files?.[0]; if(!file)return; try{ const payload=JSON.parse(await file.text()); if(!payload?.data)throw new Error(); if(!confirm("Import this backup and replace current app data?"))return; Object.entries(payload.data).forEach(([k,v])=>localStorage.setItem(k,v)); window.ftosToast?.("Backup imported"); setTimeout(()=>location.reload(),500); }catch{ window.ftosToast?.("Invalid backup file","warning"); } finally{e.target.value="";} }
  return <Page><header className="app-header"><div><span className="eyebrow">Trip Profile</span><h1>Settings</h1></div><span className="status-chip">Saved</span></header>
    <SectionTitle title="Appearance" subtitle="Saved locally on this device."/><Card className="theme-card beta1-theme-card"><div className="theme-copy"><span className="theme-icon"><ThemeIcon size={20}/></span><section><strong>{theme === "system" ? "Follow System" : theme === "dark" ? "Dark Mode" : "Light Mode"}</strong><p>Switch between premium light, navy dark, or your device setting.</p></section></div><ThemeSelector theme={theme} setTheme={setTheme}/></Card>
    <SectionTitle title="Trip Profile"/><Card className="form-grid">{["traveller","tripName","destination","startDate","endDate","status"].map((k)=><EditableField key={k} label={k} value={trip[k]} onChange={(v)=>{updateTripField(k,v);window.ftosToast?.("Trip profile saved");}}/>)}</Card>
    <SectionTitle title="Backup & Transfer" subtitle="Save a portable file to Drive, OneDrive, Files or another device."/><Card className="backup-actions"><button onClick={downloadBackup}><Download size={17}/> Download Backup</button><button onClick={shareBackup}><Share2 size={17}/> Share / Save to Cloud</button><button onClick={()=>inputRef.current?.click()}><Upload size={17}/> Import Backup</button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={importBackup}/><p>Automatic cloud sync is not enabled yet. This backup contains your local FTOS data and can be stored in your preferred cloud drive.</p></Card>
    <SectionTitle title="Danger Zone"/><Card><button className="danger-button" onClick={()=>confirm("Reset all data?")&&(resetAll(),window.ftosToast?.("App data reset","warning"))}><RotateCcw size={16}/> Reset All App Data</button></Card>
  </Page>;
}

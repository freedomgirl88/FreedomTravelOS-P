import { useState } from "react";
import { CalendarDays, MapPin, Plane, Sparkles } from "lucide-react";

export default function CreateTrip({ store }) {
  const [form,setForm]=useState({traveller:"",tripName:"",destination:"",startDate:"",endDate:"",homeCurrency:"SGD",travelCurrency:"USD",totalBudgetSGD:""});
  const set=(key,value)=>setForm(current=>({...current,[key]:value}));
  function submit(event){
    event.preventDefault();
    if(!form.tripName.trim()||!form.destination.trim()||!form.startDate||!form.endDate)return;
    store.createTrip({...form,totalBudgetSGD:Number(form.totalBudgetSGD)||0});
    window.ftosToast?.("Your trip is ready");
  }
  return <main className="onboarding-page">
    <div className="onboarding-glow" />
    <section className="onboarding-card">
      <div className="onboarding-mark"><Plane size={28}/></div>
      <span className="eyebrow">Freedom Travel OS · Public Edition</span>
      <h1>Create your first trip</h1>
      <p>Start with the basics. You can add flights, hotels, packing, places and expenses after this.</p>
      <form className="onboarding-form" onSubmit={submit}>
        <label><span>Your name</span><input value={form.traveller} onChange={e=>set("traveller",e.target.value)} placeholder="Optional" /></label>
        <label><span>Trip name</span><input required value={form.tripName} onChange={e=>set("tripName",e.target.value)} placeholder="e.g. Japan Spring Trip" /></label>
        <label><span>Destination</span><div className="input-with-icon"><MapPin size={17}/><input required value={form.destination} onChange={e=>set("destination",e.target.value)} placeholder="City, Country" /></div></label>
        <div className="onboarding-grid"><label><span>Start date</span><div className="input-with-icon"><CalendarDays size={17}/><input required type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)} /></div></label><label><span>End date</span><input required type="date" min={form.startDate} value={form.endDate} onChange={e=>set("endDate",e.target.value)} /></label></div>
        <div className="onboarding-grid"><label><span>Home currency</span><input value={form.homeCurrency} onChange={e=>set("homeCurrency",e.target.value.toUpperCase())} maxLength="3" /></label><label><span>Travel currency</span><input value={form.travelCurrency} onChange={e=>set("travelCurrency",e.target.value.toUpperCase())} maxLength="3" /></label></div>
        <label><span>Starting budget</span><input type="number" min="0" step="0.01" value={form.totalBudgetSGD} onChange={e=>set("totalBudgetSGD",e.target.value)} placeholder="Optional" /></label>
        <button className="onboarding-submit"><Sparkles size={18}/> Create Trip</button>
      </form>
      <small>Your trip data stays on this device unless you export a backup.</small>
    </section>
  </main>;
}

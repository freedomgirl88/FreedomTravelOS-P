import { useEffect, useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ModalSheet from "../components/ModalSheet";
import EditableField from "../components/EditableField";
import { Plus, Settings, Trash2, WalletCards, CircleDollarSign, RefreshCw } from "lucide-react";
import { krwToSgd } from "../utils/helpers";

const PAYMENT_METHODS=["Card","Cash","Transport Card","Other"];
const roundRate=(value)=>Number(value)>=100?Number(value).toFixed(2):Number(value).toFixed(4).replace(/0+$/,"").replace(/\.$/,"");

export default function Budget({store}){
  const {trip,updateTripField,expenses,addExpense,deleteExpense,spentSGD,remainingSGD}=store;
  const [addOpen,setAddOpen]=useState(false);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [name,setName]=useState("");
  const [category,setCategory]=useState("Food");
  const [amount,setAmount]=useState("");
  const [paymentMethod,setPaymentMethod]=useState("Card");
  const [loadingRate,setLoadingRate]=useState(false);
  const [rateError,setRateError]=useState("");

  const home=(trip.homeCurrency||"SGD").toUpperCase();
  const travel=(trip.travelCurrency||"USD").toUpperCase();
  const rawRate=Number(trip.exchangeRate);
  const sameCurrency=home===travel;
  const legacyPlaceholder=!sameCurrency && rawRate===1 && !trip.exchangeRateUpdatedAt && !trip.manualExchangeRateUpdatedAt && !trip.marketExchangeRateUpdatedAt;
  const hasSavedRate=sameCurrency || (Number.isFinite(rawRate) && rawRate>0 && !legacyPlaceholder);
  const rate=sameCurrency?1:(hasSavedRate?rawRate:null);
  const mode=trip.exchangeRateMode||"live";
  const remainingPct=trip.totalBudgetSGD>0?Math.max(0,Math.round((remainingSGD/trip.totalBudgetSGD)*100)):0;

  async function refreshLiveRate(showToast=true){
    if(sameCurrency){
      const now=new Date().toISOString();
      updateTripField("exchangeRate",1);
      updateTripField("exchangeRateMode","live");
      updateTripField("marketExchangeRate",1);
      updateTripField("marketExchangeRateUpdatedAt",now);
      updateTripField("exchangeRateUpdatedAt",now);
      updateTripField("exchangeRateSourceDetail","Same currency");
      return;
    }
    setLoadingRate(true);
    setRateError("");
    try{
      const response=await fetch(`https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(home)}&symbols=${encodeURIComponent(travel)}`,{cache:"no-store"});
      if(!response.ok) throw new Error(`Rate service returned ${response.status}`);
      const data=await response.json();
      const nextRate=Number(data?.rates?.[travel]);
      if(!Number.isFinite(nextRate)||nextRate<=0) throw new Error("Rate unavailable for this currency pair");
      const now=new Date().toISOString();
      updateTripField("exchangeRate",nextRate);
      updateTripField("exchangeRateMode","live");
      updateTripField("marketExchangeRate",nextRate);
      updateTripField("marketExchangeRateUpdatedAt",now);
      updateTripField("exchangeRateUpdatedAt",now);
      updateTripField("exchangeRateDate",data.date||"");
      updateTripField("exchangeRateSourceDetail","Live reference rate");
      if(showToast) window.ftosToast?.("Live exchange rate updated");
    }catch(error){
      setRateError(error?.message||"Could not retrieve the live rate");
      if(showToast) window.ftosToast?.("Live rate unavailable. You can enter a manual rate.","warning");
    }finally{
      setLoadingRate(false);
    }
  }

  useEffect(()=>{
    if(legacyPlaceholder){updateTripField("exchangeRateMode","live");refreshLiveRate(false);return;}
    if(mode==="live"&&!hasSavedRate&&!loadingRate) refreshLiveRate(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[home,travel,mode]);

  const byCat=useMemo(()=>expenses.reduce((acc,e)=>{
    const effective=Number(e.rateUsed)>0?Number(e.rateUsed):rate;
    if(!effective)return acc;
    const key=e.category||"Other";
    acc[key]=(acc[key]||0)+krwToSgd(Number(e.amountKRW)||0,effective);
    return acc;
  },{}),[expenses,rate]);

  function submit(e){
    e.preventDefault();
    if(!name.trim()||!amount)return;
    if(!rate){window.ftosToast?.("Set an exchange rate before adding expenses.","warning");setSettingsOpen(true);return;}
    addExpense({name:name.trim(),category,amountKRW:Number(amount),paymentMethod,createdAt:new Date().toISOString(),rateUsed:rate});
    setName("");setAmount("");setAddOpen(false);window.ftosToast?.("Expense saved");
  }

  function saveManualRate(value){
    const next=Number(value);
    if(!Number.isFinite(next)||next<=0){
      updateTripField("manualExchangeRate",null);
      updateTripField("exchangeRate",null);
      updateTripField("manualExchangeRateUpdatedAt","");
      updateTripField("exchangeRateUpdatedAt","");
      return;
    }
    const now=new Date().toISOString();
    updateTripField("manualExchangeRate",next);
    updateTripField("manualExchangeRateUpdatedAt",now);
    updateTripField("exchangeRate",next);
    updateTripField("exchangeRateMode","manual");
    updateTripField("exchangeRateUpdatedAt",now);
    updateTripField("exchangeRateSourceDetail","Manual rate");
  }

  const rateTitle=loadingRate?"Loading…":rate?`1 ${home} = ${roundRate(rate)} ${travel}`:"Not set";
  const rateSubtitle=loadingRate?"Retrieving live reference rate":rateError?"Live rate unavailable":mode==="live"?(trip.exchangeRateUpdatedAt?`Live · updated ${new Date(trip.exchangeRateUpdatedAt).toLocaleString()}`:"Live rate"):(trip.exchangeRateUpdatedAt?`Manual · updated ${new Date(trip.exchangeRateUpdatedAt).toLocaleString()}`:"Manual rate");

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Travel Wallet</span><h1>Budget</h1></div><button className="status-chip" onClick={()=>setSettingsOpen(true)}><Settings size={15}/> Edit</button></header>
    <Card className="budget-hero beta-wallet"><div><span className="eyebrow">Available Balance</span><h2>{home} {remainingSGD.toFixed(2)}</h2><p>Spent {home} {spentSGD.toFixed(2)} · {remainingPct}% left</p><button className="hero-action" onClick={()=>setAddOpen(true)}><Plus size={16}/> Add Expense</button></div><div className="donut" style={{"--p":`${remainingPct}%`}}><div><strong>{remainingPct}%</strong><span>left</span></div></div></Card>
    <div className="wallet-metrics wallet-metrics-v3">
      <Card><span>💳</span><div><small>Total Budget</small><strong>{home} {Number(trip.totalBudgetSGD||0).toLocaleString()}</strong><p>Trip allowance</p></div></Card>
      <Card className={!rate?"rate-not-set":""}><span>💱</span><div><small>Exchange Rate</small><strong>{rateTitle}</strong><p>{rateSubtitle}</p>{mode==="live"&&<button className="rate-refresh-inline" onClick={()=>refreshLiveRate()} disabled={loadingRate}><RefreshCw size={14} className={loadingRate?"spin":""}/> {loadingRate?"Updating":"Refresh"}</button>}</div></Card>
      <Card><span>🔥</span><div><small>Spent</small><strong>{home} {spentSGD.toFixed(2)}</strong><p>Recorded</p></div></Card>
    </div>
    <SectionTitle title="Category Breakdown"/><Card className="breakdown-card">{Object.keys(byCat).length===0&&<div className="empty-state-v7"><WalletCards size={22}/><div><strong>No expenses recorded yet</strong><p>Add your first expense to see a breakdown.</p></div></div>}{Object.entries(byCat).map(([cat,val])=><div className="category-row" key={cat}><span>•</span><div><div><strong>{cat}</strong><small>{home} {val.toFixed(2)}</small></div><div className="bar"><span style={{width:`${spentSGD?Math.min(100,val/spentSGD*100):0}%`}}/></div></div></div>)}</Card>
    <SectionTitle title="Recent Expenses"/><div className="list expense-list">{expenses.length===0&&<Card className="empty-state-v7"><CircleDollarSign size={22}/><div><strong>No recent expenses</strong><p>Tap Add Expense whenever you spend during the trip.</p></div></Card>}{expenses.slice().reverse().map(e=><Card className="expense-row beta-expense" key={e.id}><span>•</span><div><strong>{e.name}</strong><p>{e.category} · {e.paymentMethod}</p></div><div><strong>{travel} {Number(e.amountKRW).toLocaleString()}</strong><p>{home} {krwToSgd(e.amountKRW,e.rateUsed||rate).toFixed(2)}</p></div><button className="icon-danger" onClick={()=>confirm("Delete this expense?")&&deleteExpense(e.id)}><Trash2 size={16}/></button></Card>)}</div>
    <ModalSheet title="Add Expense" open={addOpen} onClose={()=>setAddOpen(false)}><form className="inline-form" onSubmit={submit}><input placeholder="Expense name" value={name} onChange={e=>setName(e.target.value)}/><select value={category} onChange={e=>setCategory(e.target.value)}><option>Food</option><option>Shopping</option><option>Transport</option><option>Attraction</option><option>Accommodation</option><option>Other</option></select><input placeholder={`Amount ${travel}`} type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/><select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>{PAYMENT_METHODS.map(method=><option key={method}>{method}</option>)}</select><button><Plus size={16}/> Save Expense</button></form></ModalSheet>
    <ModalSheet title="Budget Settings" open={settingsOpen} onClose={()=>setSettingsOpen(false)}><div className="form-grid"><EditableField label={`Total Budget ${home}`} type="number" value={trip.totalBudgetSGD} onChange={v=>updateTripField("totalBudgetSGD",Number(v))}/><label className="field"><span>Exchange rate mode</span><select value={mode} onChange={e=>{const next=e.target.value;updateTripField("exchangeRateMode",next);if(next==="live")refreshLiveRate();else if(Number(trip.manualExchangeRate)>0)saveManualRate(trip.manualExchangeRate);}}><option value="live">Live reference rate</option><option value="manual">Manual rate</option></select></label>{mode==="manual"?<EditableField label={`1 ${home} equals how many ${travel}`} type="number" value={trip.manualExchangeRate??""} onChange={saveManualRate}/>:<div className="live-rate-setting"><strong>{rateTitle}</strong><p>{rateError||rateSubtitle}</p><button type="button" onClick={()=>refreshLiveRate()} disabled={loadingRate}><RefreshCw size={15} className={loadingRate?"spin":""}/> Refresh live rate</button></div>}<EditableField label="Home Currency" value={home} onChange={v=>{updateTripField("homeCurrency",v.toUpperCase());updateTripField("exchangeRate",null);updateTripField("exchangeRateUpdatedAt","");}}/><EditableField label="Travel Currency" value={travel} onChange={v=>{updateTripField("travelCurrency",v.toUpperCase());updateTripField("exchangeRate",null);updateTripField("exchangeRateUpdatedAt","");}}/></div></ModalSheet>
  </Page>;
}

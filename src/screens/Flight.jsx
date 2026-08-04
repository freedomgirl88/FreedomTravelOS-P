import { useEffect, useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import EditFormSheet from "../components/EditFormSheet";
import EmptyState from "../components/EmptyState";
import { PlaneTakeoff, Luggage, Pencil, Clock3, CheckCircle2, Circle, MapPin, RefreshCw } from "lucide-react";
import { combineDateTime, formatDateTime, formatFlightCountdown, subtractHours } from "../utils/helpers";

const STATUS_OPTIONS=["Scheduled","On Time","Check-in Open","Boarding","Delayed","Gate Changed","Departed","Landed","Cancelled"];

function statusTone(status=""){
  if(["On Time","Landed"].includes(status))return "live";
  if(["Boarding","Check-in Open","Gate Changed"].includes(status))return "warning";
  if(["Delayed","Cancelled"].includes(status))return "danger";
  return "neutral";
}

function BoardingCard({flight,label,onEdit,onClear,onStatus}){
  const has=Boolean(flight.flightNumber||flight.airline);
  const countdown=formatFlightCountdown(flight.departureDate,flight.departureTime);
  if(!has)return <Card className="empty-state-card"><EmptyState icon={PlaneTakeoff} title={`No ${label.toLowerCase()} flight yet`} description="Add the airline, route, dates, times and baggage allowance." actionLabel={`Add ${label} Flight`} onAction={onEdit}/></Card>;
  return <Card className="boarding-pass-v2 boarding-pass-v5 flight-leg-card">
    <div className="pass-top"><div><span className="eyebrow">{label} · {flight.airline||"Airline"}</span><h2>{flight.flightNumber||"Flight"}</h2></div><PlaneTakeoff size={34}/></div>
    <div className="flight-live-row">
      <span className={`flight-status-badge ${statusTone(flight.status)}`}>{flight.status||"Scheduled"}</span>
      <span className={`flight-countdown ${countdown.tone}`}><Clock3 size={14}/>{countdown.label}</span>
    </div>
    {flight.statusNote&&<p className="flight-status-note">{flight.statusNote}</p>}
    <div className="pass-date">{flight.departureDate||"Date not set"} · {flight.departureTime||"Time not set"}</div>
    <div className="pass-route"><div><strong>{flight.departureCode||"FROM"}</strong><span>{flight.departureTime}</span><p>{flight.departureAirport}</p></div><div className="route-line"><span>✈</span></div><div><strong>{flight.arrivalCode||"TO"}</strong><span>{flight.arrivalTime}</span><p>{flight.arrivalAirport}</p></div></div>
    <div className="pass-details pass-details-v5"><div><small>Terminal</small><strong>{flight.terminal||"—"}</strong></div><div><small>Gate</small><strong>{flight.gate||"—"}</strong></div><div><small>Boarding</small><strong>{flight.boardingTime||"—"}</strong></div><div><small>Seat</small><strong>{flight.seat||"—"}</strong></div></div>
    <div className="flight-meta-row"><span>Carry-on: {flight.carryOn||"—"}</span><span>Checked: {flight.checked||"—"}</span></div>
    <div className="card-action-row"><button className="hero-action" onClick={onEdit}><Pencil size={15}/> Edit {label}</button><button className="secondary-button" onClick={onStatus}><RefreshCw size={15}/> Status</button><button className="secondary-button" onClick={onClear}>Remove</button></div>
  </Card>
}

function FlightJourney({flight}){
  const departure=combineDateTime(flight.departureDate,flight.departureTime);
  const checkIn=subtractHours(flight.departureDate,flight.departureTime,flight.checkInOpensHours||48);
  const boarding=combineDateTime(flight.departureDate,flight.boardingTime||flight.departureTime);
  const arrival=combineDateTime(flight.arrivalDate||flight.departureDate,flight.arrivalTime);
  const now=Date.now();
  const steps=[
    {label:"Online check-in opens",time:checkIn,detail:`${flight.checkInOpensHours||48} hours before departure`},
    {label:"Arrive at airport",time:subtractHours(flight.departureDate,flight.departureTime,3),detail:"Recommended international-flight buffer"},
    {label:"Boarding",time:boarding,detail:flight.gate?`Gate ${flight.gate}`:"Check the airport screens"},
    {label:"Departure",time:departure,detail:`${flight.departureCode||"Departure"} → ${flight.arrivalCode||"Arrival"}`},
    {label:"Arrival",time:arrival,detail:flight.arrivalAirport||"Destination airport"}
  ];
  if(!departure)return null;
  return <div className="flight-journey-list">{steps.map((step,index)=>{
    const complete=step.time&&step.time.getTime()<now;
    return <div className={`flight-journey-step ${complete?"complete":""}`} key={`${step.label}-${index}`}>
      <div className="flight-step-marker">{complete?<CheckCircle2 size={18}/>:<Circle size={18}/>}</div>
      <div><small>{formatDateTime(step.time)}</small><strong>{step.label}</strong><p>{step.detail}</p></div>
    </div>;
  })}</div>;
}

function StatusSheet({open,flight,onSave,onClose}){
  const [status,setStatus]=useState(flight.status||"Scheduled");
  const [note,setNote]=useState(flight.statusNote||"");
  useEffect(()=>{if(open){setStatus(flight.status||"Scheduled");setNote(flight.statusNote||"");}},[open,flight.status,flight.statusNote]);
  if(!open)return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal-sheet compact-status-sheet" role="dialog" aria-modal="true" aria-label="Update flight status">
      <div className="sheet-handle"/><div className="modal-sheet-header"><h2>Update Flight Status</h2><button className="modal-close" onClick={onClose}>Close</button></div>
      <div className="flight-status-grid">{STATUS_OPTIONS.map(option=><button key={option} className={status===option?"active":""} onClick={()=>setStatus(option)}>{option}</button>)}</div>
      <label className="field"><span>Status note</span><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Example: Gate changed to A15"/></label>
      <div className="sheet-action-bar"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={()=>{onSave(status,note);onClose();}}>Save Status</button></div>
    </div>
  </div>;
}

export default function Flight({store}){
  const {trip,updateFlightField,updateReturnFlightField,clearFlight}=store;
  const [editing,setEditing]=useState(null);
  const [statusLeg,setStatusLeg]=useState(null);
  const outboundFields=useMemo(()=>["airline","flightNumber","departureCode","arrivalCode","departureAirport","arrivalAirport","departureDate","departureTime","arrivalDate","arrivalTime","boardingTime","terminal","gate","seat","carryOn","checked","checkInOpensHours"],[]);
  const returnFields=useMemo(()=>[...outboundFields,"airportTargetTime","leaveByTime","leaveFrom"],[outboundFields]);
  const flight=editing==="return"?trip.returnFlight:trip.flight;
  const updater=editing==="return"?updateReturnFlightField:updateFlightField;
  const fields=editing==="return"?returnFields:outboundFields;
  const save=draft=>fields.forEach(key=>updater(key,draft[key]));
  const statusFlight=statusLeg==="return"?trip.returnFlight:trip.flight;
  const statusUpdater=statusLeg==="return"?updateReturnFlightField:updateFlightField;
  return <Page>
    <header className="app-header"><div><span className="eyebrow">Travel Itinerary</span><h1>Flight</h1></div><span className="status-chip">{trip.flight.flightNumber?"Saved":"Planning"}</span></header>
    <BoardingCard flight={trip.flight} label="Outbound" onEdit={()=>setEditing("outbound")} onStatus={()=>setStatusLeg("outbound")} onClear={()=>confirm("Remove outbound flight details?")&&clearFlight("outbound")}/>
    <BoardingCard flight={trip.returnFlight} label="Return" onEdit={()=>setEditing("return")} onStatus={()=>setStatusLeg("return")} onClear={()=>confirm("Remove return flight details?")&&clearFlight("return")}/>
    {trip.flight.flightNumber&&<><SectionTitle title="Outbound Journey" subtitle="Key times calculated from the saved flight."/><Card className="flight-journey-card"><FlightJourney flight={trip.flight}/></Card></>}
    <SectionTitle title="Flight Notes" subtitle="Keep the details you need on travel day."/>
    <Card className="timeline-item"><Luggage/><div><strong>Baggage allowances</strong><p>Save cabin and checked-baggage limits for each direction so they are easy to check later.</p></div></Card>
    <Card className="timeline-item"><MapPin/><div><strong>Live status note</strong><p>Flight status is manual in this release. Update it whenever the airline changes the gate, timing or boarding state.</p></div></Card>
    <EditFormSheet title={`${editing==="return"?"Edit Return":"Edit Outbound"} Flight`} open={Boolean(editing)} values={flight} fields={fields} onSave={save} onClose={()=>setEditing(null)}/>
    <StatusSheet open={Boolean(statusLeg)} flight={statusFlight} onClose={()=>setStatusLeg(null)} onSave={(status,note)=>{statusUpdater("status",status);statusUpdater("statusNote",note);statusUpdater("statusUpdatedAt",new Date().toISOString());window.ftosToast?.("Flight status updated");}}/>
  </Page>;
}

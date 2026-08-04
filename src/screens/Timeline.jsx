import { useMemo } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { CalendarDays, Plane, Hotel, MapPin, BellRing } from "lucide-react";
const iconFor={flight:Plane,hotel:Hotel,place:MapPin,reminder:BellRing};
export default function Timeline({store}){
 const events=useMemo(()=>{
  const items=[]; const t=store.trip;
  if(t.flight?.departureDate)items.push({id:"outbound",date:t.flight.departureDate,title:`${t.flight.airline||"Flight"} ${t.flight.flightNumber||""}`.trim(),sub:`${t.flight.departureAirport||"Departure"} → ${t.flight.arrivalAirport||"Arrival"}`,type:"flight"});
  if(t.hotel?.checkIn)items.push({id:"hotel-in",date:t.hotel.checkIn,title:`Check in: ${t.hotel.name||"Hotel"}`,sub:t.hotel.address||"Hotel check-in",type:"hotel"});
  if(t.hotel?.checkOut)items.push({id:"hotel-out",date:t.hotel.checkOut,title:`Check out: ${t.hotel.name||"Hotel"}`,sub:"Hotel check-out",type:"hotel"});
  store.days.forEach(d=>d.places.forEach(p=>{if(p.date||d.date)items.push({id:p.id,date:p.date||d.date,title:p.name,sub:p.time||d.title||`Day ${d.day}`,type:"place"})}));
  store.reminders.filter(r=>r.date).forEach(r=>items.push({id:r.id,date:r.date,title:r.title,sub:r.time||r.note||"Reminder",type:"reminder"}));
  if(t.returnFlight?.departureDate)items.push({id:"return",date:t.returnFlight.departureDate,title:`${t.returnFlight.airline||"Return flight"} ${t.returnFlight.flightNumber||""}`.trim(),sub:`${t.returnFlight.departureAirport||"Departure"} → ${t.returnFlight.arrivalAirport||"Arrival"}`,type:"flight"});
  return items.sort((a,b)=>`${a.date}${a.sub}`.localeCompare(`${b.date}${b.sub}`));
 },[store.trip,store.days,store.reminders]);
 return <Page><header className="app-header"><div><span className="eyebrow">Smart Travel</span><h1>Trip Timeline</h1></div><span className="status-chip">{events.length} events</span></header>
 <Card className="timeline-hero"><CalendarDays size={28}/><div><h2>Your journey in one place</h2><p>Flights, hotel dates, itinerary items and reminders appear automatically.</p></div></Card>
 {!events.length?<EmptyState icon={CalendarDays} title="Timeline is empty" description="Add flight dates, hotel dates, itinerary places or reminders to build your timeline automatically."/>:<div className="smart-timeline">{events.map((event,index)=>{const Icon=iconFor[event.type]||CalendarDays;return <div className="smart-timeline-event" key={`${event.id}-${index}`}><div className="smart-timeline-rail"><span><Icon size={17}/></span>{index<events.length-1&&<i/>}</div><Card><small>{event.date}</small><strong>{event.title}</strong><p>{event.sub}</p></Card></div>})}</div>}
 </Page>;
}

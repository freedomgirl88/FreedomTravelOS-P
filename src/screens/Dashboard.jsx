import Card from "../components/Card";
import Page from "../components/Page";
import SectionTitle from "../components/SectionTitle";
import ProgressRing from "../components/ProgressRing";
import StatCard from "../components/StatCard";
import { getDaysUntil } from "../utils/helpers";
import { Plane, Hotel, Wallet, MapPin, Settings, Luggage } from "lucide-react";

export default function Dashboard({ store, setActivePage }) {
  const { trip, packingProgress, remainingSGD, ready } = store;
  const days = getDaysUntil(trip.startDate);
  const hasFlight=Boolean(trip.flight.flightNumber);
  const hasHotel=Boolean(trip.hotel.name);
  return <Page>
    <header className="app-header beta-header"><div><span className="eyebrow">Freedom Travel OS · P Edition</span><h1>{trip.traveller || "Traveller"}</h1></div><span className="status-chip">{days > 0 ? `${days} days` : trip.status}</span></header>
    <Card className="hero-card beta-hero"><div><span className="eyebrow">{trip.tripName}</span><h2>{trip.destination}</h2><p>{trip.startDate} → {trip.endDate}</p><div className="hero-pills"><span>{hasFlight?"Flight added":"Add flight"}</span><span>{hasHotel?"Hotel added":"Add hotel"}</span></div></div><ProgressRing value={ready} label="Ready" /></Card>
    <div className="beta-stat-grid"><StatCard icon="✈️" label="Outbound" value={hasFlight?trip.flight.flightNumber:"Not added"} sub={hasFlight?`${trip.flight.departureDate} · ${trip.flight.departureTime}`:"Tap to add details"} onClick={()=>setActivePage("flight")}/><StatCard icon="🏨" label="Hotel" value={hasHotel?trip.hotel.name:"Not added"} sub={hasHotel?`${trip.hotel.checkInDate} → ${trip.hotel.checkOutDate}`:"Tap to add a stay"} onClick={()=>setActivePage("hotel")}/><StatCard icon="🧳" label="Packing" value={`${packingProgress}%`} sub="Saved checklist" onClick={()=>setActivePage("packing")}/><StatCard icon="💰" label="Budget" value={`${trip.homeCurrency || "SGD"} ${Number(remainingSGD||0).toFixed(0)}`} sub="Remaining" onClick={()=>setActivePage("budget")}/></div>
    <SectionTitle title="Build Your Trip" subtitle="Add the details you need, in any order." />
    <div className="compact-feed"><Card className="feed-item" onClick={()=>setActivePage("flight")}><Plane size={18}/><p>{hasFlight?`${trip.flight.departureCode} → ${trip.flight.arrivalCode}`:"Add outbound and return flight details."}</p></Card><Card className="feed-item" onClick={()=>setActivePage("hotel")}><Hotel size={18}/><p>{hasHotel?trip.hotel.name:"Add your accommodation and check-in details."}</p></Card><Card className="feed-item" onClick={()=>setActivePage("packing")}><Luggage size={18}/><p>Customise your packing checklist.</p></Card></div>
    <SectionTitle title="Quick Actions"/><div className="quick-action-row"><button onClick={()=>setActivePage("explore")}><MapPin size={18}/> Explore</button><button onClick={()=>setActivePage("budget")}><Wallet size={18}/> Budget</button><button onClick={()=>setActivePage("settings")}><Settings size={18}/> Trip Settings</button></div>
  </Page>;
}

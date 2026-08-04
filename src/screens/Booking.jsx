import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ModalSheet from "../components/ModalSheet";
import EmptyState from "../components/EmptyState";
import { money } from "../utils/helpers";
import { PlusCircle, Trash2, TrendingDown, Plane, Hotel, ShieldCheck, ReceiptText } from "lucide-react";

export default function Booking({ store }) {
  const { bookings, addBooking, deleteBooking } = store;
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Hotel"), [title, setTitle] = useState(""), [dateChecked, setDate] = useState(new Date().toISOString().slice(0, 10)), [price, setPrice] = useState(""), [provider, setProvider] = useState("Trip.com"), [stayDates, setStay] = useState(""), [note, setNote] = useState("");
  function submit(e) { e.preventDefault(); if (!title.trim()) return; addBooking({ type, title, dateChecked, priceSGD: price ? Number(price) : "Unknown", provider, stayDates, status: "Manual entry", note }); setTitle(""); setPrice(""); setNote(""); setOpen(false); window.ftosToast?.("Price check saved"); }
  const verified = bookings.filter((b) => typeof b.priceSGD === "number");
  const lowest = verified.length ? [...verified].sort((a, b) => a.priceSGD - b.priceSGD)[0] : null;
  const flightTotal = verified.filter((b) => b.type === "Flight").reduce((s, b) => s + b.priceSGD, 0);
  const hotelTotal = verified.filter((b) => b.type === "Hotel").reduce((s, b) => s + b.priceSGD, 0);
  const sorted = useMemo(() => [...bookings].sort((a, b) => String(b.dateChecked).localeCompare(String(a.dateChecked))), [bookings]);
  const openAddSheet = () => setOpen(true);

  return <Page>
    <header className="app-header"><div><span className="eyebrow">Booking Control</span><h1>Booking</h1></div><span className="status-chip">v1.7</span></header>
    <Card className="booking-hero booking-hero-v5"><div><span className="eyebrow">Lowest verified</span><h2>{lowest ? money(lowest.priceSGD) : "No data"}</h2><p>{lowest ? `${lowest.title} · ${lowest.provider}` : "Add prices to compare."}</p></div><TrendingDown size={30} /></Card>
    <div className="booking-metrics"><Card><Plane size={20}/><small>Flight verified</small><strong>{money(flightTotal)}</strong></Card><Card><Hotel size={20}/><small>Hotel verified</small><strong>{money(hotelTotal)}</strong></Card></div>
    <button className="booking-add-cta" onClick={openAddSheet}><PlusCircle size={18}/> Add Price Check</button>

    <SectionTitle title="Saved Price Checks" subtitle="Only records you add are used for comparison." />
    <Card className="storage verified-card verified-card-v6"><ShieldCheck size={20}/><div><strong>Your data, your records</strong><p>Add quotes or confirmed bookings to build a useful price history for this trip.</p></div></Card>

    <SectionTitle title="Booking Timeline" subtitle="Newest checks first." />
    <div className="booking-timeline">{sorted.length === 0 && <Card className="empty-state-card"><EmptyState icon={ReceiptText} title="No price checks yet" description="Save a flight, hotel or transport quote to compare it later." actionLabel="Add price check" onAction={openAddSheet} /></Card>}{sorted.map((b) => {
      const isMissing = String(b.priceSGD) === "Unknown" || String(b.status).toLowerCase().includes("missing");
      return <Card key={b.id} className={`booking-row booking-row-v5 ${isMissing ? "booking-empty-state" : ""}`}>
        <div className="booking-icon">{b.type === "Flight" ? <Plane size={18}/> : <Hotel size={18}/>}</div>
        <div className="booking-main"><span className="type-chip">{b.type}</span><strong>{isMissing ? "No previous search saved yet" : b.title}</strong><p>{isMissing ? "When you save another hotel, price comparison will appear here." : `${b.dateChecked} · ${b.stayDates} · ${b.provider}`}</p><small>{isMissing ? "This is intentionally marked as unknown, not a real price." : b.note}</small></div>
        <div className="booking-price"><strong>{isMissing ? "Unknown" : money(b.priceSGD)}</strong><p>{isMissing ? "Missing record" : b.status}</p></div>
        <button className="icon-danger" onClick={() => { if (confirm("Delete this booking record?")) { deleteBooking(b.id); window.ftosToast?.("Booking record deleted", "warning"); } }}><Trash2 size={16}/></button>
      </Card>})}</div>

    <ModalSheet title="Add Price Check" open={open} onClose={() => setOpen(false)}>
      <form className="inline-form" onSubmit={submit}>
        <select value={type} onChange={(e) => setType(e.target.value)}><option>Hotel</option><option>Flight</option><option>Package</option><option>Transport</option></select>
        <input placeholder="Name e.g. Central City Hotel" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Date checked" type="date" value={dateChecked} onChange={(e) => setDate(e.target.value)} />
        <input placeholder="Stay / flight dates" value={stayDates} onChange={(e) => setStay(e.target.value)} />
        <input placeholder="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} />
        <input placeholder="Price SGD" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Notes" value={note} onChange={(e) => setNote(e.target.value)} />
        <button><PlusCircle size={16}/> Add Record</button>
      </form>
    </ModalSheet>
  </Page>;
}

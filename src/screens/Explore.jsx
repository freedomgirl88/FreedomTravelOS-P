import { useMemo, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ModalSheet from "../components/ModalSheet";
import {
  MapPin, Heart, CheckCircle2, Navigation, Clock3, Search, Sparkles,
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, CalendarPlus, MoreHorizontal
} from "lucide-react";

const emptyPlace = {
  name: "", category: "Attraction", time: "10:00", duration: "60 min",
  station: "", exit: "", note: "", priority: "Nice to Visit", travelTime: "", reservation: "", bookingRef: ""
};

function getTimeBand(time) {
  const normalized = String(time || "").toLowerCase();
  if (normalized.includes("evening")) return "Evening";
  const hour = Number(String(time || "0").split(":")[0]);
  if (!Number.isFinite(hour)) return "Day Plan";
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

function buildTimelineItems(places) {
  const items = [];
  let lastBand = "";
  places.forEach((place) => {
    const band = getTimeBand(place.time);
    if (band !== lastBand) {
      items.push({ type: "band", id: `band-${band}-${place.id}`, label: band });
      lastBand = band;
    }
    items.push({ type: "place", ...place });
  });
  return items;
}

function DayForm({ initial, onSave, onDelete }) {
  const [form, setForm] = useState(initial);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <form className="sheet-form explore-editor-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
    <label className="field"><span>Day name</span><input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Old Town and food market" required /></label>
    <label className="field"><span>Area</span><input value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. Downtown / Old Town" /></label>
    <label className="field"><span>Summary</span><textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} placeholder="What do you want to do today?" rows="3" /></label>
    <button className="primary-wide" type="submit">Save day</button>
    {onDelete && <button className="danger-button" type="button" onClick={onDelete}><Trash2 size={16}/> Delete day</button>}
  </form>;
}

function PlaceForm({ initial, onSave, onDelete }) {
  const [form, setForm] = useState(initial);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <form className="sheet-form explore-editor-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
    <label className="field"><span>Place name</span><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. City observation deck" required /></label>
    <div className="explore-form-grid">
      <label className="field"><span>Time</span><input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} /></label>
      <label className="field"><span>Duration</span><input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="60 min" /></label>
    </div>
    <div className="explore-form-grid">
      <label className="field"><span>Category</span><select value={form.category} onChange={(e) => set("category", e.target.value)}><option>Attraction</option><option>Shopping</option><option>Food</option><option>Cafe</option><option>Photo Spot</option><option>Event</option><option>Transport</option><option>Hotel</option><option>Others</option></select></label>
      <label className="field"><span>Priority</span><select value={form.priority} onChange={(e) => set("priority", e.target.value)}><option>Must Visit</option><option>Nice to Visit</option><option>Optional</option></select></label>
    </div>
    <label className="field"><span>Nearest station / location</span><input value={form.station} onChange={(e) => set("station", e.target.value)} placeholder="e.g. Central Station" /></label>
    <label className="field"><span>Exit / address</span><input value={form.exit} onChange={(e) => set("exit", e.target.value)} placeholder="e.g. Exit 3 or full address" /></label>
    <div className="explore-form-grid">
      <label className="field"><span>Travel time from previous stop</span><input value={form.travelTime || ""} onChange={(e) => set("travelTime", e.target.value)} placeholder="e.g. 20 min by train" /></label>
      <label className="field"><span>Reservation time</span><input type="time" value={form.reservation || ""} onChange={(e) => set("reservation", e.target.value)} /></label>
    </div>
    <label className="field"><span>Booking reference</span><input value={form.bookingRef || ""} onChange={(e) => set("bookingRef", e.target.value)} placeholder="Optional confirmation number" /></label>
    <label className="field"><span>Notes</span><textarea value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Food to try, photo ideas, booking details..." rows="3" /></label>
    <button className="primary-wide" type="submit">Save place</button>
    {onDelete && <button className="danger-button" type="button" onClick={onDelete}><Trash2 size={16}/> Delete place</button>}
  </form>;
}

export default function Explore({ store }) {
  const {
    days, selectedDay, setSelectedDay, activeDay, activeVisited, exploreProgress,
    visited, favourites, toggleVisited, toggleFavourite,
    addExploreDay, updateExploreDay, deleteExploreDay,
    addExplorePlace, updateExplorePlace, deleteExplorePlace, moveExplorePlace
  } = store;
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [dayEditor, setDayEditor] = useState(null);
  const [placeEditor, setPlaceEditor] = useState(null);

  const saveDay = (form) => {
    if (dayEditor.mode === "new") {
      const created = addExploreDay(form);
      setSelectedDay(created.day);
      window.ftosToast?.("Day created");
    } else {
      updateExploreDay(activeDay.day, form);
      window.ftosToast?.("Day updated");
    }
    setDayEditor(null);
  };

  if (!activeDay) return (
    <Page>
      <header className="app-header">
        <div><span className="eyebrow">Smart Explore</span><h1>Explore</h1></div>
      </header>

      <Card className="empty-card explore-empty-main">
        <CalendarPlus size={30} />
        <h2>Create your first day</h2>
        <p>Start with a blank itinerary and build your day around the places you want to visit.</p>
        <button
          className="primary-wide"
          type="button"
          onClick={() => setDayEditor({ mode: "new", data: { title: "Day 1", area: "", summary: "" } })}
        >
          <Plus size={17}/> Create day
        </button>
      </Card>

      <ModalSheet title="Create Day" open={Boolean(dayEditor)} onClose={() => setDayEditor(null)}>
        {dayEditor && <DayForm initial={dayEditor.data} onSave={saveDay} />}
      </ModalSheet>
    </Page>
  );

  const categories = ["All", "Must Visit", "Favourites", ...new Set(activeDay.places.map((place) => place.category).filter(Boolean))];
  const filteredPlaces = useMemo(() => activeDay.places.filter((place) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || [place.name, place.category, place.priority, place.station, place.exit, place.note, place.travelTime, place.bookingRef].join(" ").toLowerCase().includes(q);
    const matchesFilter = filter === "All" || (filter === "Must Visit" ? place.priority === "Must Visit" : filter === "Favourites" ? favourites.includes(place.id) : place.category === filter);
    return matchesQuery && matchesFilter;
  }), [activeDay, filter, favourites, query]);
  const mustVisit = activeDay.places.filter((place) => place.priority === "Must Visit").length;
  const timelineItems = useMemo(() => buildTimelineItems(filteredPlaces), [filteredPlaces]);

  const savePlace = (form) => {
    if (placeEditor.mode === "new") {
      addExplorePlace(activeDay.day, form);
      window.ftosToast?.("Place added");
    } else {
      updateExplorePlace(activeDay.day, placeEditor.data.id, form);
      window.ftosToast?.("Place updated");
    }
    setPlaceEditor(null);
  };

  return (
    <Page>
      <header className="app-header explore-header-actions">
        <div><span className="eyebrow">Smart Explore</span><h1>Explore</h1></div>
        <button className="status-chip editable-chip" onClick={() => setDayEditor({ mode: "edit", data: activeDay })}><Pencil size={14}/> Day {activeDay.day}</button>
      </header>

      <Card className="explore-hero explore-hero-v5">
        <div>
          <span className="eyebrow">{activeDay.area || "Not planned yet"}</span>
          <h2>{activeDay.title || `Day ${activeDay.day}`}</h2>
          <p>{activeDay.summary || "Add places whenever you are ready. Your plan stays editable."}</p>
          <div className="hero-pills"><span>{activeVisited}/{activeDay.places.length} visited</span><span>{mustVisit} must visit</span></div>
        </div>
        <Navigation size={30} />
      </Card>

      <div className="day-tabs-wrap">
        <div className="tabs day-tabs">{days.map((day) => <button key={day.id || day.day} className={day.day === selectedDay ? "active" : ""} onClick={() => { setSelectedDay(day.day); setFilter("All"); setQuery(""); }}>Day {day.day}</button>)}</div>
        <button className="day-add-button" aria-label="Add day" onClick={() => setDayEditor({ mode: "new", data: { title: `Day ${days.length + 1}`, area: "", summary: "" } })}><Plus size={18}/></button>
      </div>

      <Card className="explore-control-card">
        <div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved places" /></div>
        {activeDay.places.length > 0 && <div className="filter-row">{categories.map((category) => <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>{category}</button>)}</div>}
      </Card>

      <Card className="progress-card-v5">
        <div className="progress-head"><div><strong>{exploreProgress}% completed</strong><p>{activeDay.title}</p></div><span>{activeVisited}/{activeDay.places.length}</span></div>
        <div className="bar"><span style={{ width: `${exploreProgress}%` }} /></div>
      </Card>

      <div className="section-title-row">
        <SectionTitle title="Timeline" subtitle={`${filteredPlaces.length} ${filteredPlaces.length === 1 ? "place" : "places"} shown`} />
        <button className="inline-add-button" onClick={() => setPlaceEditor({ mode: "new", data: { ...emptyPlace } })}><Plus size={17}/> Add place</button>
      </div>

      <div className="list timeline-list">{timelineItems.map((item) => {
        if (item.type === "band") return <div className="time-band" key={item.id}><span>{item.label}</span></div>;
        const place = item;
        const index = activeDay.places.findIndex((saved) => saved.id === place.id);
        const isVisited = visited.includes(place.id), isFavourite = favourites.includes(place.id);
        return <Card key={place.id} className={isVisited ? "place-card place-card-v5 visited" : "place-card place-card-v5"}>
          <div className="place-time"><span>{place.time || "Anytime"}</span></div>
          <div>
            <div className="place-title"><strong>{place.name}</strong><div className="place-title-actions"><button aria-label="Edit place" className="heart edit-place-button" onClick={() => setPlaceEditor({ mode: "edit", data: place })}><Pencil size={17}/></button><button aria-label="Favourite" className={isFavourite ? "heart active" : "heart"} onClick={() => { toggleFavourite(place.id); window.ftosToast?.(isFavourite ? "Removed from favourites" : "Added to favourites"); }}><Heart size={18} fill={isFavourite ? "currentColor" : "none"} /></button></div></div>
            <div className="chips"><span>{place.category}</span><span>{place.priority}</span>{isVisited && <span>Visited</span>}</div>
            <div className="place-meta-grid"><p><MapPin size={14} /> {place.station || "Location not added"}{place.exit ? ` · ${place.exit}` : ""}</p><p><Clock3 size={14} /> {place.duration || "Flexible"}</p></div>
            {(place.travelTime || place.reservation || place.bookingRef) && <div className="explore-booking-strip">{place.travelTime && <span>Route: {place.travelTime}</span>}{place.reservation && <span>Reserved {place.reservation}</span>}{place.bookingRef && <span>Ref: {place.bookingRef}</span>}</div>}
            {place.note && <small>{place.note}</small>}
            <div className="actions place-actions"><button onClick={() => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([place.name, place.station, place.exit].filter(Boolean).join(" "))}`, "_blank"); window.ftosToast?.("Opening map"); }}>Map</button><button onClick={() => { navigator.clipboard?.writeText(place.name); window.ftosToast?.("Place copied"); }}>Copy</button><button onClick={() => { toggleVisited(place.id); window.ftosToast?.(isVisited ? "Marked as not visited" : "Marked as visited"); }}><CheckCircle2 size={15} /> {isVisited ? "Done" : "Mark"}</button><span className="reorder-actions"><button aria-label="Move up" disabled={index <= 0} onClick={() => moveExplorePlace(activeDay.day, place.id, -1)}><ChevronUp size={16}/></button><button aria-label="Move down" disabled={index >= activeDay.places.length - 1} onClick={() => moveExplorePlace(activeDay.day, place.id, 1)}><ChevronDown size={16}/></button></span></div>
          </div>
        </Card>})}
        {activeDay.places.length === 0 && <Card className="empty-card explore-empty-day"><Sparkles size={24}/><h3>This day is open</h3><p>Add your first place when you decide what you want to do.</p><button className="primary-wide" onClick={() => setPlaceEditor({ mode: "new", data: { ...emptyPlace } })}><Plus size={17}/> Add first place</button></Card>}
        {activeDay.places.length > 0 && filteredPlaces.length === 0 && <Card className="empty-card"><Sparkles size={20}/><p>No matching places. Try another search or filter.</p></Card>}
      </div>

      <ModalSheet title={dayEditor?.mode === "new" ? "Create Day" : "Edit Day"} open={Boolean(dayEditor)} onClose={() => setDayEditor(null)}>
        {dayEditor && <DayForm initial={dayEditor.data} onSave={saveDay} onDelete={dayEditor.mode === "edit" && days.length > 1 ? () => { if (window.confirm(`Delete Day ${activeDay.day} and all its places?`)) { deleteExploreDay(activeDay.day); setDayEditor(null); window.ftosToast?.("Day deleted"); } } : null} />}
      </ModalSheet>

      <ModalSheet title={placeEditor?.mode === "new" ? "Add Place" : "Edit Place"} open={Boolean(placeEditor)} onClose={() => setPlaceEditor(null)}>
        {placeEditor && <PlaceForm initial={placeEditor.data} onSave={savePlace} onDelete={placeEditor.mode === "edit" ? () => { if (window.confirm(`Delete ${placeEditor.data.name}?`)) { deleteExplorePlace(activeDay.day, placeEditor.data.id); setPlaceEditor(null); window.ftosToast?.("Place deleted"); } } : null} />}
      </ModalSheet>
    </Page>
  );
}

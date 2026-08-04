import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const hasText = (value) => Boolean(String(value || "").trim());

export default function TripHealth({ store, setActivePage }) {
  const { trip, packing, packingProgress, remainingSGD, bookings, days } = store;

  const flightFields = [
    trip.flight?.flightNumber,
    trip.flight?.departureDate,
    trip.flight?.departureTime,
    trip.returnFlight?.flightNumber,
    trip.returnFlight?.departureDate,
    trip.returnFlight?.departureTime,
  ];
  const flightScore = (flightFields.filter(hasText).length / flightFields.length) * 100;

  const hotelFields = [
    trip.packageHotel?.name,
    trip.packageHotel?.checkInDate,
    trip.hotel?.name,
    trip.hotel?.checkInDate,
    trip.hotel?.checkOutDate,
    trip.hotel?.addressEnglish,
  ];
  const hotelScore = (hotelFields.filter(hasText).length / hotelFields.length) * 100;

  const criticalDocumentNames = ["passport", "flight ticket", "hotel booking", "concert ticket", "travel insurance"];
  const documentItems = criticalDocumentNames.map((name) => packing.find((item) => item.label?.toLowerCase() === name));
  const documentsScore = (documentItems.filter((item) => item?.packed).length / criticalDocumentNames.length) * 100;

  const budgetSignals = [remainingSGD > 0, Number(trip.totalBudgetSGD) > 0, Number(trip.exchangeRate) > 0, Boolean(trip.exchangeRateUpdatedAt)];
  const budgetScore = (budgetSignals.filter(Boolean).length / budgetSignals.length) * 100;

  const plannedDays = (days || []).filter((day) => (day.places || []).length > 0).length;
  const exploreScore = days?.length ? clamp((plannedDays / Math.min(days.length, 3)) * 100) : 0;

  const categories = [
    { label: "Flights confirmed", score: flightScore, weight: 25, action: "flight" },
    { label: "Hotels confirmed", score: hotelScore, weight: 20, action: "hotel" },
    { label: "Travel documents", score: documentsScore, weight: 20, action: "packing" },
    { label: "Packing progress", score: packingProgress, weight: 15, action: "packing" },
    { label: "Budget & live rate", score: budgetScore, weight: 10, action: "budget" },
    { label: "Explore plan started", score: exploreScore, weight: 10, action: "explore" },
  ];

  const score = Math.round(categories.reduce((total, item) => total + (clamp(item.score) * item.weight) / 100, 0));
  const completed = categories.filter((item) => item.score >= 75).length;
  const topMissing = categories.filter((item) => item.score < 75).sort((a, b) => a.score - b.score).slice(0, 2);

  return (
    <section className="trip-health-card">
      <div className="health-head">
        <div>
          <span className="eyebrow">Smart Trip Health</span>
          <h2>{score >= 90 ? "Trip Ready" : score >= 70 ? "Almost Ready" : "Needs Attention"}</h2>
          <p>Weighted by flights, hotels, documents, packing, budget and Explore.</p>
        </div>
        <div className="health-score"><strong>{score}%</strong><span>ready</span></div>
      </div>
      <div className="health-meter"><span style={{ width: `${score}%` }} /></div>
      <div className="health-list">
        {categories.slice(0, 4).map((item) => {
          const ok = item.score >= 75;
          return (
            <button key={item.label} onClick={() => setActivePage(item.action)} className={ok ? "ok" : "todo"}>
              {ok ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}<span>{item.label}</span><small>{Math.round(item.score)}%</small>
            </button>
          );
        })}
      </div>
      {topMissing.length > 0
        ? <p className="health-hint"><AlertTriangle size={15}/> Next: {topMissing.map((item) => item.label).join(" · ")}</p>
        : <p className="health-hint good"><ShieldCheck size={15}/> All important trip areas look ready.</p>}
      <p className="health-method">{completed}/6 categories are at least 75% complete.</p>
    </section>
  );
}

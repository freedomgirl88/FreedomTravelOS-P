import { useLocalStorage } from "./useLocalStorage";
import { defaultTrip, defaultPacking, defaultExpenses, defaultExploreDays, defaultBookingHistory } from "../data/defaults";
import { krwToSgd, pct, uid } from "../utils/helpers";

const WORKSPACE_KEY = "ftos-p-workspace-v1";
const LEGACY_KEYS = {
  trip: "ftos-public-trip-v1",
  packing: "ftos-public-packing-v1",
  expenses: "ftos-public-expenses-v1",
  days: "ftos-public-days-v1",
  selectedDay: "ftos-public-selected-day-v1",
  visited: "ftos-public-visited-v1",
  favourites: "ftos-public-fav-v1",
  bookings: "ftos-public-bookings-v1",
  memories: "ftos-public-memories-v1"
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const readLegacy = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : clone(fallback); }
  catch { return clone(fallback); }
};

function createTripRecord(tripData = {}) {
  const id = tripData.id || uid("trip");
  return {
    id,
    createdAt: tripData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trip: { ...clone(defaultTrip), ...tripData, id, isConfigured: Boolean(tripData.isConfigured) },
    packing: clone(defaultPacking),
    expenses: clone(defaultExpenses),
    days: clone(defaultExploreDays),
    selectedDay: 1,
    visited: [],
    favourites: [],
    bookings: clone(defaultBookingHistory),
    memories: []
  };
}

function initialWorkspace() {
  try {
    const existing = localStorage.getItem(WORKSPACE_KEY);
    if (existing) return JSON.parse(existing);

    const legacyTrip = readLegacy(LEGACY_KEYS.trip, defaultTrip);
    if (legacyTrip?.isConfigured) {
      const record = createTripRecord(legacyTrip);
      record.packing = readLegacy(LEGACY_KEYS.packing, defaultPacking);
      record.expenses = readLegacy(LEGACY_KEYS.expenses, defaultExpenses);
      record.days = readLegacy(LEGACY_KEYS.days, defaultExploreDays);
      record.selectedDay = readLegacy(LEGACY_KEYS.selectedDay, 1);
      record.visited = readLegacy(LEGACY_KEYS.visited, []);
      record.favourites = readLegacy(LEGACY_KEYS.favourites, []);
      record.bookings = readLegacy(LEGACY_KEYS.bookings, defaultBookingHistory);
      record.memories = readLegacy(LEGACY_KEYS.memories, []);
      return { version: 1, activeTripId: record.id, trips: [record] };
    }
  } catch {}
  return { version: 1, activeTripId: null, trips: [] };
}

export function useTripStore(){
  const [workspace,setWorkspace]=useLocalStorage(WORKSPACE_KEY, initialWorkspace());
  const activeRecord = workspace.trips.find(item => item.id === workspace.activeTripId) || null;
  const emptyRecord = createTripRecord();
  const record = activeRecord || emptyRecord;
  const { trip, packing, expenses, days, selectedDay, visited, favourites, bookings, memories } = record;

  const updateActive = (updater) => setWorkspace(current => ({
    ...current,
    trips: current.trips.map(item => item.id === current.activeTripId
      ? { ...updater(item), updatedAt: new Date().toISOString() }
      : item)
  }));

  const packed=packing.filter(i=>i.packed).length;
  const packingProgress=pct((packed/Math.max(packing.length,1))*100);
  const spentSGD=expenses.reduce((sum,e)=>sum+krwToSgd(e.amountKRW,e.rateUsed||trip.exchangeRate),0);
  const remainingSGD=Number((Number(trip.totalBudgetSGD||0)-spentSGD).toFixed(2));
  const activeDay=days.find(d=>d.day===selectedDay)||days[0];
  const activeVisited=activeDay?.places.filter(p=>visited.includes(p.id)).length||0;
  const exploreProgress=pct((activeVisited/Math.max(activeDay?.places.length||0,1))*100);
  const ready=pct(packingProgress*.5+exploreProgress*.25+(trip.flight?.flightNumber?15:0)+(trip.hotel?.name?10:0));

  const createTrip=(data)=>{
    const newRecord=createTripRecord({...data,isConfigured:true,status:"Planning"});
    setWorkspace(current=>({...current,activeTripId:newRecord.id,trips:[...current.trips,newRecord]}));
    return newRecord.id;
  };
  const switchTrip=(id)=>setWorkspace(current=>current.trips.some(item=>item.id===id)?{...current,activeTripId:id}:current);
  const deleteTrip=(id)=>setWorkspace(current=>{
    const trips=current.trips.filter(item=>item.id!==id);
    const activeTripId=current.activeTripId===id?(trips[0]?.id||null):current.activeTripId;
    return {...current,trips,activeTripId};
  });
  const updateTripField=(k,v)=>updateActive(item=>({...item,trip:{...item.trip,[k]:v}}));
  const updateFlightField=(k,v)=>updateActive(item=>({...item,trip:{...item.trip,flight:{...item.trip.flight,[k]:v}}}));
  const updateHotelField=(k,v)=>updateActive(item=>({...item,trip:{...item.trip,hotel:{...item.trip.hotel,[k]:v}}}));
  const updateReturnFlightField=(k,v)=>updateActive(item=>({...item,trip:{...item.trip,returnFlight:{...item.trip.returnFlight,[k]:v}}}));
  const togglePacking=id=>updateActive(item=>({...item,packing:item.packing.map(i=>i.id===id?{...i,packed:!i.packed}:i)}));
  const addPackingItem=value=>updateActive(item=>({...item,packing:[...item.packing,{id:uid("pack"),packed:false,...value}]}));
  const updatePackingItem=(id,updates)=>updateActive(item=>({...item,packing:item.packing.map(i=>i.id===id?{...i,...updates}:i)}));
  const deletePackingItem=id=>updateActive(item=>({...item,packing:item.packing.filter(i=>i.id!==id)}));
  const addExpense=e=>updateActive(item=>({...item,expenses:[...item.expenses,{id:uid("expense"),...e}]}));
  const deleteExpense=id=>updateActive(item=>({...item,expenses:item.expenses.filter(e=>e.id!==id)}));
  const setSelectedDay=value=>updateActive(item=>({...item,selectedDay:value}));
  const toggleVisited=id=>updateActive(item=>({...item,visited:item.visited.includes(id)?item.visited.filter(x=>x!==id):[...item.visited,id]}));
  const toggleFavourite=id=>updateActive(item=>({...item,favourites:item.favourites.includes(id)?item.favourites.filter(x=>x!==id):[...item.favourites,id]}));
  const addBooking=b=>updateActive(item=>({...item,bookings:[...item.bookings,{id:uid("booking"),...b}]}));
  const deleteBooking=id=>updateActive(item=>({...item,bookings:item.bookings.filter(b=>b.id!==id)}));
  const addMemory=m=>updateActive(item=>({...item,memories:[...item.memories,{id:uid("memory"),date:m.date||new Date().toISOString().slice(0,10),favourite:false,...m}]}));
  const updateMemory=(id,updates)=>updateActive(item=>({...item,memories:item.memories.map(m=>m.id===id?{...m,...updates}:m)}));
  const toggleMemoryFavourite=id=>updateActive(item=>({...item,memories:item.memories.map(m=>m.id===id?{...m,favourite:!m.favourite}:m)}));
  const deleteMemory=id=>updateActive(item=>({...item,memories:item.memories.filter(m=>m.id!==id)}));

  const normalizeDays=(next)=>next.map((day,index)=>({...day,day:index+1,id:day.id||uid("day")}));
  const addExploreDay=(data)=>{
    const created={id:uid("day"),day:days.length+1,title:data.title?.trim()||`Day ${days.length+1}`,area:data.area?.trim()||"Not planned yet",summary:data.summary?.trim()||"Add places whenever you are ready.",places:[]};
    updateActive(item=>({...item,days:[...item.days,created],selectedDay:created.day}));
    return created;
  };
  const updateExploreDay=(dayNumber,data)=>updateActive(item=>({...item,days:item.days.map(day=>day.day===dayNumber?{...day,title:data.title?.trim()||day.title,area:data.area?.trim()||"Not planned yet",summary:data.summary?.trim()||"Add places whenever you are ready."}:day)}));
  const deleteExploreDay=(dayNumber)=>updateActive(item=>{
    const removed=item.days.find(day=>day.day===dayNumber);
    const removedIds=removed?.places.map(place=>place.id)||[];
    const next=normalizeDays(item.days.filter(day=>day.day!==dayNumber));
    return {...item,days:next,visited:item.visited.filter(id=>!removedIds.includes(id)),favourites:item.favourites.filter(id=>!removedIds.includes(id)),selectedDay:Math.min(dayNumber,next.length)||1};
  });
  const addExplorePlace=(dayNumber,data)=>updateActive(item=>({...item,days:item.days.map(day=>day.day===dayNumber?{...day,places:[...day.places,{id:uid("place"),...data,name:data.name.trim()}]}:day)}));
  const updateExplorePlace=(dayNumber,placeId,data)=>updateActive(item=>({...item,days:item.days.map(day=>day.day===dayNumber?{...day,places:day.places.map(place=>place.id===placeId?{...place,...data,name:data.name.trim()}:place)}:day)}));
  const deleteExplorePlace=(dayNumber,placeId)=>updateActive(item=>({...item,days:item.days.map(day=>day.day===dayNumber?{...day,places:day.places.filter(place=>place.id!==placeId)}:day),visited:item.visited.filter(id=>id!==placeId),favourites:item.favourites.filter(id=>id!==placeId)}));
  const moveExplorePlace=(dayNumber,placeId,direction)=>updateActive(item=>({...item,days:item.days.map(day=>{
    if(day.day!==dayNumber)return day;
    const places=[...day.places]; const from=places.findIndex(place=>place.id===placeId); const to=from+direction;
    if(from<0||to<0||to>=places.length)return day;
    [places[from],places[to]]=[places[to],places[from]]; return {...day,places};
  })}));

  const resetActiveTrip=()=>activeRecord&&updateActive(item=>({...createTripRecord({...clone(defaultTrip),id:item.id}),id:item.id}));
  const resetAll=()=>setWorkspace({version:1,activeTripId:null,trips:[]});

  return {workspace,trips:workspace.trips.map(({id,trip,updatedAt})=>({id,trip,updatedAt})),activeTripId:workspace.activeTripId,hasTrips:workspace.trips.length>0,trip,packing,expenses,days,selectedDay,setSelectedDay,visited,favourites,bookings,memories,packed,packingProgress,spentSGD,remainingSGD,activeDay,activeVisited,exploreProgress,ready,createTrip,switchTrip,deleteTrip,updateTripField,updateFlightField,updateHotelField,updateReturnFlightField,togglePacking,addPackingItem,updatePackingItem,deletePackingItem,addExpense,deleteExpense,toggleVisited,toggleFavourite,addBooking,deleteBooking,addMemory,updateMemory,toggleMemoryFavourite,deleteMemory,addExploreDay,updateExploreDay,deleteExploreDay,addExplorePlace,updateExplorePlace,deleteExplorePlace,moveExplorePlace,resetActiveTrip,resetAll};
}

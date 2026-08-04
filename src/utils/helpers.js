export const uid = (p="id") => `${p}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
export function getDaysUntil(dateString){const today=new Date();const target=new Date(dateString+"T00:00:00");today.setHours(0,0,0,0);return Math.max(0,Math.ceil((target-today)/(1000*60*60*24)))}
export function krwToSgd(krw,rate){const safeRate=Number(rate);if(!Number.isFinite(safeRate)||safeRate<=0)return 0;return Number((Number(krw||0)/safeRate).toFixed(2))}
export function pct(value){return Math.max(0,Math.min(100,Math.round(value||0)))}
export function money(v){return typeof v === "number" ? `S$${v.toFixed(2)}` : v}

export function combineDateTime(dateString,timeString="00:00"){
  if(!dateString)return null;
  const value=new Date(`${dateString}T${timeString||"00:00"}:00`);
  return Number.isNaN(value.getTime())?null:value;
}
export function formatFlightCountdown(dateString,timeString){
  const target=combineDateTime(dateString,timeString);
  if(!target)return {label:"Date not set",tone:"neutral",minutes:null};
  const minutes=Math.round((target-Date.now())/60000);
  if(minutes < -180)return {label:"Departed",tone:"muted",minutes};
  if(minutes < 0)return {label:"Departing now",tone:"danger",minutes};
  if(minutes <= 60)return {label:`${minutes} min to departure`,tone:"danger",minutes};
  if(minutes <= 24*60)return {label:`${Math.floor(minutes/60)}h ${minutes%60}m to departure`,tone:"warning",minutes};
  const days=Math.ceil(minutes/1440);
  return {label:`${days} day${days===1?"":"s"} to flight`,tone:"live",minutes};
}
export function subtractHours(dateString,timeString,hours){
  const value=combineDateTime(dateString,timeString);
  if(!value)return null;
  value.setHours(value.getHours()-Number(hours||0));
  return value;
}
export function formatDateTime(value){
  if(!value)return "Not set";
  return new Intl.DateTimeFormat(undefined,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(value);
}

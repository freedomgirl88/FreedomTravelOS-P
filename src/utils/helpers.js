export const uid = (p="id") => `${p}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
export function getDaysUntil(dateString){const today=new Date();const target=new Date(dateString+"T00:00:00");today.setHours(0,0,0,0);return Math.max(0,Math.ceil((target-today)/(1000*60*60*24)))}
export function krwToSgd(krw,rate){return Number((Number(krw||0)/Number(rate||1)).toFixed(2))}
export function pct(value){return Math.max(0,Math.min(100,Math.round(value||0)))}
export function money(v){return typeof v === "number" ? `S$${v.toFixed(2)}` : v}

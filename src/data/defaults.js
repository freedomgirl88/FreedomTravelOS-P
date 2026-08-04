export const emptyFlight = {
  airline:"", flightNumber:"", departureCode:"", arrivalCode:"", departureAirport:"", arrivalAirport:"", departureDate:"", departureTime:"", arrivalDate:"", arrivalTime:"", boardingTime:"", terminal:"", gate:"", seat:"", carryOn:"", checked:"", status:"Scheduled", statusNote:"", statusUpdatedAt:"", checkInOpensHours:48, airportTargetTime:"", leaveByTime:"", leaveFrom:"", airportTimingMode:"recommended", airportBufferMinutes:180, manualLeaveTime:""
};

export const emptyHotel = {
  name:"", status:"Not booked", rating:"", area:"", addressEnglish:"", addressKorean:"", checkInDate:"", checkOutDate:"", checkInTime:"15:00", checkOutTime:"11:00", nearestStation:"", stationWalk:"", room:"", paidPriceSGD:"", cancellation:""
};

export const defaultTrip = {
  isConfigured:false,
  traveller:"",
  tripName:"",
  destination:"",
  startDate:"",
  endDate:"",
  status:"Planning",
  homeCurrency:"SGD",
  travelCurrency:"USD",
  exchangeRate:null,
  exchangeRateMode:"live",
  marketExchangeRate:null,
  marketExchangeRateUpdatedAt:"",
  trustExchangeRate:null,
  trustExchangeRateUpdatedAt:"",
  youtripExchangeRate:null,
  youtripExchangeRateUpdatedAt:"",
  manualExchangeRate:null,
  manualExchangeRateUpdatedAt:"",
  exchangeRateUpdatedAt:"",
  exchangeRateDate:"",
  exchangeRateSourceDetail:"",
  totalBudgetSGD:0,
  flight:{...emptyFlight},
  returnFlight:{...emptyFlight},
  packageHotel:{...emptyHotel},
  hotel:{...emptyHotel}
};

export const defaultPacking = [
  ["passport","Passport","Documents",false,""],
  ["flight","Flight booking","Documents",false,""],
  ["hotel","Hotel booking","Documents",false,""],
  ["insurance","Travel insurance","Documents",false,""],
  ["phone","Phone","Electronics",false,""],
  ["powerbank","Power bank","Electronics",false,""],
  ["adapter","Travel adapter","Electronics",false,""]
].map(([id,label,category,packed,meta])=>({id,label,category,packed,meta,quantity:1,weightKg:0,toBuy:false,essential:["passport","flight","hotel","insurance"].includes(id)}));

export const defaultExpenses = [];
export const defaultBookingHistory = [];
export const defaultExploreDays = [];
export const defaultReminders = [];

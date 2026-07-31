const LABELS = {
  flightNumber: "Flight Number",
  departureCode: "Departure Code",
  arrivalCode: "Arrival Code",
  departureAirport: "Departure Airport",
  arrivalAirport: "Arrival Airport",
  departureDate: "Departure Date",
  departureTime: "Departure Time",
  arrivalDate: "Arrival Date",
  arrivalTime: "Arrival Time",
  carryOn: "Carry-on",
  airportTargetTime: "Airport Target Time",
  leaveByTime: "Leave By Time",
  leaveFrom: "Leave From",
  addressEnglish: "Address (English)",
  addressKorean: "Address (Korean)",
  checkInDate: "Check-in Date",
  checkOutDate: "Check-out Date",
  checkInTime: "Check-in Time",
  checkOutTime: "Check-out Time",
  nearestStation: "Nearest Station",
  stationWalk: "Walking Distance",
  paidPriceSGD: "Paid Price (SGD)",
};

export function fieldLabel(key) {
  if (LABELS[key]) return LABELS[key];
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

export const APP_VERSION = "0.10.0";

export const RELEASES = [
  {
    version: "0.10.0",
    date: "2026-08-04",
    title: "Public Quality RC1",
    highlights: [
      "Fixed the Packing Add Item action",
      "Rebuilt Packing controls for reliable mobile taps and alignment",
      "Redesigned Travel Documents and Reminders forms",
      "Improved responsive spacing, date and time inputs, and action buttons"
    ]
  },
  {
    version: "0.9.0",
    date: "2026-08-04",
    title: "Explore Pro & UI Polish",
    highlights: [
      "Fixed Smart Packing add-item alignment on mobile",
      "Touch-friendly Essential and Need to buy controls",
      "Travel-time and reservation details for itinerary places",
      "Booking references shown directly in Explore"
    ]
  },
  {
    version: "0.8.0",
    date: "2026-08-04",
    title: "Smart Packing 2.0",
    highlights: ["Packing templates", "Quantity and weight tracking", "Shopping and missing-item filters", "Category progress and duplicate protection"]
  },
  {
    version: "0.7.0",
    title: "Flight Status & Countdown",
    date: "2026-08-04",
    highlights: [
      "Flight countdowns on the Dashboard and Flight screen",
      "Manual status updates for delays, boarding and gate changes",
      "Boarding-pass details with boarding time, gate and seat",
      "Calculated check-in, airport, boarding, departure and arrival timeline"
    ]
  },
  {
    version: "0.6.0",
    title: "Smart Travel Essentials",
    date: "2026-08-04",
    highlights: [
      "Travel Documents with references and expiry dates",
      "Emergency contacts with one-tap calling",
      "Automatic timeline for flights, hotels, plans and reminders",
      "Trip-specific local storage for all new information"
    ]
  },
  {
    version: "0.5.0",
    title: "Premium Experience",
    date: "2026-08-04",
    highlights: [
      "One-tap update notifications for installed apps",
      "A What's New screen after each release",
      "Updates wait while you are typing or editing",
      "Release notes and feedback tools inside the app",
      "Smoother update and startup experience"
    ]
  },
  {
    version: "0.4.0",
    title: "Public Foundation",
    date: "2026-08-03",
    highlights: [
      "Trip-specific reminders",
      "Editable flights and hotel details",
      "Multi-trip local storage foundation",
      "Public trip data with no personal Korea information"
    ]
  },
  {
    version: "0.3.0",
    title: "Vercel Foundation",
    date: "2026-08-03",
    highlights: [
      "Clean Vite deployment setup",
      "Independent FTOS P identity",
      "Installable iPhone and Android PWA"
    ]
  }
];

export const CURRENT_RELEASE = RELEASES[0];

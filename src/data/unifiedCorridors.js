// UNIFIED CORRIDORS & POLYLINES ACROSS INDIA
// Separate road highways from verified Indian Railways Broad Gauge track corridors
// Distinct colors & dashed styling

import { MASTER_CORRIDORS } from "./masterCorridors.js";
import { ROUTE_CORRIDORS } from "./routeCorridors.js";

export const UNIFIED_CORRIDORS = {
  // 1. All-India Grand Pan-India Highway Loop
  allIndiaHighway: {
    name: "Pan-India Grand Circuit Highway (NH19, NH35, NH46, NH52, NH44, NH48, ECR)",
    color: "#f59e0b",
    weight: 4.5,
    opacity: 0.9,
    dashArray: "10, 6",
    points: [
      // North & Central
      [25.3176, 82.9739], // Varanasi
      [25.4358, 81.8463], // Prayagraj
      [25.8617, 81.6025], // Mangarh
      [25.1764, 80.8687], // Chitrakoot
      [25.1611, 82.5028], // Vindhyachal / Mirzapur
      [24.2676, 80.7583], // Maihar
      [23.1815, 79.9864], // Jabalpur
      [23.2599, 77.4126], // Bhopal
      [23.1765, 75.7885], // Ujjain
      [22.7196, 75.8577], // Indore
      [22.2458, 76.1511], // Omkareshwar
      [22.1764, 75.5833], // Maheshwar
      [19.9975, 73.7898], // Nashik
      [19.9322, 73.5308], // Trimbakeshwar
      [27.5056, 77.6694], // Mathura
      [27.5706, 77.6596], // Vrindavan
      [27.4958, 77.4642], // Govardhan
      [27.6472, 77.3756], // Barsana
      [27.7125, 77.3853], // Nandgaon
      [27.1767, 78.0081], // Agra
      [27.3639, 75.3054], // Khatu Shyam Ji
      [26.9124, 75.7873], // Jaipur
      // South India Grand Loop connection via NH44
      [21.1458, 79.0882], // Nagpur Gateway
      [17.3850, 78.4867], // Hyderabad
      [13.6288, 79.4192], // Tirupati
      [13.0827, 80.2707], // Chennai
      [12.6269, 80.1927], // Mahabalipuram
      [11.9416, 79.8083], // Puducherry
      [10.7870, 79.1378], // Thanjavur
      [10.7905, 78.7047], // Tiruchirappalli
      [9.9252, 78.1198],  // Madurai
      [9.2876, 79.3129],  // Rameswaram
      [8.0883, 77.5385],  // Kanyakumari
      [10.0889, 77.0595], // Munnar
      [9.6031, 77.1615],  // Thekkady
      [9.4981, 76.3388],  // Alleppey
      [9.9312, 76.2673],  // Kochi
      [11.4102, 76.6950], // Ooty
      [12.2958, 76.6394], // Mysuru
      [12.9716, 77.5946], // Bengaluru
      [25.3176, 82.9739]  // Return to Varanasi
    ]
  },

  // 2. North-Central-West Master Highway
  masterHighway: MASTER_CORRIDORS.primaryRoad,

  // 3. South India Grand Loop Highway
  southHighway: {
    name: "South India Grand Highway Circuit",
    color: "#3b82f6",
    weight: 4.5,
    opacity: 0.9,
    dashArray: "10, 6",
    points: ROUTE_CORRIDORS.grandLoop.map(p => [p.lat, p.lng])
  },

  // 4. Verified Railway Corridors (Cyan dashed lines - visually completely distinct)
  railways: [
    ...(MASTER_CORRIDORS.railways || []),
    ...(ROUTE_CORRIDORS.railCorridors || [])
  ],

  // 5. Optional Detour Corridors
  optionalDetours: [
    ...(MASTER_CORRIDORS.optionalDetours || []),
    {
      id: "detour_agra",
      name: "Agra Mughal Heritage Detour (Mathura ➔ Agra ➔ Bharatpur)",
      color: "#ec4899",
      weight: 4,
      points: [
        [27.5056, 77.6694], // Mathura
        [27.1767, 78.0081], // Agra Cantt / Taj
        [27.0945, 77.6679], // Fatehpur Sikri
        [27.2173, 77.4900]  // Bharatpur
      ]
    },
    {
      id: "detour_dhanushkodi",
      name: "Dhanushkodi Ocean Road Detour (NH-87 Arichal Munai)",
      color: "#ec4899",
      weight: 4,
      points: [
        [9.2876, 79.3129], // Rameswaram
        [9.1772, 79.4184], // Dhanushkodi Ghost Town
        [9.1550, 79.4450]  // Arichal Munai
      ]
    }
  ]
};

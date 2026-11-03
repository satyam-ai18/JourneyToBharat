// Route corridors and polyline coordinates for Varanasi -> Vindhyachal -> Maihar -> MP -> Nashik

export const MP_NASHIK_CORRIDORS = {
  // Master proposed highway route connecting all 13 destinations
  mainRoute: [
    { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
    { name: "Mirzapur", lat: 25.1337, lng: 82.5644 },
    { name: "Vindhyachal", lat: 25.1633, lng: 82.4988 },
    { name: "Prayagraj bypass", lat: 25.4358, lng: 81.8463 },
    { name: "Rewa / Satna", lat: 24.5825, lng: 80.8322 },
    { name: "Maihar", lat: 24.2690, lng: 80.7570 },
    { name: "Katni", lat: 23.8343, lng: 80.3989 },
    { name: "Jabalpur", lat: 23.1815, lng: 79.9864 },
    { name: "Narsinghpur", lat: 22.9465, lng: 79.1985 },
    { name: "Pipariya", lat: 22.7585, lng: 78.3565 },
    { name: "Hoshangabad", lat: 22.7512, lng: 77.7262 },
    { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
    { name: "Sehore", lat: 23.2012, lng: 77.0855 },
    { name: "Ujjain", lat: 23.1765, lng: 75.7885 },
    { name: "Indore", lat: 22.7196, lng: 75.8577 },
    { name: "Barwaha", lat: 22.2545, lng: 76.0425 },
    { name: "Omkareshwar", lat: 22.2464, lng: 76.1511 },
    { name: "Maheshwar", lat: 22.1764, lng: 75.5866 },
    { name: "Dhamnod", lat: 22.2185, lng: 75.4685 },
    { name: "Mandu", lat: 22.3662, lng: 75.4024 },
    { name: "Dhamnod", lat: 22.2185, lng: 75.4685 },
    { name: "Sendhwa (MP Border)", lat: 21.6885, lng: 75.0985 },
    { name: "Dhule", lat: 20.9042, lng: 74.7745 },
    { name: "Malegaon", lat: 20.5535, lng: 74.5285 },
    { name: "Nashik", lat: 19.9975, lng: 73.7898 },
    { name: "Anjaneri", lat: 19.9255, lng: 73.5785 },
    { name: "Trimbakeshwar", lat: 19.9328, lng: 73.5307 }
  ],

  // Verified Indian Railways Corridors
  railCorridors: [
    {
      id: "rail-vns-mzp-bdl",
      name: "Varanasi - Mirzapur - Vindhyachal Trunk Line",
      color: "#3b82f6",
      dashArray: null,
      points: [
        [25.3283, 82.9863], // BSB
        [25.3087, 82.9647], // BSBS
        [25.1275, 82.8842], // Chunar CAR
        [25.1462, 82.5685], // Mirzapur MZP
        [25.1633, 82.4988]  // Vindhyachal BDL
      ]
    },
    {
      id: "rail-mzp-maihar-jbp",
      name: "Prayagraj - Manikpur - Maihar - Katni - Jabalpur Mainline",
      color: "#2563eb",
      dashArray: null,
      points: [
        [25.1462, 82.5685], // MZP
        [25.4358, 81.8463], // Prayagraj Chheoki PCOI
        [25.0425, 81.0885], // Manikpur MKP
        [24.5825, 80.8322], // Satna STA
        [24.2690, 80.7570], // Maihar MYR
        [23.8343, 80.3989], // Katni KTE
        [23.1678, 79.9545], // Jabalpur JBP
        [23.1538, 79.9142]  // Madan Mahal MML
      ]
    },
    {
      id: "rail-jbp-itarsi-bhopal",
      name: "Narmada Valley Superfast (Jabalpur to Bhopal via Itarsi)",
      color: "#0284c7",
      dashArray: null,
      points: [
        [23.1678, 79.9545], // JBP
        [22.9465, 79.1985], // Narsinghpur
        [22.7585, 78.3565], // Pipariya
        [22.6125, 77.7612], // Itarsi Junction
        [22.7512, 77.7262], // Hoshangabad NDPM
        [23.2052, 77.4385], // Rani Kamlapati RKMP
        [23.2678, 77.4125]  // Bhopal Junction BPL
      ]
    },
    {
      id: "rail-bhopal-ujjain-indore",
      name: "Malwa Express Corridor (Bhopal -> Ujjain -> Indore)",
      color: "#6366f1",
      dashArray: null,
      points: [
        [23.2678, 77.4125], // BPL
        [23.2012, 77.0855], // Sehore
        [23.2985, 76.5125], // Shujalpur
        [23.2125, 76.0425], // Maksi Jn
        [23.1812, 75.7765], // Ujjain UJN
        [23.0255, 75.6885], // Fatehabad FTD
        [22.7178, 75.8682]  // Indore INDB
      ]
    },
    {
      id: "rail-khandwa-nashik",
      name: "Central Railway Trunk (Khandwa -> Bhusawal -> Manmad -> Nashik)",
      color: "#8b5cf6",
      dashArray: null,
      points: [
        [21.8255, 76.3512], // Khandwa KNW
        [21.3125, 76.2255], // Burhanpur BAU
        [21.0455, 75.7885], // Bhusawal BSL
        [20.9985, 75.5685], // Jalgaon JL
        [20.2525, 74.4385], // Manmad MMR
        [19.9545, 73.8312]  // Nashik Road NK
      ]
    }
  ],

  // Specific Scenic Highway Detours
  scenicDetours: [
    {
      id: "detour-bhopal-sanchi",
      name: "Bhopal to Sanchi UNESCO Stupa Highway (NH-146)",
      color: "#eab308",
      points: [
        [23.2599, 77.4126], // Bhopal
        [23.4125, 77.5855], // Salamatpur
        [23.4873, 77.7412]  // Sanchi Stupa
      ]
    },
    {
      id: "detour-bhopal-bhojpur-bhimbetka",
      name: "Bhopal to Bhojpur Temple & Bhimbetka Caves (NH-46)",
      color: "#f59e0b",
      points: [
        [23.2052, 77.4385], // RKMP
        [23.1005, 77.5855], // Bhojpur Temple
        [23.0455, 77.5985], // Mandideep
        [22.9372, 77.6125]  // Bhimbetka Rock Shelters
      ]
    },
    {
      id: "detour-maheshwar-mandu",
      name: "Maheshwar to Mandu Fort Plateau Ghat Road",
      color: "#f97316",
      points: [
        [22.1764, 75.5866], // Maheshwar
        [22.2185, 75.4685], // Dhamnod
        [22.3125, 75.4125], // Mandu Ghat Entrance
        [22.3662, 75.4024]  // Jahaz Mahal
      ]
    },
    {
      id: "detour-nashik-trimbakeshwar",
      name: "Nashik to Trimbakeshwar Jyotirlinga Highway (NH-848)",
      color: "#ec4899",
      points: [
        [19.9975, 73.7898], // Nashik City
        [19.9655, 73.6885], // Gangapur phata
        [19.9255, 73.5785], // Anjaneri
        [19.9328, 73.5307]  // Trimbakeshwar Temple
      ]
    }
  ]
};

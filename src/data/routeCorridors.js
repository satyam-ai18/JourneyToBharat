// Complete geographic route coordinates and polyline pathways for South India Grand Loop
// Categorized by Rail Corridor, Bus Corridor, Scenic Road Highway, and Walking Heritage Trails.

export const ROUTE_CORRIDORS = {
  // --- 1. FULL GRAND CIRCUIT (Master Overview) ---
  grandLoop: [
    { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
    { name: "Jabalpur", lat: 23.1815, lng: 79.9864 },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
    { name: "Vijayawada", lat: 16.5062, lng: 80.6480 },
    { name: "Tirupati", lat: 13.6288, lng: 79.4192 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Mahabalipuram", lat: 12.6269, lng: 80.1927 },
    { name: "Pondicherry", lat: 11.9416, lng: 79.8083 },
    { name: "Thanjavur", lat: 10.7870, lng: 79.1378 },
    { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
    { name: "Madurai", lat: 9.9252, lng: 78.1198 },
    { name: "Rameswaram", lat: 9.2876, lng: 79.3129 },
    { name: "Dhanushkodi", lat: 9.1772, lng: 79.4184 },
    { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 },
    { name: "Aluva / Munnar Foothills", lat: 10.1082, lng: 76.3533 },
    { name: "Munnar", lat: 10.0889, lng: 77.0595 },
    { name: "Thekkady", lat: 9.6031, lng: 77.1615 },
    { name: "Alleppey", lat: 9.4981, lng: 76.3388 },
    { name: "Kochi", lat: 9.9312, lng: 76.2673 },
    { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
    { name: "Mettupalayam", lat: 11.3005, lng: 76.9538 },
    { name: "Coonoor", lat: 11.3530, lng: 76.7959 },
    { name: "Ooty", lat: 11.4102, lng: 76.6950 },
    { name: "Bandipur / Gundlupet", lat: 11.6667, lng: 76.6333 },
    { name: "Coorg (Madikeri)", lat: 12.4244, lng: 75.7382 },
    { name: "Mysuru", lat: 12.2958, lng: 76.6394 },
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    { name: "Secunderabad", lat: 17.4399, lng: 78.4983 },
    { name: "Nagpur (Return)", lat: 21.1458, lng: 79.0882 },
    { name: "Pt. Deen Dayal Upadhyaya", lat: 25.2818, lng: 83.1186 },
    { name: "Varanasi (Return)", lat: 25.3176, lng: 82.9739 }
  ],

  // --- 2. RAIL CORRIDORS ---
  railCorridors: [
    {
      id: "rail-trunk-north-south",
      name: "Grand Trunk North-South Rail (BSB to TPTY & Return)",
      color: "#3b82f6",
      dashArray: "6, 6",
      points: [
        [25.3283, 82.9863], // Varanasi BSB
        [25.2818, 83.1186], // DDU
        [24.5714, 80.8322], // Satna
        [23.8343, 80.3989], // Katni
        [23.1815, 79.9864], // Jabalpur
        [22.7533, 77.7262], // Itarsi
        [21.1458, 79.0882], // Nagpur
        [19.9535, 79.2961], // Balharshah
        [17.9784, 79.6006], // Warangal
        [16.5062, 80.6480], // Vijayawada
        [14.4426, 79.9865], // Nellore
        [14.1534, 79.8512], // Gudur
        [13.6508, 79.5161], // Renigunta RU
        [13.6268, 79.4199]  // Tirupati TPTY
      ]
    },
    {
      id: "rail-coromandel-south",
      name: "Southern Tamil Nadu Rail Corridor (TPTY -> MAS -> CGL -> VM -> TJ -> TPJ -> MDU -> RMM -> CAPE)",
      color: "#2563eb",
      dashArray: null,
      points: [
        [13.6268, 79.4199], // Tirupati
        [13.0825, 80.2755], // Chennai Central
        [13.0782, 80.2608], // Chennai Egmore
        [12.9249, 80.1264], // Tambaram
        [12.6841, 79.9836], // Chengalpattu
        [11.9398, 79.4975], // Villupuram
        [11.9298, 79.8286], // Pondicherry branch
        [11.9398, 79.4975], // back to VM
        [10.7745, 79.1328], // Thanjavur
        [10.7933, 78.6853], // Trichy TPJ
        [10.3673, 77.9803], // Dindigul
        [9.9213, 78.1105],  // Madurai MDU
        [9.7116, 78.5833],  // Manamadurai
        [9.3639, 78.8395],  // Ramanathapuram
        [9.2789, 79.1243],  // Mandapam
        [9.2882, 79.3082],  // Rameswaram RMM
        [9.2789, 79.1243],  // back mainland
        [9.7116, 78.5833],  // Manamadurai
        [8.7139, 77.7567],  // Tirunelveli
        [8.1741, 77.4338],  // Nagercoil NCJ
        [8.0864, 77.5458]   // Kanniyakumari CAPE
      ]
    },
    {
      id: "rail-kerala-corridor",
      name: "Kerala Coastal & Malabar Rail (CAPE -> AWY -> ALLP -> ERS -> CBE -> MTP)",
      color: "#0284c7",
      dashArray: null,
      points: [
        [8.0864, 77.5458], // Kanyakumari
        [8.5074, 76.9507], // Thiruvananthapuram Central
        [8.8932, 76.6141], // Kollam
        [9.1722, 76.4972], // Kayamkulam
        [9.4891, 76.3245], // Alleppey ALLP
        [9.9678, 76.2891], // Ernakulam ERS
        [10.1082, 76.3533], // Aluva AWY
        [10.5276, 76.2144], // Thrissur
        [10.7867, 76.6548], // Palakkad
        [11.0016, 76.9628], // Coimbatore CBE
        [11.3005, 76.9538]  // Mettupalayam MTP
      ]
    },
    {
      id: "rail-nilgiri-toy-train",
      name: "UNESCO Nilgiri Mountain Toy Train (MTP to OOTY)",
      color: "#ec4899",
      dashArray: "4, 4",
      points: [
        [11.3005, 76.9538], // Mettupalayam (Base - 325m)
        [11.3256, 76.8924], // Kallar
        [11.3361, 76.8483], // Hillgrove
        [11.3524, 76.7972], // Coonoor (1,712m)
        [11.3654, 76.7865], // Wellington
        [11.3789, 76.7645], // Aravankadu
        [11.3855, 76.7321], // Ketti (Valley)
        [11.3922, 76.7118], // Lovedale
        [11.4058, 76.6961]  // Udhagamandalam / Ooty (2,210m)
      ]
    },
    {
      id: "rail-mysore-bangalore",
      name: "Cauvery Plain Superfast (Mysuru MYS to Bengaluru SBC)",
      color: "#8b5cf6",
      dashArray: null,
      points: [
        [12.3162, 76.6438], // Mysuru Jn
        [12.4208, 76.7028], // Srirangapatna
        [12.5255, 76.8972], // Mandya
        [12.6012, 77.0428], // Maddur
        [12.7214, 77.2812], // Ramanagara
        [12.8345, 77.4125], // Bidadi
        [12.9122, 77.4855], // Kengeri
        [12.9781, 77.5694]  // Bengaluru SBC
      ]
    }
  ],

  // --- 3. BUS CORRIDORS ---
  busCorridors: [
    {
      id: "bus-ecr",
      name: "East Coast Road (ECR) Coastal Bus Highway (Chennai - Mahabalipuram - Pondicherry)",
      color: "#10b981",
      dashArray: "5, 5",
      points: [
        [13.0827, 80.2707], // Chennai CMBT / Thiruvanmiyur
        [12.8345, 80.2415], // Kovalam / Covelong
        [12.6269, 80.1927], // Mahabalipuram Town
        [12.5085, 80.1412], // Kalpakkam
        [12.2152, 79.9452], // Marakkanam Salt Pans
        [11.9808, 79.8000], // Auroville Junction
        [11.9416, 79.8083]  // Pondicherry New Bus Stand
      ]
    },
    {
      id: "bus-western-ghats-munnar",
      name: "Munnar High-Range Mountain Bus Corridor (Aluva -> Munnar -> Thekkady)",
      color: "#059669",
      dashArray: "5, 5",
      points: [
        [10.1082, 76.3533], // Aluva KSRTC Stand
        [10.0522, 76.5412], // Kothamangalam
        [10.0345, 76.7118], // Neriamangalam Forest Bridge
        [10.0458, 76.8845], // Adimali
        [10.0889, 77.0595], // Munnar KSRTC Depot (1,600m)
        [9.9822, 77.1215],  // Devikulam
        [9.9145, 77.1652],  // Pooppara Tea Junction
        [9.7522, 77.1585],  // Nedumkandam Cardamom Hills
        [9.6031, 77.1615]   // Thekkady (Kumily Bus Terminal)
      ]
    },
    {
      id: "bus-thekkady-alleppey",
      name: "KK Road (Kottayam-Kumily NH-183) to Alleppey Backwaters",
      color: "#14b8a6",
      dashArray: "5, 5",
      points: [
        [9.6031, 77.1615], // Kumily / Thekkady
        [9.5845, 77.0215], // Peermade
        [9.5422, 76.8852], // Mundakayam
        [9.5612, 76.7845], // Kanjirappally
        [9.5898, 76.5312], // Kottayam Bus Stand
        [9.4981, 76.3388]  // Alleppey Canal Bus Stand
      ]
    },
    {
      id: "bus-nilgiri-coorg",
      name: "Interstate Tiger Reserve & Coffee Corridor (Ooty -> Gudalur -> Bandipur -> Madikeri)",
      color: "#16a34a",
      dashArray: "5, 5",
      points: [
        [11.4102, 76.6950], // Ooty
        [11.5052, 76.4952], // Gudalur
        [11.6667, 76.6333], // Mudumalai / Bandipur Tiger Reserve
        [11.8025, 76.6852], // Gundlupet
        [12.1852, 76.3845], // Hunsur
        [12.4512, 75.9612], // Kushalnagar
        [12.4244, 75.7382]  // Madikeri KSRTC Stand (Coorg)
      ]
    },
    {
      id: "bus-coorg-mysore-bangalore",
      name: "Madikeri to Mysuru & 10-Lane Bengaluru Expressway",
      color: "#047857",
      dashArray: "5, 5",
      points: [
        [12.4244, 75.7382], // Madikeri
        [12.4512, 75.9612], // Kushalnagar
        [12.1852, 76.3845], // Hunsur
        [12.2958, 76.6394], // Mysuru Suburban Stand
        [12.5255, 76.8972], // Mandya (Expressway)
        [12.7214, 77.2812], // Ramanagara
        [12.9716, 77.5946]  // Bengaluru Majestic
      ]
    }
  ],

  // --- 4. SCENIC HIGHWAY ROAD CORRIDORS ---
  scenicRoads: [
    {
      id: "road-dhanushkodi-spit",
      name: "NH-49 Ocean Spit Marine Highway (Rameswaram to Arichal Munai)",
      color: "#f59e0b",
      description: "Paved strip built over sand spits flanked by roaring oceans; dead-ends at Land's End.",
      points: [
        [9.2882, 79.3082], // Rameswaram
        [9.2612, 79.3512], // Kundukal
        [9.2215, 79.3855], // Kothandaramaswamy
        [9.1912, 79.4052], // Dhanushkodi Ruins Checkpost
        [9.1772, 79.4184], // Submerged Station & Church
        [9.1552, 79.4485]  // Arichal Munai (Land's End / Ram Setu View)
      ]
    },
    {
      id: "road-pamban-bridge",
      name: "Annai Indira Gandhi Road Bridge over Pamban Strait",
      color: "#f97316",
      description: "Elevated high-level bridge with sweeping 360-degree views of the turquoise sea and railway bridge.",
      points: [
        [9.2789, 79.1243], // Mandapam mainland
        [9.2783, 79.1989], // Mid-span high vantage
        [9.2825, 79.2312]  // Pamban island touchdown
      ]
    },
    {
      id: "road-munnar-topstation",
      name: "Munnar to Top Station Panoramic Tea Highway",
      color: "#eab308",
      description: "Curves through manicured tea gardens, Mattupetty reservoir, Echo Point, and Kundala lake to the clouds.",
      points: [
        [10.0889, 77.0595], // Munnar Town
        [10.1062, 77.1245], // Mattupetty Dam
        [10.1145, 77.1585], // Echo Point
        [10.1255, 77.1895], // Kundala Arch Dam
        [10.1235, 77.2445]  // Top Station Viewpoint
      ]
    }
  ],

  // --- 5. WALKING & HERITAGE TRAILS ---
  walkingTrails: [
    {
      id: "walk-pondicherry-whitetown",
      name: "Pondicherry French Quarter & Promenade Walk",
      color: "#a855f7",
      lengthKm: 2.2,
      points: [
        [11.9312, 79.8305], // Subbaiah Salai
        [11.9328, 79.8335], // French Institute / Romain Rolland St
        [11.9355, 79.8355], // Promenade Beach Gandhi Statue
        [11.9372, 79.8342], // French Consulate
        [11.9388, 79.8322]  // Sri Aurobindo Ashram
      ]
    },
    {
      id: "walk-fortkochi-heritage",
      name: "Fort Kochi Colonial Trail & Chinese Nets",
      color: "#d946ef",
      lengthKm: 2.8,
      points: [
        [9.9667, 76.2415], // Chinese Fishing Nets
        [9.9658, 76.2435], // Princess Street
        [9.9642, 76.2412], // St. Francis Church
        [9.9622, 76.2405], // Santa Cruz Basilica
        [9.9685, 76.2455]  // Bastion Bungalow
      ]
    },
    {
      id: "walk-mahabalipuram-monuments",
      name: "Mahabalipuram UNESCO Monolith Walk",
      color: "#ec4899",
      lengthKm: 2.0,
      points: [
        [12.6178, 79.1928], // Krishna's Butter Ball
        [12.6172, 80.1935], // Arjuna's Penance (Descent of Ganges)
        [12.6155, 80.1945], // Varaha Cave
        [12.6166, 80.1989]  // Shore Temple
      ]
    },
    {
      id: "walk-dhanushkodi-ruins",
      name: "Dhanushkodi Cyclone Ruins Walk",
      color: "#f43f5e",
      lengthKm: 1.5,
      points: [
        [9.1772, 79.4184], // Submerged Railway Station
        [9.1762, 79.4215], // St. Anthony's Church Façade
        [9.1748, 79.4248], // Water Tank & Port Office Ruins
        [9.1735, 79.4285]  // Beach shoreline
      ]
    }
  ]
};

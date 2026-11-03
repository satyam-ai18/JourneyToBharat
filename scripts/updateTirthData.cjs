const fs = require('fs');
const path = require('path');

const NEW_ENTRIES = [
  {
    id: "mallikarjuna_temple",
    name: "Mallikarjuna Swamy Temple",
    title: "Shri Mallikarjuna Jyotirlinga & Bhramaramba Shaktipeeth",
    category: "jyotirlingas",
    categories: ["jyotirlingas", "shaktipeeths"],
    categoryLabel: "12 Jyotirlingas",
    badge: "Jyotirlinga & Shaktipeeth",
    stateId: "andhra_pradesh",
    state: "Andhra Pradesh",
    location: "Srisailam, Nandyal, Andhra Pradesh",
    lat: 16.0741,
    lng: 78.8682,
    altitude: "476 m",
    timings: "04:30 AM - 10:00 PM (Afternoon break 03:30 - 05:30 PM)",
    festivals: "Maha Shivratri Brahmotsavam, Ugadi, Navratri",
    dressCode: "Traditional Dhoti/Kurta for Men, Saree/Chudidar for Women",
    deity: "Lord Shiva (Mallikarjuna Swamy) & Goddess Parvati (Bhramaramba Devi)",
    bestTime: "September to March",
    image: "/images/destinations/mallikarjuna_temple.jpg",
    attribution: "Wikimedia Commons: Srisailam Devasthanam (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/mallikarjuna_temple.jpg"
    ],
    overview: "Perched atop the verdant Nallamala Hills overlooking the sacred Krishna River (Patalaganga), Srisailam holds the unique distinction of being simultaneously one of the 12 sacred Jyotirlingas and one of the 18 Maha Shaktipeeths (Bhramaramba Devi). Devotees are uniquely permitted to touch the sacred Jyotirlinga during Sparsha Darshan.",
    howToReach: {
      byAir: "Rajiv Gandhi International Airport, Hyderabad (HYD - 200 km) / Vijayawada (260 km).",
      byRail: "Markapur Road Railway Station (MRK - 85 km) / Nandyal (160 km).",
      byRoad: "Scenic hill highway from Hyderabad (4.5 hrs) through Nallamala Tiger Reserve."
    },
    nearbyPlaces: [
      { name: "Patalaganga Krishna Ghat", distance: "2 km (Ropeway)", desc: "Sacred bathing ghat accessible by scenic cable car." },
      { name: "Srisailam Dam Viewpoint", distance: "14 km", desc: "Massive hydroelectric dam across the deep Krishna river gorge." },
      { name: "Phaladhara Panchadhara", distance: "4 km", desc: "Natural spring waterfalls where Adi Shankaracharya composed Sivananda Lahari." }
    ],
    tips: [
      "Sparsha Darshan (touching the sacred linga) requires mandatory traditional silk/cotton dhoti.",
      "The forest ghat road through Amrabad Tiger Reserve closes for vehicles between 9:00 PM and 6:00 AM."
    ],
    popular: true
  },
  {
    id: "omkareshwar_temple",
    name: "Omkareshwar Temple",
    title: "Shri Omkareshwar Jyotirlinga",
    category: "jyotirlingas",
    categories: ["jyotirlingas"],
    categoryLabel: "12 Jyotirlingas",
    badge: "Jyotirlinga",
    stateId: "madhya_pradesh",
    state: "Madhya Pradesh",
    location: "Mandhata, Khandwa, Madhya Pradesh",
    lat: 22.2464,
    lng: 76.1517,
    altitude: "178 m",
    timings: "05:00 AM - 09:30 PM (Mangala Aarti at 05:00 AM)",
    festivals: "Maha Shivratri, Kartik Purnima, Narmada Jayanti",
    dressCode: "Traditional Modest Attire",
    deity: "Lord Shiva (Omkareshwar & Mamleshwar)",
    bestTime: "October to March",
    image: "/images/destinations/omkareshwar_temple.jpg",
    attribution: "Wikimedia Commons: By Joydeep (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/omkareshwar_temple.jpg"
    ],
    overview: "Situated on Mandhata Island in the Narmada River—an island naturally sculpted by the river into the sacred symbol 'ॐ' (OM)—Omkareshwar is divided into two revered sanctuaries: Omkareshwar on the island and Mamleshwar (Amareshwar) on the south riverbank. Pilgrims traditionally perform the 7-km island parikrama on foot or boat.",
    howToReach: {
      byAir: "Devi Ahilyabai Holkar International Airport, Indore (IDR - 77 km).",
      byRail: "Omkareshwar Road (OM - 12 km) / Khandwa Junction (70 km) / Indore Jn (80 km).",
      byRoad: "Smooth 4-lane highway connectivity from Indore (2 hrs) and Ujjain (3 hrs)."
    },
    nearbyPlaces: [
      { name: "Mamleshwar Jyotirlinga", distance: "Across river", desc: "The ancient twin sanctum on the south bank connected by footbridge." },
      { name: "Govinda Bhagavatpada Cave", distance: "500m", desc: "Where Adi Shankaracharya met his guru and received formal Sannyasa." },
      { name: "Narmada Parikrama Path", distance: "7 km circuit", desc: "Holy circumambulation around the sacred Om-shaped Mandhata hill." }
    ],
    tips: [
      "Cross the river via the suspension bridge (Jhula Pul) or hire a decorated motorboat across the calm waters.",
      "Combine Omkareshwar with Mahakaleshwar Ujjain (135 km) on a weekend Malwa Jyotirlinga circuit."
    ],
    popular: true
  },
  {
    id: "bhimashankar_temple",
    name: "Bhimashankar Temple",
    title: "Shri Bhimashankar Jyotirlinga",
    category: "jyotirlingas",
    categories: ["jyotirlingas"],
    categoryLabel: "12 Jyotirlingas",
    badge: "Jyotirlinga",
    stateId: "maharashtra",
    state: "Maharashtra",
    location: "Khed, Pune, Maharashtra",
    lat: 19.0722,
    lng: 73.5358,
    altitude: "1,030 m",
    timings: "04:30 AM - 09:30 PM (Kakad Aarti at 04:30 AM)",
    festivals: "Maha Shivratri, Shravan Mondays, Tripurari Purnima",
    dressCode: "Modest Indian Attire",
    deity: "Lord Shiva (Bhimashankar)",
    bestTime: "September to February (Lush Sahyadri post-monsoon greenery)",
    image: "/images/destinations/bhimashankar_temple.jpg",
    attribution: "Wikimedia Commons: By Subhashish Panigrahi (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/bhimashankar_temple.jpg"
    ],
    overview: "Cradled inside dense evergreen rainforests of the Western Ghats (Sahyadris), Bhimashankar marks the mythical origin of the holy Bhima River. The exquisite Nagara-style black stone temple incorporates ancient and modern Hemadpanthi stone carvings, surrounded by the protected Bhimashankar Wildlife Sanctuary, home of the Malabar Giant Squirrel (Shekru).",
    howToReach: {
      byAir: "Pune International Airport (PNQ - 110 km) / Mumbai CSMIA (220 km).",
      byRail: "Pune Junction (115 km) / Manchar (65 km).",
      byRoad: "Direct state transport MSRTC buses and private cabs from Pune (3.5 hrs) via Manchar."
    },
    nearbyPlaces: [
      { name: "Gupt Bhimashankar", distance: "2 km trek", desc: "Hidden stream spot where the Bhima river first originates from beneath rocks." },
      { name: "Nagphani (Cobra Hood) Viewpoint", distance: "2.5 km trek", desc: "Highest cliff point offering panoramas of the Konkan plains." },
      { name: "Bhimashankar Wildlife Sanctuary", distance: "Surrounding", desc: "Dense biodiversity hotspot harboring giant squirrels and orchids." }
    ],
    tips: [
      "Carry umbrellas or light windcheaters as passing clouds and rain showers occur frequently in the Sahyadris.",
      "Visiting on Shravan Mondays draws large crowds; early morning darshan between 5:00 and 7:00 AM is optimal."
    ],
    popular: true
  },
  {
    id: "trimbakeshwar_temple",
    name: "Trimbakeshwar Temple",
    title: "Shri Trimbakeshwar Jyotirlinga",
    category: "jyotirlingas",
    categories: ["jyotirlingas"],
    categoryLabel: "12 Jyotirlingas",
    badge: "Jyotirlinga",
    stateId: "maharashtra",
    state: "Maharashtra",
    location: "Trimbak, Nashik, Maharashtra",
    lat: 19.9324,
    lng: 73.5308,
    altitude: "720 m",
    timings: "05:30 AM - 09:00 PM (Rudra Abhishek 06:00 - 08:30 AM)",
    festivals: "Nashik-Trimbak Kumbh Mela, Maha Shivratri, Godavari Jayanti",
    dressCode: "Traditional Dhoti/Sovale for Abhishek, Modest Attire for General Darshan",
    deity: "Lord Shiva (Trimbakeshwar - Trimurti Linga)",
    bestTime: "September to March",
    image: "/images/destinations/trimbakeshwar_temple.jpg",
    attribution: "Wikimedia Commons: By Niranjan.parab (CC BY-SA 4.0)",
    gallery: [
      "/images/destinations/trimbakeshwar_temple.jpg"
    ],
    overview: "Nestled at the foothills of the sacred Brahmagiri Mountain from which river Godavari (Dakshin Ganga) springs forth, Trimbakeshwar is extraordinary among all 12 Jyotirlingas: its lingam features three distinct thumb-sized faces representing Brahma, Vishnu, and Maheshwar, crowned by an ancient bejeweled crown dating to the Pandavas.",
    howToReach: {
      byAir: "Nashik Ozar Airport (ISK - 55 km) / Mumbai International Airport (170 km).",
      byRail: "Nashik Road Railway Station (NK - 38 km).",
      byRoad: "Smooth 4-lane highway from Nashik city center (28 km, 45 mins) and Mumbai (3.5 hrs via Samruddhi Mahamarg)."
    },
    nearbyPlaces: [
      { name: "Kushavarta Kund", distance: "400m", desc: "Sacred stone water reservoir where Godavari re-emerges; ritual bathing center." },
      { name: "Brahmagiri Mountain Trek", distance: "3 km (750 steps)", desc: "Origin of river Godavari with Gangadwar shrine atop the cliff." },
      { name: "Anjaneri Hill", distance: "8 km", desc: "Birthplace of Lord Hanuman with hilltop temple and scenic plateau." }
    ],
    tips: [
      "Devotees performing Kalsarpa or Narayan Nagbali rituals must register with authorized purohits at Kushavarta.",
      "The jewel-studded ancient crown (Mukut) is displayed for special public darshan on Mondays between 4:00 and 5:00 PM."
    ],
    popular: true
  },
  {
    id: "baidyanath_temple",
    name: "Baidyanath Dham",
    title: "Baba Baidyanath Jyotirlinga (Vaidyanath)",
    category: "jyotirlingas",
    categories: ["jyotirlingas", "shaktipeeths"],
    categoryLabel: "12 Jyotirlingas",
    badge: "Jyotirlinga & Shaktipeeth",
    stateId: "jharkhand",
    state: "Jharkhand",
    location: "Deoghar, Santhal Parganas, Jharkhand",
    lat: 24.4925,
    lng: 86.7001,
    altitude: "254 m",
    timings: "04:00 AM - 09:00 PM (Afternoon closing 03:30 - 06:00 PM)",
    festivals: "Shravani Mela (Kanwar Yatra), Maha Shivratri, Basant Panchami",
    dressCode: "Traditional Modest Attire (Saffron Kanwar attire during Shravan)",
    deity: "Lord Shiva (Baidyanath / Kamna Linga) & Goddess Parvati (Jayadurga)",
    bestTime: "October to March (July-August for sacred Kanwar Yatra experience)",
    image: "/images/destinations/baidyanath_temple.jpg",
    attribution: "Wikimedia Commons: By Rakeshkdogra (CC BY-SA 4.0)",
    gallery: [
      "/images/destinations/baidyanath_temple.jpg"
    ],
    overview: "Baba Baidyanath Dham in Deoghar is the legendary site where King Ravana performed intense tapasya to obtain Shiva's Atmalinga. It is celebrated as both a premier Jyotirlinga and the Jayadurga Shaktipeeth. In the sacred month of Shravan, millions of Kanwariyas fetch holy Ganga water from Sultanganj and trek 105 km barefoot to offer it here.",
    howToReach: {
      byAir: "Deoghar International Airport (DGH - 7 km) / Kazi Nazrul Islam Airport Durgapur (130 km).",
      byRail: "Jasidih Junction (JSME - 8 km, major mainline station on Howrah-Delhi line).",
      byRoad: "Well-connected by state highways from Ranchi (250 km), Patna (250 km), and Kolkata (310 km)."
    },
    nearbyPlaces: [
      { name: "Shiva Ganga Kund", distance: "200m", desc: "Ancient holy bathing pond excavated by Ravana before darshan." },
      { name: "Naulakha Mandir", distance: "2 km", desc: "Majestic 146-ft stone temple built by Queen Charushila of Pathuria." },
      { name: "Trikut Pahar", distance: "18 km", desc: "Three-peaked sacred hill with scenic cable car ropeway and Shiva caves." }
    ],
    tips: [
      "Book early morning VIP Darshan (VIP Tirtha Purohit slip) during peak Shravan month to save waiting time.",
      "The sanctums of Shiva and Parvati are connected by a sacred red cloth ribbon (Gathbandhan) offered by married couples."
    ],
    popular: true
  },
  {
    id: "nageshwar_temple",
    name: "Nageshwar Jyotirlinga",
    title: "Shri Nageshwar Jyotirlinga Temple",
    category: "jyotirlingas",
    categories: ["jyotirlingas"],
    categoryLabel: "12 Jyotirlingas",
    badge: "Jyotirlinga",
    stateId: "gujarat",
    state: "Gujarat",
    location: "Dwarka, Devbhumi Dwarka, Gujarat",
    lat: 22.3344,
    lng: 69.0538,
    altitude: "18 m",
    timings: "06:00 AM - 12:30 PM & 05:00 PM - 09:30 PM",
    festivals: "Maha Shivratri, Shravan Mahina, Diwali",
    dressCode: "Traditional Attire (Dhoti required for inner sanctum Abhishek)",
    deity: "Lord Shiva (Nageshwar / Lord of Serpents)",
    bestTime: "October to March",
    image: "/images/destinations/nageshwar_temple.jpg",
    attribution: "Wikimedia Commons: By Shashi Shekhar (CC BY-SA 4.0)",
    gallery: [
      "/images/destinations/nageshwar_temple.jpg"
    ],
    overview: "Set amid the ancient Darukavana forest near the Arabian coast between Dwarka and Bet Dwarka, Nageshwar Jyotirlinga enshrines Lord Shiva as the protector from all venom and worldly fears. The sanctum features a giant 80-foot seated statue of Lord Shiva visible for miles across the Saurashtra plains.",
    howToReach: {
      byAir: "Jamnagar Airport (JGA - 130 km) / Porbandar Airport (110 km).",
      byRail: "Dwarka Railway Station (DWK - 16 km).",
      byRoad: "Smooth coastal highway from Dwarka city center (15 mins)."
    },
    nearbyPlaces: [
      { name: "Bet Dwarka Island", distance: "20 km", desc: "Lord Krishna's residential island reached via the iconic Sudarshan Setu cable bridge." },
      { name: "Gopi Talav", distance: "4 km", desc: "Sacred lake associated with Krishna and the Gopis, known for yellowish Gopi Chandan." },
      { name: "Rukmini Devi Mandir", distance: "12 km", desc: "12th-century richly carved stone temple dedicated to Krishna's queen Rukmini." }
    ],
    tips: [
      "Easily combined into a half-day circuit with Dwarkadhish, Gopi Talav, and Bet Dwarka.",
      "Abhishek with holy milk is performed directly by devotees inside the underground sanctum during morning hours."
    ],
    popular: true
  },
  {
    id: "grishneshwar_temple",
    name: "Grishneshwar Temple",
    title: "Shri Grishneshwar Jyotirlinga (Ghushmeshwar)",
    category: "jyotirlingas",
    categories: ["jyotirlingas"],
    categoryLabel: "12 Jyotirlingas",
    badge: "Jyotirlinga",
    stateId: "maharashtra",
    state: "Maharashtra",
    location: "Verul, Chhatrapati Sambhaji Nagar, Maharashtra",
    lat: 20.0249,
    lng: 75.1706,
    altitude: "570 m",
    timings: "05:30 AM - 09:30 PM (Mangala Aarti at 05:30 AM)",
    festivals: "Maha Shivratri, Shravan Mondays, Tripurari Purnima",
    dressCode: "Men must remove upper-body clothes (bare torso) to enter inner sanctum",
    deity: "Lord Shiva (Grishneshwar / Kusumeshwar)",
    bestTime: "October to March",
    image: "/images/destinations/grishneshwar_temple.jpg",
    attribution: "Wikimedia Commons: By Ankur P (CC BY-SA 2.0)",
    gallery: [
      "/images/destinations/grishneshwar_temple.jpg"
    ],
    overview: "The twelfth and final Jyotirlinga, Grishneshwar stands mere steps from the UNESCO World Heritage Ellora Caves. Constructed from warm reddish-brown basalt stone by the legendary Maratha queen Ahilyabai Holkar in the 18th century, the temple boasts a 5-tier sculpted shikhara, courtly mandapa, and intricate carvings of the Dashavatara.",
    howToReach: {
      byAir: "Chhatrapati Sambhaji Nagar (Aurangabad) Airport (IXU - 35 km).",
      byRail: "Aurangabad Railway Station (AWB - 30 km).",
      byRoad: "Smooth national highway NH 52 connecting Aurangabad city center (45 mins)."
    },
    nearbyPlaces: [
      { name: "Ellora Caves (Kailasa Temple)", distance: "1 km", desc: "World-famous rock-cut monolithic marvel carved out of a single mountain cliff." },
      { name: "Daulatabad (Devagiri) Fort", distance: "14 km", desc: "Impregnable medieval hill fortress with dark labyrinth passages." },
      { name: "Shivalaya Teerth", distance: "Adjacent", desc: "Holy stone tank where the devoted Kusuma revived her dead son." }
    ],
    tips: [
      "Male devotees entering the Garbhagriha must remove shirts and vests following traditional custom.",
      "Plan a full-day itinerary combining Ellora Cave 16 (Kailasa) and Grishneshwar morning darshan."
    ],
    popular: true
  },
  {
    id: "dwarkadhish_temple",
    name: "Dwarkadhish Temple",
    title: "Shri Dwarkadhish Mandir (Jagat Mandir)",
    category: "chardham",
    categories: ["chardham", "manyata_temples"],
    categoryLabel: "Char Dham",
    badge: "Char Dham",
    stateId: "gujarat",
    state: "Gujarat",
    location: "Dwarka, Devbhumi Dwarka, Gujarat",
    lat: 22.2376,
    lng: 68.9678,
    altitude: "12 m",
    timings: "06:30 AM - 01:00 PM & 05:00 PM - 09:30 PM",
    festivals: "Krishna Janmashtami, Annakut, Holi, Diwali",
    dressCode: "Traditional Modest Attire (Electronic devices prohibited inside)",
    deity: "Lord Krishna (Dwarkadhish / King of Dwarka)",
    bestTime: "October to March",
    image: "/images/destinations/dwarkadhish_temple.jpg",
    attribution: "Wikimedia Commons: By Scales (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/dwarkadhish_temple.jpg"
    ],
    overview: "Dwarkadhish Mandir (Jagat Mandir) is the sacred western anchor of Adi Shankaracharya's 4 cardinal Char Dham abodes and one of the holy Sapta Puri cities. Perched dramatically where the Gomti River meets the Arabian Sea, this 2,200-year-old 5-story sandstone temple is supported by 72 carved pillars and flies the famous 52-yard Dhwaja flag changed five times daily.",
    howToReach: {
      byAir: "Jamnagar Airport (JGA - 135 km) / Porbandar Airport (105 km).",
      byRail: "Dwarka Railway Station (DWK - 2 km).",
      byRoad: "Smooth coastal 4-lane highway from Rajkot (220 km) and Ahmedabad (440 km)."
    },
    nearbyPlaces: [
      { name: "Gomti Ghat & Sangam", distance: "Adjacent", desc: "Sacred confluence of river Gomti with the Arabian sea ocean." },
      { name: "Sudama Setu Suspension Bridge", distance: "200m", desc: "Pedestrian bridge leading across to the Panchkui island sands." },
      { name: "Dwarka Beach & Lighthouse", distance: "1.5 km", desc: "Scenic coastal viewpoint with evening Arabian Sea sunsets." }
    ],
    tips: [
      "Witness the mesmerizing Dhwaja Aarohan (flag changing ceremony) from Gomti Ghat.",
      "Mobile phones, cameras, and leather belts must be deposited at the official temple cloakroom before entering."
    ],
    popular: true
  },
  {
    id: "kalighat_temple",
    name: "Kalighat Kali Temple",
    title: "Maa Kalighat Kali Temple",
    category: "shaktipeeths",
    categories: ["shaktipeeths"],
    categoryLabel: "Shaktipeeths",
    badge: "Shaktipeeth",
    stateId: "west_bengal",
    state: "West Bengal",
    location: "Kolkata, West Bengal",
    lat: 22.5204,
    lng: 88.3426,
    altitude: "9 m",
    timings: "05:00 AM - 02:00 PM & 05:00 PM - 10:30 PM",
    festivals: "Kali Puja (Diwali), Durga Puja, Poila Boishakh, Navratri",
    dressCode: "Traditional Modest Attire",
    deity: "Goddess Kali (Maa Kalika - Mukhamandala)",
    bestTime: "October to March",
    image: "/images/destinations/kalighat_temple.jpg",
    attribution: "Wikimedia Commons: By Amitabha Gupta (CC BY-SA 4.0)",
    gallery: [
      "/images/destinations/kalighat_temple.jpg"
    ],
    overview: "Kalighat is one of the most revered Shaktipeeths in Sanatana Dharma, consecrated where the four toes of Sati's right foot fell. The iconic black stone idol features three large orange eyes, a protruding gold tongue, and four hands. Built on the banks of Adi Ganga in traditional Bengal char-chala architecture, Kalighat has been the spiritual heart of Bengal for centuries.",
    howToReach: {
      byAir: "Netaji Subhash Chandra Bose International Airport, Kolkata (CCU - 24 km).",
      byRail: "Howrah Junction (HWH - 10 km) / Sealdah (8 km) / Kalighat Metro Station (800m).",
      byRoad: "Easily reached via Kolkata Metro rail (get down at Kalighat or Jatin Das Park station)."
    },
    nearbyPlaces: [
      { name: "Dakshineswar Kali Temple", distance: "18 km", desc: "Ramakrishna Paramahamsa's riverside 9-spired Bhavatarini temple." },
      { name: "Belur Math", distance: "16 km", desc: "Universal headquarters of Ramakrishna Mission on Hooghly River." },
      { name: "Victoria Memorial & Maidan", distance: "4 km", desc: "Monumental white marble architectural landmark of Kolkata." }
    ],
    tips: [
      "Take Kolkata Metro to Kalighat station and walk 8 minutes through the temple lane.",
      "Beware of persistent touts (pandas); join the standard public queue (Garbhagriha line) directly."
    ],
    popular: true
  },
  {
    id: "tarapith_temple",
    name: "Tarapith Temple",
    title: "Maa Tara Temple, Tarapith",
    category: "shaktipeeths",
    categories: ["shaktipeeths"],
    categoryLabel: "Shaktipeeths",
    badge: "Shaktipeeth",
    stateId: "west_bengal",
    state: "West Bengal",
    location: "Rampurhat, Birbhum, West Bengal",
    lat: 24.1147,
    lng: 87.7989,
    altitude: "39 m",
    timings: "06:00 AM - 08:30 PM (Bhog Aarti at 12:30 PM)",
    festivals: "Tara Jayanti, Kali Puja, Kaushiki Amavasya",
    dressCode: "Traditional Modest Attire",
    deity: "Goddess Tara (Second Mahavidya)",
    bestTime: "October to March",
    image: "/images/destinations/tarapith_temple.jpg",
    attribution: "Wikimedia Commons: By Biswarup Ganguly (CC BY 3.0)",
    gallery: [
      "/images/destinations/tarapith_temple.jpg"
    ],
    overview: "Tarapith is a celebrated Tantric Shaktipeeth where the eyeball (Tara / Netra) of Sati is believed to have fallen. Revered by Sadhus and seekers throughout India, it is eternally linked with the eccentric enlightened saint Bamakhepa (the mad saint). The terracotta aatchala shrine overlooks the sacred Dwarka river and the mystical Maha Smashan cremation grounds.",
    howToReach: {
      byAir: "Kazi Nazrul Islam Airport, Durgapur (RND - 110 km) / Kolkata Airport (210 km).",
      byRail: "Rampurhat Junction (RPH - 9 km, major express railhead).",
      byRoad: "Smooth state highway connecting Bolpur Santiniketan (65 km) and Kolkata (4.5 hrs)."
    },
    nearbyPlaces: [
      { name: "Maha Smashan & Bamakhepa Ashram", distance: "500m", desc: "Sacred cremation ground where saint Bamakhepa attained divine siddhi." },
      { name: "Bakreshwar Hot Springs & Temple", distance: "45 km", desc: "Natural therapeutic sulfur springs and Shaktipeeth." },
      { name: "Santiniketan (Rabindranath Tagore)", distance: "65 km", desc: "UNESCO World Heritage cultural and educational township." }
    ],
    tips: [
      "Arrive before noon to receive the sacred Mahaprasad bhog served at the temple hall.",
      "Rampurhat railway station offers frequent battery-rickshaws directly to Tarapith gates."
    ],
    popular: true
  },
  {
    id: "ambaji_temple",
    name: "Ambaji Temple",
    title: "Shri Arasuri Ambaji Mata Mandir",
    category: "shaktipeeths",
    categories: ["shaktipeeths"],
    categoryLabel: "Shaktipeeths",
    badge: "Shaktipeeth",
    stateId: "gujarat",
    state: "Gujarat",
    location: "Banaskantha, Aravalli Range, Gujarat",
    lat: 24.3314,
    lng: 72.8517,
    altitude: "480 m",
    timings: "07:30 AM - 11:30 AM & 12:30 PM - 04:30 PM & 06:30 PM - 09:00 PM",
    festivals: "Bhadarvi Purnima Mega Fair, Chaitra & Ashvin Navratri",
    dressCode: "Traditional Modest Attire",
    deity: "Goddess Amba (Vishwa Yantra - Heart of Sati)",
    bestTime: "September to March",
    image: "/images/destinations/ambaji_temple.jpg",
    attribution: "Wikimedia Commons: By Kuntal Shah (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/ambaji_temple.jpg"
    ],
    overview: "One of the original 51 Shaktipeeths, Ambaji marks the sacred spot where the heart (Hriday) of Devi Sati fell. Uniquely, the sanctum contains no stone or metal idol; instead, the supreme goddess is worshipped in the consecrated golden Shri Viso Yantra inscribed on the wall. The white marble temple boasts a 103-ft spire and 358 golden Kalash.",
    howToReach: {
      byAir: "Sardar Vallabhbhai Patel International Airport, Ahmedabad (AMD - 180 km).",
      byRail: "Abu Road Railway Station (ABR - 22 km, major mainline junction).",
      byRoad: "Smooth 4-lane highway from Abu Road (30 mins), Palanpur (65 km), and Ahmedabad (3.5 hrs)."
    },
    nearbyPlaces: [
      { name: "Gabbar Hill & Holy Flame", distance: "4.5 km", desc: "Original seat of the goddess atop a 999-step hill with modern cable car ropeway." },
      { name: "Kamakshi Devi Mandir Complex", distance: "1 km", desc: "Temple complex featuring replica shrines of all 51 Shaktipeeths of India." },
      { name: "Mount Abu Hill Station & Dilwara", distance: "45 km", desc: "Rajasthan's sole hill station with world-famous intricately carved marble Jain temples." }
    ],
    tips: [
      "Take the Gabbar Hill Ropeway for scenic aerial views of the Aravalli valleys.",
      "During the annual Bhadarvi Purnima fair, millions of pilgrims undertake padayatra walking on foot from across Gujarat."
    ],
    popular: true
  },
  {
    id: "jwalaji_temple",
    name: "Jwala Ji Temple",
    title: "Shri Jwala Ji Temple (Jwalamukhi)",
    category: "shaktipeeths",
    categories: ["shaktipeeths"],
    categoryLabel: "Shaktipeeths",
    badge: "Shaktipeeth",
    stateId: "himachal_pradesh",
    state: "Himachal Pradesh",
    location: "Kangra, Himachal Pradesh",
    lat: 31.8761,
    lng: 76.3229,
    altitude: "610 m",
    timings: "05:00 AM - 10:00 PM (Aarti 5 times daily)",
    festivals: "Chaitra Navratri, Shardiya Navratri, Sawan Ashtami",
    dressCode: "Modest Attire",
    deity: "Goddess Jwalamukhi (Tongue of Sati - Sacred Blue Flames)",
    bestTime: "September to April",
    image: "/images/destinations/jwalaji_temple.jpg",
    attribution: "Wikimedia Commons: By Varun Shiv Kapur (CC BY 2.0)",
    gallery: [
      "/images/destinations/jwalaji_temple.jpg"
    ],
    overview: "Set in the emerald Kangra Valley, Jwala Ji is the miraculous Maha Shaktipeeth where the holy tongue (Jihva) of Sati fell. There is no idol; instead, nine eternal natural blue flames flicker continuously from crevices in the solid rock sanctum without any known fuel source. Even Mughal Emperor Akbar's attempts to extinguish the flames with water streams famously failed.",
    howToReach: {
      byAir: "Kangra Gaggal Airport, Dharamshala (DHM - 45 km).",
      byRail: "Pathankot Junction (PTK - 120 km) / Amb Andaura (65 km).",
      byRoad: "Well-connected scenic mountain roads from Kangra (35 km) and Chandigarh (185 km)."
    },
    nearbyPlaces: [
      { name: "Kangra Brajeshwari Devi Temple", distance: "35 km", desc: "Renowned Nagarkot Shaktipeeth dedicated to Maa Brajeshwari." },
      { name: "Dharamshala & McLeodganj", distance: "55 km", desc: "Abode of the Dalai Lama set beneath snow-clad Dhauladhar mountains." },
      { name: "Naina Devi Ji Temple", distance: "110 km", desc: "Hilltop Shaktipeeth overlooking the Gobind Sagar lake." }
    ],
    tips: [
      "Attend the evening Shaiyya Aarti when the goddess is ceremonially put to rest with floral shringar.",
      "The temple can easily be covered as part of the famous 'Navadevi Yatra' circuit of Himachal Pradesh."
    ],
    popular: true
  },
  {
    id: "kolhapur_mahalakshmi",
    name: "Kolhapur Mahalakshmi",
    title: "Shri Ambabai Mahalakshmi Temple",
    category: "shaktipeeths",
    categories: ["shaktipeeths", "manyata_temples"],
    categoryLabel: "Shaktipeeths",
    badge: "Shaktipeeth & Manyata",
    stateId: "maharashtra",
    state: "Maharashtra",
    location: "Kolhapur, Maharashtra",
    lat: 16.6944,
    lng: 74.2238,
    altitude: "569 m",
    timings: "05:00 AM - 10:30 PM (Kiranotsav festival in Nov & Jan)",
    festivals: "Kiranotsav (Sun Ray Festival), Navratri Mahotsav, Chaitra Rathotsav",
    dressCode: "Traditional Modest Attire",
    deity: "Goddess Mahalakshmi (Karveer Nivasini Ambabai)",
    bestTime: "October to March",
    image: "/images/destinations/kolhapur_mahalakshmi.jpg",
    attribution: "Wikimedia Commons: By Coolmallu1 (CC BY-SA 4.0)",
    gallery: [
      "/images/destinations/kolhapur_mahalakshmi.jpg"
    ],
    overview: "Built in the 7th century by the Chalukya dynasty, the Mahalakshmi Temple of Kolhapur (Ambabai) is one of the premier Shaktipeeths of western India. The carved black stone deity holds a mace, shield, citrus fruit, and bowl, crowned with a serpent hood. Bi-annually during Kiranotsav, the rays of the setting sun penetrate through the stone gates to illuminate the feet, torso, and face of the idol directly.",
    howToReach: {
      byAir: "Kolhapur Airport (KLH - 10 km) / Pune International Airport (240 km).",
      byRail: "Chhatrapati Shahu Maharaj Terminus, Kolhapur (KOP - 2 km).",
      byRoad: "Direct NH 48 expressway from Pune (4.5 hrs) and Bengaluru (9 hrs)."
    },
    nearbyPlaces: [
      { name: "New Palace & Chhatrapati Shahu Museum", distance: "3 km", desc: "Stunning Victorian-Indo-Saracenic palace with Maharaja's artifacts." },
      { name: "Panhala Fort", distance: "20 km", desc: "Massive historic hilltop fortress where Chhatrapati Shivaji escaped from Siddi Johar." },
      { name: "Rankala Lake", distance: "2 km", desc: "Scenic freshwater lake with historic stone pavilions and evening promenade." }
    ],
    tips: [
      "Witness the sunset during Kiranotsav (late January and early November) to observe the natural solar marvel.",
      "Try the authentic Kolhapuri Misal and renowned cane jaggery from nearby markets."
    ],
    popular: true
  },
  {
    id: "vindhyavasini_temple",
    name: "Maa Vindhyavasini Temple",
    title: "Maa Vindhyavasini Temple (Vindhyachal)",
    category: "shaktipeeths",
    categories: ["shaktipeeths"],
    categoryLabel: "Shaktipeeths",
    badge: "Shaktipeeth",
    stateId: "uttar_pradesh",
    state: "Uttar Pradesh",
    location: "Vindhyachal, Mirzapur, Uttar Pradesh",
    lat: 25.1633,
    lng: 82.5050,
    altitude: "90 m",
    timings: "05:00 AM - 11:00 PM (Mangala Aarti at 05:00 AM)",
    festivals: "Chaitra Navratri Mela, Shardiya Navratri, Ganga Dusshera",
    dressCode: "Traditional Modest Attire",
    deity: "Goddess Vindhyavasini (Mahishasuramardini)",
    bestTime: "October to March",
    image: "/images/destinations/vindhyavasini_temple.jpg",
    attribution: "Wikimedia Commons: By Mohit Saxena (CC BY-SA 4.0)",
    gallery: [
      "/images/destinations/vindhyavasini_temple.jpg"
    ],
    overview: "Set on the Vindhya hill chain along the sacred banks of the Ganges, Maa Vindhyavasini is celebrated as the living Siddhapeeth where Goddess Mahishasuramardini chose to reside permanently after destroying demon Mahishasura. Pilgrims complete the celebrated Trikona Yatra covering Vindhyavasini, Kali Khoh, and Ashtabhuja Temple.",
    howToReach: {
      byAir: "Lal Bahadur Shastri International Airport, Varanasi (VNS - 75 km).",
      byRail: "Vindhyachal Railway Station (BDL - 1 km) / Mirzapur (MZP - 8 km).",
      byRoad: "Smooth national highway NH 35 from Varanasi (1.5 hrs) and Prayagraj (2 hrs)."
    },
    nearbyPlaces: [
      { name: "Ashtabhuja Devi Mandir", distance: "3 km (Hill)", desc: "Hilltop temple dedicated to Lord Krishna's sister Mahamaya." },
      { name: "Kali Khoh Cave Mandir", distance: "2 km", desc: "Tantric cave shrine dedicated to Maa Kali nestled in forest cleft." },
      { name: "Chunar Fort & Ganga Ghat", distance: "40 km", desc: "Ancient cliff fortress overlooking the majestic bend of Ganga." }
    ],
    tips: [
      "Complete the sacred triangular pilgrimage (Trikona Parikrama) connecting all three hill shrines in one day.",
      "The newly renovated Vindhya Corridor provides wide, marble-paved parikrama walkways."
    ],
    popular: true
  },
  {
    id: "ram_mandir_ayodhya",
    name: "Ram Mandir Ayodhya",
    title: "Shri Ram Janmabhoomi Mandir",
    category: "manyata_temples",
    categories: ["manyata_temples"],
    categoryLabel: "Famous & Manyata Temples",
    badge: "National Heritage",
    stateId: "uttar_pradesh",
    state: "Uttar Pradesh",
    location: "Ayodhya, Uttar Pradesh",
    lat: 26.7922,
    lng: 82.1998,
    altitude: "102 m",
    timings: "06:30 AM - 12:00 PM & 02:00 PM - 09:30 PM",
    festivals: "Ram Navami, Diwali Deepotsav, Vivah Panchami, Janmashtami",
    dressCode: "Traditional Modest Attire (Electronic devices prohibited in inner compound)",
    deity: "Lord Rama (Balak Ram - 5-year-old manifestation)",
    bestTime: "October to March (Warm festive climate)",
    image: "/images/destinations/ram_mandir_ayodhya.png",
    attribution: "Wikimedia Commons: Shri Ram Janmabhoomi Teerth Kshetra (CC BY-SA 4.0)",
    gallery: [
      "/images/destinations/ram_mandir_ayodhya.png"
    ],
    overview: "Constructed in traditional Gurjara-Chalukya Nagara architectural style using pink Bansi Paharpur stone from Rajasthan, Shri Ram Janmabhoomi Mandir enshrines the 51-inch black shaligram idol of Balak Ram (Lord Rama as a divine five-year-old child). Built entirely without iron or steel, the grand three-story temple features 392 pillars, 44 teakwood doors, and 5 majestic mandapas.",
    howToReach: {
      byAir: "Maharishi Valmiki International Airport, Ayodhya (AYJ - 8 km) / Lucknow (135 km).",
      byRail: "Ayodhya Dham Junction (AY - 1.5 km) / Ayodhya Cantt (AYC - 6 km).",
      byRoad: "Smooth 4-lane expressway from Lucknow (2.5 hrs), Varanasi (4 hrs), and Gorakhpur (2.5 hrs)."
    },
    nearbyPlaces: [
      { name: "Hanuman Garhi", distance: "1 km", desc: "76-step fortress shrine of Lord Hanuman; customary first stop before Ram Mandir." },
      { name: "Kanak Bhawan", distance: "800m", desc: "Golden palace gift from Queen Kaikeyi to Sita with ornate deities." },
      { name: "Saryu River Ghats & Aarti", distance: "2 km", desc: "Sacred riverside where Lord Rama took Jal Samadhi; evening grand Maha Aarti." }
    ],
    tips: [
      "First take blessings at Hanuman Garhi temple following ancient Ayodhya tradition.",
      "Book online Aarti passes (Mangala, Shringar, or Shayan Aarti) on the official trust portal."
    ],
    popular: true
  },
  {
    id: "siddhivinayak_temple",
    name: "Siddhivinayak Temple",
    title: "Shree Siddhivinayak Ganapati Mandir",
    category: "manyata_temples",
    categories: ["manyata_temples"],
    categoryLabel: "Famous & Manyata Temples",
    badge: "Manyata",
    stateId: "maharashtra",
    state: "Maharashtra",
    location: "Prabhadevi, Mumbai, Maharashtra",
    lat: 19.0168,
    lng: 72.8302,
    altitude: "8 m",
    timings: "05:30 AM - 09:50 PM (Tuesdays open 03:15 AM - 10:30 PM)",
    festivals: "Ganesh Chaturthi, Angaraki Sankashti Chaturthi, Maghi Ganeshotsav",
    dressCode: "Traditional Modest Attire",
    deity: "Lord Ganesha (Navasacha Ganapati - Right-trunked Siddhivinayak)",
    bestTime: "Year-round (Peak Tuesday and Angaraki Chaturthi devotion)",
    image: "/images/destinations/siddhivinayak_temple.jpg",
    attribution: "Wikimedia Commons: By Darwin Sodhi (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/siddhivinayak_temple.jpg"
    ],
    overview: "Consecrated in 1801, Shree Siddhivinayak Ganapati Mandir in Prabhadevi is Mumbai's most beloved shrine of faith. The idol of Lord Ganesha is uniquely carved out of a single piece of black stone with his trunk curved to the right (Navasacha Ganapati - wish granter), flanked by Riddhi and Siddhi. Millions from all walks of life—from film icons to pilgrims—seek divine grace here.",
    howToReach: {
      byAir: "Chhatrapati Shivaji Maharaj International Airport, Mumbai (BOM - 12 km).",
      byRail: "Dadar Railway Station (2 km, central intersection of Western & Central railways).",
      byRoad: "Located in central Mumbai on Veer Savarkar Marg, Prabhadevi."
    },
    nearbyPlaces: [
      { name: "Shivaji Park & Dadar Chowpatty", distance: "1.5 km", desc: "Historic coastal ground and promenade overlooking Bandra-Worli Sea Link." },
      { name: "Mahalaxmi Temple & Haji Ali", distance: "6 km", desc: "Historic sea-facing shrines on Mumbai's southern coastline." },
      { name: "Gateway of India", distance: "12 km", desc: "Monumental stone archway overlooking Mumbai harbor." }
    ],
    tips: [
      "Use the Siddhivinayak Temple Trust mobile app to book digital time-slot darshan on Tuesdays.",
      "Purchase fresh Modaks and red hibiscus flowers (Jaswand) from authentic stall vendors outside gate 2."
    ],
    popular: true
  },
  {
    id: "shirdi_sai_temple",
    name: "Shirdi Sai Baba Temple",
    title: "Shri Saibaba Sansthan Temple, Shirdi",
    category: "manyata_temples",
    categories: ["manyata_temples"],
    categoryLabel: "Famous & Manyata Temples",
    badge: "Manyata",
    stateId: "maharashtra",
    state: "Maharashtra",
    location: "Shirdi, Ahmednagar, Maharashtra",
    lat: 19.7667,
    lng: 74.4764,
    altitude: "508 m",
    timings: "04:00 AM - 11:15 PM (Kakad Aarti at 04:30 AM, Shej Aarti at 10:30 PM)",
    festivals: "Ram Navami, Guru Purnima, Sai Punyatithi (Vijayadashami)",
    dressCode: "Traditional Modest Attire",
    deity: "Shri Sai Baba (Universal Divine Saint)",
    bestTime: "September to March",
    image: "/images/destinations/shirdi_sai_temple.jpg",
    attribution: "Wikimedia Commons: By Sai Sansthan (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/shirdi_sai_temple.jpg"
    ],
    overview: "Shirdi is the sacred resting ground of the 19th-century saint Shri Sai Baba, who taught 'Sabka Malik Ek' (One God Governs All) and 'Shraddha & Saburi' (Faith & Patience). The Samadhi Mandir houses Baba's holy tomb crafted from Italian white marble. The sacred fire (Dhuni) lit by Baba at the adjacent Dwarkamai mosque has burned continuously for over a century.",
    howToReach: {
      byAir: "Shirdi International Airport (SAG - 14 km, direct flights from Mumbai, Delhi, Bengaluru, Hyderabad).",
      byRail: "Sainagar Shirdi Railway Station (SNSI - 3 km) / Kopargaon (16 km) / Manmad (60 km).",
      byRoad: "Smooth expressway connectivity from Pune (4 hrs), Mumbai (4.5 hrs via Samruddhi Mahamarg)."
    },
    nearbyPlaces: [
      { name: "Dwarkamai & Chavadi", distance: "Adjacent", desc: "The historic mosque where Sai Baba lived and the sacred perpetual Dhuni fire." },
      { name: "Lendibaug Garden", distance: "300m", desc: "Tranquil garden nurtured by Sai Baba with an eternal lamp under the neem tree." },
      { name: "Shani Shingnapur", distance: "72 km", desc: "Famous doorless village dedicated to Lord Shani Dev on open-air platform." }
    ],
    tips: [
      "Book online VIP Darshan or Aarti passes on the official online.sai.org.in portal in advance.",
      "Savor the subsidized multi-course vegetarian Prasad served at the Asia's largest solar kitchen Prasadalaya."
    ],
    popular: true
  },
  {
    id: "golden_temple_amritsar",
    name: "Golden Temple Amritsar",
    title: "Sri Harmandir Sahib (The Golden Temple)",
    category: "manyata_temples",
    categories: ["manyata_temples"],
    categoryLabel: "Famous & Manyata Temples",
    badge: "Sacred Shrine",
    stateId: "punjab",
    state: "Punjab",
    location: "Amritsar, Punjab",
    lat: 31.6200,
    lng: 74.8765,
    altitude: "234 m",
    timings: "03:00 AM - 11:00 PM (Langar hall open 24/7 round the clock)",
    festivals: "Baisakhi, Guru Nanak Gurpurab, Diwali (Bandi Chhor Divas)",
    dressCode: "Head must be covered (scarf/rumal); footwear removed; modest clothing",
    deity: "Sri Guru Granth Sahib (Eternal Living Guru)",
    bestTime: "October to March",
    image: "/images/destinations/golden_temple_amritsar.jpg",
    attribution: "Wikimedia Commons: By Paulrudd (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/golden_temple_amritsar.jpg"
    ],
    overview: "Sri Harmandir Sahib (the Golden Temple) is the supreme spiritual center of Sikhism, founded by Guru Ram Das and consecrated by Guru Arjan Dev. Floating peacefully in the center of the Amrit Sarovar (Pool of Nectar), the two-story shrine is overlaid with 500 kg of pure gold leaf. With four open doors welcoming all people of all faiths, its 24/7 Guru Ram Das Langar feeds over 100,000 pilgrims free daily.",
    howToReach: {
      byAir: "Sri Guru Ram Dass Jee International Airport, Amritsar (ATQ - 12 km).",
      byRail: "Amritsar Junction (ASR - 2.5 km, free electric bus shuttles to temple).",
      byRoad: "Smooth national highway NH 44 from New Delhi (7 hrs) and Chandigarh (4 hrs)."
    },
    nearbyPlaces: [
      { name: "Jallianwala Bagh Memorial", distance: "400m", desc: "Historic national memorial honoring the 1919 martyrs of India's independence movement." },
      { name: "Akal Takht Sahib", distance: "In Complex", desc: "The highest temporal seat of Sikh authority facing the Sarovar." },
      { name: "Wagah-Attari Border Ceremony", distance: "30 km", desc: "Electrifying daily evening retreat ceremony on the India-Pakistan international border." }
    ],
    tips: [
      "Cover your head at all times inside the complex (free orange headscarves provided at gates).",
      "Volunteer for 30 minutes in the Langar hall or utensil washing service (Seva) for a deeply moving spiritual experience."
    ],
    popular: true
  },
  {
    id: "padmanabhaswamy_temple",
    name: "Padmanabhaswamy Temple",
    title: "Sree Padmanabhaswamy Temple",
    category: "manyata_temples",
    categories: ["manyata_temples"],
    categoryLabel: "Famous & Manyata Temples",
    badge: "Divya Desam",
    stateId: "kerala",
    state: "Kerala",
    location: "Thiruvananthapuram, Kerala",
    lat: 8.4828,
    lng: 76.9436,
    altitude: "10 m",
    timings: "03:30 AM - 12:00 PM & 05:00 PM - 08:30 PM (Specific intermittent darshan slots)",
    festivals: "Alpashy Utsavam, Panguni Festival, Lakshadeepam (100,000 oil lamps)",
    dressCode: "Strict: Men in traditional white Mundu/Dhoti (bare chest); Women in Saree/Mundum Neriyathum",
    deity: "Lord Vishnu (Anantha Padmanabhaswamy in Ananthasayanam posture)",
    bestTime: "September to March",
    image: "/images/destinations/padmanabhaswamy_temple.jpg",
    attribution: "Wikimedia Commons: By Dinuraj (CC BY 2.0)",
    gallery: [
      "/images/destinations/padmanabhaswamy_temple.jpg"
    ],
    overview: "Built in an exquisite fusion of Kerala and Dravidian architectural styles, Sree Padmanabhaswamy Temple in Thiruvananthapuram is one of the 108 Divya Desams and the richest shrine in human history. The 18-foot deity of Lord Vishnu reclines on the five-hooded serpent Anantha in eternal yogic sleep (Ananthasayanam), viewed through three distinct doors corresponding to his face, navel, and lotus feet.",
    howToReach: {
      byAir: "Thiruvananthapuram International Airport (TRV - 4 km).",
      byRail: "Thiruvananthapuram Central Railway Station (TVC - 1 km).",
      byRoad: "Smooth access in the city center of Kerala's capital city."
    },
    nearbyPlaces: [
      { name: "Padmatheertham Tank", distance: "Adjacent", desc: "Sacred lotus pond fronting the grand 100-foot 7-tier gopuram." },
      { name: "Kuthiramalika (Mansion of Horses)", distance: "200m", desc: "Travancore royal palace featuring 122 teakwood horses and antique royal treasures." },
      { name: "Kovalam Beach & Lighthouse", distance: "14 km", desc: "World-famous crescent beach on the Arabian coast with historic lighthouse." }
    ],
    tips: [
      "Strict Kerala dress code is enforced: Dhotis (Mundu) can be rented or purchased outside temple gates.",
      "No electronic items, leather items, or bags are permitted inside; use official security lockers."
    ],
    popular: true
  },
  {
    id: "banke_bihari_temple",
    name: "Banke Bihari Temple",
    title: "Shri Banke Bihari Mandir, Vrindavan",
    category: "manyata_temples",
    categories: ["manyata_temples"],
    categoryLabel: "Famous & Manyata Temples",
    badge: "Manyata",
    stateId: "uttar_pradesh",
    state: "Uttar Pradesh",
    location: "Vrindavan, Mathura, Uttar Pradesh",
    lat: 27.5813,
    lng: 77.7011,
    altitude: "170 m",
    timings: "07:45 AM - 12:00 PM & 05:30 PM - 09:30 PM (Summer/Winter timings vary by 30 mins)",
    festivals: "Janmashtami (Mangala Aarti only on this night), Holi, Jhulan Yatra, Radhashtami",
    dressCode: "Traditional Modest Attire",
    deity: "Lord Krishna (Banke Bihari - Tribhanga Bent Posture)",
    bestTime: "September to March",
    image: "/images/destinations/banke_bihari_temple.jpg",
    attribution: "Wikimedia Commons: By Joydeep (CC BY-SA 3.0)",
    gallery: [
      "/images/destinations/banke_bihari_temple.jpg"
    ],
    overview: "Established by the great music master and saint Swami Haridas (guru of Tansen) in the 16th century, Shri Banke Bihari Mandir is the radiant heart of Vrindavan devotion. The charming black stone idol stands in the tribhanga (three-fold bent) posture. In unique tradition, a velvet curtain is drawn and opened every few minutes before the deity so that devotees are not overwhelmed by the captivating enchantment of Bihari Ji's divine gaze.",
    howToReach: {
      byAir: "Indira Gandhi International Airport, New Delhi (DEL - 150 km) / Agra Airport (75 km).",
      byRail: "Mathura Junction (MTJ - 12 km, premier junction with 24/7 auto/cab fleet).",
      byRoad: "Smooth Yamuna Expressway from Delhi (2.5 hrs) and Agra (1 hr)."
    },
    nearbyPlaces: [
      { name: "Nidhivan", distance: "1 km", desc: "Mystical sacred forest where Radha and Krishna are believed to perform Raas Leela nightly." },
      { name: "Prem Mandir & Light Show", distance: "3.5 km", desc: "Monumental white Italian Carrara marble temple with synchronized evening musical fountain." },
      { name: "Shri Krishna Janmabhoomi, Mathura", distance: "12 km", desc: "The divine prison cell birthplace of Lord Krishna in sacred Mathura." }
    ],
    tips: [
      "Keep eyeglasses, mobile phones, and bags closely secured as Vrindavan monkeys are remarkably clever.",
      "Unlike other temples, there are no bells or loud gongs here; prayers are sung gently in sweet Vraja Bhasha."
    ],
    popular: true
  }
];

// Read existing tirthData.js
const tirthDataPath = path.resolve('src/data/tirthData.js');
let content = fs.readFileSync(tirthDataPath, 'utf8');

// Update existing destinations to include categories array
const existingCategoriesMap = {
  kedarnath_temple: ['jyotirlingas', 'chardham'],
  badrinath_temple: ['chardham'],
  gangotri_dham: ['chardham'],
  yamunotri_dham: ['chardham'],
  vaishno_devi: ['manyata_temples', 'shaktipeeths'],
  tirupati_balaji: ['manyata_temples'],
  kashi_vishwanath: ['jyotirlingas'],
  jagannath_puri: ['chardham'],
  meenakshi_temple: ['manyata_temples'],
  somnath_temple: ['jyotirlingas'],
  kamakhya_devi: ['shaktipeeths'],
  mahakaleshwar_ujjain: ['jyotirlingas'],
  dhanushkodi_rameshwaram: ['chardham', 'jyotirlingas'],
  hampi_virupaksha: ['heritage_history'],
  khatu_shyam_ji: ['manyata_temples'],
  bhedaghat_dhuandhar: ['lakes_waterfalls']
};

for (const [id, cats] of Object.entries(existingCategoriesMap)) {
  const targetStr = `id: "${id}",`;
  if (content.includes(targetStr)) {
    // Check if categories is already added
    if (!content.includes(`id: "${id}",\n    categories:`)) {
      content = content.replace(
        targetStr,
        `id: "${id}",\n    categories: ${JSON.stringify(cats)},`
      );
    }
  }
}

// Append new entries before the closing ]; of FLAGSHIP_DESTINATIONS
const lastDestMarker = 'id: "bhedaghat_dhuandhar"';
const lastDestIndex = content.lastIndexOf(lastDestMarker);
if (lastDestIndex !== -1) {
  const closingBracketIndex = content.indexOf('];', lastDestIndex);
  if (closingBracketIndex !== -1) {
    const serializedNewEntries = NEW_ENTRIES.map(entry => {
      return `  ${JSON.stringify(entry, null, 2).replace(/\n/g, '\n  ')}`;
    }).join(',\n');

    content = content.slice(0, closingBracketIndex) + ',\n' + serializedNewEntries + '\n' + content.slice(closingBracketIndex);
    fs.writeFileSync(tirthDataPath, content, 'utf8');
    console.log('Successfully updated tirthData.js with new destinations!');
  } else {
    console.error('Could not find closing bracket of FLAGSHIP_DESTINATIONS');
  }
} else {
  console.error('Could not find bhedaghat_dhuandhar in tirthData.js');
}

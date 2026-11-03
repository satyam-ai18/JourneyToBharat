// Master Route Corridors & Polylines
// Visually separate Highway Road routes from Railway Tracks
// Supports dynamic optional detours (Mandu, Sanchi/Bhimbetka, Deeg, Jaipur, Salasar)

export const MASTER_CORRIDORS = {
  // 1. Primary Highway Highway Corridor
  primaryRoad: {
    name: "Master Highway Corridor (NH19, NH35, NH30, NH46, NH52, Samruddhi, Yamuna Exp, NH21)",
    color: "#f59e0b", // Amber Gold
    weight: 5,
    opacity: 0.9,
    points: [
      [25.3176, 82.9739], // Varanasi
      [25.1611, 82.5028], // Vindhyachal / Mirzapur
      [25.4358, 81.8463], // Prayagraj
      [25.8617, 81.6025], // Bhakti Mandir Mangarh (Pratapgarh)
      [25.1764, 80.8687], // Chitrakoot
      [24.2676, 80.7583], // Maihar
      [23.1815, 79.9864], // Jabalpur
      [23.1006, 77.5847], // Bhojpur
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
      [27.3639, 75.3054]  // Khatu Shyam Ji
    ]
  },

  // 2. Verified Indian Railways Mainlines (Visually distinct: dashed, slate-blue/cyan)
  railways: [
    {
      id: "rail_ncr_01",
      name: "North Central Mainline (Pt. DDU - Varanasi - Mirzapur - Prayagraj)",
      color: "#38bdf8",
      weight: 3.5,
      dashArray: "6, 8",
      points: [
        [25.2819, 83.1158], // DDU
        [25.3283, 82.9864], // Varanasi BSB
        [25.1439, 82.5658], // Mirzapur MZP
        [25.1653, 82.5111], // Vindhyachal BDL
        [25.3853, 81.8739], // Naini NYN
        [25.4489, 81.8333]  // Prayagraj PRYJ
      ]
    },
    {
      id: "rail_bundelkhand",
      name: "Prayagraj - Manikpur - Chitrakoot Rail Corridor",
      color: "#38bdf8",
      weight: 3.5,
      dashArray: "6, 8",
      points: [
        [25.4489, 81.8333], // Prayagraj PRYJ
        [25.0411, 81.0822], // Manikpur MKP
        [25.2144, 80.8986]  // Chitrakootdham Karwi CKTD
      ]
    },
    {
      id: "rail_wcr_01",
      name: "Prayagraj - Satna - Maihar - Katni - Jabalpur Mainline",
      color: "#38bdf8",
      weight: 3.5,
      dashArray: "6, 8",
      points: [
        [25.4489, 81.8333], // Prayagraj PRYJ
        [25.0411, 81.0822], // Manikpur MKP
        [24.5714, 80.8258], // Satna STA
        [24.2658, 80.7619], // Maihar MYR
        [23.8344, 80.4003], // Katni KTE
        [23.1617, 79.9547]  // Jabalpur JBP
      ]
    },
    {
      id: "rail_wcr_02",
      name: "Jabalpur - Itarsi - Bhopal Rail Line",
      color: "#38bdf8",
      weight: 3.5,
      dashArray: "6, 8",
      points: [
        [23.1617, 79.9547], // Jabalpur
        [22.9231, 78.7842], // Narsinghpur
        [22.6128, 77.7619], // Itarsi
        [23.2081, 77.4375], // Rani Kamlapati
        [23.2689, 77.4128]  // Bhopal BPL
      ]
    },
    {
      id: "rail_wr_01",
      name: "Bhopal - Ujjain - Indore Western Railway Mainline",
      color: "#38bdf8",
      weight: 3.5,
      dashArray: "6, 8",
      points: [
        [23.2689, 77.4128], // Bhopal
        [23.2975, 77.0389], // Sehore
        [23.1803, 75.7778], // Ujjain UJN
        [22.7175, 75.8683]  // Indore INDB
      ]
    },
    {
      id: "rail_cr_nashik",
      name: "Khandwa - Bhusawal - Manmad - Nashik Central Mainline",
      color: "#38bdf8",
      weight: 3.5,
      dashArray: "6, 8",
      points: [
        [21.8286, 76.3533], // Khandwa KNW
        [21.0456, 75.7892], // Bhusawal BSL
        [20.2528, 74.4361], // Manmad MMR
        [19.9575, 73.8378], // Nashik Road NK
        [19.6964, 73.5594]  // Igatpuri IGP
      ]
    },
    {
      id: "rail_braj_nwr",
      name: "Mathura - Bharatpur - Jaipur - Ringas (Khatu) Mainline",
      color: "#38bdf8",
      weight: 3.5,
      dashArray: "6, 8",
      points: [
        [27.4914, 77.6736], // Mathura MTJ
        [27.2389, 77.4986], // Bharatpur BTE
        [26.9194, 75.7878], // Jaipur JP
        [27.3589, 75.5683], // Ringas RGS
        [27.6089, 75.1483]  // Sikar SIKR
      ]
    }
  ],

  // 3. Optional Scenic & Heritage Detours
  optionalDetours: [
    {
      id: "detour_sanchi_bhimbetka",
      name: "Sanchi & Bhimbetka UNESCO Detour (MP)",
      color: "#10b981", // Emerald Green
      points: [
        [23.2599, 77.4126], // Bhopal
        [23.4795, 77.7397], // Sanchi Stupa
        [23.2599, 77.4126], // Return via Bhopal
        [22.9372, 77.6128]  // Bhimbetka Caves
      ]
    },
    {
      id: "detour_mandu",
      name: "Mandu Fortress City Detour (MP)",
      color: "#ec4899", // Pink
      points: [
        [22.7196, 75.8577], // Indore
        [22.5989, 75.3014], // Dhar
        [22.3664, 75.4044], // Mandu Jahaz Mahal
        [22.3169, 75.3942], // Roopmati Pavilion
        [22.1764, 75.5833]  // Maheshwar
      ]
    },
    {
      id: "detour_deeg_bharatpur",
      name: "Deeg & Bharatpur Bird Sanctuary Detour (Rajasthan)",
      color: "#8b5cf6", // Purple
      points: [
        [27.4958, 77.4642], // Govardhan
        [27.4722, 77.3278], // Deeg Palace
        [27.2152, 77.4930], // Bharatpur
        [27.1611, 77.5222]  // Keoladeo National Park
      ]
    },
    {
      id: "detour_jaipur",
      name: "Jaipur Pink City & Amer Fort Detour (Rajasthan)",
      color: "#f43f5e", // Rose
      points: [
        [27.3589, 75.5683], // Ringas
        [26.9124, 75.7873], // Jaipur City
        [26.9855, 75.8513], // Amber Fort
        [26.9278, 75.8242]  // Govind Dev Ji
      ]
    },
    {
      id: "detour_salasar",
      name: "Salasar Balaji Pilgrimage Detour (Rajasthan)",
      color: "#06b6d4", // Cyan
      points: [
        [27.3639, 75.3054], // Khatu Shyam Ji
        [27.5342, 75.1856], // Jeen Mata
        [27.6089, 75.1483], // Sikar
        [27.7214, 74.8219]  // Salasar Balaji
      ]
    }
  ]
};

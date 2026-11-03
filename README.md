# Bharat Pilgrimage & Tourism Master Atlas: Complete Pan-India Geospatial System

> **A Unified Interactive Geospatial Travel Map, Distance Matrix & Transit Atlas** covering **North, Central, West, and South India**: Uttar Pradesh, Madhya Pradesh, Maharashtra, Rajasthan, Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and Puducherry.
> 
> Built with **React 19**, **Vite**, **Leaflet**, **OpenStreetMap**, **OSRM Routing Engine**, and live **Google Maps Platform API** (Routes v2, Places v1, Geocoding, and Tile Layers).

---

## 🗺️ Unified Subcontinental Routes (Zero Day-wise Itineraries)

Organized strictly **geographically, station-wise, city-wise, and route-wise** with zero Day 1/Day 2 schedules:

### 1. 🌟 Flagship Pan-India Grand Pilgrimage Circuit (41 Major Stops)
```text
Varanasi ➔ Prayagraj ➔ Bhakti Mandir Mangarh ➔ Chitrakoot ➔ Vindhyachal/Mirzapur ➔ Maihar 
➔ Jabalpur & Nature ➔ Bhopal/Sanchi/Bhojpur ➔ Ujjain ➔ Indore ➔ Omkareshwar ➔ Maheshwar 
➔ Mandu [Detour] ➔ Nashik/Trimbakeshwar ➔ Mathura/Vrindavan ➔ Govardhan/Barsana/Nandgaon 
➔ Agra/Fatehpur Sikri [Detour] ➔ Deeg/Bharatpur [Detour] ➔ Khatu Shyam Ji/Jeen Mata/Harshnath 
➔ Jaipur [Detour] ➔ Salasar Balaji [Detour] ➔ Nagpur Gateway ➔ Tirupati ➔ Chennai ➔ Mahabalipuram 
➔ Puducherry ➔ Thanjavur ➔ Tiruchirappalli ➔ Madurai ➔ Rameswaram ➔ Dhanushkodi [Detour] 
➔ Kanyakumari ➔ Munnar ➔ Thekkady ➔ Alleppey ➔ Kochi ➔ Ooty ➔ Coonoor [Detour] 
➔ Coorg [Detour] ➔ Mysuru ➔ Bengaluru ➔ Return to Varanasi
```

### 2. 🏛️ North, Central & West India Circuit (21 Stops)
UP, MP, Maharashtra, Rajasthan & Agra Mughal Heritage Corridor.

### 3. 🌴 South India Grand Geographic Circuit (20 Stops)
Varanasi ➔ Eastern Ghats ➔ Coromandel Coast ➔ Cauvery Delta ➔ Pamban ➔ Cape Comorin ➔ Backwaters ➔ Nilgiris ➔ Western Ghats ➔ Bengaluru.

---

## ⚡ 10-Dimension Geospatial Distance Intelligence System

Every destination, attraction, and transport hub includes a comprehensive distance panel computing:

1. **Straight-Line Distance (Haversine)**: Great-circle geometric flight distance with interactive reference location selector.
2. **Actual Road Distance (Live Routing)**: Measured via OSRM Driving Engine and Google Maps Routes API v2, with exact driving duration and winding curvature factor.
3. **Verified Railway Route Distance**: Official broad gauge track distances compiled from Indian Railways / NTES network. Displays `"Rail distance unavailable — verify railway route"` whenever direct track geometry is absent.
4. **Distance to Nearest Useful Railway Station**: Discovers official stations within 25–50 km, displaying station code, straight-line km, road km, and last-mile transfer advice.
5. **Distance to Nearest Useful Bus Terminal**: Discovers state transport stands (UPSRTC, MP Transport, MSRTC, RSRTC, TNSTC, KSRTC-KL, KSRTC-KA, APSRTC) with straight-line and road km.
6. **Distance to Nearest Tourist Attraction**: Closest cultural or scenic sight with road km and category.
7. **Distance to User-Selected Destination**: Real-time road and straight-line measurement to any other destination in India.
8. **Active Route Consecutive Legs**: Exact road and straight-line distance to previous and next stops in custom route.
9. **Optional Detour Mileage**: Specific extra road mileage incurred when visiting branch detours (e.g. Mandu, Salasar, Agra, Dhanushkodi).
10. **Distance to City Center**: Distance from the destination cluster's urban downtown core.

---

## 📊 Distance Matrix & Multi-Modal Comparator

1. **Two-Point Transit Comparison**:
   - Compare any two locations across India.
   - Side-by-side comparison of Straight-Line, Road (Car/Taxi), Verified Rail, State Roadways Bus, and Walking Pace.
   - Highlights gateway stations, bus terminals, and winding factor ratio.
2. **Multi-Stop Distance Matrix ($N \times N$ Table)**:
   - Select up to 8 destinations from across India.
   - Generates an interactive $N \times N$ matrix displaying both road distance and straight-line distance in every cell.
3. **Custom Route Consecutive Legs**:
   - Step-by-step consecutive segment breakdown for the entire 41-stop route.
   - Displays Segment Corridor, Road Distance, Straight-Line Distance, Driving Time, and Primary vs. Detour classification.
   - Cumulative total road distance computed: **`10,505.6 km`** (~`143 hrs 17 mins` driving time).

---

## 🔍 Nearby Places Discovery (5 / 10 / 25 / 50 km)

For every temple, waterfall, mountain, fort, cave, ghat, and beach:
- Interactive radius filter buttons: `5 km`, `10 km`, `25 km`, `50 km`.
- Sort modes: **Sort by Road Distance** vs. **Sort by Straight-Line Distance**.
- Side-by-side display of road km, driving duration, and straight-line km.
- **Detour Warning Badge**: Automatically flags sights where `Road Km > 1.5x Straight-Line Km` (e.g. hill ghat winding or river bypasses).

---

## 🚆 Verified Indian Railways Stations & Halts

**85+ Verified Stations** with authentic official codes, including:
- **UP**: `BSB`, `BSBS`, `DDU`, `BCY`, `PRYJ`, `PYGS`, `PRG`, `NYN`, `SFG`, `KHNM` (Kunda Harnamganj - 5.5 km from Bhakti Mandir Mangarh), `CKTD`, `MKP`, `BDL`, `MZP`, `MTJ`, `BDB`, `GDO`, `KSV`, `AGC`, `AF`, `RKM`.
- **MP**: `MYR`, `STA`, `KTE`, `JBP`, `MML`, `BRGT`, `BPL`, `RKMP`, `SCI`, `BHS`, `UJN`, `FTD`, `INDB`, `DADN`, `OM`, `KNW`, `BWW`.
- **Maharashtra**: `NK`, `IGP`, `MMR`.
- **Rajasthan**: `RGS` (Ringas Jn - verified railhead for Khatu Shyam Ji), `SIKR`, `BTE`, `DEEG`, `JP`, `GADJ`, `SUJH` (Sujangarh - verified railhead for Salasar Balaji), `CUR`.
- **South India**: `TPTY`, `RU`, `MAS`, `MS`, `TBM`, `CGL`, `PDY`, `VM`, `TJ`, `TPJ`, `MDU`, `RMM`, `CAPE`, `NCJ`, `TVC`, `ALLP`, `ERS`, `ERN`, `CBE`, `MTP`, `UAM`, `MYS`, `SBC`, `YPR`.

---

## 🚀 Installation & Running

```bash
# Clone the repository
git clone <repo-url>
cd South

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **`http://localhost:5173/`** to interact with the full application.

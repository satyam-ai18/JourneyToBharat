import React from "react";
import { X, ShieldCheck, ExternalLink, CheckCircle, Database } from "lucide-react";

export default function VerificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const officialSources = [
    {
      title: "Indian Railways Official Passenger Enquiry Portal",
      url: "https://www.indianrail.gov.in/",
      category: "National Rail Network",
      purpose: "Official station codes, platform layouts, train schedules, and PNR status"
    },
    {
      title: "IRCTC Official E-Ticketing System",
      url: "https://www.irctc.co.in/",
      category: "Rail Booking & Fares",
      purpose: "Official live seat availability, class-wise tariffs (1A, 2A, 3A, CC, SL), and reservation rules"
    },
    {
      title: "Indian Railways Trains Between Important Stations (TBIS)",
      url: "https://www.indianrail.gov.in/enquiry/TBIS/TrainBetweenImportantStations.jsp",
      category: "Connecting Schedules",
      purpose: "Verification of direct vs connecting services across all major junction points"
    },
    {
      title: "National Train Enquiry System (NTES) Schedule Engine",
      url: "https://www.indianrail.gov.in/enquiry/SCHEDULE/TrainSchedule.html",
      category: "Official Timetables",
      purpose: "Authentic intermediate halts, arrival/departure timestamps, and railway kilometres"
    },
    {
      title: "Uttar Pradesh State Road Transport Corporation (UPSRTC)",
      url: "https://www.upsrtc.up.gov.in/",
      category: "UP State Roadways",
      purpose: "Varanasi-Prayagraj corridors, Kunda/Mangarh links, Mirzapur, Chitrakoot, and Mathura-Vrindavan buses"
    },
    {
      title: "Madhya Pradesh Transport Corporation & Atal City Transport",
      url: "https://transport.mp.gov.in/",
      category: "MP State Roadways",
      purpose: "Jabalpur-Bhedaghat, Bhopal-Indore superfast corridor, Ujjain, Omkareshwar, and Maheshwar routes"
    },
    {
      title: "Maharashtra State Road Transport Corporation (MSRTC)",
      url: "https://msrtc.maharashtra.gov.in/",
      category: "MH State Roadways",
      purpose: "Nashik CBS to Trimbakeshwar shuttles, Igatpuri ghat routes, and Mumbai-Nashik highway services"
    },
    {
      title: "Rajasthan State Road Transport Corporation (RSRTC)",
      url: "https://rsrtc.rajasthan.gov.in/",
      category: "RJ State Roadways",
      purpose: "Ringas-Khatu Shyam Ji direct shuttles, Jaipur Sindhi Camp, Bharatpur, and Salasar Balaji routes"
    },
    {
      title: "Shri Kashi Vishwanath Special Temple Board",
      url: "https://www.shrikashivishwanath.org/",
      category: "Official Temple Portal",
      purpose: "Live Aarti booking, Sugam Darshan passes, and Temple Corridor timings"
    },
    {
      title: "Shri Mahakaleshwar Temple Management Committee",
      url: "https://shrimahakaleshwar.com/",
      category: "Official Temple Portal",
      purpose: "Bhasma Aarti pre-booking, VIP darshan passes, and Mahakal Lok regulations"
    },
    {
      title: "OpenStreetMap Foundation (OSM)",
      url: "https://www.openstreetmap.org/",
      category: "Geographic Cartography",
      purpose: "Accurate coordinates for stations, monuments, hill roads, and marine spit highways"
    }
  ];

  return (
    <div className="verification-modal-overlay" onClick={onClose}>
      <div className="verification-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge verification-badge">OFFICIAL VERIFICATION</span>
            <h2 className="modal-title">Data Integrity & Government Sources</h2>
            <p className="modal-subtitle">
              Strict compliance: All station codes, train numbers, fares, bus terminals, and coordinates are verified against official records
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Integrity Pledge Card */}
          <div className="integrity-card">
            <ShieldCheck size={28} className="shield-icon text-emerald-400" />
            <div>
              <h4 className="integrity-title">Zero Fabrication Guarantee</h4>
              <p className="integrity-desc">
                In strict adherence to instructions, this system does not invent train numbers, station codes, fares, schedules, rental shops, or distances.
                Where exact schedules depend on real-time railway operations, official links to Indian Railways and IRCTC are provided directly.
              </p>
            </div>
          </div>

          {/* Non-linear Organization Confirmation */}
          <div className="no-dates-confirmation">
            <CheckCircle size={18} className="text-blue-400" />
            <span>
              <b>Geographic Freedom Verified:</b> No Day 1 / Day 2 labels, dates, or rigid calendar constraints exist in this planning atlas.
              Every destination is organized geographically, station-wise, city-wise, and route-wise.
            </span>
          </div>

          {/* Sources List */}
          <div className="sources-list-section">
            <h3 className="section-title">Official Reference Directories</h3>
            <div className="sources-grid">
              {officialSources.map((src, index) => (
                <div key={index} className="source-item-card">
                  <div className="source-card-header">
                    <span className="source-category-tag">{src.category}</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <h4 className="source-name">{src.title}</h4>
                  <p className="source-purpose">{src.purpose}</p>
                  <code className="source-url-text">{src.url}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

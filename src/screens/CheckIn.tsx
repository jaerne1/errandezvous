import { useState } from "react";
import { Radio, ShieldAlert, Navigation, Clock, X } from "lucide-react";
import { matchedPerson } from "../data/mockData";
import { Avatar } from "../components/Avatar";

export function CheckIn() {
  const [sosOpen, setSosOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const handleSosConfirm = () => {
    setSosSent(true);
    setSosOpen(false);
    setTimeout(() => setSosSent(false), 3000);
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <div>
          <h1>Active task</h1>
          <p className="screen__subtitle">Grocery run at Sprout's</p>
        </div>
      </header>

      <div className="map-placeholder">
        <div className="map-placeholder__grid" />
        <div className="map-placeholder__pin map-placeholder__pin--me">
          <Navigation size={16} />
        </div>
        <div className="map-placeholder__pin map-placeholder__pin--them">
          <Avatar color={matchedPerson.photoColor} initials={matchedPerson.initials} size={30} />
        </div>
        <div className="live-badge">
          <span className="live-badge__dot" />
          <Radio size={14} /> Live location sharing on
        </div>
      </div>

      <div className="checkin-info">
        <div className="checkin-info__row">
          <Avatar color={matchedPerson.photoColor} initials={matchedPerson.initials} size={40} />
          <div>
            <h3>{matchedPerson.name}</h3>
            <span className="checkin-info__meta">
              <Clock size={13} /> Checked in 12 min ago
            </span>
          </div>
        </div>
        <p className="checkin-info__note">
          You're sharing live location with Riley and one emergency contact for the duration of this
          task.
        </p>
      </div>

      {sosSent && (
        <div className="sos-confirmation">SOS alert sent. Your emergency contact and TaskMate support have been notified.</div>
      )}

      <button className="sos-btn" onClick={() => setSosOpen(true)}>
        <ShieldAlert size={22} />
        SOS / Report an issue
      </button>

      {sosOpen && (
        <div className="modal-overlay" onClick={() => setSosOpen(false)}>
          <div className="modal modal--sos" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Send an SOS alert?</h2>
              <button className="icon-btn" onClick={() => setSosOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <p className="modal__body-text">
              This will immediately notify your emergency contact and TaskMate support with your live
              location.
            </p>
            <div className="modal__actions">
              <button className="btn btn--secondary btn--block" onClick={() => setSosOpen(false)}>
                Cancel
              </button>
              <button className="btn btn--danger btn--block" onClick={handleSosConfirm}>
                Send SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

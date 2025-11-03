import { useEffect, useState } from "react";
import { getEvents } from "../../utilities/users-api";
import "./ManagerDashboard.css";

export default function ManagedEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents).catch(() => {});
  }, []);

  return (
    <div className="dashboard-container manager">
      <header className="dashboard-header">
        <h1>📋 Managed Events</h1>
        <p className="welcome">Here’s a list of all events under your management.</p>
      </header>

      <section className="event-list">
        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id} className="event-item">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>Status: <strong>{event.status}</strong></p>
                <button className="action-card">View Details</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events">No managed events yet.</p>
        )}
      </section>
    </div>
  );
}

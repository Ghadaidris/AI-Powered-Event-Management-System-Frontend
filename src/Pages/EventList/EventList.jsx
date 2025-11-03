// frontend/src/pages/EventList/EventList.jsx
import { useEffect, useState } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../utilities/users-api';
import Navbar from '../../components/Navbar';
import './EventList.css';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',   
    date: '', 
    location: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getEvents().then(setEvents).catch(err => {
      console.error(err);
      alert('Failed to load events');
    });
  }, []);

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.location) {
      alert('Please fill Title, Date, and Location');
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description || null,
      date: formData.date,  // YYYY-MM-DD
      location: formData.location,
      company: null  // لا ترسلي company إلا إذا أضفتِ select
    };

    try {
      if (editingId) {
        const updated = await updateEvent(editingId, eventData);
        setEvents(events.map(e => e.id === editingId ? updated : e));
      } else {
        const newEvent = await createEvent(eventData);
        setEvents([...events, newEvent]);
      }
      resetForm();
    } catch (err) {
      console.error('Create event failed:', err);
      alert('Failed to save event. Check console for details.');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({ title: '', description: '', date: '', location: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await deleteEvent(id);
    setEvents(events.filter(e => e.id !== id));
  };

  const handleEdit = (evt) => {
    setFormData({ 
      title: evt.title, 
      description: evt.description || '',  
      date: evt.date, 
      location: evt.location 
    });
    setEditingId(evt.id);
    setShowForm(true);
  };

  return (
    <>
      <Navbar />
      <div className="list-container">
        <header className="list-header">
          <h1>Events Management</h1>
          <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Event</button>
        </header>

        {showForm && (
          <div className="form-card">
            <input placeholder="Title *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" />
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            <input placeholder="Location *" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <div className="form-actions">
              <button onClick={handleSubmit} className="btn-save">Save</button>
              <button onClick={resetForm} className="btn-cancel">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid">
          {events.length === 0 ? (
            <p className="no-data">No events. Click "+ Add Event" to create one.</p>
          ) : (
            events.map(evt => (
              <div key={evt.id} className="item-card">
                <h3>{evt.title}</h3>
                <p><strong>Description:</strong> {evt.description || '—'}</p>
                <p><strong>Date:</strong> {evt.date}</p>
                <p><strong>Location:</strong> {evt.location}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(evt)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(evt.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
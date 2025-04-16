import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EventCreatePage.scss';

const EventCreatePage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !email) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/events', {
        name,
        description,
        max_selections: 2,
        max_per_option: 25,
      });
      navigate(`/event/${res.data.eventId}/organizer`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating event.');
    }
  };

  return (
    <div className="event-create">
      <h1>Welcome to Conference Topic Selector</h1>
      <div className="options">
        <button onClick={() => document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' })}>
          Create New Event
        </button>
        <button onClick={() => navigate('/event/1/organizer')}>Open as Organizer</button>
        <button onClick={() => navigate('/event/1')}>Join as Participant</button>
      </div>

      <form id="event-form" onSubmit={handleSubmit} className="create-form">
        <h2>Create a New Event</h2>
        {error && <div className="error">{error}</div>}
        <label>
          Event Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Organizer Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default EventCreatePage;

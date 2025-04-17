import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EventCreatePage.scss';

const EventCreatePage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleStartVerification = async () => {
    setError('');
    if (!name || !description || !email) {
      return setError('All fields are required.');
    }
    if (!validateEmail(email)) {
      return setError('Invalid email format.');
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:3001/api/verify/request', { email });
      setCodeSent(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    setError('');
    if (!code) return setError('Please enter the code sent to your email.');

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3001/api/verify/confirm', { email, code });
      if (res.data.verified) {
        setVerified(true);
        await createEvent();
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/events', {
        name,
        description,
        email,
        max_selections: 2,
        max_per_option: 25,
      });
      navigate(`/event/${res.data.eventId}/organizer`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong.');
      } else {
        setError('Unexpected error occurred.');
      }
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

      <form id="event-form" className="create-form" onSubmit={(e) => e.preventDefault()}>
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

        {!codeSent ? (
          <button type="button" onClick={handleStartVerification} disabled={loading}>
            {loading ? 'Sending Code...' : 'Verify Email & Continue'}
          </button>
        ) : !verified ? (
          <>
            <label>
              Enter 6-digit Verification Code:
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} />
            </label>
            <button type="button" onClick={handleConfirmCode} disabled={loading}>
              {loading ? 'Verifying...' : 'Confirm & Create Event'}
            </button>
          </>
        ) : (
          <p className="success">Event created successfully!</p>
        )}
      </form>
    </div>
  );
};

export default EventCreatePage;

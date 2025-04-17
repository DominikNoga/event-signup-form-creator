import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventParticipantPage.scss';
import { getEvent, registerToEvent } from '../utils/apiUtil';
import axios from 'axios';

interface Option {
  id: number;
  label: string;
  count: number;
}

const EventParticipantPage: React.FC = () => {
  const { eventId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [event, setEvent] = useState<any>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const emailKey = `participant_email_${eventId}`;
  const verifiedKey = `participant_verified_${eventId}`;
  const submittedKey = `participant_submitted_${eventId}`;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEvent(eventId!);
        setEvent(res.data);
        setOptions(res.data.options);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load event.');
        } else {
          setError('Unexpected error occurred while loading event.');
        }
      }
    };
    fetchEvent();

    const savedEmail = localStorage.getItem(emailKey);
    const isVerified = localStorage.getItem(verifiedKey) === 'true';
    const isSubmitted = localStorage.getItem(submittedKey) === 'true';

    if (savedEmail) setEmail(savedEmail);
    if (isVerified) setVerified(true);
    if (isSubmitted) setSubmitted(true);
  }, [emailKey, eventId, submittedKey, verifiedKey]);

  const toggleOption = (label: string) => {
    if (selected.includes(label)) {
      setSelected(selected.filter(l => l !== label));
    } else if (selected.length < event.max_selections) {
      setSelected([...selected, label]);
    }
  };

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const sendCode = async () => {
    setError('');
    if (!name || !email) {
      return setError('Please enter your name and email.');
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
        setError(err.response?.data?.message || 'Failed to send verification code.');
      } else {
        setError('Unexpected error occurred while sending code.');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3001/api/verify/confirm', { email, code });
      if (res.data.verified) {
        setVerified(true);
        localStorage.setItem(emailKey, email);
        localStorage.setItem(verifiedKey, 'true');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid verification code.');
      } else {
        setError('Unexpected error occurred while verifying code.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || selected.length === 0 || !email) {
      return setError('Please complete all fields and select at least one option.');
    }

    try {
      setLoading(true);
      await registerToEvent(eventId!, name, email, selected);
      setSuccess('Successfully registered!');
      setError('');
      setSubmitted(true);
      localStorage.setItem(submittedKey, 'true');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error submitting selection.');
      } else {
        setError('Unexpected error occurred while submitting.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-participant">
      <h1>{event.name}</h1>
      <p>{event.description}</p>

      {submitted ? (
        <p className="success-msg">You have already submitted your response. Thank you!</p>
      ) : !verified ? (
        <>
          <div>
            <label>
              Your name:
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label>
              Your email:
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            {!codeSent ? (
              <button onClick={sendCode} disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            ) : (
              <>
                <label>
                  Enter Code:
                  <input type="text" value={code} onChange={e => setCode(e.target.value)} maxLength={6} />
                </label>
                <button onClick={confirmCode} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </>
            )}
          </div>
          {error && <div className="error-msg">{error}</div>}
        </>
      ) : (
        <>
          <h3>Select up to {event.max_selections} options:</h3>
          <ul>
            {options.map(opt => (
              <li key={opt.id}>
                <label>
                  <input
                    type="checkbox"
                    disabled={opt.count >= event.max_per_option && !selected.includes(opt.label)}
                    checked={selected.includes(opt.label)}
                    onChange={() => toggleOption(opt.label)}
                  />
                  {opt.label} ({opt.count}/{event.max_per_option})
                </label>
              </li>
            ))}
          </ul>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </>
      )}
    </div>
  );
};

export default EventParticipantPage;

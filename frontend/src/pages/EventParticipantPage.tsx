import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventParticipantPage.scss';
import { getEvent, registerToEvent } from '../utils/apiUtil';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEvent(eventId!);
        setEvent(res.data);
        setOptions(res.data.options);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };
    fetchEvent();
  }, [eventId]);

  const toggleOption = (label: string) => {
    if (selected.includes(label)) {
      setSelected(selected.filter(l => l !== label));
    } else if (selected.length < event.max_selections) {
      setSelected([...selected, label]);
    }
  };

  const handleSubmit = async () => {
    if (!name || selected.length === 0) {
      setError('Please enter your name and select at least one option.');
      return;
    }
    try {
      await registerToEvent(eventId!, name, selected);
      setSuccess('Successfully registered!');
      setError('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting selection.');
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-participant">
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <div>
        <label>
          Your name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
      </div>
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
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default EventParticipantPage;

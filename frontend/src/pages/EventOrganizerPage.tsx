import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent, addEventOption } from '../utils/apiUtil';
import '../styles/EventOrganizerPage.scss';

interface Option {
  id: number;
  label: string;
  count: number;
}

const EventOrganizerPage: React.FC = () => {
  const { eventId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [event, setEvent] = useState<any>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [newOption, setNewOption] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

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

  const addOption = async () => {
    if (!newOption.trim()) return;
    try {
      const res = await addEventOption(eventId!, newOption);
      setOptions([...options, { id: res.data.optionId, label: newOption, count: 0 }]);
      setNewOption('');
    } catch (err) {
      console.error('Error adding option:', err);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(link).then(() => setCopySuccess('Link copied!'));
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-organizer">
      <h1>Organizer View</h1>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <div className="config-section">
        <h3>Add Options</h3>
        <input
          type="text"
          placeholder="New option label"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <button onClick={addOption}>Add Option</button>
        <ul>
          {options.map((opt) => (
            <li key={opt.id}>{opt.label} ({opt.count}/{event.max_per_option})</li>
          ))}
        </ul>
      </div>
      <div className="share-section">
        <button onClick={copyLink}>Copy Participant Link</button>
        {copySuccess && <span className="copy-feedback">{copySuccess}</span>}
      </div>
    </div>
  );
};

export default EventOrganizerPage;

import { Routes, Route } from 'react-router-dom';
import EventCreatePage from './pages/EventCreatePage';
import EventOrganizerPage from './pages/EventOrganizerPage';
import EventParticipantPage from './pages/EventParticipantPage';
import './styles/App.scss';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EventCreatePage />} />
      <Route path="/event/:eventId/organizer" element={<EventOrganizerPage />} />
      <Route path="/event/:eventId" element={<EventParticipantPage />} />
    </Routes>
  );
}
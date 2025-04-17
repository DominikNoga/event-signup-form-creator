import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export const getEvent = (eventId: string) => {
  return axios.get(`${API_BASE}/events/${eventId}`);
};

export const addEventOption = (eventId: string, label: string) => {
  return axios.post(`${API_BASE}/events/${eventId}/options`, { label });
};

export const registerToEvent = (
  eventId: string,
  name: string,
  email: string,
  selected: string[]
) => {
  return axios.post(`${API_BASE}/register`, {
    eventId,
    name,
    email,
    selected,
  });
};


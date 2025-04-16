# 🗳️ Form Creator – Event Participation & Topic Selection App

This project allows event organizers to create and configure limited-capacity sign-up forms for conference-style events. Participants can select from a list of options (e.g. workshops or topics), with configurable limits on:
- how many selections a single participant can make,
- and how many participants can choose any one option.

---

## 📦 Project Structure

```
form-creator/
├── frontend/             # React + TypeScript + SCSS (Vite)
│   ├── src/
│   │   ├── api/          # Axios API logic
│   │   ├── pages/        # Page views: Organizer, Participant, Creator
│   │   └── styles/       # SCSS modules
│   └── vite.config.ts
│
└── server/               # Express + SQLite backend
    ├── db/              # Database connection (SQLite)
    ├── routes/          # API route definitions
    ├── controllers/     # Business logic for routes
    ├── conference.db    # SQLite file (auto-created)
    └── server.js        # Main server entry
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js 18+
- npm
- (Optional) SQLite DB browser for development

---

## 🧩 Frontend Setup (React)

1. Navigate to the `frontend` folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## 🔧 Backend Setup (Express + SQLite)

1. Navigate to the `server` folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server using nodemon:

```bash
npm run dev
```

4. Backend runs on [http://localhost:3001](http://localhost:3001)

📁 The `conference.db` file will be created automatically in the server root.

---

## ✨ Features

- Create a new event with a name, description, and limits
- Organizer can define available options
- Each option has a per-choice cap (e.g. max 25 users)
- Participants receive a link to select from available options
- Selections respect event-wide and per-option limits
- Registrations tracked and viewable by the organizer

---

## 🧪 API Overview

- `POST /api/events`: Create an event
- `GET /api/events/:id`: Fetch event with options
- `POST /api/events/:id/options`: Add an option to an event
- `POST /api/register`: Register a user to selected options
- `GET /api/events/:id/registrations`: View all responses for an event

---

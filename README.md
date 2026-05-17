# Smart Enterprise Service Desk

A full-stack enterprise helpdesk platform built with the MERN stack. Employees can raise IT, HR, and Admin service requests. Support agents and admins can assign, track, and resolve tickets with real-time chat and analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Redux Toolkit, Bootstrap, MUI, Recharts, Leaflet |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| Realtime | Socket.io |
| Maps | React Leaflet (OpenStreetMap) |
| Dev Tools | Postman, Git, nodemon |

---

## Features

- **Authentication** — Register, login, JWT-based auth with role protection
- **Role Management** — Three roles: Employee, Support Agent, Admin
- **Ticket System** — Create, assign, update status, filter, paginate
- **Real-Time Chat** — Per-ticket chat rooms using Socket.io
- **Location Tracking** — GPS capture on ticket creation, displayed on map
- **Analytics Dashboard** — Charts for ticket volume, status, category, priority
- **Responsive UI** — Bootstrap + MUI components

---

## Project Structure
service-desk/
├── client/                   # React frontend
│   └── src/
│       ├── components/       # Navbar, Chat, TicketMap
│       ├── pages/            # Login, Register, Dashboard, Tickets, Analytics
│       ├── redux/            # Auth and Tickets slices
│       └── services/         # Axios instance
├── server/                   # Node.js backend
│   ├── controllers/          # Business logic
│   ├── middleware/            # JWT auth, role guard
│   ├── models/               # User, Ticket, Message schemas
│   └── routes/               # Auth, Tickets, Messages
└── README.md

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/service-desk.git
cd service-desk
```

**2. Install server dependencies**
```bash
cd server
npm install
```

**3. Install client dependencies**
```bash
cd ../client
npm install
```

**4. Set up environment variables**

Create `/server/.env`:
PORT=5002
MONGO_URI=mongodb://localhost:27017/servicedesk
JWT_SECRET=your_jwt_secret_key


**5. Run the app**

In one terminal (backend):
```bash
cd server
npm run dev
```

In another terminal (frontend):
```bash
cd client
npm start
```

App runs at `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login and get token |
| GET | /api/auth/me | Protected | Get current user |

### Tickets
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/tickets | All roles | Create ticket |
| GET | /api/tickets | All roles | Get tickets (filtered by role) |
| GET | /api/tickets/:id | All roles | Get single ticket |
| PUT | /api/tickets/:id | Agent, Admin | Update status/assignment |
| DELETE | /api/tickets/:id | Admin | Delete ticket |
| GET | /api/tickets/analytics/summary | Agent, Admin | Analytics data |
| GET | /api/tickets/map/locations | Agent, Admin | Tickets with GPS data |

### Messages
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/messages/:ticketId | Protected | Get chat history |

---

## Test Accounts

After registering, use these roles to test different flows:

| Name | Email | Role |
|---|---|---|
| Alice Admin | alice@company.com | admin |
| Bob Agent | bob@company.com | agent |
| Carol Employee | carol@company.com | employee |

---

## Sprint Breakdown

| Sprint | Features |
|---|---|
| Sprint 1 | Auth, JWT, roles, React login/register, Redux |
| Sprint 2 | Ticket CRUD, MongoDB schema, REST API, React UI |
| Sprint 3 | Socket.io chat, per-ticket rooms, message persistence |
| Sprint 4 | Analytics dashboard, charts, location tracking, map |

---

## Lab Mapping

| Lab | Feature Covered |
|---|---|
| Lab 1 | Login/Register HTML forms with JS validation |
| Lab 4 | Bootstrap layout and components |
| Lab 5 | React components and state |
| Lab 7 | JWT authentication |
| Lab 8 | REST API CRUD operations |
| Lab 9 | MongoDB schema design and indexing |
| Lab 10 | Socket.io real-time chat |

---

## Author

Anoushka Karra  
Enterprise Application Development — Semester Project
# KNOCKKNOCK — Backend Server

Production-ready Node.js / Express / MongoDB lead capture API for the KNOCKKNOCK doorstep mobile repair website.

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local or Atlas)

### Installation

```bash
cd server
npm install
```

### Configuration

Copy the `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

**`.env` variables:**
| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/knockknock` | MongoDB connection string |
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |

### Run

```bash
npm start        # Production
npm run dev      # Development (auto-reload with nodemon)
```

> **Note:** The server works even without MongoDB — it starts in frontend-only mode and logs form submissions to the console.

---

## API Endpoints

### `POST /api/leads`
Create a new service request.

**Body (JSON):**
```json
{
  "name": "Ravi Kumar",
  "phone": "+91 81222 80010",
  "brand": "Samsung",
  "issue": "Cracked screen, needs replacement",
  "location": "Dharmapuri town center",
  "preferredTime": "Morning (9AM–12PM)"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Service request received! We will contact you within 1 hour.",
  "leadId": "..."
}
```

### `GET /api/leads`
List all leads (admin). Supports `?status=new&page=1&limit=50`.

### `PATCH /api/leads/:id`
Update lead status. Body: `{ "status": "contacted" }`
Valid statuses: `new`, `contacted`, `booked`, `completed`, `closed`.

### `GET /api/health`
Health check endpoint.

---

## Architecture

```
server/
├── server.js           # Express app, DB connection, middleware
├── routes/
│   └── leads.js        # Lead CRUD endpoints
├── models/
│   └── Lead.js         # Mongoose schema
├── .env                # Environment variables (not committed)
├── .env.example        # Template
├── package.json
└── README.md
```

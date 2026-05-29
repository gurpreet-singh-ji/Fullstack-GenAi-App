# Fullstack GenAI App — AI Interview Preparation

A full-stack web application that generates personalised interview preparation reports powered by **Groq AI**. Upload your resume, provide a self-description and job description, and receive a comprehensive, AI-generated report in seconds.

---

## Features

- **AI-Powered Interview Reports** — Generates tailored reports using the Groq LLM, structured with Zod schema validation for reliable output.
- **Resume Parsing** — Extracts text from uploaded PDF resumes via `pdf-parse`.
- **Match Score** — An AI-calculated score (0–100) showing how well your profile fits the target role.
- **Technical & Behavioural Questions** — Curated interview questions with the interviewer's intent and suggested answers.
- **Skill Gap Analysis** — Identifies missing skills with severity ratings (low / medium / high).
- **Day-Wise Preparation Plan** — A structured multi-day study plan to get interview-ready.
- **PDF Report Download** — Download your generated report as a PDF using Puppeteer.
- **JWT Authentication** — Secure registration, login, and logout with cookie-based sessions.

---


## Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Groq SDK | LLM inference |
| @google/genai | Google GenAI integration |
| Zod | AI response schema validation |
| Multer | PDF file upload handling |
| pdf-parse | Resume text extraction |
| Puppeteer | PDF report generation |
| bcrypt + JWT | Authentication |

### Frontend
| Tool | Purpose |
|------|---------|
| React 19 + Vite | UI framework & build tool |
| React Router 7 | Client-side routing |
| Axios | HTTP requests |
| SASS | Styling |

---

## Project Structure

```
Fullstack-GenAi-App/
├── backend/
│   └── src/
│       ├── server.js           # Entry point
│       ├── app.js              # Express app & middleware
│       ├── db/                 # MongoDB connection
│       ├── routes/
│       │   ├── auth.routes.js  # /api/auth/*
│       │   └── ai.routes.js    # /api/interview/*
│       ├── controller/
│       │   ├── auth.controller.js
│       │   ├── ai.controller.js
│       │   └── pdf.controller.js
│       ├── service/
│       │   └── ai.service.js   # Groq LLM integration
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── multer.middleware.js
│       └── models/
│           └── interviewReport.model.js
└── frontend/
    └── src/                    # React components & pages
```

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT cookie |
| POST | `/logout` | Public | Clear session cookie |
| GET | `/get-me` | Private | Get authenticated user data |

### Interview Routes — `/api/interview`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Generate interview report (multipart/form-data) |
| GET | `/:id/download-pdf` | Private | Download report as PDF |

**POST `/api/interview` — Request Body (form-data)**

| Field | Type | Required |
|-------|------|----------|
| `resume` | PDF file | ✅ |
| `selfDescription` | string | ✅ |
| `jobDescription` | string | ✅ |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB instance (local or Atlas)
- [Groq API key](https://console.groq.com/)

### 1. Clone the repository

```bash
git clone https://github.com/gurpreet-singh-ji/Fullstack-GenAi-App.git
cd Fullstack-GenAi-App
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Start the backend:

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API calls to the backend at `http://localhost:5000`.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com/) |

---

## How It Works

1. A user registers/logs in and receives a JWT stored in an HTTP-only cookie.
2. On the report generation page, the user uploads their PDF resume, fills in their self-description, and pastes the target job description.
3. The backend extracts the resume text, then sends all three inputs to the Groq LLM with a structured prompt.
4. The AI response is validated against a **Zod schema** to guarantee all required fields are present (match score, questions, skill gaps, preparation plan).
5. The validated report is stored in MongoDB and returned to the frontend.
6. The user can download the report as a formatted PDF at any time.

---

## License

ISC

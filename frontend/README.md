# Resumer Frontend

A Next.js frontend application for the Resumer resume management system.

## Features

- **Authentication**: Login and signup with role-based access (Candidate/Recruiter)
- **Candidate Dashboard**: Create, view, edit, and delete resumes
- **Recruiter Dashboard**: Search and filter resumes with pagination
- **Protected Routes**: Role-based route protection
- **JWT Authentication**: Secure token-based authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:5000` (or configure `NEXT_PUBLIC_API_URL`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the API URL (optional, defaults to `http://localhost:5000`):
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx             # Home page (redirects based on auth)
│   ├── globals.css          # Global styles
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Signup page
│   ├── candidate/
│   │   └── page.tsx         # Candidate dashboard
│   └── recruiter/
│       └── page.tsx         # Recruiter dashboard
├── lib/
│   ├── api.ts               # API client with all endpoints
│   └── auth.tsx             # Authentication context provider
├── middleware.ts            # Route protection middleware
└── package.json
```

## API Integration

The frontend communicates with the backend API at the URL specified in `NEXT_PUBLIC_API_URL`. All API requests include JWT tokens in the Authorization header when authenticated.

### Endpoints Used

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /candidate/resume` - Get candidate's resume
- `POST /candidate/resume` - Create resume
- `PUT /candidate/resume/:id` - Update resume
- `DELETE /candidate/resume/:id` - Delete resume
- `GET /recruiter/search` - Search resumes with filters

## Authentication Flow

1. User signs up or logs in
2. JWT token is stored in localStorage
3. Token is included in all API requests via Authorization header
4. Protected routes check for authentication and redirect if needed
5. Role-based access control ensures candidates can only access candidate routes and recruiters can only access recruiter routes

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules (global styles)


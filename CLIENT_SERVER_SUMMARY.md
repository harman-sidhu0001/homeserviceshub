# HomeservicesHub: Client & Server Summary

---

## Client (Frontend)

**Tech Stack:**

- JavaScript (ES2020+)
- React 19
- Redux Toolkit
- React Router DOM v7
- Vite
- TailwindCSS
- Framer Motion
- React Hook Form
- Zod
- React Query (@tanstack/react-query)
- Axios
- ESLint
- react-icons
- react-lazy-load-image-component

**Architecture:**

- MVVM (Model-View-ViewModel) pattern for separation of concerns
- ViewModels manage business logic and state, Views/Components handle UI

**Key Features:**

- Authentication (User & Provider): login, registration, session management, role-based navigation
- Routing & Navigation: SPA routing, protected/guest/admin routes
- State Management: Redux Toolkit, React Query
- Home Page: Hero, trending services, top providers, testimonials, contact, etc.
- Service Listing & Search: Browse/search services, icons, descriptions
- Service Providers Directory: Search/filter providers, provider cards, ratings, verification
- Provider Profile & Reviews: Gallery, ratings, reviews, services, availability, verification
- User Profile & Bookmarks: Service history, reviews, bookmarks, uploads
- Service Request Flow: Multi-step form, validation, modal/page variants
- Admin Dashboard & CRUD: Manage users, providers, services, requests, verifications
- Reusable UI Components: Button, Card, Modal, Alert, Spinner, Avatar, FileUpload, etc.
- API Client & Utilities: Axios client, async handler, validators
- Styling & Theming: TailwindCSS, custom CSS, responsive design
- Code Quality & Tooling: ESLint, Vite, dev dependencies

**See also:** `MVVM_IMPLEMENTATION_SUMMARY.md` for a detailed breakdown of the MVVM pattern and its benefits.

---

## Server (Backend)

**Tech Stack:**

- Node.js (ES Modules)
- Express 5
- MongoDB (via Mongoose)
- Redis (ioredis)
- JWT (jsonwebtoken)
- AWS S3 (via @aws-sdk/client-s3, multer-s3)
- Nodemailer (email)
- bcryptjs (password hashing)
- dotenv, morgan, cors, cookie-parser

**Architecture:**

- RESTful API with modular controllers and routes
- Middleware for error handling, rate limiting, CORS, logging, and cookies
- Redis for caching and session management
- JWT for authentication and authorization
- S3 for file uploads

**Main Features:**

- **Authentication:** User and provider login/registration, refresh tokens, secure cookies
- **User Management:** CRUD for users, providers, admin
- **Service Management:** CRUD for services, trending services
- **Service Requests:** Create and manage service requests
- **Reviews & Ratings:** Submit and fetch provider reviews
- **Bookmarks:** User bookmarks for providers/services
- **Admin Dashboard:** Stats, verification, and management endpoints
- **Rate Limiting:** Global and per-route throttling
- **Error Handling:** Centralized error middleware

**Key Files & Folders:**

- `controllers/`: Business logic for each domain (auth, user, provider, admin, review, services, bookmark)
- `routes/`: API endpoints for each domain
- `models/`: Mongoose schemas for User, Provider, Service, Review, etc.
- `middleware/`: Auth, role, error, rate limiter, cache
- `services/`: Email, token, location, upload, OTP
- `utils/`: Async handler, validators, rating calculator
- `server.js`: Main entry, middleware setup, route registration, server start

**See also:**

- `MVVM_IMPLEMENTATION_SUMMARY.md` for how backend auth supports MVVM
- `PROVIDER_RATING_SYSTEM.md` and `REVIEW_RATING_SYSTEM_IMPLEMENTATION.md` for details on rating/review logic

---

_This summary provides a high-level overview of the tech stack, architecture, and main features of both the client and server for HomeservicesHub. For more details, see the referenced markdown files and the codebase itself._

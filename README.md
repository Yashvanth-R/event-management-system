# Event Management System

A full-stack Event Management System built with Laravel (PHP) backend and Next.js frontend, featuring clean architecture, scalability, and data integrity.

## 🎯 Features Implemented

### ✅ Core Requirements
- **Event Creation**: Create events with name, location, timing, and capacity
- **Event Listing**: View all upcoming events
- **Attendee Registration**: Register for events with capacity limits
- **Attendee Management**: View paginated attendee lists
- **Overbooking Prevention**: Automatic capacity management
- **Duplicate Prevention**: Email uniqueness per event
- **Timezone Support**: Events created in IST with proper timezone handling

### ✅ Technical Features
- **Clean Architecture**: MVC pattern with services layer
- **Data Validation**: Comprehensive input validation and error handling
- **Database Integrity**: PostgreSQL with proper constraints and indexing
- **Pagination**: Efficient attendee list pagination
- **Unit Tests**: Comprehensive test coverage
- **Modern UI**: Next.js with Shadcn UI components
- **Responsive Design**: Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- PostgreSQL 12+

### 1. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=event_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
APP_TIMEZONE=Asia/Kolkata

# Run migrations
php artisan migrate

# Start server
php artisan serve
```

### 2. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Configure API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health

## 📡 API Endpoints

### Events
- `POST /api/events` - Create new event
- `GET /api/events` - List upcoming events
- `GET /api/events/{id}` - Get specific event

### Attendees
- `POST /api/events/{event_id}/register` - Register attendee
- `GET /api/events/{event_id}/attendees` - Get event attendees 

## 🗄️ Database Schema

### Events Table
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    max_capacity INTEGER NOT NULL,
    current_attendees INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_start_end_time ON events(start_time, end_time);
```

### Attendees Table
```sql
CREATE TABLE attendees (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, email)
);

CREATE INDEX idx_attendees_event_id ON attendees(event_id);
```

## 🧪 Running Tests

```bash
# Backend tests
cd backend
php artisan test

# Test specific feature
php artisan test --filter EventTest
```

## 🔧 Technical Decisions & Assumptions

### Backend (Laravel)
- **PostgreSQL**: Chosen for data integrity and advanced features
- **Services Layer**: Separation of business logic from controllers
- **Resource Classes**: Consistent API response formatting
- **Eloquent ORM**: Type-safe database interactions
- **Form Requests**: Centralized validation logic

### Frontend (Next.js)
- **Shadcn UI**: Modern, accessible component library
- **TypeScript**: Type safety and better developer experience
- **Zod**: Runtime validation and type inference
- **React Hook Form**: Efficient form handling
- **Axios**: HTTP client with interceptors

### Architecture Decisions
- **Clean Architecture**: Clear separation of concerns
- **API-First**: Backend as API, frontend as consumer
- **Timezone Handling**: UTC storage, local display
- **Error Handling**: Consistent error responses
- **Validation**: Both client and server-side validation

## 🌐 Timezone Management

- Events stored in UTC in database
- Created in IST timezone (Asia/Kolkata)
- Frontend displays in user's local timezone
- API responses include both ISO and formatted times

## 📊 Performance Optimizations

- Database indexing on frequently queried columns
- Pagination for large datasets
- Efficient API resource transformations
- Frontend code splitting and lazy loading
- Optimized database queries with proper relationships

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention (Eloquent ORM)
- XSS protection
- CSRF protection ready
- Environment variable protection
- Unique constraints for data integrity

## 📁 Project Structure

```
event-management-system/
├── README.md
├── API_DOCUMENTATION.md
├── SETUP.md
├── .gitignore
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── EventController.php
│   │   │   │   └── AttendeeController.php
│   │   │   ├── Requests/
│   │   │   │   ├── CreateEventRequest.php
│   │   │   │   └── RegisterAttendeeRequest.php
│   │   │   └── Resources/
│   │   │       ├── EventResource.php
│   │   │       └── AttendeeResource.php
│   │   ├── Models/
│   │   │   ├── Event.php
│   │   │   └── Attendee.php
│   │   ├── Services/
│   │   │   ├── EventService.php
│   │   │   └── AttendeeService.php
│   │   └── Exceptions/
│   │       └── EventCapacityExceededException.php
│   ├── database/
│   │   ├── migrations/
│   │   └── factories/
│   ├── tests/Feature/
│   ├── routes/api.php
│   ├── composer.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── events/
    │   │   ├── create-event/
    │   │   └── layout.tsx
    │   ├── components/
    │   │   ├── ui/
    │   │   ├── EventCard.tsx
    │   │   ├── EventForm.tsx
    │   │   ├── AttendeeForm.tsx
    │   │   └── AttendeeList.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   └── utils.ts
    │   └── types/index.ts
    ├── package.json
    └── .env.local.example
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
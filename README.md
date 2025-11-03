# Event Management System

A modern full-stack Event Management System built with **NestJS** (TypeScript) backend and **Next.js** frontend, featuring beautiful UI, clean architecture, and robust data management with PostgreSQL and Prisma ORM.

## 🎯 Features Implemented

### ✅ Core Requirements
- **Event Creation**: Create events with name, location, timing, and capacity
- **Event Listing**: View all upcoming events with beautiful table interface
- **Attendee Registration**: Register for events with capacity limits
- **Attendee Management**: View paginated attendee lists with modern UI
- **Overbooking Prevention**: Automatic capacity management
- **Duplicate Prevention**: Email uniqueness per event
- **Real-time Updates**: Dynamic capacity tracking

### ✅ Modern UI Features
- **Beautiful Interface**: Professional sidebar navigation with gradient themes
- **Responsive Design**: Mobile-friendly with modern card layouts
- **Interactive Tables**: Hover effects, gradients, and smooth animations
- **Loading States**: Elegant loading spinners and error handling
- **Form Validation**: Real-time validation with visual feedback
- **Modern Components**: Shadcn UI with custom styling enhancements

### ✅ Technical Features
- **NestJS Backend**: Modern TypeScript framework with decorators
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Swagger Documentation**: Auto-generated API documentation
- **Data Validation**: Comprehensive input validation with class-validator
- **Database Integrity**: PostgreSQL with proper constraints and indexing
- **Pagination**: Efficient attendee list pagination
- **Docker Support**: Complete containerization setup
- **TypeScript**: Full type safety across the stack

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker (optional)

### 1. Backend Setup (NestJS)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.nestjs .env

# Configure database in .env
DATABASE_URL="postgresql://username:password@localhost:5432/event_management?schema=public"
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed

# Start development server
npm run start:dev
```

### 2. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure API URL (already set in code)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

### 3. Docker Setup (Alternative)

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **API Documentation**: http://localhost:8000/api/docs
- **Prisma Studio**: `npm run prisma:studio` (in backend directory)

## 📡 API Endpoints

### Events
- `POST /api/events` - Create new event
- `GET /api/events` - List upcoming events
- `GET /api/events/:id` - Get specific event

### Attendees
- `POST /api/events/:eventId/attendees` - Register attendee
- `GET /api/events/:eventId/attendees` - Get event attendees (paginated)
- `GET /api/events/:eventId/attendees/all` - Get all event attendees

## 🗄️ Database Schema (Prisma)

### Events Model
```prisma
model Event {
  id                Int        @id @default(autoincrement())
  name              String
  location          String
  startTime         DateTime   @map("start_time")
  endTime           DateTime   @map("end_time")
  maxCapacity       Int        @map("max_capacity")
  currentAttendees  Int        @default(0) @map("current_attendees")
  createdAt         DateTime   @default(now()) @map("created_at")
  updatedAt         DateTime   @updatedAt @map("updated_at")
  
  attendees         Attendee[]

  @@map("events")
}
```

### Attendees Model
```prisma
model Attendee {
  id           Int      @id @default(autoincrement())
  eventId      Int      @map("event_id")
  name         String
  email        String
  registeredAt DateTime @map("registered_at")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  
  event        Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([eventId, email])
  @@index([eventId])
  @@map("attendees")
}
```

## 🧪 Running Tests

```bash
# Backend tests
cd backend
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Technical Stack & Decisions

### Backend (NestJS + Prisma)
- **NestJS**: Modern TypeScript framework with decorators and dependency injection
- **Prisma ORM**: Type-safe database client with migrations
- **PostgreSQL**: Robust relational database with advanced features
- **Class Validator**: Decorator-based validation
- **Swagger**: Auto-generated API documentation
- **Docker**: Containerization support

### Frontend (Next.js + Shadcn UI)
- **Next.js 14**: React framework with App Router
- **Shadcn UI**: Modern, accessible component library
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Custom Styling**: Enhanced with gradients and animations

### Architecture Decisions
- **Clean Architecture**: Modular structure with clear separation
- **API-First**: RESTful API with comprehensive documentation
- **Type Safety**: End-to-end TypeScript implementation
- **Modern UI**: Professional design with interactive elements
- **Error Handling**: Comprehensive error responses and user feedback
- **Performance**: Optimized queries and efficient rendering

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Professional blue/purple/green theme
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: Consistent 16px/24px/32px spacing system
- **Shadows**: Depth and modern feel with hover animations
- **Gradients**: Beautiful color transitions throughout

### Interactive Elements
- **Sidebar Navigation**: Dark gradient with active state highlighting
- **Data Tables**: Professional tables with hover effects and proper alignment
- **Forms**: Modern inputs with focus states and validation feedback
- **Cards**: Clean cards with shadows and hover animations
- **Buttons**: Gradient backgrounds with smooth transitions

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Flexible Layouts**: CSS Grid and Flexbox for responsive design
- **Touch-Friendly**: Proper touch targets and interactions

## 📊 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data loading for large datasets
- **Type Safety**: Compile-time error prevention
- **Code Splitting**: Optimized bundle sizes
- **Caching**: Efficient data fetching and caching strategies

## 🔒 Security Features

- **Input Validation**: Comprehensive validation with class-validator
- **SQL Injection Prevention**: Prisma ORM protection
- **Type Safety**: Runtime and compile-time type checking
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Secure configuration management
- **Database Constraints**: Unique constraints and foreign keys

## 📁 Project Structure

```
event-management-system/
├── README.md
├── docker-compose.yml
├── .gitignore
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── main.ts                   # Application entry point
│   │   ├── app.module.ts             # Root module
│   │   ├── prisma/                   # Prisma service
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── events/                   # Events module
│   │   │   ├── events.controller.ts
│   │   │   ├── events.service.ts
│   │   │   ├── events.module.ts
│   │   │   ├── dto/
│   │   │   │   └── create-event.dto.ts
│   │   │   └── entities/
│   │   │       └── event.entity.ts
│   │   └── attendees/                # Attendees module
│   │       ├── attendees.controller.ts
│   │       ├── attendees.service.ts
│   │       ├── attendees.module.ts
│   │       ├── dto/
│   │       │   └── register-attendee.dto.ts
│   │       └── entities/
│   │           └── attendee.entity.ts
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   └── seed.ts                   # Database seeding
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── Dockerfile.nestjs
└── frontend/                         # Next.js Frontend
    ├── src/
    │   ├── app/                      # App Router
    │   │   ├── layout.tsx            # Root layout with sidebar
    │   │   ├── page.tsx              # Home page
    │   │   ├── events/
    │   │   │   ├── page.tsx          # Events list
    │   │   │   └── [id]/
    │   │   │       └── attendees/
    │   │   │           └── page.tsx  # Event attendees
    │   │   ├── attendees/
    │   │   │   └── page.tsx          # All attendees
    │   │   ├── create-event/
    │   │   │   └── page.tsx          # Create event form
    │   │   └── globals.css           # Global styles
    │   ├── components/
    │   │   ├── ui/                   # Shadcn UI components
    │   │   │   ├── button.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── label.tsx
    │   │   │   └── card.tsx
    │   │   ├── Sidebar.tsx           # Navigation sidebar
    │   │   ├── EventCard.tsx         # Event display card
    │   │   ├── EventForm.tsx         # Event creation form
    │   │   ├── AttendeeForm.tsx      # Attendee registration
    │   │   └── AttendeeList.tsx      # Attendee display
    │   ├── lib/
    │   │   ├── api.ts                # API client
    │   │   └── utils.ts              # Utility functions
    │   └── types/
    │       └── index.ts              # TypeScript types
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    └── next.config.js
```

## 🐳 Docker Support

The project includes full Docker support with PostgreSQL, NestJS backend, and Next.js frontend:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

## 📚 Documentation

- **API Documentation**: Available at `/api/docs` when running the backend
- **Prisma Studio**: Database GUI available via `npm run prisma:studio`
- **Setup Guide**: Detailed setup instructions in `backend/setup-nestjs.md`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
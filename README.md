# Event Booking API

A RESTful API for an Event Booking system built with **Node.js**, **Express.js**, **Sequelize ORM**, and **MySQL**. This API allows you to manage Venues, Events, and Attendees, with full support for one-to-many and many-to-many relationships.

The API supports CRUD operations for all three resources, input validation, structured error responses, request logging middleware, and a Postman collection for testing.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [Relationship Diagram (ER Diagram)](#relationship-diagram-er-diagram)
- [API Reference](#api-reference)
- [Error Responses](#error-responses)
- [Postman Collection](#postman-collection)

---

## Tech Stack

| Technology | Version |
|---|---|
| Node.js | v18+ |
| Express.js | ^4.19.2 |
| Sequelize ORM | ^6.37.3 |
| MySQL2 Driver | ^3.10.1 |
| dotenv | ^16.4.5 |

---

## Prerequisites

Before running this project, make sure you have the following installed on your machine:

### 1. Node.js (v18 or higher)
Download from: https://nodejs.org/

Verify installation:
```bash
node -v
npm -v
```

### 2. MySQL Server
Download from: https://dev.mysql.com/downloads/mysql/

Or use XAMPP (which includes MySQL): https://www.apachefriends.org/

Verify MySQL is running:
```bash
mysql -u root -p
```

### 3. Postman (for API testing)
Download from: https://www.postman.com/downloads/

---

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd event-booking-api
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create the MySQL Database

Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal) and run:

```sql
CREATE DATABASE event_booking_db;
```

### Step 4: Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Open `.env` and update the values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=event_booking_db
DB_USER=root
DB_PASSWORD=yourpassword
PORT=3000
```

Replace `yourpassword` with your actual MySQL root password (or any MySQL user that has access to the `event_booking_db` database).

### Step 5: Start the Server

```bash
npm start
```

Or, for development with auto-restart:

```bash
npm run dev
```

You should see:
```
Database synced successfully.
Server is running on http://localhost:3000
```

> Sequelize will **automatically create all tables** (`venues`, `events`, `attendees`, `registrations`) on startup via `sequelize.sync({ alter: true })`. You do **not** need to run any SQL migration scripts manually.

### Step 6: Test the API

Open Postman, import the collection from `docs/postman_collection.json`, and start making requests to `http://localhost:3000`.

---

## Database Schema

### Table: `venues`

| Column | Type | Constraints |
|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT, NOT NULL |
| name | VARCHAR(150) | NOT NULL |
| location | VARCHAR(255) | NOT NULL |
| capacity | INT | NOT NULL |
| description | TEXT | NULLABLE |
| createdAt | DATETIME | NOT NULL |
| updatedAt | DATETIME | NOT NULL |

### Table: `events`

| Column | Type | Constraints |
|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT, NOT NULL |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | NULLABLE |
| date | DATEONLY | NOT NULL |
| time | TIME | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 |
| venueId | INT | FOREIGN KEY → venues(id), NOT NULL |
| createdAt | DATETIME | NOT NULL |
| updatedAt | DATETIME | NOT NULL |

### Table: `attendees`

| Column | Type | Constraints |
|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT, NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| phone | VARCHAR(20) | NULLABLE |
| createdAt | DATETIME | NOT NULL |
| updatedAt | DATETIME | NOT NULL |

### Table: `registrations` (Junction Table)

| Column | Type | Constraints |
|---|---|---|
| eventId | INT | FOREIGN KEY → events(id) |
| attendeeId | INT | FOREIGN KEY → attendees(id) |
| createdAt | DATETIME | NOT NULL |
| updatedAt | DATETIME | NOT NULL |

---

## Relationship Diagram (ER Diagram)

```
+----------+       1       +----------+       M       +--------------+
|  venues  |<-----------  |  events  |  -----------> | registrations|
+----------+               +----------+               +--------------+
| id (PK)  |               | id (PK)  |               | eventId (FK) |
| name     |               | title    |               | attendeeId   |
| location |               | date     |               +--------------+
| capacity |               | time     |                     |
| ...      |               | price    |                     | M
+----------+               | venueId  |               +----------+
                           +----------+               | attendees|
                                                      +----------+
Relationships:                                        | id (PK)  |
- Venue has many Events (1-to-Many)                   | name     |
- Event belongs to one Venue (1-to-Many)              | email    |
- Event has many Attendees through registrations      | phone    |
- Attendee registers for many Events (Many-to-Many)   +----------+
```

---

## API Reference

Base URL: `http://localhost:3000`

### Venues

| Method | Path | Request Body | Description | Success Response |
|---|---|---|---|---|
| GET | /venues | — | Get all venues | 200 OK |
| GET | /venues/:id | — | Get venue by ID (includes events) | 200 OK |
| POST | /venues | `{ name, location, capacity, description? }` | Create a venue | 201 Created |
| PUT | /venues/:id | `{ name?, location?, capacity?, description? }` | Update a venue | 200 OK |
| DELETE | /venues/:id | — | Delete a venue | 200 OK |

### Events

| Method | Path | Request Body | Description | Success Response |
|---|---|---|---|---|
| GET | /events | — | Get all events (includes venue) | 200 OK |
| GET | /events/:id | — | Get event by ID (includes venue and attendees) | 200 OK |
| POST | /events | `{ title, date, time, venueId, description?, price? }` | Create an event | 201 Created |
| PUT | /events/:id | `{ title?, date?, time?, venueId?, description?, price? }` | Update an event | 200 OK |
| DELETE | /events/:id | — | Delete an event | 200 OK |

### Attendees

| Method | Path | Request Body | Description | Success Response |
|---|---|---|---|---|
| GET | /attendees | — | Get all attendees | 200 OK |
| GET | /attendees/:id | — | Get attendee by ID (includes events) | 200 OK |
| POST | /attendees | `{ name, email, phone? }` | Create an attendee | 201 Created |
| PUT | /attendees/:id | `{ name?, email?, phone? }` | Update an attendee | 200 OK |
| DELETE | /attendees/:id | — | Delete an attendee | 200 OK |

### Relationship Endpoints

| Method | Path | Request Body | Description | Success Response |
|---|---|---|---|---|
| POST | /events/:id/register | `{ attendeeId }` | Register an attendee to an event | 201 Created |
| DELETE | /events/:id/unregister | `{ attendeeId }` | Unregister an attendee from an event | 200 OK |
| GET | /events/:id/attendees | — | List all attendees of an event | 200 OK |

---

## Error Responses

All error responses return a JSON body. The API never exposes stack traces to the client.

### 400 Bad Request — Validation Failed

Returned when required fields are missing or invalid.

```json
{
  "error": "Validation failed",
  "message": "name, location, and capacity are required fields."
}
```

### 404 Not Found — Resource Missing

Returned when a record does not exist by the given ID.

```json
{
  "error": "Venue not found"
}
```

### 404 Not Found — Unknown Route

Returned by the catch-all middleware for undefined routes.

```json
{
  "error": "Route not found",
  "message": "Cannot GET /unknown-path"
}
```

### 500 Internal Server Error

Returned by the global error handler for unexpected server errors.

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred."
}
```

---

## Postman Collection

The Postman collection is located at:

```
docs/postman_collection.json
```

### How to Import

1. Open **Postman**.
2. Click **Import** (top-left).
3. Select **File** and choose `docs/postman_collection.json`.
4. The collection **"Event Booking API"** will appear in your sidebar.
5. Make sure the base URL variable is set to `http://localhost:3000` (it is pre-configured).

### Recommended Testing Order

To avoid foreign key issues, test in this order:

1. **Create a Venue** → note the `id` returned (e.g., `1`)
2. **Create an Event** → use the venue's `id` as `venueId`
3. **Create an Attendee** → note the `id` returned
4. **Register Attendee to Event** → use the event and attendee IDs
5. **List Event Attendees** → verify registration
6. **Unregister Attendee** → verify removal
7. Test **GET**, **PUT**, and **DELETE** endpoints for each resource
8. Test **error cases** (missing fields, non-existent IDs)

# sound-circle-be

**sound-circle-be** is the backend API for Sound Circle, a collaborative music sharing and discovery platform. This service powers user authentication, track management, sound byte sharing, and more.

## Features

- User registration, login, and JWT-based authentication
- Upload, manage, and share music tracks
- Create and share sound bytes
- RESTful API endpoints for all core features
- Secure access to protected resources
- Modular controllers and services for scalability

## API Endpoints

### Authentication

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT token

### Tracks

- `GET /tracks` — List all tracks
- `POST /tracks` — Upload a new track
- `GET /tracks/:id` — Get details for a specific track
- `PUT /tracks/:id` — Update track information
- `DELETE /tracks/:id` — Delete a track

### Sound Bytes

- `GET /soundbytes` — List all sound bytes
- `POST /soundbytes` — Create a new sound byte
- `GET /soundbytes/:id` — Get details for a specific sound byte
- `DELETE /soundbytes/:id` — Delete a sound byte

### Users

- `GET /users` — List all users
- `GET /users/:id` — Get user profile

## Usage

This API is deployed and running. You can interact with it using any HTTP client (such as Postman or curl) or integrate it with your frontend application.

All protected endpoints require a valid JWT token in the `Authorization` header.

## Project Structure

- `controllers/` — Route handlers for authentication, tracks, users, and sound bytes
- `middleware/` — JWT verification and other middleware
- `models/` — Mongoose models for users, tracks, and sound bytes
- `services/` — Business logic for music and sound byte operations
- `server.js` — Main entry point for the Express server

## Citation

Some coding for this project, including API development, was assisted by ChatGPT.
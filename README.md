# Kanban Board Todo App

A simple Kanban board app built with Next.js, React, and Drizzle ORM.

⚠️ **Note:** This is a demo application built primarily to showcase deployment on Coolify. It was vibe-coded, but may not be suitable for serious task management or production use. Feel free to play around with it, but maybe don't use it to manage your company's mission-critical projects! 😅

The app demonstrates a simple implementation of a Kanban board and serves as a practical example of deploying a full-stack Next.js application on Coolify.


## Features

- Drag-and-drop kanban board using @dnd-kit library
- SQLite database with Drizzle ORM
- Full CRUD operations for todos
- Responsive design

## Tech Stack

- Next.js 15
- React 19
- Drizzle ORM with SQLite
- Tailwind CSS
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npm run db:push
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Management

This project uses Drizzle ORM with SQLite. You can use the following commands to manage your database:

- `npm run db:generate` - Generate migrations based on your schema changes
- `npm run db:push` - Apply schema changes directly to the database
- `npm run db:studio` - Open Drizzle Studio to manage your database

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - React components
- `/src/db` - Drizzle database schema and connection
- `/src/types` - TypeScript type definitions

## Authentication (Optional)

This application supports optional single-user authentication using environment variables. If `AUTH_USERNAME` and `AUTH_PASSWORD` are not provided, authentication will be skipped.

To enable authentication, create a `.env.local` file in the root of your project and add the following variables:

```
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
AUTH_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
```

- `AUTH_USERNAME`: The username for authentication.
- `AUTH_PASSWORD`: The password for authentication.
- `AUTH_SECRET`: A secret key used to sign JWT tokens. It should be a long, random string (at least 32 characters).

## License

MIT

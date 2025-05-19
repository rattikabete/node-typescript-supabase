# Simple Backend with Node.js and Supabase

This is a simple backend with Node.js and Supabase. It uses the Supabase JavaScript SDK to connect to the Supabase database.

## Prerequisites

- Node.js
- Supabase account

## Setup

1. Install the dependencies:

```bash
npm install
```

2. Create a Supabase project and copy the project URL.

3. Create a `.env` file in the root directory and add the following variables:

```bash
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
```

4. Run the server:

```bash
npm run dev
```

## Usage

To use the server, you can send a Get request to the `/api/test` endpoint.
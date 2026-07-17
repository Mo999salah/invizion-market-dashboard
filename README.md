# Invizion Market Dashboard

A small cryptocurrency dashboard built for the Invizion frontend. It uses
live market data from CoinGecko and includes a client-side demo login.


## Features

- Top 20 cryptocurrencies by market cap in USD
- Search by coin name or symbol
- Current price, 24-hour change, volume, high, low, and last update time
- Coin logos with a symbol fallback when an image cannot be loaded
- Selectable rows and a separate details panel
- Manual refresh without hiding the current data
- Loading, error, empty, and refresh states
- Desktop table and a compact expandable list on mobile
- Demo login with session persistence and protected routes

## Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS
- TanStack Query
- CoinGecko public API

## Run locally

You will need Node.js 20.19 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm run start
```

Run the checks with:

```bash
npm run lint
npm test
npm run build
```

No API key or environment variables are required.

## Demo account

```text
Email: demo@invizion.com
Password: demo123
```

The same credentials are shown on the login screen. The **Use demo account**
button fills them in automatically.

Authentication is intentionally local and only demonstrates session handling.
The session is stored in `localStorage`, so it should not be treated as real
security.

## Project structure

```text
src/
├── app/                 # Routes, layouts, and global styles
├── features/
│   ├── auth/            # Demo auth, persistence, route guards, and UI
│   └── market/          # Market API, query, formatting, and components
├── providers/           # TanStack Query provider
└── shared/              # Shared UI components
```

Market requests are kept in the market feature instead of being called from UI
components. CoinGecko responses are checked before they reach the dashboard,
and TanStack Query keeps the previous result visible during a refresh.

## Notes

- CoinGecko may occasionally rate-limit unauthenticated requests. API failures
  are shown in the dashboard and can be retried.
- Market data, search, and row selection are kept in the browser.
- Charts, sorting, pagination, a backend, and real account management are outside
  the scope of this task.

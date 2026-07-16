# Invizion Market Dashboard

A responsive cryptocurrency market dashboard built as a frontend technical assessment. It combines a focused dark trading interface, live CoinGecko market data, and a clearly identified client-side demo sign-in flow.

## Project links

- Live demo: **TBD**
- Repository: **TBD**

## Features

- Top 20 cryptocurrencies by market capitalization in USD
- Search by asset name or symbol
- Selectable market rows with a synchronized details panel
- Manual refresh with existing data preserved during background requests
- Dedicated initial loading, refresh, error, and empty states
- Responsive table overflow and mobile-friendly layouts
- Keyboard-visible focus, labelled controls, semantic data tables, and live status announcements
- Demo login, persisted session, protected dashboard route, and logout
- Automatic `/` routing based on the current demo session

## Technology

- [Next.js](https://nextjs.org/) with the App Router
- TypeScript in strict mode
- Tailwind CSS
- [TanStack Query](https://tanstack.com/query/latest)
- Native `fetch` and the [CoinGecko public API](https://www.coingecko.com/en/api)

The project intentionally has no backend, database, Redux store, API SDK, or React Query Devtools.

## Getting started

### Prerequisites

- Node.js 20.9 or newer
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route sends the browser to the appropriate login or dashboard page.

### Production build

```bash
npm run build
npm run start
```

### Quality checks

```bash
npm run lint
npm run build
```

## Demo authentication

Use the credentials below, which are also shown on the login screen:

```text
Email: demo@invizion.com
Password: demo123
```

The session stored in `localStorage` contains only the demo email. The password is never written to the session.

> **Security note:** This is deliberately client-side demo authentication for an assessment. The credentials and session logic ship to the browser, and the stored session can be inspected or forged. It does not provide production authentication or authorization. A real application should validate credentials on a trusted server and use an appropriate secure session mechanism.

## Market data

The market service requests:

```text
GET https://api.coingecko.com/api/v3/coins/markets
```

with these query parameters:

```text
vs_currency=usd
order=market_cap_desc
per_page=20
page=1
sparkline=false
price_change_percentage=24h
```

The response boundary validates that the payload is an array and parses every required field into the strict `MarketAsset` type. TanStack Query owns caching and request state with a stable query key, a 60-second stale time, one retry, and previous data retained during refetches.

## Request state behavior

- **Initial loading:** A focused loading screen is shown when no successful market response is available yet.
- **Background refresh:** The current table and selection remain visible. The refresh action is disabled and a small live status reports that new data is being fetched.
- **Initial error:** A meaningful CoinGecko request error replaces the dashboard and provides a retry action.
- **Refresh error:** The last successful data remains usable while a non-blocking alert explains that the latest refresh failed.
- **Empty response:** A valid empty API array produces a dedicated empty state with a refresh action.
- **No search results:** The table area reports that no assets match while the search and refresh controls remain available.

## Architecture

The App Router handles route composition while feature modules keep business logic separate from presentation:

```text
src/
├── app/
│   ├── (auth)/login/          # Login route
│   ├── (dashboard)/dashboard/ # Protected market route
│   ├── layout.tsx             # Global providers and metadata
│   └── page.tsx               # Session-aware root redirect
├── features/
│   ├── auth/                  # Provider, store, persistence, guards, and UI
│   └── market/                # API, types, query keys, hook, formatters, and UI
└── providers/                 # Browser QueryClient provider
```

Key boundaries:

- `features/market/api` owns the CoinGecko request and runtime response validation.
- `features/market/hooks` exposes server state to the dashboard through TanStack Query.
- `features/market/components` contains orchestration and presentation components without API calls.
- `features/auth` centralizes demo-session state, persistence, validation, and route guards.
- `providers/query-provider.tsx` creates one browser `QueryClient` for the application session.

## Accessibility and responsive behavior

- Every form control and action has an accessible name.
- Validation errors are associated with their inputs and focus moves to the first invalid field.
- Market data uses native table headers and row-header controls.
- Asset selection, refresh state, and async states are available without relying on color alone.
- Focus indicators remain visible across keyboard-operable controls.
- Financial values use tabular monospace numerals; missing API values render as an em dash.
- The market table remains horizontally scrollable at narrow widths while the surrounding layout reflows.
- Reduced-motion preferences minimize transitions and animation.

## Known limitations

- CoinGecko's unauthenticated public API is an external dependency and may apply rate limits or temporary availability restrictions. A `429` or other failed response is shown through the dashboard error states.
- Data is client-fetched, so the first market view requires a network request.
- Search, selection, and query cache are intentionally in-memory and reset with a new browser session.
- Demo authentication is not a security boundary and must not be reused for production.
- This assessment intentionally excludes charts, sorting, pagination, a backend, and account management.

## Deployment notes

The application can be deployed to Vercel without environment variables:

1. Import the repository into Vercel.
2. Keep the detected Next.js framework preset.
3. Use `npm run build` as the build command and the default Next.js output settings.
4. Deploy, then replace the **TBD** project links above with the final URLs.

No deployment is performed as part of this repository handoff.

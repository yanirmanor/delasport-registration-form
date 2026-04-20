# Delasport Registration Form

React + TypeScript + Vite implementation of the Delasport registration task.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Vitest + Testing Library
- OXC tooling (`oxlint`, `oxfmt`)

## Scripts

- `npm run dev`: start frontend
- `npm run mock:server`: start mock API at `http://localhost:8787`
- `npm run test:run`: run tests once
- `npm run test:coverage`: run coverage report
- `npm run lint`: run oxlint
- `npm run format`: format files with oxfmt
- `npm run format:check`: formatting check only

## Mock Server Behavior

Endpoint: `POST /api/register`

- Success (HTTP 200): returns `Registration completed successfully.`
- Failure (HTTP 422): if full name contains `fail` or tax identifier contains `ERROR`

Vite is configured to proxy `/api/*` requests to `http://localhost:8787`.

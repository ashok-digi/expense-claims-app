# Expense Claims App

Node 20+ / Express backend with in-memory storage, plus a plain HTML/CSS/JS frontend served from `public/`.

## Commands
- `npm run dev` – start with nodemon
- `npm start` – start with node
- `npm test` – placeholder until tests exist

## Conventions
- **Layered code:** feature code stays layered: routes → controllers → services → repositories, with shapes and allowed values in `models/`. Keep each layer to its own job (no storage access in controllers, no HTTP concerns in services).
- **Money:** amounts are numbers with at most two decimal places. Currencies are 3-letter ISO 4217 codes (e.g. `USD`, `EUR`).
- **New fields:** a new claim field is always added to the model, the validation, and the frontend (form and table) together in one pass. Never leave them partially updated.
- **Structure:** do not add new top-level directories without asking first.
- **Secrets:** only `.env.example` is committed; never commit `.env` or real secrets.

# DealerDesk — Service Desk

A repair order / service ticket management app modeled on the workflows behind
dealership management systems (DMS) — the category of software companies like
Reynolds and Reynolds build for auto dealerships and service departments.

Built after five years working hands-on as an automotive electronics diagnostics
technician. This project translates that shop-floor workflow (customer intake,
vehicle history, diagnostic notes, parts and labor, repair order status) into a
working web application.

## Features

- **Dashboard** — cars currently in shop, open/unassigned work, average repair time, and today's revenue (revenue hidden for the Technician role)
- **Service Tickets** — create repair orders, assign a technician, set an estimated labor time, log the reported concern, track status through a workflow (Open → In Progress → Waiting on Parts → Completed), and itemize parts/labor line items (parts can be pulled straight from inventory) with automatic totals
- **Repair order timeline** — every status change is timestamped and shown as a history trail on the ticket
- **PDF export** — download any repair order as a formatted PDF (customer, vehicle, technician, line items, total, timeline)
- **Search & filter** — find tickets by RO number, VIN, or customer name, plus filter by status
- **Customers** — contact records with linked vehicle counts
- **Vehicles** — year/make/model, VIN, and mileage, linked to an owner; click a vehicle to see its full repair history
- **VIN decode** — type or scan a VIN and auto-fill year/make/model via the free NHTSA vPIC API
- **VIN barcode scanner** — scan a VIN barcode (e.g. the door-jamb sticker) using the device camera
- **Parts inventory** — SKU, stock quantity (with low-stock flagging), and unit cost; parts can be attached directly to a repair order's line items
- **Role-based views** — sign in as Advisor, Technician, or Manager; Technicians can't delete tickets, and revenue figures are hidden outside Advisor/Manager

Data persists to the browser's local storage, so the demo state survives a refresh without needing a backend.

### Two features built as clearly-labeled demo versions

- **"Authentication"** is a role picker, not real login — there's no password, account system, or server-side verification. A production build would need a real backend with hashed credentials and session tokens.
- **Barcode scanning** uses the device camera directly in the browser (`html5-qrcode`). It only works over HTTPS (or `localhost`), so it needs to be tried on the deployed version, not a plain local file.

Both are worth being upfront about in an interview — they show the concept and the UI, not a production-hardened implementation.

## Stack

- React 18 + Vite
- Plain CSS (custom properties, no framework) — see `src/index.css`
- `jspdf` for client-side PDF generation
- `html5-qrcode` for camera-based barcode scanning
- NHTSA vPIC API (free, no key required) for VIN decoding
- No backend required for the demo; state is modeled the way it would map onto a
  real relational schema (`customers` → `vehicles` → `tickets`, `technicians`, `parts`,
  with `tickets` holding a `lines[]` array and a `history[]` status timeline)

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build in `dist/`.

## Why this project

Most of my other projects (NASA Lunabotics rover, embedded firmware, VHDL/ALU design)
are deep in embedded/robotics territory. This one is deliberately different: a
CRUD-style business application built on a standard web stack, in the exact domain
(automotive service/dealership operations) I already know from the inside. The goal
is to show I can build straightforward, well-structured application software — not
just systems-level embedded work — while bringing real domain knowledge of how a
service department actually operates.

## Possible extensions

- Swap local storage for a real backend (Node/Express + SQLite or Postgres) and add real authentication (hashed passwords, sessions)
- Add a technician management page (add/edit/remove technicians, not just seeded data)
- Tie parts inventory line items to actual stock decrements when a ticket is saved
- Add printable customer-facing estimates, separate from the internal repair order PDF

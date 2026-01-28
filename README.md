# IMPULSE Order Confirmation & Delivery Tracking System

Production-ready backend system for IMPULSE food delivery, handling order confirmation via WhatsApp, real-time courier GPS tracking, and secure customer/courier tracking pages.

## Features

- ✅ Automatic order confirmation via WhatsApp after payment
- ✅ Real-time courier GPS tracking (Uber-style)
- ✅ Secure customer and courier tracking pages
- ✅ Idempotent WhatsApp messaging (no duplicates)
- ✅ Token-based authentication for tracking
- ✅ Graceful degradation (works without WhatsApp in dev mode)

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Maps**: Leaflet + OpenStreetMap
- **WhatsApp**: Meta WhatsApp Cloud API

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required:
- `IMPULSE_ORDER_SECRET`: Secret key for order creation endpoint

Optional (for WhatsApp):
- `WHATSAPP_ACCESS_TOKEN`: Meta WhatsApp Cloud API access token
- `WHATSAPP_PHONE_NUMBER_ID`: Your WhatsApp phone number ID
- `WHATSAPP_BUSINESS_ACCOUNT_ID`: Your WhatsApp business account ID

### 3. Setup Database

Run the setup script to generate Prisma client and run migrations:

```bash
npm run setup
```

Or manually:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (creates SQLite database)
npm run prisma:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Create/Update Order

**POST** `/api/orders/paid`

Headers:
- `x-impulse-secret`: Your secret key

Body:
```json
{
  "orderNumber": "IMP-047",
  "customer": {
    "name": "Juan",
    "phone": "+52 55 1234 5678"
  },
  "items": [
    { "name": "Smash Burger", "qty": 2 },
    { "name": "Papas", "qty": 1 }
  ],
  "total": "420",
  "paymentStatus": "paid",
  "paymentMethod": "online",
  "address": "CDMX"
}
```

Response:
```json
{
  "ok": true,
  "customerTrackingUrl": "http://localhost:3000/t/IMP-047?token=...",
  "courierTrackingUrl": "http://localhost:3000/c/IMP-047?token=..."
}
```

### Courier Location Update

**POST** `/api/courier/location`

Body:
```json
{
  "orderNumber": "IMP-047",
  "token": "<courierToken>",
  "lat": 19.3901,
  "lng": -99.2456,
  "accuracy": 12
}
```

### Get Tracking Data

**GET** `/api/track/:orderNumber?token=<customerToken>`

Response:
```json
{
  "ok": true,
  "location": {
    "lat": 19.39,
    "lng": -99.24,
    "accuracy": 12,
    "updatedAt": "2026-01-27T18:42:00Z"
  }
}
```

## Public Pages

### Customer Tracking

**GET** `/t/:orderNumber?token=<customerToken>`

Displays a map with real-time courier location updates.

### Courier Tracking

**GET** `/c/:orderNumber?token=<courierToken>`

Allows courier to share their GPS location automatically.

## WhatsApp Templates

The system uses WhatsApp Cloud API templates. You need to create these templates in your Meta Business account:

1. **impulse_order_confirm_v1** (es_MX)
   - Variables: `{{1}}` (orderNumber), `{{2}}` (total), `{{3}}` (trackingUrl)

2. **impulse_on_the_way_v1** (es_MX)
   - Variables: `{{1}}` (orderNumber), `{{2}}` (trackingUrl)

## Database Schema

- **Order**: Main order entity with customer/courier tokens
- **OrderItem**: Order line items
- **LocationPing**: GPS pings from courier
- **OrderEvent**: Idempotency tracking for WhatsApp messages

## Development

```bash
# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Production Deployment

1. Set `DATABASE_URL` to PostgreSQL connection string
2. Configure WhatsApp Cloud API credentials
3. Set `IMPULSE_ORDER_SECRET` to a strong random value
4. Set `BASE_URL` to your production domain
5. Enable HTTPS (required for geolocation API)
6. Run Prisma migrations: `npm run prisma:migrate`
7. Build and start: `npm run build && npm start`

## Security

- Secure token generation using `crypto.randomBytes`
- Secret header validation for order creation
- Separate tokens for customer and courier
- Input validation on all endpoints
- SQL injection protection via Prisma ORM

## License

ISC

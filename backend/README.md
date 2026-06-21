# Car Japan Motors — Backend API

Production-ready REST API for the Car Japan Motors single-showroom dealership.

- **Node.js + Express.js**
- **Prisma ORM** on **PostgreSQL (Neon)**
- **JWT** auth + **bcrypt** password hashing
- **Cloudinary** image storage via **multer** uploads
- `dotenv`, `cors`, clean separation of concerns

> Single admin. Cars are public. Reviews are moderated. Inquiries are stored leads. WhatsApp is the conversion channel (handled on the frontend).

---

## 1. Setup

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values (Windows: copy .env.example .env)
```

Fill `.env`:

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string (`...-pooler...?sslmode=require`) |
| `DIRECT_URL` | Neon **direct** URL for migrations (or set equal to `DATABASE_URL`) |
| `JWT_SECRET` | Long random string |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin login |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `CLIENT_URL` | Comma-separated allowed frontend origins |

---

## 2. Database (Prisma + Neon)

```bash
npm run prisma:generate     # generate the Prisma client
npm run prisma:migrate      # create & apply the initial migration
npm run db:seed             # create the admin from ADMIN_EMAIL/ADMIN_PASSWORD
```

For production deploys use `npm run prisma:deploy` (applies existing migrations without prompting).

Inspect data anytime with `npm run prisma:studio`.

---

## 3. Run

```bash
npm run dev     # nodemon, hot reload
npm start       # production
```

Health check: `GET http://localhost:5000/api/health`

---

## 4. Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Admin, Car, Review, Inquiry + enums
│   └── seed.js              # creates the single admin (idempotent)
├── src/
│   ├── config/
│   │   ├── db.js            # Prisma client singleton
│   │   └── cloudinary.js    # Cloudinary SDK config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── car.controller.js
│   │   ├── review.controller.js
│   │   └── inquiry.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── car.routes.js
│   │   ├── review.routes.js
│   │   └── inquiry.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT guard
│   │   ├── error.middleware.js    # notFound + central error handler
│   │   ├── upload.middleware.js   # multer (memory) for images
│   │   └── validate.middleware.js # request validators
│   ├── services/
│   │   └── cloudinary.service.js  # buffer → Cloudinary URL
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── hash.js
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   ├── app.js               # express app (middleware, routes, errors)
│   └── server.js            # http bootstrap + graceful shutdown
├── .env.example
└── package.json
```

---

## 5. API Reference

Base URL: `/api`. All responses are JSON: `{ success, ... }`. Admin routes require
`Authorization: Bearer <token>`.

### Auth
| Method | Path | Auth | Body |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | – | `{ email, password }` → `{ token, user }` |

### Cars
| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/cars` | – | Filters: `search, bodyType, fuelType, transmission, minPrice, maxPrice, featured, sold, sort` |
| GET | `/api/cars/:id` | – | Single car |
| POST | `/api/cars` | ✅ | `multipart/form-data`; text fields + `images` files |
| PUT | `/api/cars/:id` | ✅ | Partial update; `existingImages` (keep) + new `images` files |
| DELETE | `/api/cars/:id` | ✅ | Also removes Cloudinary assets |

### Reviews
| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/reviews` | – | `{ name, rating(1–5), comment }` → always `PENDING` |
| GET | `/api/reviews` | – | Only `APPROVED` |
| GET | `/api/admin/reviews` | ✅ | All; optional `?status=PENDING\|APPROVED\|REJECTED` |
| PATCH | `/api/reviews/:id/approve` | ✅ | Set `APPROVED` |
| PATCH | `/api/reviews/:id/reject` | ✅ | Set `REJECTED` |

### Inquiries
| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/inquiries` | – | `{ name, phone, message, carId? }` → `NEW` |
| GET | `/api/admin/inquiries` | ✅ | All; optional `?status=` ; includes linked car |
| PATCH | `/api/inquiries/:id/status` | ✅ | `{ status: NEW\|CONTACTED\|CLOSED }` |

---

## 6. Image Upload Flow

1. Client sends `multipart/form-data` with one or more `images` files to `POST /api/cars`.
2. `multer` (memory storage) hands buffers to the controller.
3. `cloudinary.service.js` streams each buffer to Cloudinary and returns secure URLs.
4. Only the URLs are stored in `Car.images[]` — **no image bytes in the database**.

On update, send `existingImages` (JSON array of URLs to keep) plus any new files; removed images are cleaned up on Cloudinary. On delete, all of a car's images are removed.

---

## 7. Business Rules

- Only the admin can create/update/delete cars, moderate reviews, and change inquiry status.
- Reviews are **always created as `PENDING`** and appear publicly only once `APPROVED`.
- `price` and `mileage` are stored as integers; `rating` must be 1–5.
- `features` and `images` are string arrays.
- Every inquiry submission (form or WhatsApp click) creates a lead record.

---

## 8. Connecting the Frontend

Set the frontend's `VITE_API_BASE_URL` to this server's URL (e.g. `http://localhost:5000`).
The frontend's service layer (`src/services/`) already targets these exact endpoints,
so it switches from mock data to this API with no component changes.

> Note: the frontend's mock shape uses `_id`/`name`; this API uses `id`/`title`. When
> wiring live, map fields in the frontend service layer (the single integration seam).

---

## 9. Notes

- `bcryptjs` is used (pure-JS, drop-in for `bcrypt`) for painless installs on Windows and serverless.
- Prisma client is a singleton to protect the Neon connection pool.
- Errors are normalized centrally (`{ success:false, message, details? }`), including Prisma/Multer/JWT cases.

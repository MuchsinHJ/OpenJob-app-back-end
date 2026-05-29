# PRD — OpenJob RESTful API (v2 — Feature-Based Architecture)

**Versi:** 2.0  
**Tech Stack:** Node.js · Express.js · PostgreSQL · node-pg-migrate · Joi · JWT · bcrypt · nanoid  
**Arsitektur:** Feature-based / Domain-Driven (referensi struktur NODE-JS-WEB-SERVER)  
**Target:** Advance (4 pts semua kriteria)

---

## Daftar Isi

1. [Gambaran Arsitektur](#1-gambaran-arsitektur)
2. [Struktur Folder & File Lengkap](#2-struktur-folder--file-lengkap)
3. [Penjelasan Setiap Layer](#3-penjelasan-setiap-layer)
4. [Penjelasan Per Domain (services/)](#4-penjelasan-per-domain-services)
5. [Skema Database & ERD](#5-skema-database--erd)
6. [Daftar Endpoint Lengkap](#6-daftar-endpoint-lengkap)
7. [Alur Autentikasi (JWT)](#7-alur-autentikasi-jwt)
8. [Environment Variables (.env)](#8-environment-variables-env)
9. [Package.json Scripts](#9-packagejson-scripts)
10. [Checklist Kriteria](#10-checklist-kriteria)

---

## 1. Gambaran Arsitektur

Proyek ini menggunakan pola **Feature-based (Domain-Driven)** dimana setiap fitur/domain
dikemas dalam satu folder mandiri di dalam `src/services/`. Setiap domain memiliki
4 sub-folder: `controllers`, `repositories`, `routes`, dan `validator`.

### Alur Data per Request

```
Request
  → src/routes/index.js          (router utama, mount semua service routes)
  → src/middlewares/auth.js       (jika protected route)
  → src/middlewares/validate.js   (jika ada body validation)
  → services/{domain}/routes/     (router per domain)
  → services/{domain}/controllers/ (terima req, panggil repository)
  → services/{domain}/repositories/ (query PostgreSQL)
  → utils/response.js             (format JSON response)
  → src/middlewares/error.js      (tangkap semua error)
```

### Keuntungan Arsitektur Ini

- Setiap domain **independen** — mudah dikembangkan atau dihapus tanpa efek samping
- File per domain kecil dan fokus — mudah dibaca dan di-debug
- Cocok untuk tim karena setiap orang bisa pegang satu domain
- Mudah di-scale menjadi microservices di masa depan

---

## 2. Struktur Folder & File Lengkap

```
openjob-api/
│
├── migrations/
│   ├── {timestamp}_create-table-users.js
│   ├── {timestamp}_create-table-companies.js
│   ├── {timestamp}_create-table-categories.js
│   ├── {timestamp}_create-table-jobs.js
│   ├── {timestamp}_create-table-authentications.js
│   ├── {timestamp}_create-table-applications.js
│   ├── {timestamp}_create-table-bookmarks.js
│   └── {timestamp}_create-table-documents.js
│
├── src/
│   │
│   ├── exceptions/                        ← Custom error classes
│   │   ├── authentication-error.js        ← Error 401
│   │   ├── authorization-error.js         ← Error 403
│   │   ├── client-error.js                ← Base class error 4xx
│   │   ├── not-found-error.js             ← Error 404
│   │   ├── invariant-error.js             ← Error 400 (validasi/bisnis)
│   │   └── index.js                       ← Re-export semua exception
│   │
│   ├── middlewares/
│   │   ├── auth.js                        ← Verifikasi JWT Bearer token
│   │   ├── validate.js                    ← Wrapper Joi validation
│   │   └── error.js                       ← Global error handler (4 params)
│   │
│   ├── routes/
│   │   └── index.js                       ← Mount semua service routes ke app
│   │
│   ├── security/
│   │   └── token-manager.js               ← generateAccessToken, generateRefreshToken,
│   │                                         verifyAccessToken, verifyRefreshToken
│   │
│   ├── server/
│   │   └── index.js                       ← Buat express app, pasang middleware & routes
│   │
│   └── services/
│       │
│       ├── authentications/
│       │   ├── controllers/
│       │   │   └── index.js               ← login(), refreshToken(), logout()
│       │   ├── repositories/
│       │   │   └── index.js               ← addToken(), findToken(), deleteToken()
│       │   ├── routes/
│       │   │   └── index.js               ← POST/PUT/DELETE /authentications
│       │   └── validator/
│       │       ├── index.js               ← validateLogin, validateRefresh, validateLogout
│       │       └── schema.js              ← Joi schema login, refresh, logout
│       │
│       ├── users/
│       │   ├── controllers/
│       │   │   └── index.js               ← register(), getUserById()
│       │   ├── repositories/
│       │   │   └── index.js               ← addUser(), getUserById(), getUserByEmail()
│       │   ├── routes/
│       │   │   └── index.js               ← POST /users, GET /users/:id
│       │   └── validator/
│       │       ├── index.js               ← validateRegister
│       │       └── schema.js              ← Joi schema register
│       │
│       ├── companies/
│       │   ├── controllers/
│       │   │   └── index.js               ← create(), getAll(), getById(), update(), delete()
│       │   ├── repositories/
│       │   │   └── index.js               ← addCompany(), getAllCompanies(), dst
│       │   ├── routes/
│       │   │   └── index.js               ← GET/POST/PUT/DELETE /companies
│       │   └── validator/
│       │       ├── index.js               ← validateCreate, validateUpdate
│       │       └── schema.js              ← Joi schema company
│       │
│       ├── categories/
│       │   ├── controllers/
│       │   │   └── index.js               ← create(), getAll(), getById(), update(), delete()
│       │   ├── repositories/
│       │   │   └── index.js               ← addCategory(), getAllCategories(), dst
│       │   ├── routes/
│       │   │   └── index.js               ← GET/POST/PUT/DELETE /categories
│       │   └── validator/
│       │       ├── index.js               ← validateCreate, validateUpdate
│       │       └── schema.js              ← Joi schema category
│       │
│       ├── jobs/
│       │   ├── controllers/
│       │   │   └── index.js               ← create(), getAll(), getById(),
│       │   │                                 getByCompany(), getByCategory(),
│       │   │                                 update(), delete()
│       │   ├── repositories/
│       │   │   └── index.js               ← addJob(), getAllJobs(query), dst
│       │   ├── routes/
│       │   │   └── index.js               ← GET/POST/PUT/DELETE /jobs + query params
│       │   └── validator/
│       │       ├── index.js               ← validateCreate, validateUpdate
│       │       └── schema.js              ← Joi schema job
│       │
│       ├── applications/
│       │   ├── controllers/
│       │   │   └── index.js               ← apply(), getAll(), getById(),
│       │   │                                 getByUser(), getByJob(),
│       │   │                                 updateStatus(), delete()
│       │   ├── repositories/
│       │   │   └── index.js               ← addApplication(), getAllApplications(), dst
│       │   ├── routes/
│       │   │   └── index.js               ← semua /applications routes
│       │   └── validator/
│       │       ├── index.js               ← validateApply, validateUpdateStatus
│       │       └── schema.js              ← Joi schema application
│       │
│       ├── bookmarks/
│       │   ├── controllers/
│       │   │   └── index.js               ← addBookmark(), getAll(), getById(), delete()
│       │   ├── repositories/
│       │   │   └── index.js               ← addBookmark(), getBookmarks(), dst
│       │   ├── routes/
│       │   │   └── index.js               ← /jobs/:jobId/bookmark + /bookmarks
│       │   └── validator/
│       │       ├── index.js               ← (opsional, jika ada body)
│       │       └── schema.js
│       │
│       ├── profile/
│       │   ├── controllers/
│       │   │   └── index.js               ← getProfile(), getMyApplications(), getMyBookmarks()
│       │   ├── repositories/
│       │   │   └── index.js               ← getUserProfile(), getApplicationsByUserId(), dst
│       │   └── routes/
│       │       └── index.js               ← GET /profile, /profile/applications, /profile/bookmarks
│       │
│       └── documents/
│           ├── controllers/
│           │   └── index.js               ← upload(), getAll(), getById(), delete()
│           ├── repositories/
│           │   └── index.js               ← addDocument(), getAllDocuments(), dst
│           └── routes/
│               └── index.js               ← POST/GET/DELETE /documents
│
├── utils/
│   └── response.js                        ← Helper: sendSuccess(), sendError()
│
├── uploads/                               ← File dokumen yang diupload (auto-created)
│
├── ERD-OpenJob-versi-1.png                ← ERD diagram (wajib untuk Advanced)
│
├── .env                                   ← Environment variables (tidak di-commit)
├── .env.example                           ← Template .env
├── .gitignore
├── package.json
└── server.js                              ← Entry point: import src/server, listen PORT
```

---

## 3. Penjelasan Setiap Layer

### `server.js` (root)

Entry point paling luar. Hanya bertugas:

```js
require("dotenv").config();
const { createServer } = require("./src/server");

const server = createServer();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### `src/server/index.js`

Factory function yang membuat express app, memasang semua middleware global, dan mounting routes.

```js
// Tugas file ini:
// 1. const app = express()
// 2. app.use(cors(), express.json())
// 3. app.use(routes)              ← dari src/routes/index.js
// 4. app.use(errorMiddleware)     ← HARUS paling terakhir
// 5. return app / module.exports = { createServer }
```

---

### `src/routes/index.js`

Router induk yang me-mount semua service routes:

```js
const router = express.Router();

router.use("/users", require("../services/users/routes"));
router.use("/authentications", require("../services/authentications/routes"));
router.use("/companies", require("../services/companies/routes"));
router.use("/categories", require("../services/categories/routes"));
router.use("/jobs", require("../services/jobs/routes"));
router.use("/applications", require("../services/applications/routes"));
router.use("/bookmarks", require("../services/bookmarks/routes"));
router.use("/profile", require("../services/profile/routes"));
router.use("/documents", require("../services/documents/routes"));

module.exports = router;
```

---

### `src/exceptions/`

| File                      | Class                 | HTTP Code | Kapan digunakan                                                       |
| ------------------------- | --------------------- | --------- | --------------------------------------------------------------------- |
| `client-error.js`         | `ClientError`         | 4xx       | Base class, tidak diinstansiasi langsung                              |
| `invariant-error.js`      | `InvariantError`      | 400       | Data tidak valid / constraint bisnis gagal                            |
| `authentication-error.js` | `AuthenticationError` | 401       | Token tidak ada / invalid / expired                                   |
| `authorization-error.js`  | `AuthorizationError`  | 403       | User tidak punya hak akses resource                                   |
| `not-found-error.js`      | `NotFoundError`       | 404       | Resource tidak ditemukan di DB                                        |
| `index.js`                | —                     | —         | Re-export semua: `const { NotFoundError } = require('../exceptions')` |

Pola pewarisan:

```
Error (native)
  └── ClientError
        ├── InvariantError   (400)
        ├── AuthenticationError (401)
        ├── AuthorizationError  (403)
        └── NotFoundError    (404)
```

---

### `src/middlewares/error.js`

Global error handler — tangkap semua error yang di-`throw` di mana saja:

```js
// Logika pengecekan:
// if (err instanceof ClientError) → kirim err.statusCode + err.message
// else if (err instanceof multer error) → kirim 400
// else → kirim 500 "Internal Server Error" (jangan expose detail ke client)
```

---

### `src/middlewares/auth.js`

```js
// 1. Ambil header: Authorization: Bearer <token>
// 2. Jika tidak ada → throw AuthenticationError
// 3. tokenManager.verifyAccessToken(token)
// 4. Set req.user = { id } dari payload token
// 5. next()
```

---

### `src/middlewares/validate.js`

Higher-order function, terima Joi schema, return middleware:

```js
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error)
    throw new InvariantError(error.details.map((d) => d.message).join(", "));
  next();
};
```

---

### `src/security/token-manager.js`

Semua operasi JWT terpusat di sini:

```js
// generateAccessToken(payload)  → jwt.sign(payload, ACCESS_TOKEN_KEY, { expiresIn: '3h' })
// generateRefreshToken(payload) → jwt.sign(payload, REFRESH_TOKEN_KEY)
// verifyAccessToken(token)      → jwt.verify(token, ACCESS_TOKEN_KEY)  — throw AuthenticationError jika gagal
// verifyRefreshToken(token)     → jwt.verify(token, REFRESH_TOKEN_KEY) — throw AuthenticationError jika gagal
```

---

### `utils/response.js`

Helper untuk konsistensi format response:

```js
const sendSuccess = (res, statusCode, data) =>
  res.status(statusCode).json({ status: "success", data });

const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({ status: "fail", message });

module.exports = { sendSuccess, sendError };
```

---

## 4. Penjelasan Per Domain (services/)

Setiap domain memiliki pola yang **sama persis** dengan 4 sub-folder.
Berikut penjelasan detail pola tersebut diikuti catatan spesifik per domain.

### Pola Umum Per Domain

```
services/{domain}/
├── controllers/index.js    ← Terima req, ekstrak data, panggil repository, kirim response
├── repositories/index.js   ← Semua SQL query (pool.query) ada di sini
├── routes/index.js         ← Definisi route + pasang middleware auth & validate
└── validator/
    ├── index.js            ← Export fungsi validate*() yang panggil schema.validate()
    └── schema.js           ← Definisi Joi.object({ ... })
```

**Aturan penting:**

- `controllers` **tidak boleh** ada SQL query
- `repositories` **tidak boleh** ada logika bisnis, hanya query
- `routes` **tidak boleh** ada logika apapun selain routing

---

### Domain: `authentications`

**repositories/index.js** — method yang perlu dibuat:

```
addToken(token)           → INSERT ke tabel authentications
findToken(token)          → SELECT, throw NotFoundError jika tidak ada
deleteToken(token)        → DELETE, throw InvariantError jika token tidak ada di DB
```

**controllers/index.js** — method:

```
login(req, res)           → cek email (getUserByEmail), bcrypt.compare,
                            generate access+refresh token, addToken, response
refreshToken(req, res)    → verifyRefreshToken, findToken, generateAccessToken, response
logout(req, res)          → verifyRefreshToken, deleteToken, response
```

**routes/index.js:**

```
POST   /   → validate(loginSchema),   authController.login
PUT    /   → validate(refreshSchema), authController.refreshToken
DELETE /   → validate(logoutSchema),  authController.logout        [auth]
```

---

### Domain: `users`

**repositories/index.js:**

```
addUser({ id, name, email, password, role })  → INSERT, throw InvariantError jika email duplikat
getUserById(id)                                → SELECT, throw NotFoundError jika tidak ada
getUserByEmail(email)                          → SELECT, throw NotFoundError jika tidak ada
```

**controllers/index.js:**

```
register(req, res)   → validasi, hash password (bcrypt), nanoid untuk id, addUser, response 201
getUserById(req, res) → getUserById(req.params.id), response 200
```

**routes/index.js:**

```
POST /         → validate(registerSchema), userController.register
GET  /:id      → userController.getUserById
```

---

### Domain: `companies`

**repositories/index.js:**

```
addCompany({ id, name, location, description })
getAllCompanies()
getCompanyById(id)          → throw NotFoundError jika tidak ada
updateCompany(id, payload)  → throw NotFoundError jika tidak ada
deleteCompany(id)           → throw NotFoundError jika tidak ada
```

**routes/index.js:**

```
GET    /     → companyController.getAll
GET    /:id  → companyController.getById
POST   /     → [auth], validate(createSchema),  companyController.create
PUT    /:id  → [auth], validate(updateSchema),  companyController.update
DELETE /:id  → [auth],                          companyController.delete
```

---

### Domain: `categories`

Sama persis dengan companies. Tambahan: unique constraint pada `name`.

**routes/index.js:**

```
GET    /     → categoryController.getAll
GET    /:id  → categoryController.getById
POST   /     → [auth], validate(createSchema),  categoryController.create
PUT    /:id  → [auth], validate(updateSchema),  categoryController.update
DELETE /:id  → [auth],                          categoryController.delete
```

---

### Domain: `jobs` ⚠️ Perhatian Urutan Route

**repositories/index.js:**

```
addJob(payload)
getAllJobs({ title, companyName })   ← support query params untuk search
getJobById(id)
getJobsByCompanyId(companyId)
getJobsByCategoryId(categoryId)
updateJob(id, payload)
deleteJob(id)
```

**Query search di getAllJobs — contoh SQL:**

```sql
SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
FROM jobs
LEFT JOIN companies ON jobs.company_id = companies.id
LEFT JOIN categories ON jobs.category_id = categories.id
WHERE 1=1
  AND ($1::text IS NULL OR jobs.title ILIKE '%' || $1 || '%')
  AND ($2::text IS NULL OR companies.name ILIKE '%' || $2 || '%')
```

**routes/index.js — URUTAN KRITIS:**

```js
// ⚠️ Route statis HARUS di atas route dinamis (:id)
GET    /company/:companyId    → jobController.getByCompany
GET    /category/:categoryId  → jobController.getByCategory
GET    /                      → jobController.getAll          (support ?title & ?company-name)
GET    /:id                   → jobController.getById
POST   /                      → [auth], validate, jobController.create
PUT    /:id                   → [auth], validate, jobController.update
DELETE /:id                   → [auth],           jobController.delete

// Bookmark sub-routes (masih di jobs router)
POST   /:jobId/bookmark       → [auth],           bookmarkController.add
GET    /:jobId/bookmark/:id   → [auth],           bookmarkController.getById
DELETE /:jobId/bookmark       → [auth],           bookmarkController.delete
```

---

### Domain: `applications`

**repositories/index.js:**

```
addApplication({ id, user_id, job_id, status })
getAllApplications()
getApplicationById(id)
getApplicationsByUserId(userId)
getApplicationsByJobId(jobId)
updateApplicationStatus(id, status)
deleteApplication(id)
```

**routes/index.js — URUTAN KRITIS:**

```js
// ⚠️ Route statis di atas route dinamis
GET    /user/:userId  → [auth], applicationController.getByUser
GET    /job/:jobId    → [auth], applicationController.getByJob
GET    /              → [auth], applicationController.getAll
GET    /:id           → [auth], applicationController.getById
POST   /              → [auth], validate, applicationController.apply
PUT    /:id           → [auth], validate, applicationController.updateStatus
DELETE /:id           → [auth],           applicationController.delete
```

---

### Domain: `bookmarks`

**Catatan:** Bookmark di-trigger dari dua tempat:

- `POST/GET/DELETE /jobs/:jobId/bookmark*` → router bookmark di-mount di dalam `jobs/routes/index.js`
- `GET /bookmarks` → di-mount langsung di `src/routes/index.js`

**repositories/index.js:**

```
addBookmark({ id, user_id, job_id })
getBookmarksByUserId(userId)
getBookmarkById(id)
deleteBookmarkByUserAndJob(userId, jobId)   ← DELETE tanpa :bookmarkId
```

---

### Domain: `profile`

Domain ini **tidak punya validator** karena tidak ada body input. Semua data diambil dari `req.user.id` yang sudah di-set oleh `auth` middleware.

**repositories/index.js:**

```
getUserProfile(userId)              → JOIN users + data lain
getApplicationsByUserId(userId)     → boleh reuse dari applications repo
getBookmarksByUserId(userId)        → boleh reuse dari bookmarks repo
```

**routes/index.js:**

```js
GET /                → [auth], profileController.getProfile
GET /applications    → [auth], profileController.getMyApplications
GET /bookmarks       → [auth], profileController.getMyBookmarks
```

---

### Domain: `documents`

Menggunakan `multer` untuk handle multipart/form-data. Field name: `document`.

**Tambahan dependency:**

```
npm install multer
```

**routes/index.js:**

```js
GET    /     →          documentController.getAll
GET    /:id  →          documentController.getById
POST   /     → [auth], upload.single('document'), documentController.upload
DELETE /:id  → [auth],                            documentController.delete
```

---

## 5. Skema Database & ERD

### Tabel: `users`

| Kolom        | Tipe         | Constraint                              |
| ------------ | ------------ | --------------------------------------- |
| `id`         | VARCHAR(50)  | PRIMARY KEY                             |
| `name`       | VARCHAR(255) | NOT NULL                                |
| `email`      | VARCHAR(255) | NOT NULL **UNIQUE** ← unique constraint |
| `password`   | TEXT         | NOT NULL                                |
| `role`       | VARCHAR(50)  | NOT NULL                                |
| `created_at` | TIMESTAMP    | DEFAULT NOW()                           |
| `updated_at` | TIMESTAMP    | DEFAULT NOW()                           |

### Tabel: `companies`

| Kolom         | Tipe         | Constraint    |
| ------------- | ------------ | ------------- |
| `id`          | VARCHAR(50)  | PRIMARY KEY   |
| `name`        | VARCHAR(255) | NOT NULL      |
| `location`    | VARCHAR(255) |               |
| `description` | TEXT         |               |
| `created_at`  | TIMESTAMP    | DEFAULT NOW() |
| `updated_at`  | TIMESTAMP    | DEFAULT NOW() |

### Tabel: `categories`

| Kolom        | Tipe         | Constraint                              |
| ------------ | ------------ | --------------------------------------- |
| `id`         | VARCHAR(50)  | PRIMARY KEY                             |
| `name`       | VARCHAR(255) | NOT NULL **UNIQUE** ← unique constraint |
| `created_at` | TIMESTAMP    | DEFAULT NOW()                           |
| `updated_at` | TIMESTAMP    | DEFAULT NOW()                           |

### Tabel: `jobs`

| Kolom               | Tipe         | Constraint                                      |
| ------------------- | ------------ | ----------------------------------------------- |
| `id`                | VARCHAR(50)  | PRIMARY KEY                                     |
| `company_id`        | VARCHAR(50)  | NOT NULL, FK → companies.id ON DELETE CASCADE   |
| `category_id`       | VARCHAR(50)  | NOT NULL, FK → categories.id ON DELETE SET NULL |
| `title`             | VARCHAR(255) | NOT NULL                                        |
| `description`       | TEXT         |                                                 |
| `job_type`          | VARCHAR(50)  |                                                 |
| `experience_level`  | VARCHAR(50)  |                                                 |
| `location_type`     | VARCHAR(50)  |                                                 |
| `location_city`     | VARCHAR(100) |                                                 |
| `salary_min`        | BIGINT       |                                                 |
| `salary_max`        | BIGINT       |                                                 |
| `is_salary_visible` | BOOLEAN      | DEFAULT true                                    |
| `status`            | VARCHAR(50)  | DEFAULT 'open'                                  |
| `created_at`        | TIMESTAMP    | DEFAULT NOW()                                   |
| `updated_at`        | TIMESTAMP    | DEFAULT NOW()                                   |

### Tabel: `authentications`

| Kolom   | Tipe | Constraint  |
| ------- | ---- | ----------- |
| `token` | TEXT | PRIMARY KEY |

### Tabel: `applications`

| Kolom        | Tipe        | Constraint                                |
| ------------ | ----------- | ----------------------------------------- |
| `id`         | VARCHAR(50) | PRIMARY KEY                               |
| `user_id`    | VARCHAR(50) | NOT NULL, FK → users.id ON DELETE CASCADE |
| `job_id`     | VARCHAR(50) | NOT NULL, FK → jobs.id ON DELETE CASCADE  |
| `status`     | VARCHAR(50) | DEFAULT 'pending'                         |
| `created_at` | TIMESTAMP   | DEFAULT NOW()                             |
| `updated_at` | TIMESTAMP   | DEFAULT NOW()                             |

### Tabel: `bookmarks`

| Kolom        | Tipe        | Constraint                                |
| ------------ | ----------- | ----------------------------------------- |
| `id`         | VARCHAR(50) | PRIMARY KEY                               |
| `user_id`    | VARCHAR(50) | NOT NULL, FK → users.id ON DELETE CASCADE |
| `job_id`     | VARCHAR(50) | NOT NULL, FK → jobs.id ON DELETE CASCADE  |
| `created_at` | TIMESTAMP   | DEFAULT NOW()                             |

### Tabel: `documents`

| Kolom        | Tipe         | Constraint                                |
| ------------ | ------------ | ----------------------------------------- |
| `id`         | VARCHAR(50)  | PRIMARY KEY                               |
| `user_id`    | VARCHAR(50)  | NOT NULL, FK → users.id ON DELETE CASCADE |
| `filename`   | VARCHAR(255) | NOT NULL                                  |
| `filepath`   | TEXT         | NOT NULL                                  |
| `created_at` | TIMESTAMP    | DEFAULT NOW()                             |

### Relasi Antar Tabel

```
users        ──<  applications  >──  jobs
users        ──<  bookmarks     >──  jobs
users        ──<  documents
jobs         >──  companies
jobs         >──  categories
```

> File `ERD-OpenJob-versi-1.png` wajib dibuat dan disimpan di **root project**.

---

## 6. Daftar Endpoint Lengkap

### PUBLIC (tanpa token)

| Method | Endpoint                     | Handler                                |
| ------ | ---------------------------- | -------------------------------------- |
| POST   | `/users`                     | users.register                         |
| GET    | `/users/:id`                 | users.getUserById                      |
| GET    | `/companies`                 | companies.getAll                       |
| GET    | `/companies/:id`             | companies.getById                      |
| GET    | `/categories`                | categories.getAll                      |
| GET    | `/categories/:id`            | categories.getById                     |
| GET    | `/jobs`                      | jobs.getAll + `?title` `?company-name` |
| GET    | `/jobs/:id`                  | jobs.getById                           |
| GET    | `/jobs/company/:companyId`   | jobs.getByCompany                      |
| GET    | `/jobs/category/:categoryId` | jobs.getByCategory                     |
| POST   | `/authentications`           | auth.login                             |
| PUT    | `/authentications`           | auth.refreshToken                      |
| GET    | `/documents`                 | documents.getAll                       |
| GET    | `/documents/:id`             | documents.getById                      |

### PROTECTED (`Authorization: Bearer <access_token>`)

| Method | Endpoint                     | Handler                      |
| ------ | ---------------------------- | ---------------------------- |
| DELETE | `/authentications`           | auth.logout                  |
| GET    | `/profile`                   | profile.getProfile           |
| GET    | `/profile/applications`      | profile.getMyApplications    |
| GET    | `/profile/bookmarks`         | profile.getMyBookmarks       |
| POST   | `/companies`                 | companies.create             |
| PUT    | `/companies/:id`             | companies.update             |
| DELETE | `/companies/:id`             | companies.delete             |
| POST   | `/categories`                | categories.create            |
| PUT    | `/categories/:id`            | categories.update            |
| DELETE | `/categories/:id`            | categories.delete            |
| POST   | `/jobs`                      | jobs.create                  |
| PUT    | `/jobs/:id`                  | jobs.update                  |
| DELETE | `/jobs/:id`                  | jobs.delete                  |
| POST   | `/applications`              | applications.apply           |
| GET    | `/applications`              | applications.getAll          |
| GET    | `/applications/:id`          | applications.getById         |
| GET    | `/applications/user/:userId` | applications.getByUser       |
| GET    | `/applications/job/:jobId`   | applications.getByJob        |
| PUT    | `/applications/:id`          | applications.updateStatus    |
| DELETE | `/applications/:id`          | applications.delete          |
| POST   | `/jobs/:jobId/bookmark`      | bookmarks.add                |
| GET    | `/jobs/:jobId/bookmark/:id`  | bookmarks.getById            |
| DELETE | `/jobs/:jobId/bookmark`      | bookmarks.deleteByUserAndJob |
| GET    | `/bookmarks`                 | bookmarks.getAllByUser       |
| POST   | `/documents`                 | documents.upload (multipart) |
| DELETE | `/documents/:id`             | documents.delete             |

---

## 7. Alur Autentikasi (JWT)

```
POST /authentications (login)
  1. validate body (email, password)
  2. userRepo.getUserByEmail(email) → NotFoundError jika tidak ada
  3. bcrypt.compare(password, user.password) → AuthenticationError jika salah
  4. tokenManager.generateAccessToken({ id: user.id })   ← expires 3h
  5. tokenManager.generateRefreshToken({ id: user.id })
  6. authRepo.addToken(refreshToken)                      ← simpan ke DB
  7. Response 200: { accessToken, refreshToken }

PUT /authentications (refresh)
  1. validate body (refreshToken)
  2. tokenManager.verifyRefreshToken(refreshToken)        ← cek signature
  3. authRepo.findToken(refreshToken)                     ← cek ada di DB
  4. tokenManager.generateAccessToken({ id })             ← buat access baru
  5. Response 200: { accessToken }

DELETE /authentications (logout) [AUTH]
  1. validate body (refreshToken)
  2. tokenManager.verifyRefreshToken(refreshToken)
  3. authRepo.deleteToken(refreshToken)
  4. Response 200: { message: "Logout berhasil" }

Protected Request:
  1. auth middleware baca: Authorization: Bearer <token>
  2. tokenManager.verifyAccessToken(token)               ← AuthenticationError jika gagal
  3. req.user = { id: payload.id }
  4. next()
```

---

## 8. Environment Variables (.env)

```env
# PostgreSQL — dibaca native oleh library pg
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=openjob_db
PGHOST=localhost
PGPORT=5432

# HTTP Server
HOST=localhost
PORT=3000

# JWT Secret Keys — WAJIB panjang dan random
ACCESS_TOKEN_KEY=ganti_dengan_string_random_panjang_untuk_access
REFRESH_TOKEN_KEY=ganti_dengan_string_random_panjang_untuk_refresh
```

`.env.example` — file yang sama dengan semua value dikosongkan, boleh di-commit ke git.

`.gitignore` — pastikan `.env` masuk:

```
node_modules/
.env
uploads/
*.log
```

---

## 9. Package.json Scripts

```json
{
  "name": "openjob-api",
  "version": "1.0.0",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js",
    "start:dev": "nodemon server.js",
    "migrate": "node-pg-migrate up",
    "migrate:down": "node-pg-migrate down",
    "migrate:create": "node-pg-migrate create"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "joi": "^18.1.2",
    "jsonwebtoken": "^9.0.3",
    "multer": "^1.4.5-lts.1",
    "nanoid": "^5.1.7",
    "node-pg-migrate": "^8.0.4",
    "pg": "^8.21.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

> **Penting:** Postman test mengharuskan `npm run start:dev` berfungsi.

---

## 10. Checklist Kriteria

### Kriteria 1 — Database (target: Advanced 4 pts)

- [ ] Data tersimpan di PostgreSQL
- [ ] Migrasi `node-pg-migrate` dengan timestamp di nama file (`{timestamp}_create-table-*.js`)
- [ ] Kredensial via `.env`: `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGHOST`, `PGPORT`
- [ ] `HOST` dan `PORT` server di `.env`
- [ ] `npm run start:dev` berfungsi (nodemon)
- [ ] Validasi menggunakan Joi (`validator/schema.js` per domain)
- [ ] Middleware validasi (`src/middlewares/validate.js`) digunakan di routes
- [ ] Middleware error handler (`src/middlewares/error.js`) dipasang terakhir
- [ ] Unique constraint: `email` di `users`, `name` di `categories`
- [ ] Normalisasi DB: 5+ relasi FK antar tabel
- [ ] File `ERD-OpenJob-versi-1.png` di root project
- [ ] `GET /jobs?title=...` dan `GET /jobs?company-name=...` berfungsi
- [ ] Semua test Postman mandatory & optional tidak error

### Kriteria 2 — Autentikasi (target: Advanced 4 pts)

- [ ] Semua endpoint public tidak butuh token
- [ ] Semua endpoint protected butuh `Authorization: Bearer <token>`
- [ ] JWT payload mengandung `id` user
- [ ] Refresh token tersimpan di tabel `authentications`
- [ ] `src/middlewares/auth.js` digunakan di semua protected routes
- [ ] `GET /profile` mengembalikan data user yang sedang login
- [ ] `GET /profile/applications` mengembalikan lamaran user yang login
- [ ] `GET /profile/bookmarks` mengembalikan bookmark user yang login
- [ ] `ACCESS_TOKEN_KEY` dan `REFRESH_TOKEN_KEY` dari `.env`
- [ ] Access token expiry: `expiresIn: '3h'`
- [ ] Semua test Postman mandatory & optional tidak error

---

## Urutan Implementasi yang Disarankan

```
1. Setup project: package.json, .env, .gitignore, server.js
2. Buat semua migrations & jalankan: npm run migrate
3. src/exceptions/ — semua custom error class
4. src/security/token-manager.js
5. utils/response.js
6. src/middlewares/ — error.js, auth.js, validate.js
7. services/users/ — register & getUserById (domain paling dasar)
8. services/authentications/ — login, refresh, logout
9. services/companies/
10. services/categories/
11. services/jobs/ — termasuk query params search
12. services/applications/
13. services/bookmarks/
14. services/profile/
15. services/documents/ — tambah multer
16. src/routes/index.js — mount semua
17. src/server/index.js — buat app
18. Test semua endpoint dengan Postman
19. Buat ERD-OpenJob-versi-1.png
```

---

_Dokumen ini adalah acuan pengembangan v2 dengan arsitektur feature-based._  
_Setiap domain berdiri sendiri — mulai dari domain yang paling tidak bergantung (users) hingga yang paling kompleks (jobs, applications)._

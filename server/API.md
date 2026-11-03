# YTC Global Backend API Documentation

Base URL: `http://localhost:5000` (or `{{baseUrl}}` in Postman)

All API responses follow the consistent JSON format:
- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "message": "...", "errors": [...] }`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/login`
- **Access**: Public (Rate limit: 5 attempts per 15 min per IP)
- **Body**:
```json
{
  "email": "admin@yourdomain.com",
  "password": "choose_a_strong_password_here"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_string",
  "data": {
    "id": "67...",
    "name": "Your Name",
    "email": "admin@yourdomain.com",
    "role": "super_admin"
  }
}
```

### `POST /api/auth/logout`
- **Access**: Public
- **Description**: Clears the HTTP-only `token` cookie.
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### `GET /api/auth/me`
- **Access**: Protected (Requires Cookie or `Authorization: Bearer <token>`)
- **Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "67...",
    "name": "Your Name",
    "email": "admin@yourdomain.com",
    "role": "super_admin",
    "lastLoginAt": "2026-10-30T10:00:00.000Z"
  }
}
```

### `PATCH /api/auth/change-password`
- **Access**: Protected
- **Body**:
```json
{
  "currentPassword": "old_password_here",
  "newPassword": "new_secure_password"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 2. Public Leads & Applications

### `POST /api/leads`
- **Access**: Public (Rate limit: 5 per 15 min in prod, generous in dev)
- **Body**:
```json
{
  "type": "consultation",
  "name": "Aarav Sharma",
  "phone": "+91 98765 43210",
  "email": "aarav@example.com",
  "country": "Canada",
  "course": "Computer Science",
  "message": "Interested in Fall 2026 intake."
}
```
- **Response** (201 Created):
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": "67...",
    "type": "consultation",
    "name": "Aarav Sharma",
    "status": "new"
  }
}
```

### `POST /api/applications`
- **Access**: Public (multipart/form-data)
- **Fields**:
  - `name`: string (required)
  - `phone`: string (required)
  - `email`: string
  - `currentCity`: string
  - `jobCategory`: Healthcare | Hospitality | Construction | IT and Engineering | Other
  - `preferredCountry`: string
  - `experience`: string
  - `message`: string
  - `cv`: file (PDF, DOC, DOCX, max 5MB)
- **Response** (201 Created):
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "67...",
    "name": "John Doe",
    "cvFile": "1730000000-abcd.pdf",
    "status": "received"
  }
}
```

---

## 3. Admin Leads Management (`/api/admin/leads`)

### `GET /api/admin/leads`
- **Access**: Protected (Counsellors see assigned/unassigned; super_admin & editor see all)
- **Query Parameters**:
  - `page`: default 1
  - `limit`: default 10
  - `type`: consultation | contact | eligibility | job_application | employer_inquiry
  - `status`: new | contacted | in_progress | converted | closed
  - `country`: string regex
  - `assignedTo`: Admin ID or 'unassigned'
  - `startDate`, `endDate`: ISO Date
  - `search`: string
  - `sort`: newest | oldest | status

### `GET /api/admin/leads/:id`
- **Access**: Protected

### `PATCH /api/admin/leads/:id`
- **Access**: Protected
- **Body**:
```json
{
  "status": "contacted",
  "assignedTo": "67...",
  "note": "Candidate requested call back tomorrow 3 PM."
}
```

### `DELETE /api/admin/leads/:id`
- **Access**: Protected (`super_admin` only)

### `GET /api/admin/leads/export`
- **Access**: Protected
- **Response**: CSV attachment with formula-injection sanitization.

---

## 4. Admin Dashboard Analytics (`/api/admin/stats`)

### `GET /api/admin/stats`
- **Access**: Protected
- **Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totals": {
      "leads": 25,
      "newLeadsToday": 4,
      "newLeadsThisWeek": 18,
      "newLeadsThisMonth": 25,
      "jobApplications": 8,
      "openJobs": 5
    },
    "conversionRate": 16.0,
    "leadsByType": [{ "type": "consultation", "count": 12 }],
    "leadsByStatus": [{ "status": "new", "count": 10 }],
    "leadsByCountry": [{ "country": "Canada", "count": 8 }],
    "leadsPerDay": [{ "date": "2026-10-30", "count": 4 }],
    "recentLeads": [...]
  }
}
```

---

## 5. Staff Management (`/api/admin/staff`)

*All routes restricted to `super_admin` only.*

- `GET /api/admin/staff` — List staff
- `POST /api/admin/staff` — Create staff account (`name`, `email`, `role`, `password`)
- `PATCH /api/admin/staff/:id` — Update staff (`name`, `role`, `isActive`)
- `POST /api/admin/staff/:id/reset-password` — Set new password
- `DELETE /api/admin/staff/:id` — Delete staff account

---

## 6. Content Resource Endpoints

| Resource | Public List & Get | Admin Create, Update, Delete |
|---|---|---|
| **Countries** | `GET /api/countries`, `GET /api/countries/:slug` | `POST, PUT, DELETE /api/admin/countries` |
| **Universities** | `GET /api/universities`, `GET /api/universities/:slug` | `POST, PUT, DELETE /api/admin/universities` |
| **Courses** | `GET /api/courses`, `GET /api/courses/:slug` | `POST, PUT, DELETE /api/admin/courses` |
| **Services** | `GET /api/services`, `GET /api/services/:slug` | `POST, PUT, DELETE /api/admin/services` |
| **Testimonials** | `GET /api/testimonials`, `GET /api/testimonials/:id` | `POST, PUT, DELETE /api/admin/testimonials` |
| **Blogs** | `GET /api/blogs`, `GET /api/blogs/:slug` | `POST, PUT, DELETE /api/admin/blogs` |
| **FAQs** | `GET /api/faqs`, `GET /api/faqs/:id` | `POST, PUT, DELETE /api/admin/faqs` |
| **Partners** | `GET /api/partners`, `GET /api/partners/:id` | `POST, PUT, DELETE /api/admin/partners` |
| **Jobs** | `GET /api/jobs`, `GET /api/jobs/:slug` | `POST, PUT, DELETE /api/admin/jobs` |

---

## 7. Media & Uploads (Cloudinary for Images, Local for CVs)

### `POST /api/admin/upload/image`
- **Access**: Protected (`super_admin`, `editor`)
- **Body**: `multipart/form-data` with field `image` (JPG, JPEG, PNG, WEBP, SVG, max 2MB)
- **Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/<cloud_name>/image/upload/v1730000/ytc/images/sample.webp",
    "publicId": "ytc/images/sample"
  }
}
```

### `DELETE /api/admin/upload/image`
- **Access**: Protected (`super_admin`, `editor`)
- **Body** (`application/json`):
```json
{
  "publicId": "ytc/images/sample"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "result": "ok"
  }
}
```

### `GET /api/admin/applications/:id/cv`
- **Access**: Protected
- **Description**: Securely downloads candidate CV from server's private `/uploads/cv/` storage.


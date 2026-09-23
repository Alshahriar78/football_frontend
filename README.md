# Gallery Management Module

The Gallery Management Module is an admin-side feature of the **Mokamtola eFootball Cup 2026** tournament management system.

It allows the tournament administrator to upload, manage, publish, edit, and delete tournament photos.

---

## Features

* Upload tournament images
* Store images in Supabase Storage
* Store image information in PostgreSQL
* Create gallery items
* View all gallery items
* View published gallery items
* Filter gallery items by category
* Edit gallery information
* Replace gallery images
* Publish / Unpublish gallery items
* Delete gallery items
* JWT protected admin actions
* Image validation
* Maximum image size: 5MB
* Responsive admin interface

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios

### Backend

* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* Supabase Storage
* JWT Authentication

---

# Architecture

The Gallery module follows this flow:

```text
Admin
  │
  ▼
React Admin Panel
  │
  ├── Gallery Form
  │
  ├── Image Upload
  │
  └── Gallery Management
  │
  ▼
NestJS API
  │
  ├── JWT Authentication
  │
  ├── Gallery Controller
  │
  └── Gallery Service
  │
  ├───────────────┐
  ▼               ▼
PostgreSQL    Supabase Storage
  │               │
  ▼               ▼
Gallery Data    Image Files
```

---

# Gallery Database Structure

The gallery table contains the following fields:

| Field       | Type      | Description                |
| ----------- | --------- | -------------------------- |
| id          | number    | Unique gallery ID          |
| title       | string    | Gallery image title        |
| imageUrl    | string    | Supabase Storage image URL |
| description | text      | Optional image description |
| category    | string    | Optional category          |
| isPublished | boolean   | Published or draft status  |
| createdAt   | timestamp | Creation date              |

---

# Backend API

Base URL:

```text
https://backend-0two.onrender.com
```

## Public Endpoints

### Get all gallery items

```http
GET /gallery
```

Returns all gallery items.

---

### Get published gallery items

```http
GET /gallery/published
```

Returns only published gallery items.

---

### Get gallery items by category

```http
GET /gallery/category/:category
```

Example:

```http
GET /gallery/category/Final
```

---

### Get single gallery item

```http
GET /gallery/:id
```

Example:

```http
GET /gallery/1
```

---

# Protected Admin Endpoints

The following endpoints require a valid JWT token.

Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Create Gallery Item

```http
POST /gallery
```

Example request:

```json
{
  "title": "Opening Ceremony",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Opening ceremony of Mokamtola eFootball Cup 2026",
  "category": "Opening",
  "isPublished": true
}
```

---

## Update Gallery Item

```http
PATCH /gallery/:id
```

Example:

```http
PATCH /gallery/1
```

Request:

```json
{
  "title": "Mokamtola eFootball Cup Opening Ceremony",
  "description": "Updated description",
  "category": "Opening",
  "isPublished": true
}
```

---

## Publish / Unpublish

```http
PATCH /gallery/:id/toggle-publish
```

Example:

```http
PATCH /gallery/1/toggle-publish
```

Behavior:

```text
Published → Draft
Draft → Published
```

---

## Delete Gallery Item

```http
DELETE /gallery/:id
```

Example:

```http
DELETE /gallery/1
```

Response:

```json
{
  "message": "Gallery item deleted successfully"
}
```

---

# Image Upload

Images are uploaded through:

```http
POST /uploads/image
```

The request uses:

```text
multipart/form-data
```

File field name:

```text
file
```

### Supported formats

```text
JPG
JPEG
PNG
WEBP
```

### Maximum file size

```text
5 MB
```

---

# Supabase Storage

Images are stored in the following Supabase Storage bucket:

```text
tournament-images
```

The bucket is configured as a public bucket so that uploaded images can be displayed directly on the website.

The backend uses the Supabase Service Role Key for server-side uploads.

> Never expose the Supabase Service Role Key in the React frontend or commit it to GitHub.

---

# Frontend Structure

Relevant files:

```text
frontend/
└── src/
    ├── pages/
    │   └── admin/
    │       └── Gallery.tsx
    │
    └── services/
        ├── api.ts
        ├── galleryService.ts
        └── uploadService.ts
```

---

# Gallery Service

`galleryService.ts` handles communication between the React application and the backend API.

Available methods:

```typescript
galleryAPI.getAll()
galleryAPI.getPublished()
galleryAPI.getById(id)
galleryAPI.create(data)
galleryAPI.update(id, data)
galleryAPI.togglePublish(id)
galleryAPI.remove(id)
```

---

# Upload Service

`uploadService.ts` handles image uploads.

Example:

```typescript
const uploadResult =
  await uploadAPI.image(selectedFile);
```

The response contains:

```typescript
{
  url: string;
  fileName: string;
}
```

The returned `url` is then saved in the gallery database record.

---

# Gallery Admin Workflow

## Create

```text
Select Image
     ↓
Validate Image
     ↓
Upload to Supabase Storage
     ↓
Receive Image URL
     ↓
Save Gallery Information
     ↓
PostgreSQL
```

---

## Edit

```text
Click Edit
     ↓
Load Existing Information
     ↓
Change Title / Category / Description
     ↓
Optional Image Replacement
     ↓
Update Database
```

If a new image is not selected, the existing image URL remains unchanged.

---

## Publish / Unpublish

```text
Admin clicks Hide
        ↓
Published = false
        ↓
Image becomes Draft
```

or:

```text
Admin clicks Publish
        ↓
Published = true
        ↓
Image becomes visible
```

---

## Delete

```text
Admin clicks Delete
        ↓
Confirmation
        ↓
DELETE /gallery/:id
        ↓
Database record deleted
```

---

# Security

Admin modification endpoints are protected using JWT authentication.

Protected operations:

```text
POST    /gallery
PATCH   /gallery/:id
PATCH   /gallery/:id/toggle-publish
DELETE  /gallery/:id
POST    /uploads/image
```

Public operations:

```text
GET /gallery
GET /gallery/published
GET /gallery/category/:category
GET /gallery/:id
```

---

# Image Validation

Frontend validates:

```text
✓ JPG
✓ JPEG
✓ PNG
✓ WEBP
✓ Maximum 5MB
```

Backend also validates the uploaded file type and size.

This provides two layers of validation:

```text
Frontend Validation
        +
Backend Validation
```

---

# Admin UI

The Gallery admin page provides:

```text
┌─────────────────────────────────────┐
│ Gallery                             │
│ Upload and manage tournament photos │
├─────────────────────────────────────┤
│                                     │
│ Add Gallery Image                   │
│                                     │
│ [ Image Upload ]  [ Title         ] │
│                   [ Category      ] │
│                   [ Description   ] │
│                   [ Publish ✓     ] │
│                   [ Add Image     ] │
│                                     │
├─────────────────────────────────────┤
│ Gallery Images                      │
│                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│ │ Image   │ │ Image   │ │ Image   ││
│ │ Title   │ │ Title   │ │ Title   ││
│ │         │ │         │ │         ││
│ │ Edit    │ │ Edit    │ │ Edit    ││
│ │ Hide    │ │ Publish │ │ Delete  ││
│ └─────────┘ └─────────┘ └─────────┘│
└─────────────────────────────────────┘
```

The interface is responsive for:

* Desktop
* Tablet
* Mobile

---

# Environment Variables

Backend `.env` should contain:

```env
DATABASE_URL=your_postgresql_connection_string

SUPABASE_URL=https://your-project.supabase.co

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

SUPABASE_STORAGE_BUCKET=tournament-images

JWT_SECRET=your_jwt_secret
```

Do not commit `.env` to Git.

Add this to `.gitignore`:

```text
.env
.env.local
```

---

# Testing with Postman

## 1. Login

```http
POST /auth/login
```

Request:

```json
{
  "username": "admin",
  "password": "your-password"
}
```

Copy the returned:

```text
access_token
```

---

## 2. Add Authorization

For protected requests:

```text
Authorization
→ Bearer Token
→ Paste access_token
```

---

## 3. Upload Image

```http
POST /uploads/image
```

Body:

```text
form-data

Key: file
Type: File
Value: your-image.jpg
```

---

## 4. Create Gallery

```http
POST /gallery
```

Use the uploaded image URL.

---

# Important Notes

### Supabase Storage

Currently, deleting a gallery database record does not automatically delete the corresponding image file from Supabase Storage.

For example:

```text
Supabase Storage
      │
      ├── image-1.jpg
      ├── image-2.jpg
      └── image-3.jpg

Database
      │
      ├── Gallery #1 → image-1.jpg
      ├── Gallery #2 → image-2.jpg
      └── Gallery #3 → image-3.jpg
```

If Gallery #2 is deleted:

```text
Database
      ↓
Gallery #2 removed
```

but:

```text
Supabase Storage
      ↓
image-2.jpg may still exist
```

A future improvement should add automatic Supabase Storage cleanup when an image is deleted or replaced.

---

# Future Improvements

Possible future features:

* [ ] Automatic Supabase image deletion
* [ ] Automatic old image cleanup when replacing an image
* [ ] Image compression
* [ ] Drag & drop upload
* [ ] Multiple image upload
* [ ] Gallery search
* [ ] Category filter in admin panel
* [ ] Pagination
* [ ] Image ordering
* [ ] Featured gallery image
* [ ] Confirmation modal instead of browser `confirm()`
* [ ] Toast notifications instead of `alert()`
* [ ] Image optimization
* [ ] Admin activity logs

---

# Project

**Mokamtola eFootball Cup 2026**

Gallery Management Module

```text
React + TypeScript
        +
NestJS + TypeScript
        +
PostgreSQL
        +
Supabase Storage
        +
JWT Authentication
```

---

## Status

**Gallery Module: Completed**

Current functionality:

```text
✅ Upload
✅ Create
✅ Read
✅ Edit
✅ Publish
✅ Unpublish
✅ Delete
✅ JWT Protection
✅ Supabase Storage
✅ Responsive Admin UI
```

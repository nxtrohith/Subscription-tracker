# API Documentation - Subscription Tracker Backend

## Base URL
```
http://localhost:5500/api/v1
```

---

## Authentication

### Authentication Method
**JWT (JSON Web Tokens)** - Bearer Token Authentication

### How to Authenticate
Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### Token Details
- **Secret Key**: Configured via `JWT_SECRET` environment variable
- **Expiration**: Configured via `JWT_EXPIRES_IN` (default: "1d" - 1 day)
- **Token Payload**: Contains `userId` field

### Protected Routes
Routes marked with 🔒 require authentication.

---

## Endpoints

### 1. Authentication Routes (`/api/v1/auth`)

#### 1.1 Sign Up
**POST** `/api/v1/auth/sign-up`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters, trimmed
- `email`: Required, valid email format, unique, lowercase, 5-255 characters
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "$2a$10$hashedpassword...",
      "createdAt": "2026-02-14T11:39:20.000Z",
      "updatedAt": "2026-02-14T11:39:20.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

**400 - User Already Exists:**
```json
{
  "success": false,
  "error": "User already exists with this email"
}
```

**400 - Validation Error:**
```json
{
  "success": false,
  "error": "Please fill a valid email address"
}
```

---

#### 1.2 Sign In
**POST** `/api/v1/auth/sign-in`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "$2a$10$hashedpassword...",
      "createdAt": "2026-02-14T11:39:20.000Z",
      "updatedAt": "2026-02-14T11:39:20.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

**404 - User Not Found:**
```json
{
  "success": false,
  "error": "User not found with this email"
}
```

**401 - Invalid Password:**
```json
{
  "success": false,
  "error": "Invalid Password"
}
```

---

#### 1.3 Sign Out
**POST** `/api/v1/auth/sign-out`

Sign out the current user (currently not implemented).

---

### 2. User Routes (`/api/v1/users`)

#### 2.1 Get All Users
**GET** `/api/v1/users`

Retrieve all users from the database.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "$2a$10$hashedpassword...",
      "createdAt": "2026-02-14T11:39:20.000Z",
      "updatedAt": "2026-02-14T11:39:20.000Z"
    }
  ]
}
```

---

#### 2.2 Get User by ID 🔒
**GET** `/api/v1/users/:id`

Retrieve a specific user by their ID (password excluded).

**Authentication Required:** Yes

**URL Parameters:**
- `id`: MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-14T11:39:20.000Z",
    "updatedAt": "2026-02-14T11:39:20.000Z"
  }
}
```

**Error Responses:**

**404 - User Not Found:**
```json
{
  "success": false,
  "error": "User not found"
}
```

**401 - Unauthorized:**
```json
{
  "message": "Unauthorized"
}
```

---

#### 2.3 Update User 🔒
**PUT** `/api/v1/users/:id`

Update user profile information. Users can only update their own profile.

**Authentication Required:** Yes

**URL Parameters:**
- `id`: MongoDB ObjectId of the user (must match authenticated user's ID)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Notes:**
- Password updates are not allowed through this endpoint (use a dedicated password change endpoint)
- User must be authenticated and can only update their own profile

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-02-14T11:39:20.000Z",
    "updatedAt": "2026-02-14T12:00:00.000Z"
  }
}
```

**Error Responses:**

**401 - Unauthorized Access:**
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

**404 - User Not Found:**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

#### 2.4 Delete User 🔒
**DELETE** `/api/v1/users/:id`

Delete user account. Users can only delete their own account. All associated subscriptions will also be deleted.

**Authentication Required:** Yes

**URL Parameters:**
- `id`: MongoDB ObjectId of the user (must match authenticated user's ID)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

**Notes:**
- Deleting a user will cascade delete all their subscriptions
- This action is permanent and cannot be undone

**Error Responses:**

**401 - Unauthorized Access:**
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

**404 - User Not Found:**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 3. Subscription Routes (`/api/v1/subscriptions`)

#### 3.1 Get Subscription by ID
**GET** `/api/v1/subscriptions/:id`

Retrieve a specific subscription by its ID.

**URL Parameters:**
- `id`: MongoDB ObjectId of the subscription

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Netflix",
    "price": 15.99,
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "credit_card",
    "status": "active",
    "startDate": "2026-02-14T00:00:00.000Z",
    "renewalDate": "2026-03-14T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-14T11:39:20.000Z",
    "updatedAt": "2026-02-14T11:39:20.000Z"
  }
}
```

**Error Responses:**

**404 - Subscription Not Found:**
```json
{
  "success": false,
  "error": "Subscription not found"
}
```

---

#### 3.2 Create Subscription 🔒
**POST** `/api/v1/subscriptions`

Create a new subscription for the authenticated user.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "Netflix",
  "price": 15.99,
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "credit_card",
  "startDate": "2026-02-14T00:00:00.000Z",
  "renewalDate": "2026-03-14T00:00:00.000Z",
  "status": "active"
}
```

**Field Details:**
- `name`: Required, 2-100 characters, subscription name
- `price`: Required, number between 0-10000
- `frequency`: Enum - `daily`, `weekly`, `monthly`, `yearly`
- `category`: Required, Enum - `entertainment`, `education`, `productivity`, `health`, `other`
- `paymentMethod`: Required, Enum - `credit_card`, `debit_card`, `UPI`, `bank_transfer`, `other`
- `status`: Optional, Enum - `active`, `expired`, `canceled`, `paused` (default: `active`)
- `startDate`: Required, cannot be in the future
- `renewalDate`: Optional (auto-calculated based on frequency if not provided), must be after startDate
- `user`: Auto-populated from authenticated user

**Success Response (201):**
```json
{
  "success": true,
  "message": "Subscription created succccesfully: [subscription object]"
}
```

**Auto-Calculation Logic:**
- If `renewalDate` is not provided, it's automatically calculated based on `frequency`:
  - `daily`: +1 day
  - `weekly`: +7 days
  - `monthly`: +30 days
  - `yearly`: +365 days
- If `renewalDate` has passed, `status` is automatically set to `expired`

---

#### 3.3 Get User's Subscriptions 🔒
**GET** `/api/v1/subscriptions/user/:id`

Get all subscriptions for a specific user.

**Authentication Required:** Yes

**URL Parameters:**
- `id`: User ID (must match authenticated user's ID)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Netflix",
      "price": 15.99,
      "frequency": "monthly",
      "category": "entertainment",
      "paymentMethod": "credit_card",
      "status": "active",
      "startDate": "2026-02-14T00:00:00.000Z",
      "renewalDate": "2026-03-14T00:00:00.000Z",
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2026-02-14T11:39:20.000Z",
      "updatedAt": "2026-02-14T11:39:20.000Z"
    }
  ]
}
```

**Error Responses:**

**401 - Unauthorized Access:**
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

---

#### 3.4 Update Subscription 🔒
**PUT** `/api/v1/subscriptions/:id`

Update an existing subscription. Only the subscription owner can update it.

**Authentication Required:** Yes

**URL Parameters:**
- `id`: MongoDB ObjectId of the subscription

**Request Body:**
```json
{
  "name": "Netflix Premium",
  "price": 19.99,
  "status": "active"
}
```

**Notes:**
- Only the owner of the subscription can update it
- All fields are optional; only provided fields will be updated
- Validation rules still apply

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Netflix Premium",
    "price": 19.99,
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "credit_card",
    "status": "active",
    "startDate": "2026-02-14T00:00:00.000Z",
    "renewalDate": "2026-03-14T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-14T11:39:20.000Z",
    "updatedAt": "2026-02-14T12:00:00.000Z"
  }
}
```

**Error Responses:**

**401 - Unauthorized Access:**
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

**404 - Subscription Not Found:**
```json
{
  "success": false,
  "error": "Subscription not found"
}
```

---

#### 3.5 Delete Subscription 🔒
**DELETE** `/api/v1/subscriptions/:id`

Permanently delete a subscription. Only the subscription owner can delete it.

**Authentication Required:** Yes

**URL Parameters:**
- `id`: MongoDB ObjectId of the subscription

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subscription deleted successfully"
}
```

**Notes:**
- This action is permanent and cannot be undone
- Only the owner of the subscription can delete it

**Error Responses:**

**401 - Unauthorized Access:**
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

**404 - Subscription Not Found:**
```json
{
  "success": false,
  "error": "Subscription not found"
}
```

---

#### 3.6 Cancel Subscription 🔒
**PUT** `/api/v1/subscriptions/:id/cancel`

Cancel a subscription (soft delete). Sets the status to 'canceled' without deleting the record.

**Authentication Required:** Yes

**URL Parameters:**
- `id`: MongoDB ObjectId of the subscription

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subscription canceled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Netflix",
    "price": 15.99,
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "credit_card",
    "status": "canceled",
    "startDate": "2026-02-14T00:00:00.000Z",
    "renewalDate": "2026-03-14T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-14T11:39:20.000Z",
    "updatedAt": "2026-02-14T12:00:00.000Z"
  }
}
```

**Notes:**
- This is a soft delete - the subscription record is preserved for historical data
- Only the owner of the subscription can cancel it
- Canceled subscriptions are excluded from upcoming renewals

**Error Responses:**

**401 - Unauthorized Access:**
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

**404 - Subscription Not Found:**
```json
{
  "success": false,
  "error": "Subscription not found"
}
```

---

#### 3.7 Get Upcoming Renewals 🔒
**GET** `/api/v1/subscriptions/upcoming-renewals`

Get all subscriptions that are due for renewal within a specified number of days.

**Authentication Required:** Yes

**Query Parameters:**
- `days`: Number of days to look ahead (default: 7)

**Example Request:**
```
GET /api/v1/subscriptions/upcoming-renewals?days=14
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Netflix",
      "price": 15.99,
      "frequency": "monthly",
      "category": "entertainment",
      "paymentMethod": "credit_card",
      "status": "active",
      "startDate": "2026-02-14T00:00:00.000Z",
      "renewalDate": "2026-02-20T00:00:00.000Z",
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2026-02-14T11:39:20.000Z",
      "updatedAt": "2026-02-14T11:39:20.000Z"
    }
  ]
}
```

**Notes:**
- Only returns subscriptions for the authenticated user
- Excludes canceled subscriptions
- Results are sorted by renewal date (earliest first)
- Default lookhead period is 7 days if `days` parameter is not provided

---

## Error Handling

### Global Error Middleware

All errors are handled by a centralized error middleware that provides consistent error responses.

### Common Error Responses

#### 400 - Bad Request
```json
{
  "success": false,
  "error": "Duplicate field value entered"
}
```

#### 401 - Unauthorized
```json
{
  "message": "Unauthorized",
  "error": "jwt malformed"
}
```

#### 403 - Forbidden (Rate Limit)
```json
{
  "message": "Too many requests. Please try again later."
}
```

#### 403 - Forbidden (Bot Detection)
```json
{
  "message": "Access denied for bots."
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "error": "Resource not found with id of [id]"
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "error": "Server Error"
}
```

### Mongoose-Specific Errors

**CastError (Invalid ObjectId):**
```json
{
  "success": false,
  "error": "Resource not found with id of [invalid_id]"
}
```

**Duplicate Key Error (Code 11000):**
```json
{
  "success": false,
  "error": "Duplicate field value entered"
}
```

**ValidationError:**
```json
{
  "success": false,
  "error": "Please fill a valid email address"
}
```

---

## CORS Settings

### Current Configuration
**CORS is NOT currently configured** in the application.

### Recommended Configuration
To allow frontend access, add CORS middleware:

```javascript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000', // Frontend domain
  credentials: true
}));
```

---

## Security Features

### 1. Arcjet Middleware
Applied globally to all routes for:
- **Rate Limiting**: Prevents too many requests
- **Bot Detection**: Blocks automated bot traffic

### 2. Password Security
- Passwords are hashed using **bcryptjs** with salt rounds of 10
- Passwords are never returned in responses (except in sign-up/sign-in where the full user object is returned)

### 3. JWT Security
- Tokens are signed with a secret key
- Tokens have expiration time (default: 1 day)
- Token verification on protected routes

---

## Database Models

### User Schema
```javascript
{
  name: String (2-50 chars, required),
  email: String (unique, valid email, required),
  password: String (min 6 chars, required, hashed),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Subscription Schema
```javascript
{
  name: String (2-100 chars, required),
  price: Number (0-10000, required),
  frequency: Enum ['daily', 'weekly', 'monthly', 'yearly'],
  category: Enum ['entertainment', 'education', 'productivity', 'health', 'other'] (required),
  paymentMethod: Enum ['credit_card', 'debit_card', 'UPI', 'bank_transfer', 'other'] (required),
  status: Enum ['active', 'expired', 'canceled', 'paused'] (default: 'active'),
  startDate: Date (required, cannot be future),
  renewalDate: Date (auto-calculated if not provided),
  user: ObjectId (reference to User, required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

---

## Environment Variables

Required environment variables (`.env.development.local`):

```env
NODE_ENV=development
PORT=5500
DB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
ARCJET_SECRET_KEY=your_arcjet_key
ARCJET_ENV=development
```

---

## Example Usage

### Complete Authentication Flow

**1. Sign Up:**
```bash
curl -X POST http://localhost:5500/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**2. Sign In:**
```bash
curl -X POST http://localhost:5500/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**3. Access Protected Route:**
```bash
curl -X GET http://localhost:5500/api/v1/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**4. Create Subscription:**
```bash
curl -X POST http://localhost:5500/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Netflix",
    "price": 15.99,
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "credit_card",
    "startDate": "2026-02-14T00:00:00.000Z"
  }'
```

---

## Notes

- All CRUD endpoints for subscriptions and users are now fully implemented
- The `signOut` endpoint is currently empty and needs implementation
- CORS should be configured before deploying to production
- Consider implementing refresh tokens for better security
- Password is included in sign-up/sign-in responses but excluded in other user queries
- Deleting a user will cascade delete all their subscriptions
- Users can only update or delete their own profiles
- Users can only update, delete, or cancel their own subscriptions

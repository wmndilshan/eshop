# Eshop User UI - Authentication System

Complete Next.js authentication system with OTP verification.

## Features

- ✅ User Registration with Email Verification
- ✅ OTP-based Authentication
- ✅ Login System
- ✅ Forgot Password Flow
- ✅ Password Reset with OTP
- ✅ Tanstack Query Integration
- ✅ React Hook Form Validation
- ✅ Toast Notifications
- ✅ Responsive Design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: Tanstack Query
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Getting Started

1. Install dependencies (already done):
```bash
npm install
```

2. Configure environment variables:
Create `.env.local` in `apps/user-ui/`:
```env
AUTH_SERVICE_URL=http://localhost:6001
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Start the development server:
```bash
npx nx dev user-ui
```

The app will run on `http://localhost:3000`

## Available Routes

- `/` - Homepage
- `/register` - User registration with OTP verification
- `/login` - User login
- `/forgot-password` - Password recovery flow

## API Endpoints (Proxied)

All API routes proxy to the auth-service:

- `POST /api/register` → `/api/user-registration`
- `POST /api/verify-otp` → `/api/verify-user`
- `POST /api/login` → `/api/login`
- `POST /api/forgot-password` → `/api/forgot-password`
- `POST /api/reset-password` → `/api/reset-password`
- `POST /api/resend-otp` → `/api/resend-otp`

## Project Structure

```
apps/user-ui/src/
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── register/
│   │   ├── login/
│   │   └── forgot-password/
│   ├── api/                 # Next.js API routes (proxy to auth-service)
│   ├── providers/           # React providers
│   │   └── query-provider.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   └── otp-input.tsx    # OTP input component
│   └── ui/
│       ├── input.tsx        # Reusable input
│       └── button.tsx       # Reusable button
└── lib/
    └── api/
        ├── client.ts        # Axios instance & error handling
        └── auth.ts          # Auth API functions
```

## Components

### UI Components

- **Input**: Reusable input with label and error display
- **Button**: Loading states, variants (primary, secondary, outline)
- **OtpInput**: 6-digit OTP input with paste support

### Auth Components

- **Register Page**: Multi-step (registration → OTP verification)
- **Login Page**: Email/password authentication
- **Forgot Password Page**: Three-step flow (email → OTP → reset)

## Features Detail

### Registration Flow
1. User enters name, email, password
2. Form validation (client-side)
3. Submit → OTP sent to email
4. User enters 6-digit OTP
5. OTP verification → Account activated
6. Resend OTP with 60s timer

### Login Flow
1. User enters email, password
2. Submit → Authentication
3. Token stored in localStorage
4. Redirect to homepage

### Forgot Password Flow
1. User enters email
2. OTP sent to email
3. User verifies OTP
4. User sets new password
5. Password reset → Redirect to login

## Error Handling

All API calls use centralized error handling:
- Axios interceptors
- Toast notifications for user feedback
- Form validation errors
- Network error handling

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Email
- Valid email format (RFC 5322)

### OTP
- Exactly 6 digits
- Auto-focus on paste
- Auto-advance on input

## Development Notes

- The app uses Next.js App Router (not Pages Router)
- All auth pages are in `(auth)` route group for shared layouts
- API routes proxy requests to auth-service on port 6001
- Tanstack Query provides caching and request deduplication
- React Hook Form handles form state and validation

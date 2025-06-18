# Authentication System with Supabase and shadcn/ui

This project includes a complete authentication system built with Supabase and shadcn/ui components.

## Features

- ✅ **Login Page** (`/auth/login`) - Email/password and GitHub OAuth
- ✅ **Signup Page** (`/auth/signup`) - Email/password and GitHub OAuth
- ✅ **Forgot Password** (`/auth/forgot-password`) - Password reset via email
- ✅ **Reset Password** (`/auth/reset-password`) - Set new password after reset
- ✅ **Logout** - Server-side logout with redirect
- ✅ **OAuth Callback** (`/auth/callback`) - Handle OAuth redirects
- ✅ **Authentication Status** - Real-time auth state management
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Form Validation** - Client-side validation
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Loading States** - Visual feedback during operations

## Pages

### Login Page (`/auth/login`)

- Email and password authentication
- GitHub OAuth integration
- Password visibility toggle
- Form validation
- Error handling
- Links to signup and forgot password

### Signup Page (`/auth/signup`)

- Full name, email, and password fields
- Password confirmation
- Password strength validation
- GitHub OAuth integration
- Email verification flow
- Success confirmation page

### Forgot Password (`/auth/forgot-password`)

- Email input for password reset
- Success confirmation
- Link back to login

### Reset Password (`/auth/reset-password`)

- New password and confirmation fields
- Password strength validation
- Success confirmation with auto-redirect

## Components Used

- **Button** - Primary and outline variants
- **Input** - Text and password inputs with icons
- **Label** - Form field labels
- **Card** - Container components
- **Separator** - Visual dividers
- **Icons** - Lucide React icons

## Setup Requirements

1. **Environment Variables**

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Supabase Configuration**

   - Enable Email authentication
   - Configure GitHub OAuth provider
   - Set up email templates for password reset
   - Configure redirect URLs

3. **GitHub OAuth Setup**
   - Create GitHub OAuth app
   - Add redirect URL: `https://your-domain.com/auth/callback`
   - Add client ID and secret to Supabase

## Usage

### Navigation

The main page (`/`) shows authentication status and provides quick access to auth pages.

### Authentication Flow

1. Users can sign up with email/password or GitHub
2. Email verification is required for new accounts
3. Users can reset passwords via email
4. OAuth users are automatically verified

### Protected Routes

You can protect routes by checking authentication status:

```tsx
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) {
  redirect("/auth/login");
}
```

## Styling

The authentication pages use:

- Tailwind CSS for styling
- shadcn/ui components for consistent design
- Responsive design for mobile and desktop
- Accessible form elements with proper labels
- Loading states and error handling

## Security Features

- Server-side authentication checks
- Secure password handling
- OAuth integration with proper redirects
- Session management via cookies
- CSRF protection through Supabase

## Customization

You can customize the authentication system by:

- Modifying the UI components
- Adding additional OAuth providers
- Customizing email templates
- Adding additional user metadata fields
- Implementing role-based access control

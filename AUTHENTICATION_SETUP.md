# Authentication Setup Guide

This guide will help you set up authentication for the Code Editor IDE using Clerk.

## Quick Start (No Authentication)

The IDE is currently configured to work without authentication. You can start using it immediately by running:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Setting Up Authentication with Clerk

If you want to add user authentication, follow these steps:

### 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your Clerk Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy your "Publishable Key" and "Secret Key"

### 3. Update Environment Variables

Update your `.env.local` file with your actual Clerk keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# Convex (Optional - leave empty if not using)
NEXT_PUBLIC_CONVEX_URL=
```

### 4. Enable Authentication in the App

Update `src/app/layout.tsx` to include the Clerk provider:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// ... font configurations ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### 5. Update the Main Page

Update `src/app/page.tsx` to include authentication:

```tsx
import {SignedIn, SignedOut, SignUpButton} from "@clerk/nextjs";
import IDE from '@/components/IDE';

export default function Home() {
  return (
    <div>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Code Editor IDE</h1>
            <p className="text-gray-600 mb-6 text-center">Sign up to start coding with our powerful online IDE</p>
            <SignUpButton>
              <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
                Sign Up to Start Coding
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <IDE />
      </SignedIn>
    </div>
  );
}
```

### 6. Create Middleware (Optional)

Create `src/middleware.ts` for protected routes:

```tsx
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/editor(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

### 7. Restart the Development Server

```bash
npm run dev
```

## Features Available with Authentication

- User profiles and session management
- Persistent file storage (when combined with a database)
- User-specific settings and preferences
- Collaborative features (future enhancement)

## Troubleshooting

### Common Issues

1. **Invalid Publishable Key Error**: Make sure you're using the correct keys from your Clerk dashboard
2. **Environment Variables Not Loading**: Restart your development server after updating `.env.local`
3. **Clerk Provider Errors**: Ensure the ClerkProvider wraps your entire app in the layout

### Getting Help

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- Check the browser console for specific error messages

## Security Notes

- Never commit your `.env.local` file to version control
- Use different keys for development and production
- Regularly rotate your secret keys
- Follow Clerk's security best practices
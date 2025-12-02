"use client"

import { SignUp } from "@clerk/clerk-react"

export default function VerifyEmailAddressPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
      <SignUp
        path="/auth/register/verify-email-address"
        routing="path"
        signInUrl="/auth/login"
        afterSignUpUrl="/"
        redirectUrl="/"
      />
    </div>
  )
}


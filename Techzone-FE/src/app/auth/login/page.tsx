"use client"

import { SignIn } from "@clerk/clerk-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
      <SignIn
        path="/auth/login"
        routing="path"
        fallbackRedirectUrl="/"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .cl-headerSubtitle,
            .cl-internal-1wjyifl,
            .cl-internal-1dauvpw {
              display: none !important;
            }

            .cl-card.cl-signIn-start.cl-internal-d5pd3d {
              padding: 16px !important;
            }
          `,
        }}
      />
    </div>
  )
}

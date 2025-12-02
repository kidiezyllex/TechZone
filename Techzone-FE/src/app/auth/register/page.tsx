"use client"

import { SignUp } from "@clerk/clerk-react"

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
            <SignUp
                path="/auth/register"
                routing="path"
                signInUrl="/auth/login"
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

            .cl-card.cl-signUp-start.cl-internal-d5pd3d {
              padding: 16px !important;
            }
          `,
                }}
            />
        </div>
    )
}


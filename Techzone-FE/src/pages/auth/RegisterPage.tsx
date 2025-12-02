import { SignUp } from "@clerk/clerk-react"
import { useSearchParams } from "react-router-dom"

export default function RegisterPage() {
    const [searchParams] = useSearchParams()

    const afterSignUpUrlParam = searchParams.get('after_sign_up_url')
    const redirectUrlParam = searchParams.get('redirect_url')

    // Chỉ redirect nếu có query param, nếu không thì undefined để không redirect tự động
    const afterSignUpUrl = afterSignUpUrlParam ? decodeURIComponent(afterSignUpUrlParam) : undefined
    const redirectUrl = redirectUrlParam ? decodeURIComponent(redirectUrlParam) : undefined

    // Ưu tiên afterSignUpUrl, nếu không có thì dùng redirectUrl
    const finalRedirectUrl = afterSignUpUrl || redirectUrl

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
            <SignUp
                path="/auth/register"
                routing="path"
                signInUrl="/auth/login"
                afterSignUpUrl={finalRedirectUrl}
                fallbackRedirectUrl={finalRedirectUrl || '/'}
                redirectUrl={finalRedirectUrl}
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


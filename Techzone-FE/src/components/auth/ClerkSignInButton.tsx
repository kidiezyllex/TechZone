import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { Icon } from '@mdi/react'
import { mdiGoogle } from '@mdi/js'

interface ClerkSignInButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function ClerkSignInGoogleButton({
  variant = 'outline',
  size = 'default',
  className = '',
}: ClerkSignInButtonProps) {
  return (
    <SignInButton mode="modal" fallbackRedirectUrl="/">
      <Button variant={variant} size={size} className={`w-full ${className}`}>
        <Icon path={mdiGoogle} size={0.8} className="mr-2" />
        Đăng nhập với Google
      </Button>
    </SignInButton>
  )
}

export function ClerkSignUpGoogleButton({
  variant = 'outline',
  size = 'default',
  className = '',
}: ClerkSignInButtonProps) {
  return (
    <SignUpButton mode="modal" fallbackRedirectUrl="/">
      <Button variant={variant} size={size} className={`w-full ${className}`}>
        <Icon path={mdiGoogle} size={0.8} className="mr-2" />
        Đăng ký với Google
      </Button>
    </SignUpButton>
  )
}

export function ClerkSignInWithOTP() {
  return (
    <SignInButton mode="modal" fallbackRedirectUrl="/">
      <Button variant="outline" className="w-full">
        Đăng nhập qua Email/OTP
      </Button>
    </SignInButton>
  )
}

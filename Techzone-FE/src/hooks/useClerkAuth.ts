import { useUser as useClerkUser } from '@clerk/clerk-react'
import { useMutation } from '@tanstack/react-query'
import { register as registerUser, login as loginUser } from '@/api/authentication'
import { useUser } from '@/context/useUserContext'
import { toast } from 'react-toastify'

/**
 * Hook để sync Clerk authentication với backend Techzone
 */
export const useClerkAuthSync = () => {
  const { user: clerkUser, isSignedIn } = useClerkUser()
  const { loginUser: loginTechzoneUser } = useUser()

  const syncClerkTechzoneAuth = useMutation({
    mutationFn: async () => {
      if (!clerkUser || !isSignedIn) {
        throw new Error('Clerk user not found')
      }

      try {
        const email = clerkUser.emailAddresses[0]?.emailAddress
        if (!email) throw new Error('Email not found in Clerk user')

        // Get ID token from Clerk
        const token = await clerkUser.getIdToken()

        // Sync với backend - backend sẽ tạo tài khoản nếu chưa tồn tại
        const response = await loginUser({
          email,
          // Sử dụng Clerk token để verify
          clerk_id_token: token,
        } as any)

        // Lưu token vào local storage
        if (response && (response as any).data?.token) {
          loginTechzoneUser(
            (response as any).data?.account,
            (response as any).data?.token
          )
          return response
        }
      } catch (error: any) {
        console.error('Clerk Techzone sync error:', error)
        throw error
      }
    },
  })

  return {
    isSignedIn,
    clerkUser,
    syncClerkTechzoneAuth,
  }
}

/**
 * Hook để register via Clerk OAuth
 */
export const useClerkRegister = () => {
  const { user: clerkUser, isSignedIn } = useClerkUser()
  const { loginUser: loginTechzoneUser } = useUser()

  return useMutation({
    mutationFn: async () => {
      if (!clerkUser || !isSignedIn) {
        throw new Error('Clerk user not found')
      }

      try {
        const email = clerkUser.emailAddresses[0]?.emailAddress
        const fullName = clerkUser.fullName || clerkUser.firstName || 'Techzone User'
        
        if (!email) throw new Error('Email not found')

        const token = await clerkUser.getIdToken()

        // Register on backend via Clerk token
        const response = await registerUser({
          email,
          full_name: fullName,
          clerk_id_token: token,
          via_oauth: true,
        } as any)

        if (response && (response as any).data?.token) {
          loginTechzoneUser(
            (response as any).data?.account,
            (response as any).data?.token
          )
          toast.success('Đăng ký thành công!')
          return response
        }
      } catch (error: any) {
        console.error('Clerk register error:', error)
        throw error
      }
    },
  })
}

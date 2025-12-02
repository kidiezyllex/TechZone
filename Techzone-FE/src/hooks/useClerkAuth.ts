import { useUser as useClerkUser, useAuth as useClerkAuth } from '@clerk/clerk-react'
import { useMutation } from '@tanstack/react-query'
import { login as loginUser } from '@/api/authentication'
import { useUser } from '@/context/useUserContext'
import { toast } from 'react-toastify'

export const useClerkAuthSync = () => {
  const { user: clerkUser, isSignedIn } = useClerkUser()
  const { getToken } = useClerkAuth()
  const { loginUser: loginTechzoneUser } = useUser()

  const syncClerkTechzoneAuth = useMutation({
    mutationFn: async () => {
      if (!clerkUser || !isSignedIn) {
        throw new Error('Clerk user not found')
      }

      try {
        const email = clerkUser.emailAddresses[0]?.emailAddress
        if (!email) throw new Error('Email not found in Clerk user')

        const token = await getToken()

        const response = await loginUser({
          email,
          clerk_token: token,
        } as any)

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


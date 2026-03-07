import { redirect } from 'next/navigation'
import { getRiderSession } from '@/utils/auth'

export default async function RootPage() {
  const session = await getRiderSession()

  if (session) {
    redirect('/rider/dashboard')
  } else {
    redirect('/login')
  }
}

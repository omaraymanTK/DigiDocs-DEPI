import Patients from '@/pages/Patients'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/patients')({
  beforeLoad: ({ context }) => {
    if (!context.isLoggedIn) {
      throw redirect({ to: '/login' })
    }
    if (context.user?.role !== 'Doctor') {
      throw redirect({ to: '/not-found' })
    }
  },
  component: Patients,
})

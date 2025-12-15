import LoginPage from '@/pages/Login'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
    beforeLoad: ({ context }) => {
        if (context.isLoggedIn) {
            throw redirect({ to: '/' })
        }
    },
    component: LoginPage,
})
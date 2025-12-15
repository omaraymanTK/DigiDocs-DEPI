import { redirectBasedOnRole } from '@/lib/utils'
import { createFileRoute, redirect, useRouteContext } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => redirectBasedOnRole(context),
  component: () => {
    const { user } = useRouteContext({ from: "/" });

    if (user?.role === 'Doctor') {
      throw redirect({ to: '/patients', replace: true });
    }
    if (user?.role === 'assistant') {
      throw redirect({ to: '/assistant', replace: true });
    }
    throw redirect({ to: '/not-found', replace: true });
  }
})
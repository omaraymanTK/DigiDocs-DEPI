import AssistantDashboard from '@/pages/Assistant'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/assistant')({
  beforeLoad: ({ context }) => {
    if (!context.isLoggedIn) {
      throw redirect({ to: '/login' })
    }
    if (context.user?.role !== 'assistant') {
      throw redirect({ to: '/not-found' })
    }
  },
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = Route.useRouteContext();
    return <AssistantDashboard userId={user?.id} />
  },
})
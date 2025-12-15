import App from '@/App'
import type { RouterContext } from '@/types'
import { createRootRouteWithContext } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<RouterContext>()({
    component: App,
})
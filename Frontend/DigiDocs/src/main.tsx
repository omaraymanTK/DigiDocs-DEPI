import { createRoot } from 'react-dom/client'
import './index.css'
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';


const session = localStorage.getItem('session');
let parsedSession = null;
try {
  parsedSession = session ? JSON.parse(session) : null;
} catch (e) {
  console.error("Failed to parse session", e);
}

const router = createRouter({
  routeTree,
  context: {
    isLoggedIn: !!parsedSession?.token,
    user: parsedSession ? {
      id: parsedSession.id,
      name: parsedSession.user,
      role: parsedSession.role,
      token: parsedSession.token
    } : null,
    session: parsedSession,
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);

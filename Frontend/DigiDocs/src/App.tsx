import { Outlet } from "@tanstack/react-router"
import { Toaster } from "sonner"

function App() {

  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}

export default App

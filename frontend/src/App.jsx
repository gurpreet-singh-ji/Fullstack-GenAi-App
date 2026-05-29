import { RouterProvider } from "react-router"
import router from "./App.router.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { AIProvider } from "./features/ai/ai.context.jsx"

function App() {
  return (
    <AuthProvider>
      <AIProvider>
        <RouterProvider router={router} />
      </AIProvider>
    </AuthProvider>
  )
}


export default App

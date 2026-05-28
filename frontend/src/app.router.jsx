import { createBrowserRouter } from "react-router"
import Layout from "./Layout.jsx"
import Home from "./pages/Home.jsx"
import Login from "./features/auth/pages/Login.jsx"
import Register from "./features/auth/pages/Register.jsx"
import { Protected } from "./features/auth/components/Protected.jsx"
const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Protected><Home /></Protected> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> }
        ]
    }
])
export default router
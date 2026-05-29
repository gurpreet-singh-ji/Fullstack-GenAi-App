import { createBrowserRouter } from "react-router"
import Layout from "./Layout.jsx"
import Home from "../src/features/ai/pages/Home.jsx"
import Login from "./features/auth/pages/Login.jsx"
import Register from "./features/auth/pages/Register.jsx"
import { Protected } from "./features/auth/components/Protected.jsx"
import Interview from "./features/ai/pages/Interview.jsx"


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Protected><Home /></Protected> },
            { path: "/interview", element: <Protected><Interview /></Protected> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/interview/:id", element: <Protected><Interview /></Protected> }
        ]
    }
])
export default router
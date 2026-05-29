import { useContext, useEffect } from "react";
import {AuthContext} from "../auth.context.jsx";
import {login, register, logout, getMe} from "../services/auth.service.js";

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const {user, setUser, loading, setLoading, error, setError} = context;
    

    const handleLogin = async ({email, password}) => {
        try {
            setLoading(true)
            setError(null)
            const data = await login({email, password})
            setUser(data.user)
            return data.user
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Login failed"
            setError(errorMsg)
            console.error("Login error:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({username, email, password}) => {
        try {
            setLoading(true)
            setError(null)
            const data = await register({username, email, password})
            setUser(data.user)
            return data.user
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Registration failed"
            setError(errorMsg)
            console.error("Register error:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true)
            setError(null)
            await logout()
            setUser(null)
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Logout failed"
            setError(errorMsg)
            console.error("Logout error:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // Fetch user on component mount to maintain session
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getMe()
                console.log("User fetched:", data)
                setUser(data.user)
            } catch (error) {
                console.log("User not authenticated or session expired")
                setUser(null)
                // Don't set error here as this is expected on first load if not logged in
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, []) // Empty dependency array - runs only on mount

    return {user, loading, error, handleLogin, handleLogout, handleRegister}
}

export {useAuth}
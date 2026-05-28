import { useContext,useEffect } from "react";
import {AuthContext} from "../auth.context.jsx";
import {login, register, logout, getMe} from "../services/auth.service.js";

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const {user, setUser, loading, setLoading} = context;
    

    const handleLogin = async ({email,password}) => {
        try {
        setLoading(true)
        const data = await login({email,password})
        setUser(data.user)
        } catch (error) {
            console.log(error);
        } finally {
        setLoading(false)
        }
    }

    const handleRegister = async ({username,email,password}) => {
        try {
        setLoading(true)
        const data = await register({username,email,password})
        setUser(data.user)
        } catch (error) {
            console.log(error);
        } finally {
        setLoading(false)
        }
    }

    const handleLogout = async (token) => {
        try {
            setLoading(true)
            const data = await logout()
            setUser(null)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
    const fetchUser = async () => {
        try {
            const data = await getMe()
            console.log(data)
            setUser(data.user)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    fetchUser()
}, [])
    return {user,loading,handleLogin,handleLogout,handleRegister}
}



export {useAuth}
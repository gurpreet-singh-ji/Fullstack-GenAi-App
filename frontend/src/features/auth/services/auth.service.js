import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:5000/api/auth",
    withCredentials: true
})
async function register({username,email,password}) {
    try {
        const response = await api.post(`/register`, { username, email, password });
        return response.data
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

async function login({email,password}) {
    try {
        const response = await api.post(`/login`, { email, password });
        return response.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function logout() {
    try {
        const response = await api.post(`/logout`, {}); 
        return response.data 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getMe() {
    try {
        const response = await api.get(`/get-me`);
        return response.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export { register, login, logout, getMe } 
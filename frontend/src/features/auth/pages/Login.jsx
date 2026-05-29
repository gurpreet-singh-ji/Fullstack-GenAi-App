import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const {loading, error, handleLogin} = useAuth()
    const [localError, setLocalError] = useState("")
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError("")
        
        try {
            if (!email || !password) {
                setLocalError("Email and password are required")
                return
            }
            
            await handleLogin({email, password})
            navigate("/")
        } catch (error) {
            setLocalError(error.response?.data?.message || error.message || "Login failed")
            console.error("Login error:", error)
        }
    }

    if (loading) {
        return (
            <main style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#0d1117',
                color: '#e6edf3'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #2a3348',
                        borderTop: '3px solid #ff2d78',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p>Checking session...</p>
                </div>
            </main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                
                {/* Error Message */}
                {(localError || error) && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        backgroundColor: 'rgba(255, 45, 120, 0.1)',
                        border: '1px solid rgba(255, 45, 120, 0.3)',
                        borderRadius: '0.5rem',
                        color: '#ff6b9d',
                        fontSize: '0.9rem'
                    }}>
                        {localError || error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            id="email"
                            name='email'
                            placeholder='Enter email address'
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            id="password"
                            name='password'
                            placeholder='Enter password'
                            disabled={loading}
                        />
                    </div>
                    <button className='button primary-button' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}

export default Login
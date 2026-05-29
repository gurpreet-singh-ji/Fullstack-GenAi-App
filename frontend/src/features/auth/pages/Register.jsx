import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const {loading, error, handleRegister} = useAuth()
    const [localError, setLocalError] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
            
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError("")

        try {
            if (!username || !email || !password) {
                setLocalError("All fields are required")
                return
            }

            if (password.length < 6) {
                setLocalError("Password must be at least 6 characters")
                return
            }

            await handleRegister({username, email, password})
            navigate("/")
        } catch (error) {
            setLocalError(error.response?.data?.message || error.message || "Registration failed")
            console.error("Register error:", error)
        }
    }

    if (loading && !username && !email && !password) {
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
                <h1>Register</h1>

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
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            id="username"
                            name='username'
                            placeholder='Enter username'
                            disabled={loading}
                        />
                    </div>
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                </form>

                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
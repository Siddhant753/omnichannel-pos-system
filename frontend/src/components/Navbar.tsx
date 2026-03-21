import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="font-bold">POS System</h1>
            <div className="space-x-4">
                {!user ? (
                    <>
                        <Link to="/">Login</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )
                }
            </div>
        </div>
    )
}
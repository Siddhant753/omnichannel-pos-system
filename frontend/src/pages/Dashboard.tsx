import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
    const navigate = useNavigate()

    const handleLogout = () => {
        const { logout } = useAuth()
        logout()
        navigate("/")
    }

    return (
        <div className="p-10">
            <h1 className="text-xl font-bold mb-4">Dashboard</h1>

            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    )
}
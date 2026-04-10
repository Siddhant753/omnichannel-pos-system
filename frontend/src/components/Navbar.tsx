import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const userProfilePic = '/user.svg'
    const userName = user?.fname || "User"

    const navLinks = [
        { name: "Dashboard", path: "/dashboard", roles: ["admin", "manager", "cashier"] },
        { name: "Stores", path: "/stores", roles: ["admin"] },
        { name: "Products", path: "/products", roles: ["admin", "manager"] },
        { name: "Orders", path: "/orders", roles: ["admin", "manager", "cashier"] },
        { name: "POS", path: "/pos", roles: ["cashier"] },
    ];

    const allowedLinks = navLinks.filter(
        (link) => user && link.roles.includes(user.role)
    )

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    if (!user) return null

    return (
        <nav className="bg-gray-300 z-50 fixed top-0 w-full h-16 p-4">
            <div className='flex justify-between items-center h-8'>
                <span className='text-xl font-bold'>POS System</span>
                <div className="hidden sm:flex items-center space-x-6">
                    {allowedLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden sm:flex items-center">
                    <div className="relative group">
                        <button className="p-2">
                            <img
                                src={userProfilePic}
                                className='w-9 h-9 rounded-full border border-gray-700'
                            />
                        </button>

                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <ul className="py-2">
                                {allowedLinks.map((link) => (
                                    <li key={link.path} className="hover:bg-blue-200">
                                        <Link
                                            to={link.path}
                                            className="block px-4 py-2 text-gray-700"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}

                                <li className="hover:bg-red-200">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="sm:hidden"
                >
                    Menu
                </button>
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="fixed top-0 right-0 w-[70%] h-full bg-white shadow-lg p-4">

                        <button onClick={() => setIsOpen(false)}>X</button>

                        <ul className="mt-5 space-y-4">
                            {allowedLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 border-t pt-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={userProfilePic}
                                    className="w-9 h-9 rounded-full"
                                />
                                <div>
                                    <p className="text-sm">{userName}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="mt-4 w-full bg-red-500 text-white py-2 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </nav>
    )
}
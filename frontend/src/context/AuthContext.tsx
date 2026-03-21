import {createContext, useState, useEffect, useContext} from 'react'

type User = {
    email: string
    role: string
}

type AuthContextType = {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)

    // Run once when the app loads. Checks local storage to presist login after refresh.
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser){
            setUser(JSON.parse(storedUser))
        }
    }, [])

    // Login function - Saves user to local storage.
    const login = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
    }

    // Logout function - Removes user from local storage.
    const logout = () => {
        localStorage.removeItem("user")
        setUser(null)
    }

    // Provides auth state and functions to all child components.
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use AuthContext easily. Prevents usage outside AuthProvider.
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}
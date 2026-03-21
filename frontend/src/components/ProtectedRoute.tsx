import {Navigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({children, allowedRoles} : {children: React.ReactNode; allowedRoles?: string[]}) {
    const { user } = useAuth()

    // Not logged in
    if (!user) {
        return <Navigate to="/" />
    }

    // Role restriction
    if (allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to="/dashboard"/>
    }
    
    return children
}
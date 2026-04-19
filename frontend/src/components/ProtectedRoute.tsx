import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { verifyToken } from '../services/auth.service';
import { useEffect } from 'react';

export default function ProtectedRoute({children, allowedRoles} : {children: React.ReactNode; allowedRoles?: string[]}) {
    const { user, loading } = useAuth()
    
    useEffect(() => {
        verifyToken();  
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

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
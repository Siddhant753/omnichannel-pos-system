import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/Verify-Email";
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar"
import { AuthProvider } from './context/AuthContext';
import Admin from './pages/Admin';
import Manager from './pages/Manager';
import POS from './pages/POS';
import Stores from './pages/Stores';
import Products from './pages/Products';


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/stores" element={<ProtectedRoute allowedRoles={["admin"]}><Stores /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute allowedRoles={["admin", "manager"]}><Products /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><Admin /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute allowedRoles={["manager"]}><Manager /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute allowedRoles={["admin", "manager", "cashier"]}><POS /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar"
import { AuthProvider } from './context/AuthContext';
import Admin from './pages/Admin';
import Manager from './pages/Manager';
import POS from './pages/POS';


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><Admin /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute allowedRoles={["manager"]}><Manager /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute allowedRoles={["cashier"]}><POS /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

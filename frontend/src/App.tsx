import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar"
import { AuthProvider } from './context/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

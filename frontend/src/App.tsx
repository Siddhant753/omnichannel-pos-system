import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup  from "./pages/auth/Signup";
import Login  from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

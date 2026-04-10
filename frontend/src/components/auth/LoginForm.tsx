import { useState } from "react"
import { loginUser } from "../../services/auth.service"
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from "../../context/AuthContext"

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const navigate = useNavigate()

    const {login} = useAuth()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return
        setIsSubmitting(true)

        try{
            const res = await loginUser(formData)
            console.log("Login Success:", res)
            // store token
            localStorage.setItem("accessToken", res.accessToken)
            // store user
            login(res.user)
            navigate("/dashboard")
        }
        catch (error: any){
            alert(error.response?.data?.message || "Login Failed")
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-amber-100 p-8 rounded-lg shadow-md max-w-md w-full place-content-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="mt-1 border rounded-md w-full px-3 py-2"
                        value={formData.email}
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="mt-1 border rounded-md w-full px-3 py-2"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 hover:cursor-pointer">{isSubmitting ? "Logging in...": "Login"}</button>

                <div className="text-center text-sm mt-4">
                    <span>New User? </span>
                    <Link to="/signup" className="text-orange-500 hover:underline font-medium">Create Account</Link>
                </div>
            </form>
        </div>
    )
}

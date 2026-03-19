import { useState } from "react";
import type { SignupFormData } from "../../types/auth.types";
import {signupUser} from '../../services/auth.service'




export default function SignupForm() {
    const [formData, setFormData] = useState<SignupFormData>({
        fname: "",
        lname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "cashier"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setFormData({ ...formData, [name]: value })
        // Error disappear when starts typing
        if (errors[name as keyof typeof errors]){
            setErrors({...errors, [name]: undefined})
        }
    }

    // Validation State
    const [errors, setErrors] = useState<Partial<SignupFormData>>({})

    const validateForm = () => {
        const newErrors: Partial<SignupFormData> = {}

        if (!formData.fname.trim()) {
            newErrors.fname = "First name is required"
        }
        if (!formData.lname.trim()) {
            newErrors.lname = "Last name is required"
        }
        if (!formData.email.includes("@")) {
            newErrors.email = "Enter a valid email"
        }
        if (formData.password.length < 6) {
            newErrors.password = "Password must be atleast 6 characters"
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // To prevent duplicate submissions
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return // Return if the form is still submitting
        
        const isValid = validateForm()
        if (!isValid) return
        setIsSubmitting(true)
        try{
            await signupUser({
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                password: formData.password,
                role: formData.role
            })
            alert("Account created successfully")
        }
        catch (error: any){
            alert(error.response?.data?.message || "Signup Failed")
        }
        finally{
            setIsSubmitting(false)
        }
    }


    return (
        <div className="bg-amber-100 p-8 rounded-lg shadow-md max-w-md w-full place-content-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            name="fname"
                            className="mt-1 w-full border rounded-md px-3 py-2"
                            value={formData.fname}
                            onChange={handleChange}
                        />
                        {errors.fname && (
                            <p className="text-red-500 text-sm mt-1">{errors.fname}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            name="lname"
                            className="mt-1 w-full border rounded-md px-3 py-2"
                            value={formData.lname}
                            onChange={handleChange}
                        />
                        {errors.lname && (
                            <p className="text-red-500 text-sm mt-1">{errors.lname}</p>
                        )}
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" name="email" id="" className="mt-1 border rounded-md w-full px-3 py-2" value={formData.email} onChange={handleChange} />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input type="password" name="password" id="" className="mt-1 border rounded-md w-full px-3 py-2" value={formData.password} onChange={handleChange} />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input type="password" name="confirmPassword" id="" className="mt-1 border rounded-md w-full px-3 py-2" value={formData.confirmPassword} onChange={handleChange} />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Role</label>
                    <select name="role" id="" className="mt-1 border rounded-md w-full px-3 py-2" value={formData.role} onChange={handleChange}>
                        <option value="cashier">Cashier</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 hover:cursor-pointer">{isSubmitting ? "Creating account...":"Sign Up"}</button>
            </form>
        </div>
    )
}
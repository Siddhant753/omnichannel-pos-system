import axios from 'axios'

export const signupUser = async (data: {
    fname: string
    lname: string
    email: string
    password: string
    role: string
}) => {
    const response = await axios.post(
        "http://localhost:5000/api/auth/signup", data
    )
    return response.data
}
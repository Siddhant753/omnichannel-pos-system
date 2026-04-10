import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Signup
export const signupUser = async (data: {
    fname: string;
    lname: string;
    email: string;
    password: string;
    role: string;
}) => {
    const res = await API.post("http://localhost:5000/api/auth/signup", data);
    return res.data;
};

// Login
export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    const res = await API.post("http://localhost:5000/api/auth/login", data);

    // store access token
    if (res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
    }

    return res.data;
};

// Logout
export const logoutUser = async () => {
    const res = await API.post("http://localhost:5000/api/auth/logout");

    // remove token
    localStorage.removeItem("accessToken");

    return res.data;
};

// Verify Token
export const verifyToken = async () => {
    const res = await API.get("http://localhost:5000/api/auth/verify-token");
    return res.data;
};

// Refresh Token
export const refreshAccessToken = async () => {
    const res = await API.post("http://localhost:5000/api/auth/refresh-token");

    if (res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
    }

    return res.data;
};
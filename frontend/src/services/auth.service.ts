import api from "./api"; 
export type SignupPayload = {
    fname: string;
    lname: string;
    email: string;
    password: string;
    role: "admin" | "manager" | "cashier";
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type User = {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    role: "admin" | "manager" | "cashier";
};

export const signupUser = async (data: SignupPayload) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
};

export const verifyEmail = async (token: string) => {
    const res = await api.post(`/auth/verify-email/${token}`);
    return res.data;
};

export const loginUser = async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data);

    if (res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
    }

    if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
};

export const logoutUser = async () => {
    const res = await api.post("/auth/logout");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    return res.data;
};

export const verifyToken = async () => {
    const res = await api.get("/auth/verify-token");
    return res.data;
};

export const refreshAccessToken = async () => {
    const res = await api.post("/auth/refresh-token");

    if (res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
    }

    return res.data;
};

export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("accessToken");
};
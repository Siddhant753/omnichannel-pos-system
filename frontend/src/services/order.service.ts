import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const createOrder = async (data: any) => {
    const res = await API.post("/orders/create-order", data);
    return res.data;
};

export const updateOrder = async (orderId: string, status: string) => {
    const res = await API.patch(`/orders/order/${orderId}/status`, { status });
    return res.data;
};

export const cancelOrder = async (orderId: string) => {
    const res = await API.patch(`/orders/order/${orderId}/cancel`);
    return res.data;
};

export const getOrderById = async (orderId: string) => {
    const res = await API.get(`/orders/order/${orderId}`);
    return res.data;
};

export const getOrders = async () => {
    const res = await API.get(`/orders/get-orders`);
    return res.data;
};
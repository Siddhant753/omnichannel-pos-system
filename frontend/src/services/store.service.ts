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

export const getStore = async (page = 1, limit = 10) => {
    const res = await API.get(`/store/get-stores?page=${page}&limit=${limit}`);
    return res.data;
};

export const createStore = async (data: any) => {
    const res = await API.post("/store/create-store", data);
    return res.data;
};

export const updateStore = async (id: string, data: any) => {
    const res = await API.put(`/store/${id}/update-store`, data);
    return res.data;
};

export const deleteStore = async (id: string) => {
    const res = await API.delete(`/store/${id}/delete-store`);
    return res.data;
};
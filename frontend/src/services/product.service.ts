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

export const createProduct = async (data: any) => {
    const res = await API.post("/product/create-product", data);
    return res.data;
};

// GET PRODUCTS
export const getProducts = async () => {
    const res = await API.get("/product/get-products");
    return res.data;
};

// GET BY BARCODE (POS)
export const getProductByBarcode = async (barcode: string) => {
    const res = await API.get(`/product/get-products/${barcode}`);
    return res.data;
};
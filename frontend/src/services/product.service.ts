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

export const getProducts = async () => {
    const res = await API.get("/product/get-products");
    return res.data;
};

export const getProductsCount = async () => {
    const res = await API.get("/product/get-products-count");
    return res.data;
};

export const getVariantsCount = async () => {
    const res = await API.get("/product/get-product-variants-count");
    return res.data;
};

export const getProductByBarcode = async (barcode: string) => {
    const res = await API.get(`/product/get-products/${barcode}`);
    return res.data;
};
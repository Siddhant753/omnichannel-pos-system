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

export const createInventory = async (data: {
    productVariantId: string;
    storeId: string;
    stock: number;
    reservedStock: number;
    reorderLevel: number;
}) => {
    const res = await API.post("/inventory/create-inventory", data);
    return res.data;
};

export const getInventoryByProductVariant = async (data: {
    variantId: string;
    storeId: string;
}) => {
    const res = await API.get(
        `/inventory/${data.variantId}/${data.storeId}/get-inventory-by-variant`
    );
    return res.data;
};

export const inventoryReservedStock = async (data: {
    variantId: string;
    storeId: string;
    quantity: number;
}) => {
    const res = await API.patch(
        `/inventory/${data.variantId}/${data.storeId}/inventory-reserved-stock`,
        { quantity: data.quantity }
    );
    return res.data;
};

export const inventoryReleaseReservedStock = async (data: {
    variantId: string;
    storeId: string;
    quantity: number;
}) => {
    const res = await API.patch(
        `/inventory/${data.variantId}/${data.storeId}/inventory-release-reserved-stock`,
        { quantity: data.quantity }
    );
    return res.data;
};

export const inventoryDeductReservedStock = async (data: {
    variantId: string;
    storeId: string;
    orderId: string;
    quantity: number;
}) => {
    const res = await API.patch(
        `/inventory/${data.variantId}/${data.storeId}/deduct-reserved-stock/${data.orderId}`,
        { quantity: data.quantity }
    );
    return res.data;
};
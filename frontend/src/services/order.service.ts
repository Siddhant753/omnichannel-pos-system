import api from "./api";

export const createOrder = async (items:{productId: number, quantity: number}[]) =>{
    const response = await api.post(
        "/api/orders", {items}
    )
    return response.data
}
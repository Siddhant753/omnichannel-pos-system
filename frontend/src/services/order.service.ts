import axios from 'axios'

export const createOrder = async () => {
    const response = await axios.post(
        "http://localhost:5000/api/orders/create-order",
    )
    return response.data
}

export const getOrders = async () => {
    const response = await axios.get(
        `http://localhost:5000/api/orders/get-orders`,
    )
    return response.data
}

export const getOrderById = async (data: {
    orderId: string
}) => {
    const response = await axios.get(
        `http://localhost:5000/api/orders/get-order/${data.orderId}`,
    )
    return response.data
}

export const updateOrder = async (data: {
    orderId: string
}) => {
    const response = await axios.patch(
        `http://localhost:5000/api/orders/${data.orderId}/status`, data
    )
    return response.data
}

export const cancelOrder = async (data: {
    orderId: string
}) => {
    const response = await axios.patch(
        `http://localhost:5000/api/orders/${data.orderId}/cancel`,
    )
    return response.data
}
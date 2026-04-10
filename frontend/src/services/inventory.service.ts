import axios from 'axios'

export const createInventory = async (data: {
    fname: string
    lname: string
    email: string
    password: string
    role: string
}) => {
    const response = await axios.post(
        "http://localhost:5000/api/inventory/create-inventory", data
    )
    return response.data
}

export const getInventory = async (data: {
    storeId: string
}) => {
    const response = await axios.get(
        `http://localhost:5000/api/inventory/${data.storeId}/get-inventory`,
    )
    return response.data
}

export const getInventoryByProductVariant = async (data: {
    variantId: string
    storeId: string,
}) => {
    const response = await axios.get(
        `http://localhost:5000/api/inventory/${data.variantId}/${data.storeId}/get-inventory-by-variant`,
    )
    return response.data
}

export const updateInventoryStock = async (data: {
    variantId: string
    storeId: string
}) => {
    const response = await axios.patch(
        `http://localhost:5000/api/inventory/${data.variantId}/${data.storeId}/update-stock`, data
    )
    return response.data
}

export const inventoryReservedStock = async (data: {
    variantId: string
    storeId: string
}) => {
    const response = await axios.patch(
        `http://localhost:5000/api/inventory/${data.variantId}/${data.storeId}/inventory-reserved-stock`,
    )
    return response.data
}

export const inventoryReleaseReservedStock = async (data: {
    variantId: string
    storeId: string,
}) => {
    const response = await axios.get(
        `http://localhost:5000/api/inventory/${data.variantId}/${data.storeId}/inventory-release-reserved-stock`,
    )
    return response.data
}

export const inventoryDeductReservedStock = async (data: {
    variantId: string
    storeId: string,
    orderId: string
}) => {
    const response = await axios.get(
        `http://localhost:5000/api/inventory/${data.variantId}/${data.storeId}/deduct-reserved-stock/${data.orderId}`,
    )
    return response.data
}

export const lowStockAlert = async (data: {
    storeId: string
}) => {
    const response = await axios.get(
        `http://localhost:5000/api/inventory/alerts/low-stock/${data.storeId}`,
    )
    return response.data
}

export const getInventoryLedger = async (data: {
    storeId: string
}) => {
    const response = await axios.get(
        `http://localhost:5000/api/inventory/ledger/${data.storeId}/get-inventory-ledger`,
    )
    return response.data
}

export const barcodeScan = async (data: {}) => {
    const response = await axios.post(
        `http://localhost:5000/api/inventory/barcode/scan`, data
    )
    return response.data
}
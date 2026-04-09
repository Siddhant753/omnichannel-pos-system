import { useState } from "react"
import api from "../services/api"

export default function ProductModel({ isOpen, onClose }: any) {

    const [form, setForm] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        sku: "",
        barcode: ""
    })

    if (!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            console.log("FORM DATA:", form)

            // Step 1: Create Product
            // const productRes = 
            await api.post("/product/create-product", {
                name: form.name,
                category: form.category,
                description: form.description,
                variants: [
                    {
                    price: Number(form.price),
                    sku: form.sku,
                    barcode: form.barcode
                    }
                ]
            })

            console.log("Product + Variant created")

            onClose()

        } catch (err: any) {
            console.error("ERROR:", err.response?.data || err.message)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-96">
                <h2 className="text-lg font-semibold mb-4">Add Product</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="name" onChange={handleChange} placeholder="Product Name" className="w-full border p-2 rounded" />
                    <input name="category" onChange={handleChange} placeholder="Category" className="w-full border p-2 rounded" />
                    <input name="description" onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

                    <input name="price" onChange={handleChange} placeholder="Price" className="w-full border p-2 rounded" />
                    <input name="sku" onChange={handleChange} placeholder="SKU" className="w-full border p-2 rounded" />
                    <input name="barcode" onChange={handleChange} placeholder="Barcode" className="w-full border p-2 rounded" />

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
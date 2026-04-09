import { useEffect, useState } from "react"
import type { ProductUI, ProductAPI, VariantAPI } from "../types/product"
import api from "../services/api"

export default function ProductTable() {
    const [products, setProducts] = useState<ProductUI[]>([])

    useEffect(() => {
        api.get("/product/get-products")
            .then(res => {
                const { products, variants } = res.data;

                const normalized: ProductUI[] = products.map((product: ProductAPI) => {
                    const variant = variants.find(
                        (v: VariantAPI) => v.productId === product._id
                    )

                    return {
                        id: product._id,
                        name: product.name,
                        category: product.category,
                        price: variant?.price || 0,
                        sku: variant?.sku || "N/A"
                    }
                })

                setProducts(normalized);
            })
            .catch(err => console.error(err));
    }, [])

    return (
        <table className="w-full bg-white rounded-xl shadow">
            <thead>
                <tr className="text-left border-b">
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>

            <tbody>
                {products.map(p => (
                    <tr key={p.id} className="border-b">
                        <td className="p-3">{p.name}</td>
                        <td className="p-3">{p.category}</td>
                        <td className="p-3">₹{p.price}</td>
                        <td className="p-3">{p.sku}</td>
                        <td className="p-3 space-x-2">
                            <button className="text-blue-500">Edit</button>
                            <button className="text-red-500">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
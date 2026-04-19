import { useEffect, useState } from "react";
import { createProduct, getProducts } from "../services/product.service";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddIcon from '@mui/icons-material/Add';

type Variant = {
    _id?: string;
    sku?: string;
    price: number;
    barcode?: string;
    attributeValues: {
        [key: string]: string;
    };
};

type Product = {
    _id: string;
    name: string;
    description: string;
    category: string;
    variants: Variant[];
};

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [openModal, setOpenModal] = useState(false);

    const [variants, setVariants] = useState<any[]>([
        { price: "", size: "", color: "" }
    ]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const data = await getProducts();

        const merged = data.products.map((p: any) => ({
        ...p,
        variants: data.variants.filter((v: any) => v.productId === p._id)
        }));

        setProducts(merged);
    };

    async function handleSubmit(e: any) {
        e.preventDefault();
        const form = new FormData(e.target);

        const productData = {
        name: form.get("name"),
        description: form.get("description"),
        category: form.get("category"),
        variants: variants.map(v => ({
            price: Number(v.price),
            attributeValues: {
            size: v.size,
            color: v.color
            }
        }))
        };

        await createProduct(productData);

        setOpenModal(false);
        fetchProducts();
    }

    const addVariant = () => {
        setVariants([...variants, { price: "", size: "", color: "" }]);
    };

    const updateVariant = (i: number, key: string, value: any) => {
        const updated = [...variants];
        updated[i][key] = value;
        setVariants(updated);
    };

    return (
        <div className="p-8 pt-20">
            <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Products</h2>
                    <Inventory2Icon />
                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    <AddIcon fontSize="small" />Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-6">
                        No products found
                    </div>
                ) : (
                    products.map((p) => (
                        <div key={p._id} className="border p-4 rounded shadow">
                            <h3 className="font-bold">{p.name}</h3>
                            <p className="text-sm text-gray-500">{p.category}</p>

                            <div className="mt-2 text-sm">
                                {p.variants.map((v) => (
                                    <div key={v._id} className="flex justify-between">
                                        <span>
                                            {v.attributeValues
                                                ? Object.values(
                                                    v.attributeValues instanceof Map
                                                        ? Object.fromEntries(v.attributeValues)
                                                        : v.attributeValues
                                                ).join(" / ")
                                                : "N/A"}
                                        </span>
                                        <span>₹{v.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white w-full max-w-lg p-6 rounded">
                        <div className="flex justify-between mb-4">
                            <h2 className="font-bold">Create Product</h2>
                            <button onClick={() => setOpenModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                            <input name="name" placeholder="Product Name" className="border p-2 rounded" />
                            <input name="description" placeholder="Description" className="border p-2 rounded" />
                            <input name="category" placeholder="Category" className="border p-2 rounded" />
                            <div>
                                <h3 className="font-semibold mb-2">Variants</h3>
                                {variants.map((v, i) => (
                                    <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                                        <input
                                            placeholder="Size"
                                            className="border p-2"
                                            onChange={(e) => updateVariant(i, "size", e.target.value)}
                                        />

                                        <input
                                            placeholder="Color"
                                            className="border p-2"
                                            onChange={(e) => updateVariant(i, "color", e.target.value)}
                                        />

                                        <input
                                            placeholder="Price"
                                            type="number"
                                            className="border p-2"
                                            onChange={(e) => updateVariant(i, "price", e.target.value)}
                                        />
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="text-blue-500 text-sm"
                                >
                                    + Add Variant
                                </button>
                            </div>

                            <button className="bg-green-500 text-white p-2 rounded">
                                Create Product
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
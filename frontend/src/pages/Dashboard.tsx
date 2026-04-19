import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getProductsCount } from "../services/product.service";
import { getStore, getStoresCount } from "../services/store.service";
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';

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

type Store = {
    _id: string;
    name: string;
    type: "store" | "warehouse";
    address: string;
    city: string;
    state: string;
    country: string;
    contactNumber: string;
    manager?: {
        fname: string;
        lname: string;
        email: string;
    };
};

export default function Dashboard() {
    const [stores, setStores] = useState<Store[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [storesCount, setStoresCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                setLoading(true);

                const storeRes = await getStoresCount();
                const productRes = await getProductsCount();

                setStoresCount(storeRes.totalStores);
                setProductsCount(productRes.totalProducts);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    useEffect(() => {
        fetchStores();
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

    const fetchStores = async () => {
        try {
            setLoading(true);
            const data = await getStore(1, 10);
            setStores(data.stores);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const filteredStores = stores.filter((s) => s.name.toLowerCase()).slice(0, 5);

    return (
        <div className="p-4 pt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-bold">POS System Details</h2>
                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Total Stores</h2>
                        <StoreIcon />
                    </div>
                    <p className="text-3xl font-bold">{storesCount}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Total Products</h2>
                        <Inventory2Icon />
                    </div>
                    <p className="text-3xl font-bold">{productsCount}</p>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow flex flex-col">
                <div className="overflow-x-auto">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="overflow-x-auto border border-gray-200 rounded-md">
                                <h2 className="text-xl font-bold p-4">Stores</h2>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-6 py-2.5 text-left text-sm">Name</th>
                                            <th className="px-6 py-2.5 text-left text-sm">Type</th>
                                            <th className="px-6 py-2.5 text-left text-sm">Location</th>
                                            <th className="px-6 py-2.5 text-left text-sm">Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStores.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No stores found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStores.map((store) => (
                                                <tr key={store._id} className="hover:bg-gray-100">
                                                    <td className="px-6 py-2.5 text-sm font-medium">
                                                        {store.name}
                                                    </td>
                                                    <td className="px-6 py-2.5 text-sm capitalize">
                                                        {store.type}
                                                    </td>
                                                    <td className="px-6 py-2.5 text-sm">
                                                        {store.city}, {store.state}, {store.country}
                                                    </td>
                                                    <td className="px-6 py-2.5 text-sm">
                                                        {store.contactNumber}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                <Link
                                                    to="/stores"
                                                    className="text-blue-500 hover:text-blue-600"
                                                >
                                                    View All Stores
                                                </Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="overflow-x-auto border border-gray-200 rounded-md">
                                <h2 className="text-xl font-bold p-4">Products</h2>
                                {products.length === 0 ? (
                                    <div className="col-span-full text-center text-gray-500 py-6">
                                        No products found
                                    </div>
                                ) : (
                                    products.map((p) => (
                                        <div key={p._id} className="py-6 px-12 shadow border border-gray-300">
                                            <div className="flex justify-between">
                                                <h3 className="font-bold">{p.name}</h3>
                                                <p className="text-sm text-gray-500">{p.category}</p>
                                            </div>

                                            <div className="mt-2 text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t pt-4">
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
                                <div className="flex justify-center items-center py-6">
                                    <Link
                                        to="/products"
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        View All Products
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
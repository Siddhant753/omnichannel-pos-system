import { useState, useEffect } from "react";
import axios from "axios";
import { getProductByBarcode } from "../services/product.service";
import {
    createInventory,
    getInventoryByProductVariant,
    inventoryReservedStock,
    inventoryReleaseReservedStock,
    inventoryDeductReservedStock
} from "../services/inventory.service";
import { createOrder } from "../services/order.service";
import { getStore } from "../services/store.service";

type CartItem = {
    variantId: string;
    name: string;
    attributeValues: { [key: string]: string };
    sku: string;
    price: number;
    barcode: string;
    quantity: number;
};

export default function POS() {
    const [barcode, setBarcode] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [stores, setStores] = useState<any[]>([]);
    const [storeId, setStoreId] = useState("");

    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "online" | "">("");

    useEffect(() => {
        const fetchStores = async () => {
            const res = await getStore();
            setStores(res.stores || []);
        };
        fetchStores();
    }, []);

    const handleScan = async () => {
        if (!barcode) return;

        if (!storeId) {
            alert("Select store first");
            return;
        }

        setLoading(true);

        try {
            const res = await getProductByBarcode(barcode);

            if (!res?.variant?._id) {
                alert("Product not found");
                return;
            }

            const variant = res.variant;
            const variantId = variant._id;

            let inventory;

            try {
                const inv = await getInventoryByProductVariant({ variantId, storeId });
                inventory = inv.inventory;

            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    await createInventory({
                        productVariantId: variantId,
                        storeId,
                        stock: 100,
                        reservedStock: 0,
                        reorderLevel: 5
                    });

                    const inv = await getInventoryByProductVariant({ variantId, storeId });
                    inventory = inv.inventory;

                } else {
                    throw error;
                }
            }

            if (inventory.stock < 1) {
                alert("Out of stock");
                return;
            }

            const existing = cart.find(i => i.variantId === variantId);

            if (existing) {
                setCart(prev =>
                    prev.map(i =>
                        i.variantId === variantId
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    )
                );
            } else {
                setCart(prev => [
                    ...prev,
                    {
                        variantId,
                        name: variant.productId.name,
                        barcode: variant.barcode,
                        attributeValues: variant.attributeValues || {},
                        sku: variant.sku,
                        price: variant.price,
                        quantity: 1
                    }
                ]);
            }

            await inventoryReservedStock({
                variantId,
                storeId,
                quantity: 1
            });

            setBarcode("");

        } catch (err: any) {
            console.error("SCAN ERROR:", err);
            alert(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    const decreaseQty = async (variantId: string) => {
        const item = cart.find(i => i.variantId === variantId);
        if (!item) return;

        if (item.quantity === 1) {
            setCart(prev => prev.filter(i => i.variantId !== variantId));
        } else {
            setCart(prev =>
                prev.map(i =>
                    i.variantId === variantId
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
            );
        }

        await inventoryReleaseReservedStock({
            variantId,
            storeId,
            quantity: 1
        });
    };

    const removeItem = async (variantId: string) => {
        const item = cart.find(i => i.variantId === variantId);
        if (!item) return;

        setCart(prev => prev.filter(i => i.variantId !== variantId));

        await inventoryReleaseReservedStock({
            variantId,
            storeId,
            quantity: item.quantity
        });
    };

    const handleCreateOrder = async () => {
        if (!storeId) return alert("Select store");
        if (!paymentMethod) return alert("Select payment method");
        if (cart.length === 0) return alert("Cart is empty");

        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            const order = await createOrder({
                storeId,
                cashierId: user?._id,
                paymentMethod,
                items: cart.map(i => ({
                    variantId: i.variantId,
                    quantity: i.quantity
                }))
            });

            for (const item of cart) {
                await inventoryDeductReservedStock({
                    variantId: item.variantId,
                    storeId,
                    orderId: order.order?._id,
                    quantity: item.quantity
                });
            }

            setCart([]);
            setPaymentMethod("");
            alert("Order created successfully");

        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Order failed");
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="p-4 pt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-bold">POS System</h2>
                <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Select Store</option>
                    {stores.map((s) => (
                        <option key={s._id} value={s._id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <input
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleScan()}
                        placeholder="Scan barcode..."
                        className="border p-2 rounded flex-1"
                    />
                    <button
                        onClick={handleScan}
                        className="bg-blue-600 text-white px-4 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow flex flex-col">

                <h3 className="text-lg font-semibold mb-3">Cart</h3>
                {cart.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        🛒 No items in cart
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="py-2">Product</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.variantId} className="border-b">
                                        <td className="py-2">{item.name}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => decreaseQty(item.variantId)}
                                                    className="px-2 bg-gray-200 rounded"
                                                >
                                                    -
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    onClick={() =>
                                                        setCart(prev =>
                                                            prev.map(i =>
                                                                i.variantId === item.variantId
                                                                    ? { ...i, quantity: i.quantity + 1 }
                                                                    : i
                                                            )
                                                        )
                                                    }
                                                    className="px-2 bg-gray-200 rounded"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>

                                        <td>₹{item.price * item.quantity}</td>

                                        <td>
                                            <button
                                                onClick={() => removeItem(item.variantId)}
                                                className="text-red-500 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 border-t pt-4 space-y-3">
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>

                    <div>
                        <p className="font-medium mb-2">Payment Method</p>

                        <div className="flex gap-2">
                            {["cash", "card", "online"].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method as any)}
                                    className={`px-4 py-2 rounded border ${
                                        paymentMethod === method
                                            ? "bg-green-600 text-white"
                                            : "bg-white"
                                    }`}
                                >
                                    {method.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleCreateOrder}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
                    >
                        Create Order
                    </button>
                </div>
            </div>
        </div>
    );
}
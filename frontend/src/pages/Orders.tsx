import { useEffect, useState } from "react";
import {
    getOrders,
    getOrderById,
} from "../services/order.service";

export default function Orders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await getOrders();
            setOrders(res.orders || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter((o) =>
        o._id.toLowerCase().includes(search.toLowerCase())
    );

    const handleView = async (id: string) => {
        const res = await getOrderById(id);
        setSelectedOrder(res.order);
        setOrderItems(res.items || []);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "refunded":
                return "bg-gray-200 text-gray-700";
            default:
                return "";
        }
    };

    return (
        <div className="p-8 pt-20">
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold">Orders</h2>

                <input
                    type="text"
                    placeholder="Search by Order ID..."
                    className="border px-3 py-2 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-2.5 text-left text-sm">Order ID</th>
                                <th className="px-6 py-2.5 text-left text-sm">Amount</th>
                                <th className="px-6 py-2.5 text-left text-sm">Payment</th>
                                <th className="px-6 py-2.5 text-left text-sm">Status</th>
                                <th className="px-6 py-2.5 text-left text-sm">Date</th>
                                <th className="px-6 py-2.5 text-left text-sm">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-100">
                                        <td className="px-6 py-2.5 text-sm font-medium">
                                            {order._id}
                                        </td>

                                        <td className="px-6 py-2.5 text-sm">
                                            ₹{order.totalAmount}
                                        </td>

                                        <td className="px-6 py-2.5 text-sm capitalize">
                                            {order.paymentMethod}
                                        </td>

                                        <td className="px-6 py-2.5 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-2.5 text-sm">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>

                                        <td className="px-6 py-2.5 text-sm flex gap-2">
                                            <button
                                                onClick={() => handleView(order._id)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)}>X</button>
                        </div>

                        <p><b>ID:</b> {selectedOrder._id}</p>
                        <p><b>Status:</b> {selectedOrder.status}</p>
                        <p><b>Total:</b> ₹{selectedOrder.totalAmount}</p>

                        <h3 className="mt-4 font-semibold">Items</h3>

                        <ul className="list-disc pl-5">
                            {orderItems.map((item: any) => (
                                <li key={item._id}>
                                    {item.variantId?.productId?.name} × {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="px-3 py-1 border"
                >
                    Prev
                </button>

                <span>Page {page}</span>

                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 border"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
import { useState, useEffect } from "react";
import { createStore, getStore, deleteStore } from "../services/store.service";

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

export default function Stores() {
    const [stores, setStores] = useState<Store[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);

    useEffect(() => {
        fetchStores();
    }, [page]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const data = await getStore(page, 10);
            setStores(data.stores);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStores = stores.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    async function handleSubmit(e: any) {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = Object.fromEntries(form.entries());

        try {
            await createStore(data);
            fetchStores();
            setOpenModal(false);
            setEditingStore(null);
        } catch (err) {
            console.error(err);
        }
    }

    function handleEdit(store: Store) {
        setEditingStore(store);
        setOpenModal(true);
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;

        try {
            await deleteStore(id);
            fetchStores();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="p-8 pt-20">
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold">Stores</h2>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search store..."
                        className="border px-3 py-2 rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        onClick={() => {
                            setEditingStore(null);
                            setOpenModal(true);
                        }}
                        className="bg-green-500 text-white md:text-sm px-4 py-2 rounded"
                    >
                        + Create Store
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-2.5 text-left text-sm">Name</th>
                                <th className="px-6 py-2.5 text-left text-sm">Type</th>
                                <th className="px-6 py-2.5 text-left text-sm">Location</th>
                                <th className="px-6 py-2.5 text-left text-sm">Contact</th>
                                <th className="px-6 py-2.5 text-left text-sm">Manager</th>
                                <th className="px-6 py-2.5 text-left text-sm">Actions</th>
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
                                        <td
                                            className="px-6 py-2.5 text-sm"
                                            title={store.manager?.email}
                                        >
                                            {store.manager
                                                ? `${store.manager.fname} ${store.manager.lname}`
                                                : "N/A"}
                                        </td>
                                        <td className="px-6 py-2.5 text-sm flex gap-2">
                                            <button
                                                onClick={() => handleEdit(store)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(store._id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">
                                {editingStore ? "Edit Store" : "Create Store"}
                            </h2>

                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-gray-500 p-2"
                            >
                                X
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                            <input name="name" defaultValue={editingStore?.name} placeholder="Name" className="border p-2 rounded" />

                            <select name="type" defaultValue={editingStore?.type} className="border p-2 rounded">
                                <option value="store">Store</option>
                                <option value="warehouse">Warehouse</option>
                            </select>

                            <input name="address" defaultValue={editingStore?.address} placeholder="Address" className="border p-2 rounded" />
                            <input name="city" defaultValue={editingStore?.city} placeholder="City" className="border p-2 rounded" />
                            <input name="state" defaultValue={editingStore?.state} placeholder="State" className="border p-2 rounded" />
                            <input name="country" defaultValue={editingStore?.country} placeholder="Country" className="border p-2 rounded" />
                            <input name="contactNumber" defaultValue={editingStore?.contactNumber} placeholder="Contact" className="border p-2 rounded" />

                            <button className="bg-green-500 text-white p-2 rounded">
                                {editingStore ? "Update" : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
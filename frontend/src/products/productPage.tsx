import ProductTable from "./productTable"
import ProductModel from "./productModel";
import { useState } from "react";

export default function ProductPage() {

    const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Products</h1>

        <button onClick={() => setIsOpen(true)} className="bg-black text-white px-4 py-2 rounded-xl hover:cursor-pointer">
          Add Product
        </button>
      </div>

      <ProductTable />
      <ProductModel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
// import { useState, useEffect } from "react"
// import { createOrder } from "../services/order.service"
// import { getProducts } from "../services/product.service"

// type Product = {
//   id: string
//   name: string
//   price: number
// }

// export default function POS() {

//   const [products, setProducts] = useState<Product[]>([])


//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const data = await getProducts()

//         console.log("API DATA:", data)

//         const normalized = data.products.map((product: any) => {
//           const productVariants = data.variants.filter(
//             (v: any) => v.productId === product._id
//           )

//           return {
//             id: product._id,
//             name: product.name,
//             category: product.category,
//             price: productVariants[0]?.price || 0
//           }
//         })

//         console.log("NORMALIZED:", normalized)

//         setProducts(normalized)

//       } catch (error) {
//         console.error("API Failed:", error)
//       }
//     }

//     fetchProducts()
//   }, [])

//   // Search
//   const [search, setsearch] = useState("")
//   const filteredProducts = products.filter(p =>
//     p.name.toLowerCase().includes(search.toLocaleLowerCase())
//   )



//   // cart Logic
//   type CartItem = {
//     id: string
//     name: string
//     price: number
//     quantity: number
//   }

//   const [cart, setCart] = useState<CartItem[]>([])

//   // Add to cart  logic
//   const addToCart = (product: Product) => {
//     const existingItem = cart.find(item => item.id === product.id)

//     if (existingItem) {
//       setCart(cart.map(item =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       ))
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }])
//     }
//   }

//   // Total logic
//   const total = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   )

//   // Checkout Handler
//   const handleCheckout = async () => {
//     /*try{
//       const items = cart.map(item => ({
//         productId: item.id,
//         quantity: item.quantity
//       }))

//       const res = await createOrder(items)

//       console.log("Order Success:", res)

//       setCart([]) // Clear cart

//       alert("Order placed successfully")
//     }
//     catch(error: any) {
//       console.error(error)
//       alert("Checkout failed")
//     }*/
//     console.log("Mock order:", cart)
//     setCart([])
//     alert("Mock order placed")
//   }


//   return (
//     <div className="h-screen flex">

//       {/* LEFT */}
//       <div className="w-2/3 p-4 border-r">
//         <h2 className="text-xl font-bold mb-4">Products</h2>

//         {/* Search Function */}
//         <input
//           type="text"
//           placeholder="Search product..."
//           className="w-full border px-3 py-2 mb-4"
//           value={search}
//           onChange={(e) => setsearch(e.target.value)}
//         />



//         {filteredProducts.length === 0 ? (
//           <p className="text-gray-500">No products available</p>
//         ) : (
//           <div className="grid grid-cols-3 gap-4">
//             {filteredProducts.map(product => (
//               <div
//                 key={product.id}
//                 onClick={() => addToCart(product)}
//                 className="border p-4 cursor-pointer hover:bg-gray-100"
//               >
//                 <h3>{product.name}</h3>
//                 <p>₹{product.price}</p>
//               </div>
//             ))}
//           </div>
//         )}

//       </div>

//       {/* RIGHT */}
//       <div className="w-1/3 p-4">
//         <h2 className="text-xl font-bold mb-4">Cart</h2>

//         <div className="space-y-2">
//           {cart.map((item) => (
//             <div key={item.id} className="flex justify-between border p-2 items-center">

//               <span>{item.name}</span>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() =>
//                     setCart(cart
//                       .map(i =>
//                         i.id === item.id
//                           ? { ...i, quantity: i.quantity - 1 }
//                           : i
//                       )
//                       .filter(i => i.quantity > 0)
//                     )
//                   }
//                 >
//                   -
//                 </button>

//                 <span>{item.quantity}</span>

//                 <button
//                   onClick={() =>
//                     setCart(cart.map(i =>
//                       i.id === item.id
//                         ? { ...i, quantity: i.quantity + 1 }
//                         : i
//                     ))
//                   }
//                 >
//                   +
//                 </button>
//               </div>

//               <span>₹{item.price * item.quantity}</span>
//             </div>
//           ))}
//         </div>

//         <div className="mt-4 font-bold text-lg">
//           Total: ₹{total}
//         </div>

//         <button
//           onClick={handleCheckout}
//           className="mt-4 w-full bg-green-500 text-white py-2">
//           Checkout
//         </button>
//       </div>

//     </div>
//   )
// }

export default function POS() {
  return <div className="p-10 text-xl">POS System</div>
}
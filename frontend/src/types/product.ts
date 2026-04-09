// types/product.ts

export interface ProductAPI {
  _id: string
  name: string
  category: string
}

export interface VariantAPI {
  productId: string
  price: number
  sku: string
}

export interface ProductUI {
    id: string
    name: string
    category: string
    price: number
    sku: string

}
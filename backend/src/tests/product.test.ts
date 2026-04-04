import { createProduct, getProducts } from "../controllers/product.controller.js";
import ProductsModel from "../models/products.model.js";
import ProductVariantsModel from "../models/productVariants.model.js";

jest.mock("../models/products.model.js");
jest.mock("../models/productVariants.model.js");

describe("Product Controller", () => {
    describe("createProduct", () => {
        it("should create a new product and productVariant and return 201 status", async () => {
            const req: any = {
                body: {
                    name: "Shirt",
                    description: "Cotton Shirt for Men",
                    category: "Clothing",
                    variants: [
                        { sku: "SKU1", price: 100, barcode: "12345" }
                    ]
                }
            }

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            (ProductsModel.create as jest.Mock).mockResolvedValue({ _id: "productId", ...req.body });
            (ProductVariantsModel.insertMany as jest.Mock).mockResolvedValue([{ _id: "variantId", productId: "productId", ...req.body.variants[0] }]);

            await createProduct(req, res);

            expect(ProductsModel.create).toHaveBeenCalled();
            expect(ProductVariantsModel.insertMany).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe("getProducts", () => {
        it("should return a list of products and their variants with 200 status", async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            const mockProducts = [{
                _id: "productId",
                name: "Shirt",
                description: "Cotton Shirt for Men",
                category: "Clothing",
                createdAt: new Date()
            }];

            const mockVariants = [{
                _id: "variantId",
                productId: "productId",
                sku: "SKU1",
                price: 100,
                barcode: "12345",
                createdAt: new Date()
            }];
            (ProductsModel.find as jest.Mock).mockResolvedValue(mockProducts);
            (ProductVariantsModel.find as jest.Mock).mockResolvedValue(mockVariants);

            await getProducts(req as any, res as any);

            expect(ProductsModel.find).toHaveBeenCalled();
            expect(ProductVariantsModel.find).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{
                ...mockProducts[0],
                variants: [mockVariants[0]]
            }]);
        });
    });
});
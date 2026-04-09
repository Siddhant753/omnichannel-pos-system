import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/rbac.middleware';
import { 
    createProduct,
    getProducts,
    getProductsByBarcode
} from '../controllers/product.controller';

const productRouter = Router();

productRouter.post('/create-product', authMiddleware, allowRoles('admin'), createProduct);
productRouter.get('/get-products', authMiddleware, allowRoles('admin', 'manager', 'cashier'), getProducts);
productRouter.get('/get-products/:barcode', authMiddleware, allowRoles('admin', 'manager', 'cashier'), getProductsByBarcode);

export default productRouter;
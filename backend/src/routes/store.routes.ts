import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/rbac.middleware';
import { 
    createStoreController,
    getStoresController,
    getStoresCountController,
    updateStoreController,
    deleteStoreController
} from '../controllers/store.controller';

const storeRouter = Router();

storeRouter.post('/create-store', authMiddleware, allowRoles('admin'), createStoreController);
storeRouter.get('/get-stores', authMiddleware, allowRoles('admin', 'manager'), getStoresController);
storeRouter.get('/get-stores-count', authMiddleware, allowRoles('admin', 'manager'), getStoresCountController);
storeRouter.patch('/:storeId/update-store', authMiddleware, allowRoles('admin', 'manager'), updateStoreController);
storeRouter.delete('/:storeId/delete-store', authMiddleware, allowRoles('admin'), deleteStoreController);

export default storeRouter;
import { Router } from "express";
import {
    createInventory,
    getInventory,
    getInventoryByProductVariant,
    updateInventoryStock,
    inventoryReservedStock,
    inventoryReleaseReservedStock,
    inventoryDeductReservedStock,
    lowStockAlert,
    getInventoryLedger,
    barcodeScan
} from "../controllers/inventory.controller";

const inventoryRouter = Router();

inventoryRouter.post("/create-inventory", createInventory);
inventoryRouter.get("/:storeId/get-inventory", getInventory);
inventoryRouter.get("/:variantId/:storeId/get-inventory-by-variant", getInventoryByProductVariant);
inventoryRouter.patch("/:variantId/:storeId/update-stock", updateInventoryStock);
inventoryRouter.patch("/:variantId/:storeId/inventory-reserved-stock", inventoryReservedStock);
inventoryRouter.patch("/:variantId/:storeId/inventory-release-reserved-stock", inventoryReleaseReservedStock);
inventoryRouter.patch("/:variantId/:storeId/deduct-reserved-stock/:orderId", inventoryDeductReservedStock);
inventoryRouter.get("/alerts/low-stock/:storeId", lowStockAlert);
inventoryRouter.get("/ledger/:storeId/get-inventory-ledger", getInventoryLedger);
inventoryRouter.post("/barcode/scan", barcodeScan);

export default inventoryRouter;
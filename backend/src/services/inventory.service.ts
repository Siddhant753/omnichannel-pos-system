import InventoryModel from "../models/inventory.model"
import InventoryLedgerModel from "../models/inventoryLedger.model";
import ProductVariantsModel from "../models/productVariants.model";

export const inventoryReserveStock = async (items: any[]) => {
    for (const item of items) {
        const product = await InventoryModel.findOne({ productVariantId: item.productVariantId });

        if (!product || product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.productVariantId}`);
        }

        product.stock -= item.quantity;
        await product.save();

        await InventoryLedgerModel.create({
            storeId: product.storeId,
            productVariantId: item.productVariantId,
            changeType: 'sale',
            quantityChange: -item.quantity,
            oldQuantity: product.stock + item.quantity,
            newQuantity: product.stock,
        });
    }
}

export const processInventory = async (barcode: string) => {
    console.log("Processing barcode:", barcode);

    const variant = await ProductVariantsModel.findOne({ barcode });

    if (!variant) {
        console.log("Variant not found:", barcode);
        return;
    }

    const inventory = await InventoryModel.findOne({ productVariantId: variant._id });
    
    if (!inventory) {
        console.log("Inventory not found for variant:", variant._id);
        return;
    }
    
    inventory.stock -= 1;
    inventory.reservedStock += 1;
    await inventory.save();
    console.log({ barcode, stock: inventory?.stock || 0 });
};
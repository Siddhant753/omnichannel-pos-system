import { v4 as uuid } from 'uuid';

export const generateSKU = (productName: string, attributeValues: Map<string, string>): string => {
    const prefix = productName.substring(0, 3).toUpperCase();
    const attributesPart = Array.from(attributeValues.values()).map(value => value.substring(0, 3).toUpperCase()).join('');
    const randomNumber = Math.floor(1000 + Math.random() * 9000); 

    return `${prefix}-${attributesPart}-${randomNumber}`;
}

export const generateBarcode = (): string => {
    return uuid().replace(/-/g, '').substring(0, 12).toUpperCase();
}
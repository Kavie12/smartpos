export type SupplierDataType = {
    id?: number;
    name: string;
    phoneNumber: string;
    email: string;
};

export type StockRecordType = {
    id?: number;
    productName: string;
    product?: ProductDataType;
    stockAmount: number;
    createdAt?: String;
};

export type ProductDataType = {
    id?: number;
    barcode: string;
    name: string;
    supplier?: SupplierDataType;
    wholesalePrice: number;
    retailPrice: number;
    stockLevel: number;
};

export type CustomerDataType = {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    points: number;
};

export type EmployeeDataType = {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
};

export type BillingRecordDataType = {
    id?: number,
    product: ProductDataType;
    price?: number;
    quantity: number;
};

export type BillingDataType = {
    id?: number;
    billingRecords: BillingRecordDataType;
    loyaltyCustomer: CustomerDataType | null;
    createdAt: String;
};
export type CredentialsType = {
    username: string;
    password: string;
};

export type BasicAlertType = {
    open: boolean,
    type: "error" | "success" | null,
    message: string | null
};

export type SupplierDataType = {
    id?: number;
    name: string;
    phoneNumber: string;
    email: string;
};

export type StockRecordType = {
    id?: number;
    product?: ProductDataType | null;
    stockAmount: number;
    createdAt?: String;
};

export type ProductDataType = {
    id?: number;
    barcode: string;
    name: string;
    supplier?: SupplierDataType | null;
    wholesalePrice: number;
    retailPrice: number;
    stockLevel: number;
};

export type LoyaltyMemberDataType = {
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
    salary: number;
    user?: any | null;
};

export type BillingRecordDataType = {
    id?: number,
    product: ProductDataType;
    price?: number;
    quantity: number;
};

export type BillingDataType = {
    id?: number;
    billingRecords: BillingRecordDataType[];
    loyaltyMember: LoyaltyMemberDataType | null;
    pointsGranted: number;
    pointsRedeemed: number;
    total: number;
    paidAmount: number | undefined;
    createdAt?: String;
};
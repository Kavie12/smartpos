import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BillingDataType } from "../types/types";

type BillingContextType = {
    bill: BillingDataType;
    setBill: React.Dispatch<React.SetStateAction<BillingDataType>>;
    total: number;
    pointsGranted: number;
    calculateTotal: () => void;
    calculatePointsGranted: () => void;
    clearBill: () => void;
};

const BillingContext = createContext<BillingContextType | null>(null);

export const useBilling = () => {
    const billingContext = useContext(BillingContext);

    if (billingContext == null) {
        throw new Error("useBilling must be used within a BillingProvider.");
    }

    return billingContext;
};

export default function BillingProvider({ children }: { children: ReactNode }) {

    const [bill, setBill] = useState<BillingDataType>({
        billingRecords: [],
        loyaltyMember: null
    });
    const [total, setTotal] = useState<number>(0);
    const [pointsGranted, setPointsGranted] = useState<number>(0);

    const calculateTotal = (): void => {
        setTotal(
            bill.billingRecords.reduce((totalValue, item) => {
                return totalValue + item.product.retailPrice * item.quantity;
            }, 0)
        );
    };

    const calculatePointsGranted = (): void => {
        setPointsGranted(total / 1000);
    };

    const clearBill = (): void => {
        setBill({
            billingRecords: [],
            loyaltyMember: null
        });
    };

    useEffect(() => {
        calculateTotal();
    }, [bill]);

    useEffect(() => {
        calculatePointsGranted();
    }, [total]);

    return <BillingContext.Provider value={{ bill, setBill, total, pointsGranted, calculateTotal, calculatePointsGranted, clearBill }}>{children}</BillingContext.Provider>
}
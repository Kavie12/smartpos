import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BillingDataType } from "../types/types";

type BillingContextType = {
    bill: BillingDataType;
    setBill: React.Dispatch<React.SetStateAction<BillingDataType>>;
    redeemPoints: boolean;
    setRedeemPoints: React.Dispatch<React.SetStateAction<boolean>>;
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
        loyaltyMember: null,
        pointsGranted: 0,
        pointsRedeemed: 0,
        total: 0
    });
    const [redeemPoints, setRedeemPoints] = useState<boolean>(false);

    const clearBill = (): void => {
        setBill({
            billingRecords: [],
            loyaltyMember: null,
            pointsGranted: 0,
            pointsRedeemed: 0,
            total: 0
        });
    };

    useEffect(() => {
        // Calculate total
        const total = bill.billingRecords.reduce((totalValue, item) => {
            return totalValue + item.product.retailPrice * item.quantity;
        }, 0);

        setBill(prev => ({
            ...prev,
            total,
        }));
    }, [bill.billingRecords]);

    useEffect(() => {
        // Calculate points granted
        setBill(prev => ({
            ...prev,
            pointsGranted: prev.total / 1000
        }));
    }, [bill.total]);

    useEffect(() => {
        // Calculate points redeemed
        setBill(prev => {
            if (redeemPoints) {
                return {
                    ...prev,
                    pointsRedeemed: prev.loyaltyMember?.points || 0
                };
            } else {
                return {
                    ...prev,
                    pointsRedeemed: 0
                };
            }

        });
    }, [redeemPoints]);

    return <BillingContext.Provider value={{
        bill,
        setBill,
        redeemPoints,
        setRedeemPoints,
        clearBill
    }}>
        {children}
    </BillingContext.Provider>
}
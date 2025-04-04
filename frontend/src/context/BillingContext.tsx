import { createContext, ReactNode, useContext, useState } from "react";
import { BillingDataType } from "../types/types";

type BillingContextType = {
    bill: BillingDataType;
    setBill: React.Dispatch<React.SetStateAction<BillingDataType>>;
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
        billingRecords: []
    });

    const clearBill = (): void => {
        setBill({
            billingRecords: []
        });
    };

    return <BillingContext.Provider value={{ bill, setBill, clearBill }}>{children}</BillingContext.Provider>
}
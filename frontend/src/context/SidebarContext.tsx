import { createContext, ReactNode, useContext, useState } from "react";

type SidebarContextType = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebar = () => {
    const sidebarContext = useContext(SidebarContext);

    if (sidebarContext == null) {
        throw new Error("useSidebar must be used within a SidebarProvider.");
    }

    return sidebarContext;
};

export default function SidebarProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState<boolean>(false);

    return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>;
}
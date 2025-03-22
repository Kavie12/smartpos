import { Box, Button, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ChangeEvent } from "react";

type QuantityCounterProps = {
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
};

export default function QuantityCounter({ quantity, setQuantity }: QuantityCounterProps) {

    const handleQuantityIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleQuantityDecrement = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : prev);
    };

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, backgroundColor: grey[200], borderRadius: 1 }}>
            <Button variant="text" sx={{ minWidth: "auto" }} onClick={() => handleQuantityDecrement()}>-</Button>
            <TextField
                id="quantity"
                variant="standard"
                size="small"
                slotProps={{
                    input: {
                        disableUnderline: true,
                        style: {
                            width: 26
                        }
                    }
                }}
                sx={{
                    "& input": {
                        textAlign: "center"
                    }
                }}
                value={quantity}
                onChange={handleQuantityChange}
            />
            <Button variant="text" sx={{ minWidth: "auto" }} onClick={() => handleQuantityIncrement()}>+</Button>
        </Box>
    );
}
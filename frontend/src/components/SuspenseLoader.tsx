import { Box, CircularProgress } from "@mui/material";

function SuspenseLoader() {
    return (
        <Box
            sx={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress
                size={56}
                disableShrink
                thickness={3}
            />
        </Box>
    );
}

export default SuspenseLoader;
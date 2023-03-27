import { Box, CircularProgress } from "@mui/material";

export const Loading = () => {
	return (
		<Box sx={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "75vh"
		}}>
			<CircularProgress size={100} />
		</Box>
	);
}

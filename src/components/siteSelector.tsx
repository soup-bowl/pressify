import { Link, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppDialog } from "./dialog";

export function saveSite(input: string) {
	let history:string[] = JSON.parse(localStorage.getItem('URLHistory') ?? '[]');
	if (!(history.indexOf(input) > -1)) {
		history.push(input);

		if (history.length > 6) {
			history.shift();
		}

		localStorage.setItem('URLHistory', JSON.stringify(history));
	}
}

export function SiteSelector() {
	const navigate = useNavigate();

	let historic = JSON.parse(localStorage.getItem('URLHistory') ?? '[]').reverse();

	return(
		<Paper sx={{ padding: 2, my: 1, mx: 8 }}>
			{historic.length > 0 ?
				<>
				{historic.map((item:string, index:number) => (
					<Typography key={index} textAlign="left" my={1}>
						<Link onClick={() => navigate(`/${item}`)} sx={{ cursor: 'pointer' }}>{item}</Link>
					</Typography>
				))}
				</>
			: 
				<Typography textAlign="left" >No recent URLs.</Typography>
			}
		</Paper>
	);
}

interface SiteSelectorProps {
	open: boolean;
	onClose: () => void;
}

export function SiteSelectorDialog({open, onClose}:SiteSelectorProps) {
	const navigate = useNavigate();

	let historic = JSON.parse(localStorage.getItem('URLHistory') ?? '[]').reverse();

	function selectSite(site:string) {
		navigate(`/${site}`);
		onClose();
	}

	return(
		<AppDialog title="Select Site" open={open} onClose={onClose}>
			{historic.length > 0 ?
				<>
				{historic.map((item:string, index:number) => (
					<Typography key={index} textAlign="left" my={1}>
						<Link onClick={() => selectSite(item)} sx={{ cursor: 'pointer' }}>
							{item}
						</Link>
					</Typography>
				))}
				</>
			: 
				<Typography textAlign="left" >No recent URLs.</Typography>
			}
		</AppDialog>
	);
}

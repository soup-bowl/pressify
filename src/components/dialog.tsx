import { Dialog, DialogContent, DialogTitle, IconButton, styled } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
	
	padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));
  
interface DialogTitleProps {
	id: string;
	children?: React.ReactNode;
	onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
	const { children, onClose, ...other } = props;
  
	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
				aria-label="close"
				onClick={onClose}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
				>
				<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
}

interface AppDialogProps {
	children?: ReactNode;
	title: string;
	open: boolean;
	onClose: () => void;
}

export function AppDialog({children, title, open, onClose}:AppDialogProps) {
	return(
		<BootstrapDialog
			open={open}
			onClose={onClose}
			aria-labelledby="conn-modal-modal-title"
			aria-describedby="conn-modal-modal-description"
		>
			<BootstrapDialogTitle id="conn-modal-modal-title" onClose={onClose}>
				{title}
			</BootstrapDialogTitle>
			<DialogContent>
				{children}
			</DialogContent>
		</BootstrapDialog>
	);
}

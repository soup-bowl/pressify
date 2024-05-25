import { Dialog, DialogContent, DialogTitle, IconButton, styled } from "@mui/material"
import { ReactNode } from "react"

import CloseIcon from "@mui/icons-material/Close"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}))

interface DialogTitleProps {
	id: string
	children?: React.ReactNode
	onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
	const { children, onClose, ...other } = props

	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose && (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			)}
		</DialogTitle>
	)
}

interface AppDialogProps {
	children?: ReactNode
	title: string
	open: boolean
	onClose: () => void
	size?: "xs" | "sm" | "md" | "lg" | "xl"
}

export const AppDialog = ({ children, title, open, onClose, size }: AppDialogProps) => {
	const ariaGen = title.toLowerCase().replace(/ /g, "-")
	return (
		<BootstrapDialog
			open={open}
			onClose={onClose}
			fullWidth={true}
			maxWidth={size}
			aria-labelledby={`${ariaGen}-modal-title`}
			aria-describedby={`${ariaGen}-modal-description`}
		>
			<BootstrapDialogTitle id="conn-modal-modal-title" onClose={onClose}>
				{title}
			</BootstrapDialogTitle>
			<DialogContent>{children}</DialogContent>
		</BootstrapDialog>
	)
}

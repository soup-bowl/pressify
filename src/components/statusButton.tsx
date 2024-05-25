import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import { ESelectorState } from "@/enums"

interface Props {
	state: ESelectorState
}

export const ButtonStateAppearance = ({ state }: Props) => {
	switch (state) {
		default:
		case ESelectorState.Ready:
			return <></>
		case ESelectorState.Detecting:
			return (
				<Tooltip title="Detecting an open REST API...">
					<IconButton edge="end" disableRipple>
						<CircularProgress size={25} />
					</IconButton>
				</Tooltip>
			)
		case ESelectorState.Confirmed:
		case ESelectorState.Denied:
			return (
				<Tooltip title={state === ESelectorState.Confirmed ? "Detected WordPress API" : "No WordPress API found"}>
					<IconButton edge="end" disableRipple>
						{state === ESelectorState.Confirmed ? (
							<CheckIcon color="success" fontSize="inherit" />
						) : (
							<CloseIcon color="error" fontSize="inherit" />
						)}
					</IconButton>
				</Tooltip>
			)
	}
}

export default ButtonStateAppearance

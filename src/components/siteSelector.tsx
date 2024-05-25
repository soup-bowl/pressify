import {
	ButtonGroup,
	FormControl,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	List,
	ListItem,
	ListItemButton,
	OutlinedInput,
	Typography,
} from "@mui/material"
import { ChangeEvent, FormEventHandler, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppDialog } from "."
import { useLocalStorageJSON } from "@/localStore"

import { ESelectorState } from "@/enums"
import ButtonStateAppearance from "./statusButton"

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import StarIcon from "@mui/icons-material/Star"
import DeleteIcon from "@mui/icons-material/Delete"
import { WordPressApi } from "@/api"

const localStorageRefs = {
	history: "URLHistory",
	saved: "URLSaved",
}

interface SiteSelectorDialogProps {
	open: boolean
	onClose: () => void
	disableInput?: boolean
}

export const SiteSelectorDialog = ({ open, onClose }: SiteSelectorDialogProps) => {
	return (
		<AppDialog title="Select Site" open={open} onClose={onClose} size="md">
			<SiteSelector onClose={onClose} />
		</AppDialog>
	)
}

interface SiteSelectorProps {
	onClose?: () => void
	disableInput?: boolean
}

export const SiteSelector = ({ onClose = undefined }: SiteSelectorProps) => {
	const navigate = useNavigate()
	const [searchValue, setSearchValue] = useState<string>("")
	const [detectionState, setDetectionState] = useState<ESelectorState>(ESelectorState.Ready)
	const searchTimeout = useRef<NodeJS.Timeout | null>(null)

	const [historic, setHistoric] = useLocalStorageJSON<string[]>(localStorageRefs.history, [])
	const [saved, setSaved] = useLocalStorageJSON<string[]>(localStorageRefs.saved, [])

	const submitForm: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		if (searchValue !== undefined && searchValue !== "") {
			saveSiteToHistory(searchValue)
		}
		navigate(`/${searchValue}`)
		if (onClose !== undefined) {
			onClose()
		}
	}

	const changeForm = (event: ChangeEvent<HTMLInputElement>) => {
		// Thanks to https://stackoverflow.com/a/31941978.
		const parsedInput = event.target.value.match(/([^/,\s]+\.[^/,\s]+?)(?=\/|,|\s|$|\?|#)/g)
		setDetectionState(ESelectorState.Detecting)
		setSearchValue(parsedInput !== null ? parsedInput[0] : "")
	}

	useEffect(() => {
		if (searchValue !== "") {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current)
			}

			searchTimeout.current = setTimeout(() => {
				new WordPressApi({ endpoint: `https://${searchValue}/wp-json` })
					.fetchInfo()
					.then(() => setDetectionState(ESelectorState.Confirmed))
					.catch(() => setDetectionState(ESelectorState.Denied))
			}, 1000)
		}
	}, [searchValue])

	const saveSiteToHistory = (item: string) => {
		const updatedItems: string[] = [...historic.slice(-4), item]
		setHistoric(updatedItems)
	}

	const removeSiteFromHistory = (item: string) => {
		const filteredItems = historic.filter((i) => i !== item)
		setHistoric(filteredItems)
	}

	const saveSiteToSaved = (item: string) => {
		if (!saved.includes(item)) {
			setSaved([...saved, item])
		}
	}

	const removeSiteFromSaved = (item: string) => {
		const filteredItems = saved.filter((i) => i !== item)
		setSaved(filteredItems)
	}

	const selectSite = (site: string) => {
		navigate(`/${site}`)
		if (onClose !== undefined) {
			onClose()
		}
	}

	return (
		<>
			<form onSubmit={submitForm} noValidate>
				<FormControl sx={{ width: "100%", marginTop: 1 }} variant="outlined">
					<InputLabel htmlFor="url">URL</InputLabel>
					<OutlinedInput
						fullWidth
						id="url"
						type="url"
						label="URL"
						onChange={changeForm}
						endAdornment={
							<InputAdornment position="end">
								<ButtonStateAppearance state={detectionState} />
								<IconButton aria-label="submit" edge="end" type="submit">
									<ArrowForwardIosIcon />
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
			</form>
			<Grid container sx={{ paddingTop: 2 }}>
				<Grid item xs={12} sm={6} sx={{ padding: 2 }}>
					<Typography variant="h5" component="h2">
						History
					</Typography>
					{historic.length > 0 ? (
						<List component="nav">
							{historic.reverse().map((item: string, index: number) => (
								<ListItem
									key={index}
									disablePadding
									secondaryAction={
										<ButtonGroup>
											<IconButton onClick={() => removeSiteFromHistory(item)}>
												<DeleteIcon />
											</IconButton>
											<IconButton onClick={() => saveSiteToSaved(item)}>
												<StarIcon />
											</IconButton>
										</ButtonGroup>
									}
								>
									<ListItemButton onClick={() => selectSite(item)}>
										<Typography variant="inherit" noWrap>
											{item}
										</Typography>
									</ListItemButton>
								</ListItem>
							))}
						</List>
					) : (
						<Typography my={2} color="text.secondary">
							No recent URLs.
						</Typography>
					)}
				</Grid>
				<Grid item xs={12} sm={6} sx={{ padding: 2 }}>
					<Typography variant="h5" component="h2">
						Saved
					</Typography>
					{saved.length > 0 ? (
						<List component="nav">
							{saved.reverse().map((item: string, index: number) => (
								<ListItem
									key={index}
									disablePadding
									secondaryAction={
										<IconButton onClick={() => removeSiteFromSaved(item)}>
											<DeleteIcon />
										</IconButton>
									}
								>
									<ListItemButton onClick={() => selectSite(item)}>
										<Typography variant="inherit" noWrap>
											{item}
										</Typography>
									</ListItemButton>
								</ListItem>
							))}
						</List>
					) : (
						<Typography my={2} color="text.secondary">
							No saved URLs.
						</Typography>
					)}
				</Grid>
			</Grid>
		</>
	)
}

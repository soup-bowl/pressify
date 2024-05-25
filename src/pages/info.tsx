import { Box, Button, Chip, IconButton, Link, Stack, Typography, styled } from "@mui/material"
import { useEffect, useState } from "react"
import { IStorage } from "@/api"

import FileCopyIcon from "@mui/icons-material/FileCopy"
import GitHubIcon from "@mui/icons-material/GitHub"
import CachedIcon from "@mui/icons-material/Cached"

const WalletDisplay = styled(Typography)({
	fontFamily: "monospace",
	color: "#ffffff",
	backgroundColor: "#121212",
	padding: 2,
	borderRadius: 5,
	borderStyle: "solid",
	borderWidth: 1,
	borderColor: "#515151",
})

// https://stackoverflow.com/a/35696506
const formatBytes = (bytes: number, decimals: number = 2) => {
	if (bytes === 0) return "0 Bytes"

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export const AboutPage = () => {
	const siteTitle = "About"

	const [storageInfo, setStorageInfo] = useState<IStorage>({} as IStorage)

	const wallets = [
		{ key: "btc", wallet: "3CFhcK1mazPDEiX8FLEhEQhQ9ARYFMCkqf" },
		{ key: "eth", wallet: "0x74C34F52593aF941BEea187203153Ec065321001" },
	]

	useEffect(() => {
		document.title = `${siteTitle} - Pressify`
	})

	useEffect(() => {
		if ("storage" in navigator && "estimate" in navigator.storage) {
			navigator.storage.estimate().then(({ usage, quota }) => setStorageInfo({ usage: usage ?? 0, quota: quota ?? 0 }))
		}
	}, [])

	return (
		<Box textAlign="center">
			<img
				src="/logo-mask-512.png"
				alt=""
				style={{
					borderRadius: "100%",
					maxWidth: 150,
				}}
			/>
			<Typography variant="h1" my={2}>
				WordPress App Generator
			</Typography>
			<Typography my={2}>
				Developed by{" "}
				<Link style={{ fontWeight: "bold" }} href="https://soupbowl.io">
					soup-bowl
				</Link>{" "}
				and hosted on{" "}
				<Link style={{ fontWeight: "bold" }} href="https://pages.cloudflare.com/">
					Cloudflare Pages
				</Link>
				.
			</Typography>
			<Stack my={2}>
				<Typography>
					App Version:{" "}
					<Box component="span" fontWeight="700">
						{process.env.REACT_APP_VERSION?.replace(/"/g, "")}
					</Box>
					&nbsp;
					<Chip label="Beta" color="info" size="small" />
				</Typography>

				{storageInfo.quota !== undefined && storageInfo.quota !== 0 ? (
					<Typography>
						Using{" "}
						<Box component="span" fontWeight="700">
							{formatBytes(storageInfo.usage)}
						</Box>{" "}
						of&nbsp;
						<Box component="span" fontWeight="700">
							{formatBytes(storageInfo.quota)}
						</Box>{" "}
						available local storage.
					</Typography>
				) : (
					<Typography color="darkgrey">Storage API is not supported.</Typography>
				)}
			</Stack>
			<Stack my={2} spacing={2} direction="row" justifyContent="center">
				<Button onClick={() => window.location.reload()} variant="outlined" color="error">
					<CachedIcon />
					&nbsp;Reload
				</Button>
				<Button href="https://github.com/soup-bowl/pressify" variant="outlined">
					<GitHubIcon />
					&nbsp;Source Code
				</Button>
			</Stack>
			<Typography variant="h1" my={2}>
				Donate
			</Typography>
			{wallets.map((wallet) => (
				<Box>
					<Typography variant="h3" sx={{ marginTop: 2 }}>
						{wallet.key.toUpperCase()} Address
					</Typography>
					<Stack direction="row" justifyContent="center" alignItems="center">
						<WalletDisplay>{wallet.wallet}</WalletDisplay>
						<IconButton
							onClick={() => {
								navigator.clipboard.writeText(wallet.wallet)
							}}
						>
							<FileCopyIcon />
						</IconButton>
					</Stack>
				</Box>
			))}
		</Box>
	)
}

export default AboutPage

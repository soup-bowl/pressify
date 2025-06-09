import { gridOutline, listOutline } from "ionicons/icons"

export const degubbins = (input: string) => {
	return input
		.replace(/<[^>]*>?/gm, "")
		.replace(/&hellip;/g, "...")
		.replace(/&#\d{1,5};/g, (x) => String.fromCharCode(parseInt(x.substring(2, x.length - 1))))
}

export const getLayoutIcon = (item: string) => {
	switch (item) {
		case "list":
			return listOutline
		case "grid":
		default:
			return gridOutline
	}
}

import { gridOutline, listOutline } from "ionicons/icons"

export const degubbins = (input: string) => {
	return input
		.replace(/<[^>]*>?/gm, "")
		.replace(/&hellip;/g, "...")
		.replace(/&#[0-9]{1,5};/g, (x) => String.fromCharCode(parseInt(x.substring(2, x.length - 1))))
}

export const getLayoutIcon = (item: string) => {
	switch (item) {
		default:
		case "grid":
			return gridOutline
		case "list":
			return listOutline
	}
}

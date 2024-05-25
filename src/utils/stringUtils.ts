export const degubbins = (input: string) => {
	return input
		.replace(/<[^>]*>?/gm, "")
		.replace(/&hellip;/g, "...")
		.replace(/&#[0-9]{1,5};/g, (x) => String.fromCharCode(parseInt(x.substring(2, x.length - 1))))
}

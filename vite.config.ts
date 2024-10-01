import legacy from "@vitejs/plugin-legacy"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import { version } from "./package.json"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		legacy(),
		VitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: false,
			},
			workbox: {
				cleanupOutdatedCaches: true,
			},
		}),
	],
	define: {
		"process.env": {
			REACT_APP_VERSION: JSON.stringify(version),
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
})

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import { version } from './package.json';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
			manifest: {
				"short_name": "Pressify",
				"name": "Pressify",
				"description": "Turns a WordPress blog into a mobile app.",
				"categories": ["productivity"],
				"icons": [
					{
						"src": "logo-144.png",
						"type": "image/png",
						"sizes": "144x144",
						"purpose": "any"
					},
					{
						"src": "logo-mask-192.png",
						"type": "image/png",
						"sizes": "192x192",
						"purpose": "maskable"
					},
					{
						"src": "logo-mask-512.png",
						"type": "image/png",
						"sizes": "512x512",
						"purpose": "maskable"
					},
					{
						"src": "logo-mask-1024.png",
						"type": "image/png",
						"sizes": "1024x1024",
						"purpose": "maskable"
					}
				],
				"start_url": ".",
				"display": "standalone",
				"theme_color": "#121212",
				"background_color": "#121212"
			},
		})
	],
	server: {
		host: true,
		port: 3000
	},
	define: {
		'process.env': {
			REACT_APP_VERSION: JSON.stringify(version),
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
})

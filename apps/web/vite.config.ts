import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		tailwindcss(),
		TanStackRouterVite({}),
		react(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "truyGoc",
				short_name: "truyGoc",
				description: "truyGoc - PWA Application",
				theme_color: "#0c0c0c",
			},
			pwaAssets: {
				disabled: false,
				config: true,
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});

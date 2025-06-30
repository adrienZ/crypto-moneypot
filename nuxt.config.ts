// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@nuxt/devtools", "./app/modules/drizzle-studio"],
	future: {
		compatibilityVersion: 4,
	},
	imports: {
		// disable auto-import
		autoImport: false,
	},
	components: {
		// disable auto-import
		dirs: [],
	},
	typescript: {
		typeCheck: true,
	},
	nitro: {
		experimental: {
			openAPI: true,
		},
	},
});

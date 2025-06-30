// https://github.com/atinux/nuxthub-better-auth/blob/main/app/plugins/auth.server.ts
import { defineNuxtPlugin, useRequestEvent } from "#imports";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin({
	name: "better-auth-fetch-plugin",
	enforce: "pre",
	async setup(nuxtApp) {
		// Flag if request is cached
		nuxtApp.payload.isCached = Boolean(useRequestEvent()?.context.cache);
		if (
			nuxtApp.payload.serverRendered &&
			!nuxtApp.payload.prerenderedAt &&
			!nuxtApp.payload.isCached
		) {
			await useAuth().fetchSession();
		}
	},
});

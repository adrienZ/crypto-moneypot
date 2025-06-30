// https://github.com/atinux/nuxthub-better-auth/blob/main/app/plugins/auth.client.ts
import { defineNuxtPlugin } from "#imports";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
	if (!nuxtApp.payload.serverRendered) {
		await useAuth().fetchSession();
	} else if (
		Boolean(nuxtApp.payload.prerenderedAt) ||
		Boolean(nuxtApp.payload.isCached)
	) {
		// To avoid hydration mismatch
		nuxtApp.hook("app:mounted", async () => {
			await useAuth().fetchSession();
		});
	}
});

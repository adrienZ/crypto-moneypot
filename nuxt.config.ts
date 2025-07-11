// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "./app/modules/drizzle-studio",
    "@nuxt/devtools",
    "@nuxt/image",
    "@nuxtjs/i18n",
  ],
  css: [`~/assets/style/main.css`],
  future: {
    compatibilityVersion: 4,
  },
  imports: {
    // disable auto-import
    autoImport: false,
    scan: false,
  },
  components: {
    // disable auto-import
    dirs: [],
  },
  experimental: {
    typedPages: true,
  },
  typescript: {
    typeCheck: true,
  },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' }
    ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en'
    }
  },
});

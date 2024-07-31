import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-31",
  modules: ["@primevue/nuxt-module", "@prisma/nuxt", "@nuxtjs/tailwindcss"],
  css: ["~/assets/main.css"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});

import Aura from "@primevue/themes/aura";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devServer: { port: 4000 },
  devtools: { enabled: true },
  compatibilityDate: "2024-07-31",
  modules: [
    "nuxt-file-storage",
    "@primevue/nuxt-module",
    "@prisma/nuxt",
    "@nuxtjs/tailwindcss",
  ],
  css: ["~/assets/main.css"],
  fileStorage: {
    mount: process.env.FILE_STORAGE_MOUNT,
  },
  prisma: {
    installStudio: false,
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // '* * * * *': ['echo']
    },
  },
});

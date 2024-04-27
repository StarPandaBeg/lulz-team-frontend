import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
    postgresConnectionUrl: process.env.POSTGRES_URL,
    parserBaseUrl: process.env.PARSER_BASE_URL,
  },
  routeRules: {
    "/api/parser/qr": { proxy: `${process.env.PARSER_QR_BASE_URL}/qr` },
    "/api/parser/add_new_komandirovaniy": {
      proxy: `${process.env.PARSER_TABLE_BASE_URL}/add_new_komandirovaniy`,
    },
  },
});

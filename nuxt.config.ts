import { defineNuxtConfig } from "nuxt/config";
import glsl from "vite-plugin-glsl";
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  ssr: false,
  srcDir: "src/",

  modules: ["@vueuse/nuxt", "@pinia/nuxt", "@tresjs/nuxt"],

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "sass:math" \n',
          charset: false,
        },
      },
    },

    plugins: [glsl(), svgLoader({ svgo: false })],
  },
});

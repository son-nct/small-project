// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  imports: {
    autoImport: false
  },
  // configure meta
  app: {
    head: {
      title: 'Namada - stakepool',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Namada - stakepool',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      // link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    },
  },
  // configure tailwind and css
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['~/assets/css/main.scss'],
  // configure nitro server and compress static files
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
    },
  },
  // configure build module
  modules: [
    '@nuxtjs/google-fonts',
    'nuxt-icon',
    // 'shadcn-nuxt'
  ],
  // shadcn: {
  //   /**
  //    * Prefix for all the imported component
  //    */
  //   prefix: '',
  //   /**
  //    * Directory that the component lives in.
  //    * @default "./components/ui"
  //    */
  //   componentDir: './components/ui'
  // },
  googleFonts: {
    // Options
    display: 'swap',
    prefetch: false,
    preconnect: false,
    preload: true,
    download: true,
    base64: false,
    families: {
      Arimo: true,
    },
  },
})
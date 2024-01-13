export default {
  title: import.meta.env.VITE_HEAD_SITE_TITLE,
  titleTemplate: '%s',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content:
        'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, viewport-fit=cover',
    },

    {
      name: 'theme-color',
      content: '#101010',
    },
    {
      hid: 'description',
      name: 'description',
      content: import.meta.env.VITE_HEAD_SITE_DESCRIPTION,
    },

    // Twitter
    // Test on: https://cards-dev.twitter.com/validator
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:site',
      name: 'twitter:site',
      content: import.meta.env.VITE_HEAD_TWITTER_HANDLE,
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: import.meta.env.VITE_SITE_URL,
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: import.meta.env.VITE_HEAD_SHARE_TITLE,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: import.meta.env.VITE_HEAD_SHARE_DESCRIPTION,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: `${import.meta.env.VITE_SITE_URL}/twitter-share.jpg`,
    },

    // Open Graph
    // Test on: https://developers.facebook.com/tools/debug/
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: import.meta.env.VITE_HEAD_SHARE_DESCRIPTION,
    },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    {
      hid: 'og:url',
      property: 'og:url',
      content: import.meta.env.VITE_SITE_URL,
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: import.meta.env.VITE_HEAD_SHARE_TITLE,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: import.meta.env.VITE_HEAD_SHARE_DESCRIPTION,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: `${import.meta.env.VITE_SITE_URL}/fb-share.jpg`,
    },
    {
      hid: 'og:image:secure_url',
      property: 'og:image:secure_url',
      content: `${import.meta.env.VITE_SITE_URL}/fb-share.jpg`,
    },
    {
      hid: 'og:image:alt',
      property: 'og:image:alt',
      content: import.meta.env.VITE_HEAD_SHARE_TITLE,
    },
  ],
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: import.meta.env.VITE_SITE_URL,
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: 'favicon.png',
    },
    {
      rel: 'apple-touch-icon',
      href: 'favicon.png',
    },
    { rel: 'stylesheet', type: 'text/css', href: '/css/head.css' },
  ],
}

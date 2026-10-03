// @ts-check
import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://DEETSIUS-Web', 
  integrations: [db()],
  adapter: vercel(),
  security: {
    checkOrigin: false,
  },
  server: {
    host: true,
  },
  vite: {
    server: {
      allowedHosts: [
        '.trycloudflare.com',
        'rants-density-frostily.ngrok-free.dev'
      ]
    }
  }
});
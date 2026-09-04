import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The deployed origin, matching public/CNAME. Hardcoded rather than read
  // from an env var so canonical URLs, og:image URLs and the sitemap are
  // emitted by every build, including CI's.
  site: 'https://poker.ottercrew.group',
  integrations: [mdx(), sitemap()],
  vite: {
    css: { modules: { localsConvention: 'camelCaseOnly' } },
  },
});

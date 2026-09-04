// JSON-LD emitted by BaseLayout. The nodes are wired together by @id so a
// crawler reads one graph per page rather than unrelated snippets: every page
// points at #website, which points at #organization.
import { site } from './site';

const ORIGIN = site.url;
export const id = (fragment: string) => `${ORIGIN}/#${fragment}`;

export const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': id('organization'),
  name: 'Otter Crew',
  url: `${ORIGIN}/`,
  logo: `${ORIGIN}/apple-touch-icon.png`,
};

export const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': id('website'),
  name: site.name,
  url: `${ORIGIN}/`,
  description: site.description,
  publisher: { '@id': id('organization') },
  inLanguage: 'en',
};

// The app is free to download and play with; packs are separate one-time
// purchases, so no price is claimed for them here. It has not shipped, so
// there is no release date, version or rating to state.
export const application = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': id('application'),
  name: site.name,
  applicationCategory: 'GameApplication',
  operatingSystem: 'iPadOS, macOS, Android',
  description: site.description,
  url: `${ORIGIN}/`,
  publisher: { '@id': id('organization') },
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/PreOrder',
  },
};

/** BreadcrumbList for a nested page, given [label, path] pairs from Home. */
export const breadcrumb = (trail: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: ([['Home', '/'], ...trail] as [string, string][]).map(
    ([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      // Trailing slash so the item matches the page's own canonical URL.
      item: `${ORIGIN}${path}${path.endsWith('/') ? '' : '/'}`,
    }),
  ),
});

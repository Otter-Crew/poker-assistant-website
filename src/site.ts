export const site = {
  name: 'Poker Assistant',
  fullName: "Otter Crew's Poker Assistant",
  description:
    'Free GTO study app. The complete heads-up preflop set is included, packs for 3 to 9 handed are bought once, and your hand histories never leave your device.',
  url: import.meta.env['PUBLIC_SITE_URL'] || undefined,
  nav: [
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Learn', href: '/learn' },
  ],
  footerNav: [
    { label: 'Learn', href: '/learn' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Accuracy', href: '/accuracy' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy', href: '/privacy' },
  ],
} as const;

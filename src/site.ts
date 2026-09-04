export const site = {
  name: 'Poker Assistant',
  fullName: "Otter Crew's Poker Assistant",
  description:
    'Free forever heads-up GTO, local hand analysis and one-time packs for bigger games. No account. No uploads. No subscription.',
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

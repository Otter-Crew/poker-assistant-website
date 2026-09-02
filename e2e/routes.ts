export interface Route {
  path: string;
  title: string;
  heading: string;
}

const site = 'Poker Assistant';
const t = (title: string) => `${title} | ${site}`;

export const routes: Route[] = [
  { path: '/', title: site, heading: 'GTO study that stays on your machine.' },
  {
    path: '/how-it-works',
    title: t('How it works'),
    heading: 'One study session, start to finish',
  },
  {
    path: '/solutions',
    title: t("What's free and what packs add"),
    heading: "What's free, and what a pack adds",
  },
  {
    path: '/accuracy',
    title: t('Accuracy'),
    heading: 'How accurate the solutions are',
  },
  {
    path: '/faq',
    title: t('FAQ'),
    heading: 'Questions a player asks before buying',
  },
  {
    path: '/learn',
    title: t('Learn'),
    heading: 'Pick what you want to work on.',
  },
  { path: '/learn/start-here', title: t('Start here'), heading: 'Start here' },
  {
    path: '/learn/load-solutions-and-packs',
    title: t('Load a solution'),
    heading: 'Load a solution',
  },
  {
    path: '/learn/study-a-solution',
    title: t('Study a solution'),
    heading: 'Study a solution',
  },
  {
    path: '/learn/practice-decisions',
    title: t('Practice decisions'),
    heading: 'Practice decisions',
  },
  {
    path: '/learn/analyze-hands',
    title: t('Analyze your hands'),
    heading: 'Analyze your hands',
  },
  {
    path: '/learn/node-locking',
    title: t('Exploit a mistake with node locking'),
    heading: 'Exploit a mistake with node locking',
  },
  {
    path: '/learn/build-a-solution',
    title: t('Build your own preflop solution'),
    heading: 'Build your own preflop solution',
  },
  {
    path: '/learn/what-a-frequency-means',
    title: t('What a frequency means'),
    heading: 'What a frequency means',
  },
  {
    path: '/learn/stack-depth-changes-everything',
    title: t('Stack depth changes everything'),
    heading: 'Stack depth changes everything',
  },
  {
    path: '/learn/ante-rake-and-straddle',
    title: t('Ante, rake and straddle'),
    heading: 'Ante, rake and straddle',
  },
  {
    path: '/privacy',
    title: t('Privacy'),
    heading: 'Kept between you and the app.',
  },
];

export const productLessons = [
  'Start here',
  'Load a solution',
  'Study a solution',
  'Practice decisions',
  'Analyze your hands',
  'Exploit a mistake with node locking',
  'Build your own preflop solution',
];

export const conceptLessons = [
  'What a frequency means',
  'Stack depth changes everything',
  'Ante, rake and straddle',
];

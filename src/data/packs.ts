import type { PackRow } from '../components/CoverageTable.types';

// Transcribed from ../poker-assistant/mise-tasks/rsp/solve-pack (PACK_NAME /
// PACK_DESC). ICM packs are deliberately absent. Status reflects the shipped
// preflop_packs on 2026-09-01: six packs complete, 7-handed mid-solve.
// `label` is the PACK_NAME suffix verbatim ("3-5 Handed"); `players` is the
// table column in the site's own casing.
const deep = (label: string, players: string): PackRow[] => [
  {
    name: `Deepstack (${label})`,
    players,
    stacks: '150bb and 200bb',
    structure: 'No ante',
    offer: 'Pack',
    status: 'Planned',
  },
  {
    name: `Deepstack Ante (${label})`,
    players,
    stacks: '150bb and 200bb',
    structure: '0.125bb and 0.5bb ante',
    offer: 'Pack',
    status: 'Planned',
  },
  {
    name: `Deepstack Rake (${label})`,
    players,
    stacks: '150bb and 200bb',
    structure: '5% rake capped at 3bb',
    offer: 'Pack',
    status: 'Planned',
  },
  {
    name: `Deepstack Straddle (${label})`,
    players,
    stacks: '150bb and 200bb',
    structure: '2bb straddle',
    offer: 'Pack',
    status: 'Planned',
  },
];

export const packs: PackRow[] = [
  {
    name: 'Heads-Up',
    players: '2-handed',
    stacks: '8bb-200bb',
    structure: 'No ante, ante, rake and straddle',
    offer: 'Free',
    status: 'Available',
  },
  {
    name: 'Core',
    players: '3-6 handed',
    stacks: '15bb-100bb',
    structure: 'No ante',
    offer: 'Pack',
    status: 'Available',
  },
  {
    name: 'Core Ante',
    players: '3-6 handed',
    stacks: '15bb-25bb',
    structure: '0.125bb and 0.5bb ante',
    offer: 'Pack',
    status: 'Available',
  },
  {
    name: 'Core Rake',
    players: '3-6 handed',
    stacks: '60bb and 100bb',
    structure: '5% rake capped at 3bb',
    offer: 'Pack',
    status: 'Available',
  },
  {
    name: 'Core Straddle',
    players: '3-6 handed',
    stacks: '100bb',
    structure: '2bb straddle',
    offer: 'Pack',
    status: 'Available',
  },
  {
    name: 'Push/Fold',
    players: '3-9 handed',
    stacks: '8bb-12bb',
    structure: 'No ante',
    offer: 'Pack',
    status: 'Available',
  },
  {
    name: '7-Handed Ring',
    players: '7-handed',
    stacks: '15bb-100bb',
    structure: 'No ante',
    offer: 'Pack',
    status: 'In progress',
  },
  {
    name: '8-Handed Ring',
    players: '8-handed',
    stacks: '15bb-100bb',
    structure: 'No ante',
    offer: 'Pack',
    status: 'Planned',
  },
  {
    name: '9-Handed Ring',
    players: '9-handed',
    stacks: '15bb-40bb',
    structure: 'No ante',
    offer: 'Pack',
    status: 'Planned',
  },
  {
    name: '9-Handed Ring (Deep)',
    players: '9-handed',
    stacks: '60bb-100bb',
    structure: 'No ante',
    offer: 'Pack',
    status: 'Planned',
    platforms: 'iPadOS and macOS',
  },
  ...deep('3-5 Handed', '3-5 handed'),
  ...deep('6 Handed', '6-handed'),
  ...deep('7 Handed', '7-handed'),
  ...deep('8 Handed', '8-handed'),
  ...deep('9 Handed', '9-handed'),
];

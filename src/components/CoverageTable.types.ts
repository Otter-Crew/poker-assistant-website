export interface PackRow {
  name: string;
  players: string;
  stacks: string;
  structure: string;
  offer: 'Free' | 'Pack';
  status: 'Available' | 'In progress' | 'Planned';
  platforms?: string;
}

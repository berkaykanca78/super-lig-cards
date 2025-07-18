export interface Position {
  x: number;
  y: number;
  role: string;
  allowedRoles: string[];
}

export interface Formation {
  positions: Position[];
}

export interface Formations {
  [key: string]: Formation;
}

export interface PlayerStats {
  [key: string]: number;
}

export interface Nationality {
  name: string;
  code: string;
  flag: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  rating: number;
  ratingPosition: string;
  image: string;
  stats: PlayerStats;
  nationality: Nationality;
  age: number;
  number: number;
  isCaptain?: boolean;
  teamName?: string;
}

export interface Manager {
  id: string;
  name: string;
  position: string;
  rating: number;
  ratingPosition: string;
  image: string;
  stats: {
    tactic: number;
    motivation: number;
    leadership: number;
  };
  nationality: Nationality;
  age: number;
  number?: number; // Optional for managers
  teamName?: string;
}

export interface TeamData {
  cardTeamName: string;
  players: Player[];
  manager?: Manager;
}

export interface DropdownItem {
  value: string;
  name: string;
}

export interface DropdownData {
  teams: DropdownItem[];
  positions: DropdownItem[];
  formations: DropdownItem[];
} 
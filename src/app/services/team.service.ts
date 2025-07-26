import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Player {
  name: string;
  position: string;
  rating: number;
  ratingPosition: string;
  number?: number;
  age: number;
  image: string;
  isCaptain?: boolean;
  stats: { [key: string]: number };
  nationality: {
    name: string;
    code: string;
    flag: string;
  };
  team?: string;
  cardTeamName?: string;
}

interface Manager {
  name: string;
  position: string;
  rating: number;
  ratingPosition: string;
  age: number;
  image: string;
  stats: {
    tactic: number;
    motivation: number;
    leadership: number;
  };
  nationality: {
    name: string;
    code: string;
    flag: string;
  };
  team?: string;
  cardTeamName?: string;
}

interface TeamData {
  name: string;
  logo: string;
  season: string;
  cardTeamName: string;
  players: Player[];
  manager?: Manager;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private selectedTeamSubject = new BehaviorSubject<string>('galatasaray');
  selectedTeam$ = this.selectedTeamSubject.asObservable();

  selectTeam(teamId: string) {
    console.log('TeamService: Selecting team:', teamId);
    this.selectedTeamSubject.next(teamId);
    console.log('TeamService: Current team is now:', this.selectedTeamSubject.value);
  }

  getCurrentTeam(): string {
    return this.selectedTeamSubject.value;
  }

  async getTeamData(teamName: string): Promise<TeamData> {
    try {
      const response = await fetch(`/data/${teamName}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading team data:', error);
      throw error;
    }
  }
} 
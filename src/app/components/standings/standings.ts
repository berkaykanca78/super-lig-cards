import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingsService, TeamStanding } from '../../services/standings.service';

@Component({
  selector: 'app-standings',
  imports: [CommonModule],
  templateUrl: './standings.html',
  styleUrl: './standings.scss'
})
export class Standings implements OnInit {
  standings: TeamStanding[] = [];
  loading = true;
  error = false;
  activeFilter = 'all';

  constructor(private standingsService: StandingsService) { }

  ngOnInit() {
    this.loadStandings();
  }

  async loadStandings() {
    this.loading = true;
    this.error = false;
    try {
      const data = await this.standingsService.getStandings();
      this.standings = data;
      this.loading = false;
    } catch (error) {
      console.error('Error loading standings:', error);
      this.error = true;
      this.loading = false;
    }
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  getFilteredStandings(): TeamStanding[] {
    if (this.activeFilter === 'all') {
      return this.standings;
    }

    // Filter based on position ranges
    switch (this.activeFilter) {
      case 'champions':
        return this.standings.filter(team => team.position <= 2);
      case 'europa':
        return this.standings.filter(team => team.position >= 3 && team.position <= 4);
      case 'conference':
        return this.standings.filter(team => team.position === 5);
      case 'relegation':
        return this.standings.filter(team => team.position >= 16);
      default:
        return this.standings;
    }
  }

  getTeamClass(team: TeamStanding): string {
    if (team.position <= 2) return 'champions';
    if (team.position >= 3 && team.position <= 4) return 'europa';
    if (team.position === 5) return 'conference';
    if (team.position >= 16) return 'relegation';
    return '';
  }

  getFormClass(result: string): string {
    switch (result) {
      case 'W': return 'win';
      case 'D': return 'draw';
      case 'L': return 'loss';
      case '-': return 'no-match';
      default: return '';
    }
  }

  getCurrentDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('tr-TR', options);
  }

  getTotalMatches(): string {
    if (this.standings.length === 0) return '0/0';
    const totalTeams = this.standings.length;
    const matchesPerTeam = this.standings[0]?.played || 0;
    const totalMatches = (totalTeams * (totalTeams - 1)) / 2;
    return `${matchesPerTeam * totalTeams}/${totalMatches}`;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Interfaces
interface Team {
  id: string;
  name: string;
  logo: string;
  stadium: string;
}

interface Match {
  week: number;
  matchNumber: number;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  time: string;
  stadium: string;
}

interface FixtureData {
  season: string;
  league: string;
  totalWeeks: number;
  totalMatches: number;
  fixtures: Array<{
    week: number;
    matches: Array<{
      home: string;
      away: string;
    }>;
  }>;
}

interface TeamsData {
  teams: Team[];
}

@Component({
  selector: 'app-fixtures',
  imports: [CommonModule],
  templateUrl: './fixtures.html',
  styleUrl: './fixtures.scss'
})
export class Fixtures implements OnInit, OnDestroy {
  // Component properties
  teams: Team[] = [];
  currentWeek = 1;
  totalWeeks = 34;
  fixtureData: Match[][] = [];
  selectedTeam: Team | null = null;
  isLoading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTeamsAndGenerateFixture();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // Load teams from JSON and generate fixture
  async loadTeamsAndGenerateFixture(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = '';

      // Load teams data
      const teamsData = await this.http.get<TeamsData>('/data/teams.json').toPromise();
      if (teamsData) {
        this.teams = teamsData.teams;
      }

      // Load fixtures data
      const fixturesData = await this.http.get<FixtureData>('/data/fixtures.json').toPromise();
      if (fixturesData) {
        // Generate fixture data from JSON
        this.fixtureData = this.generateFixtureFromJSON(fixturesData);
      }

      // Initialize the page
      this.showWeek(1);
      this.isLoading = false;

    } catch (error) {
      console.error('Error loading data:', error);
      this.error = 'Veriler yüklenirken hata oluştu.';
      this.isLoading = false;
    }
  }

  // Generate fixture data from JSON
  generateFixtureFromJSON(fixturesData: FixtureData): Match[][] {
    const fixture: Match[][] = [];
    
    // Process each week from JSON
    fixturesData.fixtures.forEach(weekData => {
      const weekMatches: Match[] = [];
      
      // Process each match in the week
      weekData.matches.forEach((match, matchIndex) => {
        // Find home and away teams from teams array
        const homeTeam = this.teams.find(team => team.name === match.home);
        const awayTeam = this.teams.find(team => team.name === match.away);
        
        if (homeTeam && awayTeam) {
          // Generate random date for the week
          const weekStartDate = new Date(2025, 7, 18); // August 18, 2025
          const matchDate = new Date(weekStartDate);
          matchDate.setDate(weekStartDate.getDate() + (weekData.week - 1) * 7 + Math.floor(Math.random() * 7));
          
          // Create match object
          weekMatches.push({
            week: weekData.week,
            matchNumber: matchIndex + 1,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            date: matchDate,
            time: `${Math.floor(Math.random() * 3) + 19}:${Math.random() > 0.5 ? '00' : '30'}`,
            stadium: homeTeam.stadium
          });
        }
      });
      
      fixture.push(weekMatches);
    });
    
    return fixture;
  }

  // Show matches for a specific week
  showWeek(week: number): void {
    this.currentWeek = week;
  }

  // Get matches for current week
  getCurrentWeekMatches(): Match[] {
    if (this.fixtureData.length === 0 || this.currentWeek > this.fixtureData.length) {
      return [];
    }
    return this.fixtureData[this.currentWeek - 1] || [];
  }

  // Get filtered matches for selected team
  getFilteredMatches(): Match[] {
    const matches = this.getCurrentWeekMatches();
    
    if (!this.selectedTeam) {
      return matches;
    }

    return matches.filter(match => 
      match.homeTeam.id === this.selectedTeam!.id || match.awayTeam.id === this.selectedTeam!.id
    );
  }

  // Select team
  selectTeam(team: Team): void {
    this.selectedTeam = team;
  }

  // Clear team selection
  clearTeamSelection(): void {
    this.selectedTeam = null;
  }

  // Check if team is selected
  isTeamSelected(team: Team): boolean {
    return this.selectedTeam?.id === team.id;
  }

  // Check if match team is selected
  isMatchTeamSelected(team: Team): boolean {
    return this.selectedTeam?.id === team.id;
  }

  // Navigation methods
  previousWeek(): void {
    if (this.currentWeek > 1) {
      this.showWeek(this.currentWeek - 1);
    }
  }

  nextWeek(): void {
    if (this.currentWeek < this.totalWeeks) {
      this.showWeek(this.currentWeek + 1);
    }
  }

  // Check if navigation buttons should be disabled
  isPreviousWeekDisabled(): boolean {
    return this.currentWeek === 1;
  }

  isNextWeekDisabled(): boolean {
    return this.currentWeek === this.totalWeeks;
  }

  // Generate week numbers for selector
  getWeekNumbers(): number[] {
    return Array.from({ length: this.totalWeeks }, (_, i) => i + 1);
  }

  // Format date for display
  formatDate(date: Date): string {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get no matches message
  getNoMatchesMessage(): string {
    if (this.selectedTeam) {
      return `${this.selectedTeam.name} için bu hafta maç bulunamadı.`;
    }
    return 'Bu hafta için maç bulunamadı.';
  }

  // Mobile menu functionality
  toggleMobileMenu(): void {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active');
    }
  }
}

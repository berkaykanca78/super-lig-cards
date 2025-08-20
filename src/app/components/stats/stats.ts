import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Player {
  id: number;
  playerName: string;
  club: string;
  position: string;
  matches: number;
  goals: number;
  assists: number;
  points: number;
  cards?: number;
  goalsConceded?: number;
  cleanSheets?: number;
  yellowCards?: number;
  redCards?: number;
  totalCards?: number;
  nationality?: string;
  age?: number;
}

interface Team {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats implements OnInit {
  // Data arrays for different tabs
  topScorers: Player[] = [];
  topAssisters: Player[] = [];
  mostCards: Player[] = [];
  mostGoalsConceded: Player[] = [];
  cleanSheets: Player[] = [];

  // Current active data
  currentPlayers: Player[] = [];
  teams: Team[] = [];
  filteredPlayers: Player[] = [];

  // UI state
  selectedStatType: string = 'goals';
  selectedPosition: string = '';
  selectedTeam: string = '';
  availableTeams: string[] = [];
  isLoading: boolean = false;
  error: string = '';
  activeTab: string = 'goal-kings';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadGoalKings();
    this.setupTabSwitching();
  }

  loadGoalKings() {
    this.isLoading = true;
    this.error = '';
    this.activeTab = 'goal-kings';
    this.selectedStatType = 'goals';
    this.selectedPosition = '';
    this.selectedTeam = '';

    this.http.get<Player[]>(`${environment.apiUrl}/api/Stats/top-scorers`).subscribe({
      next: (data) => {
        console.log(data);
        this.topScorers = data.map(player => ({
          id: player.id || 0,
          playerName: player.playerName || 'Bilinmeyen Oyuncu',
          club: player.club || 'Bilinmeyen Takım',
          position: player.position || 'UNK',
          matches: player.matches || 0,
          goals: player.goals || 0,
          assists: player.assists || 0,
          points: player.points || 0
        }));
        console.log(this.topScorers);
        this.currentPlayers = [...this.topScorers];
        this.filteredPlayers = [...this.topScorers];
        this.updateAvailableTeams();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading goal kings:', error);
        this.error = 'Gol krallığı verileri yüklenirken hata oluştu';
        this.isLoading = false;
      }
    });
  }

  loadAssistKings() {
    this.isLoading = true;
    this.error = '';
    this.activeTab = 'assist-kings';
    this.selectedStatType = 'assists';
    this.selectedPosition = '';
    this.selectedTeam = '';

    this.http.get<Player[]>(`${environment.apiUrl}/api/Stats/top-assisters`).subscribe({
      next: (data) => {
        this.topAssisters = data.map(player => ({
          id: player.id || 0,
          playerName: player.playerName || 'Bilinmeyen Oyuncu',
          club: player.club || 'Bilinmeyen Takım',
          position: player.position || 'UNK',
          matches: player.matches || 0,
          goals: player.goals || 0,
          assists: player.assists || 0,
          points: player.points || 0
        }));
        this.currentPlayers = [...this.topAssisters];
        this.filteredPlayers = [...this.topAssisters];
        this.updateAvailableTeams();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading assist kings:', error);
        this.error = 'Asist krallığı verileri yüklenirken hata oluştu';
        this.isLoading = false;
      }
    });
  }

  loadMostCards() {
    this.isLoading = true;
    this.error = '';
    this.activeTab = 'most-cards';
    this.selectedStatType = 'totalCards';
    this.selectedPosition = '';
    this.selectedTeam = '';
    
    this.http.get<Player[]>(`${environment.apiUrl}/api/Stats/card-stats`).subscribe({
      next: (data) => {
        this.mostCards = data.map(player => ({
          id: player.id || 0,
          playerName: player.playerName || 'Bilinmeyen Oyuncu',
          club: player.club || 'Bilinmeyen Takım',
          position: player.position || 'UNK',
          matches: player.matches || 0,
          goals: player.goals || 0,
          assists: player.assists || 0,
          points: player.points || 0,
          yellowCards: player.yellowCards || 0,
          redCards: player.redCards || 0,
          totalCards: player.totalCards || 0,
        }));
        this.currentPlayers = [...this.mostCards];
        this.filteredPlayers = [...this.mostCards];
        this.updateAvailableTeams();
        // Sort by total cards by default
        this.filteredPlayers.sort((a, b) => (b.totalCards || 0) - (a.totalCards || 0));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading most cards:', error);
        this.error = 'En çok kart görenler verileri yüklenirken hata oluştu';
        this.isLoading = false;
      }
    });
  }

  loadMostGoalsConceded() {
    this.isLoading = true;
    this.error = '';
    this.activeTab = 'most-goals-conceded';
    this.selectedStatType = 'goals_conceded';
    this.selectedPosition = 'GK';
    this.selectedTeam = '';

    // Assuming you have an API endpoint for most goals conceded
    this.http.get<Player[]>(`${environment.apiUrl}/api/Stats/most-goals-conceded`).subscribe({
      next: (data) => {
        this.mostGoalsConceded = data.map(player => ({
          id: player.id || 0,
          playerName: player.playerName || 'Bilinmeyen Oyuncu',
          club: player.club || 'Bilinmeyen Takım',
          position: player.position || 'UNK',
          matches: player.matches || 0,
          goals: player.goals || 0,
          assists: player.assists || 0,
          points: player.points || 0,
          goalsConceded: player.goalsConceded || 0,
        }));
        this.currentPlayers = [...this.mostGoalsConceded];
        this.filteredPlayers = [...this.mostGoalsConceded];
        this.updateAvailableTeams();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading most goals conceded:', error);
        this.error = 'En çok gol kaptanlar verileri yüklenirken hata oluştu';
        this.isLoading = false;
      }
    });
  }

  loadCleanSheets() {
    this.isLoading = true;
    this.error = '';
    this.activeTab = 'clean-sheets';
    this.selectedStatType = 'clean_sheets';
    this.selectedPosition = 'GK';
    this.selectedTeam = '';

    this.http.get<any[]>(`${environment.apiUrl}/api/Stats/clean-sheets`).subscribe({
      next: (data) => {
        this.cleanSheets = data.map(player => ({
          id: player.id || 0,
          playerName: player.playerName || 'Bilinmeyen Oyuncu',
          club: player.club || 'Bilinmeyen Takım',
          position: player.position || 'UNK',
          matches: player.matches || 0,
          goals: player.goals || 0,
          assists: player.assists || 0,
          points: player.points || 0,
          cleanSheets: player.cleanSheets || 0,
          goalsConceded: this.parseGoalsConceded(player.goalsConceded),
        }));
        this.currentPlayers = [...this.cleanSheets];
        this.filteredPlayers = [...this.cleanSheets];
        this.updateAvailableTeams();
        //this.applyFilters();
        // Sort by selected stat type
        this.filteredPlayers.sort((a, b) => {
          switch (this.selectedStatType) {
            case 'goals':
              return b.goals - a.goals;
            case 'assists':
              return b.assists - a.assists;
            case 'cards':
              return (b.cards || 0) - (a.cards || 0);
            case 'goals_conceded':
              return (b.goalsConceded || 0) - (a.goalsConceded || 0);
            case 'clean_sheets':
              return (b.cleanSheets || 0) - (a.cleanSheets || 0);
            case 'saves':
              return b.points - a.points;
            case 'passes':
              return b.points - a.points;
            default:
              return b.goals - a.goals;
          }
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clean sheets:', error);
        this.error = 'Temiz maçlar verileri yüklenirken hata oluştu';
        this.isLoading = false;
      }
    });
  }

  private parseGoalsConceded(goalsConceded: any): number {
    if (typeof goalsConceded === 'number') {
      return goalsConceded;
    }
    if (typeof goalsConceded === 'string') {
      // Handle "0.0 %" format
      const match = goalsConceded.match(/(\d+\.?\d*)/);
      if (match) {
        return parseFloat(match[1]);
      }
    }
    return 0;
  }

  loadTeamStats() {
    // You can implement team stats loading here when the API is available
    // this.http.get<Team[]>(`${environment.apiUrl}/api/Stats/team-stats`).subscribe({...});
  }

  setupTabSwitching() {
    // Add tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and target content
        button.classList.add('active');
        const targetContent = document.getElementById(targetTab!);
        if (targetContent) {
          targetContent.classList.add('active');
        }

        // Load appropriate data based on tab
        this.loadDataForTab(targetTab!);
      });
    });
  }

  loadDataForTab(tabName: string) {
    switch (tabName) {
      case 'goal-kings':
        this.loadGoalKings();
        break;
      case 'assist-kings':
        this.loadAssistKings();
        break;
      case 'most-cards':
        this.loadMostCards();
        break;
      case 'most-goals-conceded':
        this.loadMostGoalsConceded();
        break;
      case 'clean-sheets':
        this.loadCleanSheets();
        break;
    }
  }

  updateAvailableTeams() {
    this.availableTeams = [...new Set(this.currentPlayers.map(p => p.club))];
  }

  onStatTypeChange() {
    this.applyFilters();
  }

  onPositionFilterChange() {
    this.applyFilters();
  }

  onTeamFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPlayers = this.currentPlayers.filter(player => {
      const positionMatch = !this.selectedPosition || player.position === this.selectedPosition;
      const teamMatch = !this.selectedTeam || player.club === this.selectedTeam;
      return positionMatch && teamMatch;
    });

    console.log(this.filteredPlayers);

    // Sort by selected stat type
    this.filteredPlayers.sort((a, b) => {
      switch (this.selectedStatType) {
        case 'goals':
          return b.goals - a.goals;
        case 'assists':
          return b.assists - a.assists;
        case 'cards':
          return (b.cards || 0) - (a.cards || 0);
        case 'totalCards':
          return (b.totalCards || 0) - (a.totalCards || 0);
        case 'yellowCards':
          return (b.yellowCards || 0) - (a.yellowCards || 0);
        case 'redCards':
          return (b.redCards || 0) - (a.redCards || 0);
        case 'goals_conceded':
          return (b.goalsConceded || 0) - (a.goalsConceded || 0);
        case 'clean_sheets':
          return (b.cleanSheets || 0) - (a.cleanSheets || 0);
        case 'saves':
          return b.points - a.points;
        case 'passes':
          return b.points - a.points;
        default:
          return b.goals - a.goals;
      }
    });
  }

  getStatHeader(): string {
    switch (this.selectedStatType) {
      case 'goals':
        return 'Gol';
      case 'assists':
        return 'Asist';
      case 'cards':
        return 'Kart';
      case 'totalCards':
        return 'Toplam Kart';
      case 'yellowCards':
        return 'Sarı Kart';
      case 'redCards':
        return 'Kırmızı Kart';
      case 'goals_conceded':
        return 'Gol Kaptı';
      case 'clean_sheets':
        return 'Temiz Maç';
      case 'saves':
        return 'Kurtarış';
      case 'passes':
        return 'Pas';
      default:
        return 'Gol';
    }
  }

  getStatValue(player: Player): number {
    switch (this.selectedStatType) {
      case 'goals':
        return player.goals;
      case 'assists':
        return player.assists;
      case 'cards':
        return player.cards || 0;
      case 'totalCards':
        return player.totalCards || 0;
      case 'yellowCards':
        return player.yellowCards || 0;
      case 'redCards':
        return player.redCards || 0;
      case 'goals_conceded':
        return player.goalsConceded || 0;
      case 'clean_sheets':
        return player.cleanSheets || 0;
      case 'saves':
      case 'passes':
        return player.points;
      default:
        return player.goals;
    }
  }

  refreshData() {
    this.loadDataForTab(this.activeTab);
  }

  getPositionDisplayName(position: string): string {
    switch (position) {
      case 'GK':
        return 'Kaleci';
      case 'DEF':
        return 'Defans';
      case 'MID':
        return 'Orta Saha';
      case 'FWD':
        return 'Forvet';
      default:
        return position;
    }
  }

  getTotalPlayers(): number {
    return this.filteredPlayers.length;
  }

  getTopPlayer(): Player | null {
    return this.filteredPlayers.length > 0 ? this.filteredPlayers[0] : null;
  }

  getTabTitle(): string {
    switch (this.activeTab) {
      case 'goal-kings':
        return 'Gol Krallığı';
      case 'assist-kings':
        return 'Asist Krallığı';
      case 'clean-sheets':
        return 'Kalesini Gole Kapatanlar';
      case 'most-cards':
        return 'En Çok Kart Görenler';
      case 'most-goals-conceded':
        return 'En Çok Gol Kaptanlar';
      default:
        return 'İstatistikler';
    }
  }
}

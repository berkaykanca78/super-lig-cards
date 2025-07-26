import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';

interface PlayerData {
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

interface ManagerData {
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

type PlayerOrManager = PlayerData | ManagerData;

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrl: './player.scss'
})
export class Player implements OnInit, AfterViewInit {
  playerData: PlayerOrManager | null = null;
  isManager: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.loadPlayerData();
  }

  ngAfterViewInit() {
    this.enableMobileScroll();
  }

  // Helper method to check if data is manager
  private isManagerData(data: PlayerOrManager): data is ManagerData {
    return data.position === 'MAN';
  }

  // Helper method to get player stats safely
  private getPlayerStat(data: PlayerOrManager, statKey: string): number {
    if (this.isManagerData(data)) {
      return 0;
    }
    return data.stats[statKey] || 0;
  }

  // Helper method to calculate pass accuracy
  private getPassAccuracy(data: PlayerOrManager): string {
    if (this.isManagerData(data)) {
      return 'N/A';
    }
    const passes = data.stats['PAS'] || 0;
    const completedPasses = data.stats['BASARILI_PAS'] || 0;
    if (passes === 0) return '0%';
    return Math.round((completedPasses / passes) * 100) + '%';
  }

  // Helper method to get player number safely
  private getPlayerNumber(data: PlayerOrManager): string {
    if (this.isManagerData(data)) {
      return 'MAN';
    }
    return data.number?.toString() || 'N/A';
  }

  // Helper method to get any stat safely for template
  getStat(data: PlayerOrManager, statKey: string): number {
    return this.getPlayerStat(data, statKey);
  }

  // Helper method to get pass accuracy for template
  getPassAccuracyForTemplate(data: PlayerOrManager): string {
    return this.getPassAccuracy(data);
  }

  // Helper method to get player number for template
  getPlayerNumberForTemplate(data: PlayerOrManager): string {
    return this.getPlayerNumber(data);
  }

  private async loadPlayerData() {
    try {
      this.isLoading = true;
      
      // Get route parameters
      const playerName = this.route.snapshot.paramMap.get('id');
      const teamName = this.route.snapshot.queryParamMap.get('team');
      const type = this.route.snapshot.queryParamMap.get('type');

      if (!playerName) {
        this.error = 'Oyuncu bulunamadı';
        return;
      }

      // Load team data to find the player/manager
      const teamData = await this.teamService.getTeamData(teamName || 'galatasaray');
      
      if (type === 'manager') {
        // Load manager data
        if (teamData.manager && teamData.manager.name === playerName) {
          this.playerData = teamData.manager;
          this.isManager = true;
        } else {
          this.error = 'Teknik direktör bulunamadı';
        }
      } else {
        // Load player data
        const player = teamData.players.find((p: any) => p.name === playerName);
        if (player) {
          this.playerData = player;
          this.isManager = false;
        } else {
          this.error = 'Oyuncu bulunamadı';
        }
      }

      if (this.playerData) {
        this.updatePlayerDisplay();
      }
    } catch (error) {
      this.error = 'Veri yüklenirken hata oluştu';
      console.error('Error loading player data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private updatePlayerDisplay() {
    if (!this.playerData) return;

    // Update breadcrumb
    const playerNameElement = document.getElementById('playerName');
    if (playerNameElement) {
      playerNameElement.textContent = this.playerData.name;
    }

    // Update player photo
    const playerPhotoElement = document.getElementById('playerPhoto') as HTMLImageElement;
    if (playerPhotoElement) {
      playerPhotoElement.src = this.playerData.image;
      playerPhotoElement.alt = this.playerData.name;
    }

    // Update player name
    const playerFullNameElement = document.getElementById('playerFullName');
    if (playerFullNameElement) {
      playerFullNameElement.textContent = this.playerData.name;
    }

    // Update player details
    const playerNumberElement = document.getElementById('playerNumber');
    if (playerNumberElement) {
      playerNumberElement.textContent = this.getPlayerNumber(this.playerData);
    }

    const playerPositionElement = document.getElementById('playerPosition');
    if (playerPositionElement) {
      playerPositionElement.textContent = this.isManager ? 'Teknik Direktör' : this.playerData.ratingPosition;
    }

    const playerAgeElement = document.getElementById('playerAge');
    if (playerAgeElement) {
      playerAgeElement.textContent = this.playerData.age.toString();
    }

    const playerCountryElement = document.getElementById('playerCountry');
    if (playerCountryElement) {
      playerCountryElement.textContent = this.playerData.nationality.name;
    }

    // Update stats based on player type
    if (this.isManager) {
      this.updateManagerStats();
    } else {
      this.updatePlayerStats();
    }
  }

  private updateManagerStats() {
    const manager = this.playerData as ManagerData;
    
    // Update overview stats
    const goalsCountElement = document.getElementById('goalsCount');
    if (goalsCountElement) goalsCountElement.textContent = 'N/A';

    const assistsCountElement = document.getElementById('assistsCount');
    if (assistsCountElement) assistsCountElement.textContent = 'N/A';

    const matchesCountElement = document.getElementById('matchesCount');
    if (matchesCountElement) matchesCountElement.textContent = 'N/A';

    const minutesCountElement = document.getElementById('minutesCount');
    if (minutesCountElement) minutesCountElement.textContent = 'N/A';

    // Update detailed stats
    const leagueMatchesElement = document.getElementById('leagueMatches');
    if (leagueMatchesElement) leagueMatchesElement.textContent = 'N/A';

    const leagueStartsElement = document.getElementById('leagueStarts');
    if (leagueStartsElement) leagueStartsElement.textContent = 'N/A';

    const leagueGoalsElement = document.getElementById('leagueGoals');
    if (leagueGoalsElement) leagueGoalsElement.textContent = 'N/A';

    const leagueAssistsElement = document.getElementById('leagueAssists');
    if (leagueAssistsElement) leagueAssistsElement.textContent = 'N/A';

    const leagueYellowCardsElement = document.getElementById('leagueYellowCards');
    if (leagueYellowCardsElement) leagueYellowCardsElement.textContent = 'N/A';

    const leagueRedCardsElement = document.getElementById('leagueRedCards');
    if (leagueRedCardsElement) leagueRedCardsElement.textContent = 'N/A';

    // Update detailed stats
    const shotsElement = document.getElementById('shots');
    if (shotsElement) shotsElement.textContent = 'N/A';

    const shotsOnTargetElement = document.getElementById('shotsOnTarget');
    if (shotsOnTargetElement) shotsOnTargetElement.textContent = 'N/A';

    const passesElement = document.getElementById('passes');
    if (passesElement) passesElement.textContent = 'N/A';

    const passesCompletedElement = document.getElementById('passesCompleted');
    if (passesCompletedElement) passesCompletedElement.textContent = 'N/A';

    const passAccuracyElement = document.getElementById('passAccuracy');
    if (passAccuracyElement) passAccuracyElement.textContent = 'N/A';

    const tacklesElement = document.getElementById('tackles');
    if (tacklesElement) tacklesElement.textContent = 'N/A';
  }

  private updatePlayerStats() {
    const player = this.playerData as PlayerData;
    
    // Calculate some basic stats from player data
    const goals = this.getPlayerStat(player, 'GOL');
    const assists = this.getPlayerStat(player, 'AST');
    const matches = this.getPlayerStat(player, 'MAC');
    const minutes = this.getPlayerStat(player, 'DAK');

    // Update overview stats
    const goalsCountElement = document.getElementById('goalsCount');
    if (goalsCountElement) goalsCountElement.textContent = goals.toString();

    const assistsCountElement = document.getElementById('assistsCount');
    if (assistsCountElement) assistsCountElement.textContent = assists.toString();

    const matchesCountElement = document.getElementById('matchesCount');
    if (matchesCountElement) matchesCountElement.textContent = matches.toString();

    const minutesCountElement = document.getElementById('minutesCount');
    if (minutesCountElement) minutesCountElement.textContent = minutes.toString();

    // Update detailed stats
    const leagueMatchesElement = document.getElementById('leagueMatches');
    if (leagueMatchesElement) leagueMatchesElement.textContent = matches.toString();

    const leagueStartsElement = document.getElementById('leagueStarts');
    if (leagueStartsElement) leagueStartsElement.textContent = matches.toString();

    const leagueGoalsElement = document.getElementById('leagueGoals');
    if (leagueGoalsElement) leagueGoalsElement.textContent = goals.toString();

    const leagueAssistsElement = document.getElementById('leagueAssists');
    if (leagueAssistsElement) leagueAssistsElement.textContent = assists.toString();

    const leagueYellowCardsElement = document.getElementById('leagueYellowCards');
    if (leagueYellowCardsElement) leagueYellowCardsElement.textContent = this.getPlayerStat(player, 'SARI').toString();

    const leagueRedCardsElement = document.getElementById('leagueRedCards');
    if (leagueRedCardsElement) leagueRedCardsElement.textContent = this.getPlayerStat(player, 'KIRMIZI').toString();

    // Update detailed stats
    const shotsElement = document.getElementById('shots');
    if (shotsElement) shotsElement.textContent = this.getPlayerStat(player, 'SUT').toString();

    const shotsOnTargetElement = document.getElementById('shotsOnTarget');
    if (shotsOnTargetElement) shotsOnTargetElement.textContent = this.getPlayerStat(player, 'ISABETLI_SUT').toString();

    const passesElement = document.getElementById('passes');
    if (passesElement) passesElement.textContent = this.getPlayerStat(player, 'PAS').toString();

    const passesCompletedElement = document.getElementById('passesCompleted');
    if (passesCompletedElement) passesCompletedElement.textContent = this.getPlayerStat(player, 'BASARILI_PAS').toString();

    const passAccuracyElement = document.getElementById('passAccuracy');
    if (passAccuracyElement) {
      passAccuracyElement.textContent = this.getPassAccuracy(player);
    }

    const tacklesElement = document.getElementById('tackles');
    if (tacklesElement) tacklesElement.textContent = this.getPlayerStat(player, 'TOP_CALMA').toString();
  }

  private enableMobileScroll(): void {
    // Add touch event listeners for better mobile scroll experience
    const playerContainer = document.querySelector('.player-container') as HTMLElement;
    if (playerContainer) {
      // Prevent default touch behaviors that might interfere with scrolling
      playerContainer.addEventListener('touchstart', (e) => {
        // Allow default scroll behavior
      }, { passive: true });
      
      playerContainer.addEventListener('touchmove', (e) => {
        // Allow default scroll behavior
      }, { passive: true });
      
      // Ensure the container is scrollable on mobile
      (playerContainer.style as any).webkitOverflowScrolling = 'touch';
      playerContainer.style.overflowY = 'auto';
    }
  }
}

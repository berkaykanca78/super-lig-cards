import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Subscription } from 'rxjs';

// Interfaces for type safety
interface Player {
  name: string;
  position: string;
  rating: number;
  ratingPosition: string;
  number?: number; // Make number optional since managers don't have numbers
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
  rating: number;
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
}

interface TeamData {
  name: string;
  logo: string;
  season: string;
  cardTeamName: string;
  players: Player[];
  manager?: Manager;
}

interface LeagueLogos {
  [key: string]: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  // Component state
  currentPage: number = 1;
  readonly cardsPerPage: number = 14;
  selectedLeague: string = 'default';
  currentTeamData: TeamData | null = null;
  currentTeamName: string = 'galatasaray';
  isLoading: boolean = false;
  error: string | null = null;
  private teamSubscription: Subscription | null = null;

  constructor(private teamService: TeamService) {}

  // League logos mapping
  private readonly leagueLogos: LeagueLogos = {
    default: '', // No logo for default theme
    superlig: 'https://www.tff.org/Resources/TFF/Images/0000000015/TFF/TFF-Logolar/2024-2025/trendyol-super-lig-dikey-logo.png',
    turkiyekupasi: 'https://upload.wikimedia.org/wikipedia/tr/6/61/Ziraat_T%C3%BCrkiye_Kupas%C4%B1_logosu.png',
    superkupasi: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/61/T%C3%BCrkiye_S%C3%BCper_Kupas%C4%B1_logo.png/250px-T%C3%BCrkiye_S%C3%BCper_Kupas%C4%B1_logo.png',
    championsleague: '/tournaments/ucl.png',
    europaleague: '/tournaments/uel.png',
    conferenceleague: '/tournaments/uecl.png'
  };

  ngOnInit(): void {
    // Component initialization logic
    // Galatasaray'ı otomatik olarak yükle
    this.loadTeamData(this.currentTeamName);
    this.updateTheme(this.selectedLeague);

    // Subscribe to team selection changes
    this.teamSubscription = this.teamService.selectedTeam$.subscribe(teamId => {
      console.log('Home received team update:', teamId, 'Current:', this.currentTeamName);
      if (teamId !== this.currentTeamName) {
        this.currentTeamName = teamId;
        console.log('Home currentTeamName updated to:', this.currentTeamName);
        this.loadTeamData(teamId);
        this.updateTheme(this.selectedLeague);
      }
    });
  }

  ngAfterViewInit(): void {
    // DOM manipulation after view initialization
    this.initializeEventListeners();
    // Apply initial theme
    this.updateTheme(this.selectedLeague);
    // Enable mobile scroll functionality
    this.enableMobileScroll();
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    }
  }

  private initializeEventListeners(): void {
    // Add event listeners for team buttons and other interactive elements
    document.addEventListener('DOMContentLoaded', () => {
      this.setupTeamButtonListeners();
    });
  }

  private setupTeamButtonListeners(): void {
    const teamButtons = document.querySelectorAll('.team-button');
    teamButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const teamName = target.getAttribute('data-team');
        if (teamName) {
          this.loadTeamData(teamName);
        }
      });
    });
  }

  // Load team data
  async loadTeamData(teamName: string): Promise<void> {
    this.isLoading = true;
    this.error = null;
    this.currentTeamName = teamName;
    
    try {
      const data = await this.loadTeamDataFromServer(teamName);
      this.currentTeamData = data as TeamData;
      this.currentPage = 1; // Reset to first page when loading new team
    } catch (error) {
      console.error('Takım verileri yüklenirken hata oluştu:', error);
      this.error = 'Takım verileri yüklenirken hata oluştu';
      this.currentTeamData = null;
    } finally {
      this.isLoading = false;
    }
  }

  // Load team data from server
  async loadTeamDataFromServer(team: string): Promise<TeamData | { players: Player[] }> {
    if (team === 'all') {
      const teamFiles = [
        'galatasaray', 'fenerbahce', 'besiktas', 'trabzonspor', 'basaksehir',
        'antalyaspor', 'konyaspor', 'alanyaspor', 'kayserispor', 'gaziantep',
        'kocaelispor', 'genclerbirligi', 'karagumruk', 'rizespor', 'goztepe',
        'samsunspor', 'eyupspor'
      ];

      const results = await Promise.all(
        teamFiles.map(teamFile => 
          fetch(`/data/${teamFile}.json`).then(response => response.json())
        )
      );

      let allPlayers: Player[] = [];
      results.forEach((teamData: TeamData) => {
        allPlayers = allPlayers.concat(teamData.players);
        if (teamData.manager) {
          allPlayers.push({
            ...teamData.manager,
            position: 'MAN',
            ratingPosition: 'TEKNİK DİREKTÖR',
            number: undefined // Managers don't have numbers
          } as Player);
        }
      });
      return { players: allPlayers };
    } else {
      return fetch(`/data/${team}.json`).then(response => response.json());
    }
  }

  // Change page function
  changePage(page: number): void {
    this.currentPage = page;
  }

  // League change handler function
  handleLeagueChange(selectedLeague: string): void {
    this.selectedLeague = selectedLeague;
    this.updateTheme(selectedLeague);
  }

  // Update theme and league indicators
  private updateTheme(league: string): void {
    // Update league indicators on all cards
    setTimeout(() => {
      const cards = document.querySelectorAll('.player-card');
      cards.forEach(card => {
        // Remove existing league indicator if any
        const existingIndicator = card.querySelector('.league-indicator');
        if (existingIndicator) {
          existingIndicator.remove();
        }

        // Add new league indicator if not default theme
        if (league !== 'default') {
          const leagueIndicator = document.createElement('div');
          leagueIndicator.className = 'league-indicator';
          leagueIndicator.style.backgroundImage = `url('${this.leagueLogos[league]}')`;
          leagueIndicator.style.display = 'block';
          card.appendChild(leagueIndicator);
        }
      });

      // Update header theme class
      const header = document.querySelector('.header');
      if (header) {
        // Remove all theme classes
        header.classList.remove('theme-superlig', 'theme-championsleague', 'theme-europaleague', 
                               'theme-conferenceleague', 'theme-turkiyekupasi', 'theme-superkupasi');
        // Add new theme class if not default
        if (league !== 'default') {
          header.classList.add(`theme-${league}`);
        }
      }
    }, 0);
  }

  // Update sidebar team selection
  private updateSidebarTeamSelection(): void {
    // This method is no longer needed since we're using the service
    // The sidebar component handles its own active state
  }

  // Enable mobile scroll functionality
  private enableMobileScroll(): void {
    // Add touch event listeners for better mobile scroll experience
    const cardsGrid = document.querySelector('.cards-grid') as HTMLElement;
    if (cardsGrid) {
      // Prevent default touch behaviors that might interfere with scrolling
      cardsGrid.addEventListener('touchstart', (e) => {
        // Allow default scroll behavior
      }, { passive: true });
      
      cardsGrid.addEventListener('touchmove', (e) => {
        // Allow default scroll behavior
      }, { passive: true });
      
      // Ensure the grid is scrollable on mobile
      (cardsGrid.style as any).webkitOverflowScrolling = 'touch';
      cardsGrid.style.overflowY = 'auto';
    }
  }

  // Get paginated players
  get paginatedPlayers(): Player[] {
    if (!this.currentTeamData) return [];
    
    const totalCards = this.currentTeamData.players.length;
    
    // If manager exists and we're on first page, account for manager card
    const managerOnFirstPage = this.currentPage === 1 && this.currentTeamData.manager;
    const playersPerPage = managerOnFirstPage ? this.cardsPerPage - 1 : this.cardsPerPage;
    
    if (this.currentPage === 1) {
      // İlk sayfa: Manager varsa manager + (cardsPerPage - 1) oyuncu, yoksa cardsPerPage oyuncu
      return this.currentTeamData.players.slice(0, playersPerPage);
    } else {
      // Sonraki sayfalar: Geçmiş sayfalardan sonra kalan oyuncular
      const firstPagePlayers = this.currentTeamData.manager ? this.cardsPerPage - 1 : this.cardsPerPage;
      const startIndex = firstPagePlayers + ((this.currentPage - 2) * this.cardsPerPage);
      const endIndex = startIndex + this.cardsPerPage;
      return this.currentTeamData.players.slice(startIndex, endIndex);
    }
  }

  // Get total pages
  get totalPages(): number {
    if (!this.currentTeamData) return 0;
    
    const totalCards = this.currentTeamData.players.length;
    const totalCardsIncludingManager = totalCards + (this.currentTeamData.manager ? 1 : 0);
    return Math.ceil(totalCardsIncludingManager / this.cardsPerPage);
  }

  // Generate page numbers for pagination
  generatePageNumbers(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Get league logo URL
  getLeagueLogoUrl(league: string): string {
    return this.leagueLogos[league] || '';
  }

  // Check if should show manager on current page
  get shouldShowManager(): boolean {
    return this.currentPage === 1 && this.currentTeamData?.manager !== undefined;
  }

  onImageError(event: Event, position: string): void {
    const img = event.target as HTMLImageElement;
    if (position === 'MAN') {
      img.src = 'https://cdn-icons-png.flaticon.com/512/4206/4206265.png';
    } else {
      img.src = 'https://cdn-icons-png.flaticon.com/512/607/607445.png';
    }
  }

  // Create player card DOM element
  createPlayerCard(player: Player): HTMLElement {
    const card = document.createElement('div');
    card.className = `player-card ${player.cardTeamName}`;
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-position', player.position);

    // Add button for mobile
    const addButton = document.createElement('button');
    addButton.className = 'add-to-field-btn';
    addButton.innerHTML = '+';
    addButton.setAttribute('aria-label', 'Sahaya Ekle');
    card.appendChild(addButton);

    // Card glow and shine effects
    const cardGlow = document.createElement('div');
    cardGlow.className = 'card-glow';
    card.appendChild(cardGlow);

    const cardShine = document.createElement('div');
    cardShine.className = 'card-shine';
    card.appendChild(cardShine);

    // Rating badge
    const ratingBadge = document.createElement('div');
    ratingBadge.className = 'rating-badge';
    if (player.position === 'MAN') {
      ratingBadge.style.background = 'linear-gradient(145deg, #C0C0C0 0%, #A0A0A0 100%)';
    }
    
    const ratingNumber = document.createElement('div');
    ratingNumber.className = 'rating-number';
    ratingNumber.textContent = player.rating.toString();
    if (player.position === 'MAN') {
      ratingNumber.style.color = '#000000';
    }
    
    const ratingType = document.createElement('div');
    ratingType.className = 'rating-type';
    ratingType.textContent = player.position;
    if (player.position === 'MAN') {
      ratingType.style.color = '#000000';
    }
    
    ratingBadge.appendChild(ratingNumber);
    ratingBadge.appendChild(ratingType);
    card.appendChild(ratingBadge);

    // Position badge
    const positionBadge = document.createElement('div');
    positionBadge.className = 'position-badge';
    positionBadge.textContent = player.ratingPosition || (player.position === 'MAN' ? 'TEKNİK DİREKTÖR' : player.position);
    card.appendChild(positionBadge);

    // Player image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'player-image-container';
    
    const playerImage = document.createElement('div');
    playerImage.className = 'player-image';
    
    const img = document.createElement('img');
    img.src = player.image;
    img.alt = player.name;
    img.onerror = function() { 
      this.src = player.position === 'MAN' ? 
        'https://cdn-icons-png.flaticon.com/512/4206/4206265.png' : 
        'https://cdn-icons-png.flaticon.com/512/607/607445.png'; 
    };
    
    playerImage.appendChild(img);
    imageContainer.appendChild(playerImage);
    card.appendChild(imageContainer);

    // Player info
    const playerInfo = document.createElement('div');
    playerInfo.className = 'player-info';
    
    const playerName = document.createElement('div');
    playerName.className = 'player-name';
    playerName.textContent = player.name;
    playerInfo.appendChild(playerName);

    // Stats section
    const statsSection = document.createElement('div');
    statsSection.className = 'player-stats';
    
    if (player.position === 'MAN') {
      // Manager stats
      const managerStats = ['tactic', 'motivation', 'leadership'];
      const statLabels: { [key: string]: string } = { 
        tactic: 'TAK', 
        motivation: 'MOT', 
        leadership: 'LİD' 
      };
      
      managerStats.forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.className = 'stat';
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = player.stats[stat]?.toString() || '0';
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = statLabels[stat];
        
        statDiv.appendChild(statValue);
        statDiv.appendChild(statLabel);
        statsSection.appendChild(statDiv);
      });
    } else {
      // Player stats
      Object.entries(player.stats).forEach(([stat, value]) => {
        const statDiv = document.createElement('div');
        statDiv.className = 'stat';
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = value.toString();
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = stat;
        
        statDiv.appendChild(statValue);
        statDiv.appendChild(statLabel);
        statsSection.appendChild(statDiv);
      });
    }
    
    playerInfo.appendChild(statsSection);

    // Player details
    const playerDetails = document.createElement('div');
    playerDetails.className = 'player-details';
    
    const detailsLeft = document.createElement('div');
    const flag = document.createElement('img');
    flag.src = player.nationality.flag;
    flag.alt = player.nationality.name;
    flag.className = 'country-flag';
    detailsLeft.appendChild(flag);
    detailsLeft.appendChild(document.createTextNode(` ${player.nationality.name} • ${player.age} yaş`));
    
    const detailsRight = document.createElement('div');
    detailsRight.textContent = player.position === 'MAN' ? 'MAN' : `# ${player.number || ''}`;
    
    playerDetails.appendChild(detailsLeft);
    playerDetails.appendChild(detailsRight);
    playerInfo.appendChild(playerDetails);

    card.appendChild(playerInfo);

    // Add click handler for mobile add button
    addButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const availablePoints = document.querySelectorAll('.formation-point:not(.occupied)');
      const validPoints = Array.from(availablePoints).filter(point => {
        return point.getAttribute('data-position') === player.position ||
               (player.position === 'MAN' && point.classList.contains('manager-area'));
      });

      if (validPoints.length > 0) {
        const firstValidPoint = validPoints[0] as HTMLElement;
        const cardClone = card.cloneNode(true) as HTMLElement;
        cardClone.style.position = 'absolute';
        
        if (player.position === 'MAN') {
          const managerArea = document.querySelector('.manager-area') as HTMLElement;
          if (managerArea) {
            managerArea.innerHTML = '';
            managerArea.appendChild(cardClone);
            managerArea.classList.add('occupied');
          }
        } else {
          firstValidPoint.appendChild(cardClone);
          firstValidPoint.classList.add('occupied');
          
          // Position the card properly
          cardClone.style.left = '50%';
          cardClone.style.top = '50%';
          cardClone.style.transform = 'translate(-50%, -50%) scale(1)';
        }

        // Add delete functionality to the cloned card
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '×';
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          if (player.position === 'MAN') {
            const managerArea = document.querySelector('.manager-area') as HTMLElement;
            if (managerArea) {
              managerArea.innerHTML = '<div class="manager-placeholder">Teknik Direktör</div>';
              managerArea.classList.remove('occupied');
            }
          } else {
            firstValidPoint.innerHTML = '';
            firstValidPoint.classList.remove('occupied');
          }
        });
        cardClone.appendChild(deleteButton);
      } else {
        alert('Bu pozisyon için uygun boş alan bulunamadı!');
      }
    });

    // Make card draggable
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer?.setData('text/plain', '');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
      }
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    return card;
  }
}

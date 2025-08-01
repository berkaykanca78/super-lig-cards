import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  Formations, 
  Player, 
  Manager, 
  TeamData, 
  DropdownItem 
} from './lineup.types';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lineup',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './lineup.html',
  styleUrl: './lineup.scss',
})
export class Lineup implements OnInit, AfterViewInit {
  @ViewChild('cardsContainer') cardsContainer!: ElementRef;
  @ViewChild('formationPoints') formationPoints!: ElementRef;
  @ViewChild('cardContainer') cardContainer!: ElementRef;
  @ViewChild('managerArea') managerArea!: ElementRef;

  // Formasyon pozisyonları
  formations: Formations = {
    '4-4-2': {
      positions: [
        { x: 50, y: 88, role: 'GK', allowedRoles: ['GK'] },
        { x: 15, y: 75, role: 'LB', allowedRoles: ['LB', 'LWB'] },
        { x: 35, y: 80, role: 'CB', allowedRoles: ['CB'] },
        { x: 65, y: 80, role: 'CB', allowedRoles: ['CB'] },
        { x: 85, y: 75, role: 'RB', allowedRoles: ['RB', 'RWB'] },
        { x: 10, y: 50, role: 'LM', allowedRoles: ['LM', 'LW'] },
        { x: 35, y: 50, role: 'CM', allowedRoles: ['CM', 'CDM'] },
        { x: 65, y: 50, role: 'CM', allowedRoles: ['CM', 'CDM'] },
        { x: 90, y: 50, role: 'RM', allowedRoles: ['RM', 'RW'] },
        { x: 35, y: 20, role: 'ST', allowedRoles: ['ST', 'CF'] },
        { x: 65, y: 20, role: 'ST', allowedRoles: ['ST', 'CF'] }
      ]
    },
    '4-3-3': {
      positions: [
        { x: 50, y: 88, role: 'GK', allowedRoles: ['GK'] },
        { x: 15, y: 75, role: 'LB', allowedRoles: ['LB', 'LWB'] },
        { x: 35, y: 80, role: 'CB', allowedRoles: ['CB'] },
        { x: 65, y: 80, role: 'CB', allowedRoles: ['CB'] },
        { x: 85, y: 75, role: 'RB', allowedRoles: ['RB', 'RWB'] },
        { x: 35, y: 50, role: 'CM', allowedRoles: ['CM', 'CDM'] },
        { x: 50, y: 45, role: 'CM', allowedRoles: ['CM', 'CAM'] },
        { x: 65, y: 50, role: 'CM', allowedRoles: ['CM', 'CDM'] },
        { x: 10, y: 20, role: 'LW', allowedRoles: ['LW', 'LM'] },
        { x: 50, y: 15, role: 'ST', allowedRoles: ['ST', 'CF'] },
        { x: 90, y: 20, role: 'RW', allowedRoles: ['RW', 'RM'] }
      ]
    },
    '3-5-2': {
      positions: [
        { x: 50, y: 88, role: 'GK', allowedRoles: ['GK'] },
        { x: 35, y: 80, role: 'CB', allowedRoles: ['CB'] },
        { x: 50, y: 70, role: 'CB', allowedRoles: ['CB'] },
        { x: 65, y: 80, role: 'CB', allowedRoles: ['CB'] },
        { x: 10, y: 45, role: 'LWB', allowedRoles: ['LM', 'LWB'] },
        { x: 35, y: 50, role: 'CM', allowedRoles: ['CM', 'CDM'] },
        { x: 50, y: 45, role: 'CM', allowedRoles: ['CM', 'CAM'] },
        { x: 65, y: 50, role: 'CM', allowedRoles: ['CM', 'CDM'] },
        { x: 90, y: 45, role: 'RWB', allowedRoles: ['RM', 'RWB'] },
        { x: 35, y: 20, role: 'ST', allowedRoles: ['ST', 'CF'] },
        { x: 65, y: 20, role: 'ST', allowedRoles: ['ST', 'CF'] }
      ]
    },
    '4-2-3-1': {
      positions: [
        { x: 50, y: 88, role: 'GK', allowedRoles: ['GK'] },
        { x: 15, y: 75, role: 'LB', allowedRoles: ['LB', 'LWB'] },
        { x: 35, y: 80, role: 'CB', allowedRoles: ['CB'] },
        { x: 65, y: 80, role: 'CB', allowedRoles: ['CB'] },
        { x: 85, y: 75, role: 'RB', allowedRoles: ['RB', 'RWB'] },
        { x: 35, y: 60, role: 'CDM', allowedRoles: ['CDM', 'CM'] },
        { x: 65, y: 60, role: 'CDM', allowedRoles: ['CDM', 'CM'] },
        { x: 10, y: 35, role: 'LAM', allowedRoles: ['LM', 'LW'] },
        { x: 50, y: 35, role: 'CAM', allowedRoles: ['CAM', 'CF'] },
        { x: 90, y: 35, role: 'RAM', allowedRoles: ['RM', 'RW'] },
        { x: 50, y: 15, role: 'ST', allowedRoles: ['ST', 'CF'] }
      ]
    }
  };

  selectedTeam: string = 'all';
  selectedPosition: string = '';
  selectedFormation: string = '4-4-2';
  teams: DropdownItem[] = [];
  positions: DropdownItem[] = [];
  formationOptions: DropdownItem[] = [];
  allCards: (Player | Manager)[] = [];
  draggedCard: HTMLElement | null = null;
  dragOffset = { x: 0, y: 0 };

  constructor() { }

  ngOnInit() {
    this.loadDropdownData();
    this.loadAllTeamCards();
  }

  ngAfterViewInit() {
    // DOM'un tamamen hazır olması için biraz bekle
    setTimeout(() => {
      this.initializeFormation();
      this.initializeBench();
      this.setupEventListeners();
      this.setupFieldDragAndDrop();
      console.log('ngAfterViewInit completed');
    }, 300);
    
    // Add window resize listener to update card positioning
    window.addEventListener('resize', () => {
      this.updateCardPositions();
    });
  }

  private setupEventListeners() {
    // Event listeners are now handled by Angular template bindings
    // No need for manual DOM event listeners
  }

  private setupFieldDragAndDrop() {
    // DOM'un hazır olması için biraz bekle
    setTimeout(() => {
      const field = document.querySelector('.right-panel');
      if (!field) {
        console.error('Field not found');
        return;
      }

      // Manager area drag and drop
      const managerArea = document.getElementById('managerArea');
      if (managerArea) {
        managerArea.addEventListener('dragover', (e: Event) => {
          e.preventDefault();
          const draggingCard = document.querySelector('.dragging');
          if (draggingCard && draggingCard.getAttribute('data-position') === 'MAN') {
            managerArea.classList.add('drag-over');
          }
        });

        managerArea.addEventListener('dragleave', () => {
          managerArea.classList.remove('drag-over');
        });

        managerArea.addEventListener('drop', (e: Event) => {
          e.preventDefault();
          const draggingCard = document.querySelector('.dragging') as HTMLElement;
          
          if (!draggingCard || draggingCard.dataset['position'] !== 'MAN') {
            alert('Bu alana sadece teknik direktör yerleştirilebilir!');
            return;
          }

          // Teknik direktör kartını yerleştir
          const cardClone = draggingCard.cloneNode(true) as HTMLElement;
          managerArea.innerHTML = '';
          managerArea.appendChild(cardClone);
          managerArea.classList.add('occupied');
          managerArea.classList.remove('drag-over');

          // Delete butonu ekle
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-button';
          deleteButton.innerHTML = '×';
          deleteButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.clearManagerArea();
          };

          cardClone.appendChild(deleteButton);
        });
      }

      field.addEventListener('dragover', (e: Event) => {
        e.preventDefault();
        if (!this.draggedCard) return;

        const dragEvent = e as DragEvent;
        const rect = field.getBoundingClientRect();
        const x = ((dragEvent.clientX - this.dragOffset.x - rect.left) / rect.width) * 100;
        const y = ((dragEvent.clientY - this.dragOffset.y - rect.top) / rect.height) * 100;

        // Saha sınırları içinde tut
        const cardWidth = (this.draggedCard.offsetWidth / rect.width) * 100;
        const cardHeight = (this.draggedCard.offsetHeight / rect.height) * 100;

        const boundedX = Math.max(cardWidth / 2, Math.min(100 - cardWidth / 2, x));
        const boundedY = Math.max(cardHeight / 2, Math.min(100 - cardHeight / 2, y));

        // En yakın formasyon noktasını bul
        const points = document.querySelectorAll('.formation-point');
        let closestPoint: HTMLElement | null = null;
        let minDistance = Infinity;

        points.forEach(point => {
          const pointElement = point as HTMLElement;
          const pointX = parseFloat(pointElement.style.left);
          const pointY = parseFloat(pointElement.style.top);
          const distance = Math.sqrt(
            Math.pow(boundedX - pointX, 2) +
            Math.pow(boundedY - pointY, 2)
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = pointElement;
          }
        });

        // Yakın noktayı vurgula - daha geniş tolerans
        points.forEach(p => p.classList.remove('highlight'));
        if (minDistance < 25 && closestPoint) {
          (closestPoint as HTMLElement).classList.add('highlight');
        }
      });

      field.addEventListener('drop', (e: Event) => {
        e.preventDefault();
        if (!this.draggedCard) return;

        const dragEvent = e as DragEvent;
        const rect = field.getBoundingClientRect();
        const x = ((dragEvent.clientX - this.dragOffset.x - rect.left) / rect.width) * 100;
        const y = ((dragEvent.clientY - this.dragOffset.y - rect.top) / rect.height) * 100;

        console.log('Drop event triggered at:', x, y);

        // En yakın formasyon noktasını bul
        const points = document.querySelectorAll('.formation-point');
        console.log('Found formation points:', points.length);
        
        let closestPoint: HTMLElement | null = null;
        let minDistance = Infinity;

        points.forEach((point, index) => {
          const pointElement = point as HTMLElement;
          const pointX = parseFloat(pointElement.style.left);
          const pointY = parseFloat(pointElement.style.top);
          const distance = Math.sqrt(
            Math.pow(x - pointX, 2) +
            Math.pow(y - pointY, 2)
          );
          
          console.log(`Point ${index}: ${pointX}%, ${pointY}%, distance: ${distance}`);

          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = pointElement;
          }
        });

        console.log('Closest point distance:', minDistance);

        // Kartı yerleştir - daha geniş tolerans
        if (minDistance < 25 && closestPoint) {
          console.log('Placing card at formation point');
          
          const currentFormation = this.selectedFormation;
          const pointIndex = parseInt((closestPoint as HTMLElement).dataset['index'] || '0');
          const allowedRoles = this.formations[currentFormation].positions[pointIndex].allowedRoles;

          // Check if the position is already occupied by this specific point
          const existingCard = document.querySelector(`#cardContainer .player-card[style*="left: ${(closestPoint as HTMLElement).style.left}"][style*="top: ${(closestPoint as HTMLElement).style.top}"]`);
          if (existingCard) {
            alert('Bu pozisyon dolu!');
            return;
          }

          // Check if the card already exists on the bench - allow both bench and field
          const cardId = this.draggedCard.id;
          const existingBenchCard = document.querySelector(`.bench-slot .player-card[id="${cardId}"]`) as HTMLElement;
          if (existingBenchCard) {
            // Don't move from bench - allow same player on both bench and field
            console.log('Player is on bench, but allowing placement on field too');
          }

          // Check if a card with the same player name is on the bench - allow both
          const playerName = this.draggedCard.querySelector('.player-name')?.textContent?.trim();
          if (playerName) {
            const existingBenchCardByName = document.querySelector(`.bench-slot .player-card .player-name`);
            if (existingBenchCardByName && existingBenchCardByName.textContent?.trim() === playerName) {
              // Don't move from bench - allow same player on both bench and field
              console.log('Player with same name is on bench, but allowing placement on field too');
            }
          }

          // Check if the card already exists on the field (for position change)
          const existingFieldCard = document.querySelector(`#cardContainer .player-card[id="${cardId}"]`);
          if (existingFieldCard) {
            // If it's a position change, check if the new position is allowed
            if (!this.isPositionAllowed(this.draggedCard, allowedRoles)) {
              alert('Bu oyuncu bu pozisyonda oynayamaz!');
              return;
            }
            // Only remove the specific card that's being moved, not all cards
            existingFieldCard.remove();
            const oldPoint = document.querySelector(`.formation-point[style*="left: ${(existingFieldCard as HTMLElement).style.left}"][style*="top: ${(existingFieldCard as HTMLElement).style.top}"]`);
            if (oldPoint) oldPoint.classList.remove('occupied');
          } else if (!this.isPositionAllowed(this.draggedCard, allowedRoles)) {
            // If it's a new card, check if the position is allowed
            alert('Bu oyuncu bu pozisyonda oynayamaz!');
            return;
          }

          const fieldCard = this.draggedCard.cloneNode(true) as HTMLElement;
          
          fieldCard.style.position = 'absolute';
          fieldCard.style.left = (closestPoint as HTMLElement).style.left;
          fieldCard.style.top = (closestPoint as HTMLElement).style.top;
          fieldCard.style.transform = 'translate(-50%, -50%) scale(1)';
          fieldCard.style.zIndex = '100';
          fieldCard.style.cursor = 'default';
          fieldCard.style.pointerEvents = 'all';

          // Create delete button
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-button';
          deleteButton.innerHTML = '×';
          deleteButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            fieldCard.remove();
            closestPoint?.classList.remove('occupied');
            closestPoint?.classList.remove('highlight');
            if (closestPoint) {
              (closestPoint as HTMLElement).style.display = 'flex';
            }
          };

          fieldCard.appendChild(deleteButton);

          // Add the card to the field
          const cardContainer = document.getElementById('cardContainer');
          if (cardContainer) {
            cardContainer.appendChild(fieldCard);
            (closestPoint as HTMLElement).classList.add('occupied');
            (closestPoint as HTMLElement).style.display = 'none';
            points.forEach(p => p.classList.remove('highlight'));

            console.log('Card placed successfully');
          }
        } else {
          console.log('No formation point close enough');
        }
      });

      console.log('Field drag and drop setup completed');
    }, 200);
  }

  private initializeFormation() {
    this.createFormationPoints(this.selectedFormation);
  }

  createFormationPoints(formation: string) {
    console.log('Creating formation points for:', formation);
    
    // @ViewChild yerine direkt DOM'dan bul
    let formationPoints = document.querySelector('.formation-points') as HTMLElement;
    if (!formationPoints) {
      console.error('Formation points element not found - trying alternative selector');
      // Alternatif olarak field-container içinde ara
      const fieldContainer = document.querySelector('.field-container');
      if (fieldContainer) {
        console.log('Field container found, creating formation points container');
        const newContainer = document.createElement('div');
        newContainer.className = 'formation-points';
        fieldContainer.insertBefore(newContainer, fieldContainer.firstChild);
        formationPoints = newContainer;
      } else {
        console.error('Field container not found either');
        return;
      }
    }

    formationPoints.innerHTML = '';

    const formationData = this.formations[formation];
    if (!formationData) {
      console.error('Formation data not found for:', formation);
      return;
    }

    console.log('Formation data:', formationData);
    console.log('Number of positions:', formationData.positions.length);

    formationData.positions.forEach((pos, index) => {
      const point = document.createElement('div');
      point.className = 'formation-point';
      point.style.left = `${pos.x}%`;
      point.style.top = `${pos.y}%`;
      point.style.position = 'absolute';
      point.style.width = '50px';
      point.style.height = '50px';
      point.style.borderRadius = '50%';
      point.style.background = 'rgba(255, 255, 255, 0.2)';
      point.style.border = '2px dashed rgba(255, 255, 255, 0.8)';
      point.style.transform = 'translate(-50%, -50%)';
      point.style.display = 'flex';
      point.style.alignItems = 'center';
      point.style.justifyContent = 'center';
      point.style.color = 'rgba(255, 255, 255, 0.9)';
      point.style.fontSize = '14px';
      point.style.fontWeight = 'bold';
      point.style.zIndex = '5';
      point.style.pointerEvents = 'auto';
      point.style.opacity = '1';
      point.style.visibility = 'visible';
      point.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
      point.style.cursor = 'pointer';
      point.textContent = pos.role;
      point.setAttribute('data-index', index.toString());

      const indicator = document.createElement('div');
      indicator.className = 'position-indicator';
      indicator.style.display = 'none';
      indicator.textContent = `${pos.role} (${pos.allowedRoles.join(', ')})`;
      point.appendChild(indicator);

      formationPoints.appendChild(point);
      console.log(`Created formation point ${index}: ${pos.role} at (${pos.x}%, ${pos.y}%)`);
    });

    console.log('Total formation points created:', formationPoints.children.length);
  }

  private initializeBench() {
    const benchSlots = document.querySelectorAll('.bench-slot');
    benchSlots.forEach(slot => {
      slot.addEventListener('dragover', (e: Event) => this.handleBenchDragOver(e as DragEvent));
      slot.addEventListener('drop', (e: Event) => this.handleBenchDrop(e as DragEvent));
      slot.addEventListener('dragleave', (e: Event) => this.handleBenchDragLeave(e as DragEvent));
    });
  }

  private handleBenchDragOver(e: DragEvent) {
    e.preventDefault();
    const benchSlot = e.currentTarget as HTMLElement;
    const cardPosition = this.draggedCard?.getAttribute('data-position');
    const slotPosition = benchSlot.getAttribute('data-position');

    if (this.isValidBenchPosition(cardPosition || null, slotPosition || null)) {
      benchSlot.classList.add('drag-over');
    }
  }

  private handleBenchDragLeave(e: DragEvent) {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  private handleBenchDrop(e: DragEvent) {
    e.preventDefault();
    const slot = (e.target as HTMLElement).closest('.bench-slot') as HTMLElement;
    if (!slot || !this.draggedCard) return;

    const cardPosition = this.draggedCard.dataset['position'];
    const slotPosition = slot.dataset['position'];

    if (this.isValidBenchPosition(cardPosition || null, slotPosition || null)) {
      // Check if this player is already on the bench
      const playerName = this.draggedCard.querySelector('.player-name')?.textContent?.trim();
      if (playerName) {
        const existingBenchCardByName = document.querySelector(`.bench-slot .player-card .player-name`);
        if (existingBenchCardByName && existingBenchCardByName.textContent?.trim() === playerName) {
          alert('Bu oyuncu zaten yedek kulübesinde!');
          return;
        }
      }

      // Check if this player is on the field - allow both field and bench
      const existingFieldCard = document.querySelector(`#cardContainer .player-card[id="${this.draggedCard.id}"]`);
      if (existingFieldCard) {
        // Don't move from field - allow same player on both field and bench
        console.log('Player is on field, but allowing placement on bench too');
      }

      // Check if a card with the same player name is on the field - allow both
      if (playerName) {
        const existingFieldCardByName = document.querySelector(`#cardContainer .player-card .player-name`);
        if (existingFieldCardByName && existingFieldCardByName.textContent?.trim() === playerName) {
          // Don't move from field - allow same player on both field and bench
          console.log('Player with same name is on field, but allowing placement on bench too');
        }
      }

      const existingCard = slot.querySelector('.player-card');
      if (existingCard) {
        existingCard.remove();
      }

      const cardClone = this.draggedCard.cloneNode(true) as HTMLElement;
      cardClone.classList.remove('dragging');

      const addButton = cardClone.querySelector('.add-button');
      if (addButton) {
        addButton.remove();
      }

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.innerHTML = '×';
      deleteButton.onclick = () => {
        cardClone.remove();
        slot.classList.remove('occupied');
        const placeholder = slot.querySelector('.bench-placeholder') as HTMLElement;
        if (placeholder) placeholder.style.display = 'block';
      };
      cardClone.appendChild(deleteButton);

      const placeholder = slot.querySelector('.bench-placeholder') as HTMLElement;
      if (placeholder) placeholder.style.display = 'none';
      
      cardClone.style.position = 'relative';
      cardClone.style.transform = 'none';
      cardClone.style.margin = '0';
      slot.appendChild(cardClone);
      slot.classList.add('occupied');
    } else {
      alert('Bu oyuncu bu yedek pozisyonunda oynayamaz!');
    }
  }

  private isValidBenchPosition(cardPos: string | null, slotPos: string | null): boolean {
    if (!cardPos || !slotPos) return false;

    const positionMappings: { [key: string]: string[] } = {
      'GK': ['GK'],
      'RB': ['RB', 'RWB'],
      'CB': ['CB'],
      'LB': ['LB', 'LWB'],
      'CM': ['CM'],
      'CDM': ['CDM'],
      'CAM': ['CAM'],
      'RW': ['RM', 'RW'],
      'LW': ['LM', 'LW'],
      'ST': ['ST', 'CF']
    };

    return positionMappings[slotPos]?.includes(cardPos) || false;
  }

  private async loadDropdownData() {
    try {
      // Takımları yükle
      const teamsResponse = await fetch('/data/teams_lineup.json');
      const teamsData = await teamsResponse.json();
      this.teams = teamsData.teams;

      // Pozisyonları yükle
      const positionsResponse = await fetch('/data/positions.json');
      const positionsData = await positionsResponse.json();
      this.positions = positionsData.positions;

      // Formasyonları yükle
      const formationsResponse = await fetch('/data/formations.json');
      const formationsData = await formationsResponse.json();
      this.formationOptions = formationsData.formations;
    } catch (error) {
      console.error('Dropdown verileri yüklenirken hata oluştu:', error);
    }
  }

  private async loadAllTeamCards() {
    try {
      const teams = [
        'galatasaray', 'fenerbahce', 'besiktas', 'trabzonspor',
        'basaksehir', 'samsunspor', 'eyupspor', 'goztepe',
        'rizespor', 'kasimpasa', 'konyaspor', 'alanyaspor',
        'kayserispor', 'gaziantep', 'antalyaspor', 'kocaelispor',
        'genclerbirligi', 'karagumruk'
      ];

      let allCards: (Player | Manager)[] = [];

      for (const team of teams) {
        try {
          //const response = await fetch(`/data/${team}.json`);
          const response = await fetch(`${environment.apiUrl}/api/teams/${team}`);
          if (!response.ok) continue;

          const data: TeamData = await response.json();
          
          if (data.players) {
            const cards = data.players.map(player => ({
              ...player,
              teamName: data.cardTeamName
            }));
            
            if (data.manager) {
              const managerCard: Manager = {
                ...data.manager,
                position: 'MAN',
                ratingPosition: 'TEKNİK DİREKTÖR',
                teamName: data.cardTeamName
              };
              allCards.push(managerCard);
            }
            
            allCards = [...allCards, ...cards];
          }
        } catch (error) {
          console.error(`${team} takımı yüklenirken hata:`, error);
        }
      }

      this.allCards = allCards;
      this.filterCards();
    } catch (error) {
      console.error('Tüm takım kartları yüklenirken hata:', error);
    }
  }

  filterCards() {
    let filteredCards = [...this.allCards];

    // Takım filtresi
    if (this.selectedTeam !== 'all') {
      filteredCards = filteredCards.filter(card => 
        card.teamName?.toLowerCase() === this.selectedTeam.toLowerCase()
      );
    }

    // Pozisyon filtresi
    if (this.selectedPosition) {
      filteredCards = filteredCards.filter(card => {
        const pos = card.position;
        switch (this.selectedPosition) {
          case 'GK':
            return pos === 'GK';
          case 'DEF':
            return ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos);
          case 'MID':
            return ['CM', 'CDM', 'CAM', 'LM', 'RM', 'AM'].includes(pos);
          case 'FW':
            return ['ST', 'CF', 'LW', 'RW', 'FW'].includes(pos);
          case 'MAN':
            return pos === 'MAN';
          default:
            return true;
        }
      });
    }

    this.displayCards(filteredCards);
  }

  private displayCards(cards: (Player | Manager)[]) {
    if (!this.cardsContainer?.nativeElement) return;

    const container = this.cardsContainer.nativeElement;
    container.innerHTML = '';

    if (cards.length === 0) {
      container.innerHTML = `
        <div class="no-cards-message">
          ${this.selectedTeam === 'all' ? 
            'Seçilen pozisyonda oyuncu bulunamadı' : 
            `${this.selectedTeam.toUpperCase()} takımında seçilen pozisyonda oyuncu bulunamadı`}
        </div>
      `;
      return;
    }

    cards.forEach(card => {
      const cardElement = this.createCardElement(card);
      container.appendChild(cardElement);
    });
  }

  private createCardElement(card: Player | Manager): HTMLElement {
    const cardElement = document.createElement('div');
    cardElement.className = `player-card ${card.teamName || ''}`;
    cardElement.draggable = true;
    cardElement.dataset['position'] = card.position;
    // Her karta benzersiz ve doğru bir id ata
    cardElement.id = card.id && card.id !== 'undefined' ? card.id : `player-${Math.random().toString(36).substr(2, 9)}`;

    const isManager = card.position === 'MAN';
    const ratingBadgeStyle = isManager ? 
      'style="background: linear-gradient(145deg, #C0C0C0 0%, #A0A0A0 100%)"' : '';
    const ratingNumberStyle = isManager ? 'style="color: #000000"' : '';
    const ratingTypeStyle = isManager ? 'style="color: #000000"' : '';

    cardElement.innerHTML = `
      <div class="card-glow"></div>
      <div class="card-shine"></div>
      ${!isManager && (card as Player).isCaptain ? '<div class="captain-badge">C</div>' : ''}

      <div class="rating-badge" ${ratingBadgeStyle}>
        <div class="rating-number" ${ratingNumberStyle}>${card.rating}</div>
        <div class="rating-type" ${ratingTypeStyle}>${card.position}</div>
      </div>

      <div class="position-badge">${card.ratingPosition}</div>

      <div class="player-image-container">
        <div class="player-image">
          <img src="${card.image}" alt="${card.name}" onerror="this.src='${isManager ? 'https://cdn-icons-png.flaticon.com/512/4206/4206265.png' : 'https://cdn-icons-png.flaticon.com/512/607/607445.png'}'">
        </div>
      </div>

      <div class="player-info">
        <div class="player-name">${card.name}</div>

        <div class="player-stats">
          ${isManager ? `
            <div class="stat">
              <div class="stat-value">${(card as Manager).stats.tactic}</div>
              <div class="stat-label">TAK</div>
            </div>
            <div class="stat">
              <div class="stat-value">${(card as Manager).stats.motivation}</div>
              <div class="stat-label">MOT</div>
            </div>
            <div class="stat">
              <div class="stat-value">${(card as Manager).stats.leadership}</div>
              <div class="stat-label">LİD</div>
            </div>
          ` : Object.entries((card as Player).stats).map(([stat, value]) => 
            value ? `
            <div class="stat">
              <div class="stat-value">${value}</div>
              <div class="stat-label">${stat.toUpperCase()}</div>
            </div>
          ` : '').join('')}
        </div>

        <div class="player-details">
          <div>
            <img src="${card.nationality.flag}" alt="${card.nationality.name}" class="country-flag">
            ${card.nationality.code || card.nationality.name} • ${card.age} yaş
          </div>
          <div>${isManager ? 'MAN' : `# ${(card as Player).number}`}</div>
        </div>
      </div>

      <!-- Mobile + button for adding to field -->
      <button class="add-button">+</button>
    `;

    // Add drag event listeners
    cardElement.addEventListener('dragstart', this.handleDragStart.bind(this));
    cardElement.addEventListener('dragend', this.handleDragEnd.bind(this));

    // Add + button event listener
    const addButton = cardElement.querySelector('.add-button');
    if (addButton) {
      addButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.autoPlaceCard(cardElement);
      });
    }

    // Add autoPlace method to the element
    (cardElement as any).autoPlace = () => this.autoPlaceCard(cardElement);

    return cardElement;
  }

  private handleDragStart(e: DragEvent) {
    const card = (e.target as HTMLElement).closest('.player-card') as HTMLElement;
    if (!card) return;

    this.draggedCard = card;
    this.draggedCard.classList.add('dragging');

    // Add dragging class to bench-positions container only
    const benchPositions = document.querySelector('.bench-positions');
    if (benchPositions) {
      benchPositions.classList.add('dragging');
    }

    const rect = card.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;

    const dragImage = card.cloneNode(true) as HTMLElement;
            dragImage.style.transform = 'translate(-50%, -50%) scale(0.6)';
    dragImage.style.opacity = '0.9';
    dragImage.style.position = 'fixed';
    dragImage.style.left = '-1000px';
    dragImage.style.top = '-1000px';
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    
    e.dataTransfer?.setDragImage(dragImage, this.dragOffset.x, this.dragOffset.y);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.id);
    }

    requestAnimationFrame(() => {
      document.body.removeChild(dragImage);
    });
  }

  private handleDragEnd(e: DragEvent) {
    if (this.draggedCard) {
      this.draggedCard.classList.remove('dragging');
      this.draggedCard = null;
    }

    // Remove dragging class from bench-positions container
    const benchPositions = document.querySelector('.bench-positions');
    if (benchPositions) {
      benchPositions.classList.remove('dragging');
    }
  }

  private autoPlaceCard(card: HTMLElement) {
    if (!card) return;

    const cardPosition = card.querySelector('.rating-type')?.textContent;
    if (!cardPosition) return;

    // Check if this exact card element is already on the field
    const existingFieldCard = document.querySelector(`#cardContainer .player-card[id="${card.id}"]`);
    if (existingFieldCard) {
      alert('Bu oyuncu zaten sahada!');
      return;
    }

    // Check if a card with the same player name is already on the field
    const playerName = card.querySelector('.player-name')?.textContent?.trim();
    if (playerName) {
      const existingFieldCardByName = document.querySelector(`#cardContainer .player-card .player-name`);
      if (existingFieldCardByName && existingFieldCardByName.textContent?.trim() === playerName) {
        alert('Bu oyuncu zaten sahada!');
        return;
      }
    }

    // Check if this player is already on the bench - allow both bench and field
    const existingBenchCard = document.querySelector(`.bench-slot .player-card[id="${card.id}"]`) as HTMLElement;
    if (existingBenchCard) {
      // Don't move from bench - allow same player on both bench and field
      console.log('Player is on bench, but allowing placement on field too');
    }

    // Check if a card with the same player name is on the bench - allow both
    if (playerName) {
      const existingBenchCardByName = document.querySelector(`.bench-slot .player-card .player-name`);
      if (existingBenchCardByName && existingBenchCardByName.textContent?.trim() === playerName) {
        // Don't move from bench - allow same player on both bench and field
        console.log('Player with same name is on bench, but allowing placement on field too');
      }
    }

    if (cardPosition === 'MAN') {
      this.placeManagerCard(card);
      return;
    }

    // Önce saha'ya eklemeye çalış, yoksa bench'e
    const formationData = this.formations[this.selectedFormation];
    if (formationData) {
      let foundPosition: HTMLElement | null = null;
      
      for (let i = 0; i < formationData.positions.length; i++) {
        const pos = formationData.positions[i];
        const point = document.querySelector(`.formation-point[data-index="${i}"]`) as HTMLElement;
        
        if (!point) continue;

        const pointLeft = point.style.left;
        const pointTop = point.style.top;
        
        if (!pointLeft || !pointTop) continue;

        const existingCard = document.querySelector(`#cardContainer .player-card[style*="left: ${pointLeft}"][style*="top: ${pointTop}"]`);
        
        if (!existingCard && this.isPositionAllowed(card, pos.allowedRoles)) {
          foundPosition = point;
          break;
        }
      }

      if (foundPosition) {
        // Saha'da boş yer var, oraya ekle
        this.placePlayerCard(card);
        return;
      }
    }

    // Saha'da yer yok, bench'e ekle
    this.tryPlaceOnBench(card);
  }

  private placeManagerCard(card: HTMLElement) {
    const isMobile = window.innerWidth <= 768;
    const managerArea = isMobile 
      ? document.querySelector('.mobile-manager-section .manager-area')
      : document.querySelector('.field-container .manager-area');
        
    if (!managerArea) return;

    const existingManager = managerArea.querySelector('.player-card');
    if (existingManager) {
      alert('Zaten bir teknik direktör var!');
      return;
    }

    const fieldCard = card.cloneNode(true) as HTMLElement;
    
    const addButton = fieldCard.querySelector('.add-button');
    if (addButton) {
      addButton.remove();
    }
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '×';
    deleteButton.onclick = () => {
      fieldCard.remove();
      managerArea.innerHTML = '<div class="manager-placeholder">Teknik Direktör</div>';
    };
    fieldCard.appendChild(deleteButton);

    managerArea.innerHTML = '';
    managerArea.appendChild(fieldCard);

    if (isMobile) {
      fieldCard.style.margin = '0';
      fieldCard.style.minWidth = '160px';
    }
  }

  private placePlayerCard(card: HTMLElement) {
    // Eğer aynı id'li oyuncu bench'te varsa sahaya eklenemez
    const cardId = card.id;
    const existingBenchCard = document.querySelector(`.bench-slot .player-card[id="${cardId}"]`);
    if (existingBenchCard) {
      alert('Bu oyuncu zaten yedek kulübesinde! Aynı oyuncu hem sahada hem yedek kulübesinde olamaz.');
      return;
    }

    const formationData = this.formations[this.selectedFormation];
    if (!formationData) return;

    let foundPosition: HTMLElement | null = null;
    
    for (let i = 0; i < formationData.positions.length; i++) {
      const pos = formationData.positions[i];
      const point = document.querySelector(`.formation-point[data-index="${i}"]`) as HTMLElement;
      
      if (!point) continue;

      const pointLeft = point.style.left;
      const pointTop = point.style.top;
      
      if (!pointLeft || !pointTop) continue;

      const existingCard = document.querySelector(`#cardContainer .player-card[style*="left: ${pointLeft}"][style*="top: ${pointTop}"]`);
      
      if (!existingCard && this.isPositionAllowed(card, pos.allowedRoles)) {
        foundPosition = point;
        break;
      }
    }

    if (foundPosition) {
      const fieldCard = card.cloneNode(true) as HTMLElement;
      const addButton = fieldCard.querySelector('.add-button');
      if (addButton) {
        addButton.remove();
      }
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.innerHTML = '×';
      deleteButton.onclick = () => fieldCard.remove();
      fieldCard.appendChild(deleteButton);
      
      const captainBadge = card.querySelector('.captain-badge');
      if (captainBadge) {
        const newCaptainBadge = captainBadge.cloneNode(true);
        fieldCard.appendChild(newCaptainBadge);
      }
      
      fieldCard.style.position = 'absolute';
      fieldCard.style.left = foundPosition.style.left;
      fieldCard.style.top = foundPosition.style.top;
      fieldCard.style.transform = 'translate(-50%, -50%) scale(1)';
      fieldCard.style.zIndex = '50';
      fieldCard.style.cursor = 'move';
      fieldCard.style.pointerEvents = 'all';
      
      const cardContainer = document.getElementById('cardContainer');
      if (cardContainer) {
        cardContainer.appendChild(fieldCard);
        this.makeDraggable(fieldCard);
      }
    } else {
      // No suitable position found on field, try bench
      this.tryPlaceOnBench(card);
    }
  }

  private tryPlaceOnBench(card: HTMLElement) {
    const cardPosition = card.querySelector('.rating-type')?.textContent;
    if (!cardPosition) return;

    // Eğer aynı id'li oyuncu sahada varsa benche eklenemez
    const cardId = card.id;
    const existingFieldCard = document.querySelector(`#cardContainer .player-card[id="${cardId}"]`);
    if (existingFieldCard) {
      alert('Bu oyuncu zaten sahada! Aynı oyuncu hem sahada hem yedek kulübesinde olamaz.');
      return;
    }

    // Check if this player is already on the bench - allow multiple bench slots
    const playerName = card.querySelector('.player-name')?.textContent?.trim();
    if (playerName) {
      const existingBenchCardByName = document.querySelector(`.bench-slot .player-card .player-name`);
      if (existingBenchCardByName && existingBenchCardByName.textContent?.trim() === playerName) {
        console.log('Player is already on bench, but allowing multiple bench slots');
      }
    }

    // Check if a card with the same player name is on the field - allow both
    if (playerName) {
      const existingFieldCardByName = document.querySelector(`#cardContainer .player-card .player-name`);
      if (existingFieldCardByName && existingFieldCardByName.textContent?.trim() === playerName) {
        // Don't move from field - allow same player on both field and bench
        console.log('Player with same name is on field, but allowing placement on bench too');
      }
    }

    const benchSlots = document.querySelectorAll('.bench-slot');
    let benchPlaced = false;

    for (const slot of benchSlots) {
      const slotPosition = slot.getAttribute('data-position');
      
      if (!slot.querySelector('.player-card') && this.isValidBenchPosition(cardPosition, slotPosition || null)) {
        const benchCard = card.cloneNode(true) as HTMLElement;
        
        const addButton = benchCard.querySelector('.add-button');
        if (addButton) {
          addButton.remove();
        }

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '×';
        deleteButton.onclick = () => {
          benchCard.remove();
          slot.classList.remove('occupied');
          const placeholder = slot.querySelector('.bench-placeholder') as HTMLElement;
          if (placeholder) placeholder.style.display = 'block';
        };
        benchCard.appendChild(deleteButton);

        const placeholder = slot.querySelector('.bench-placeholder') as HTMLElement;
        if (placeholder) placeholder.style.display = 'none';
        
        // Check if mobile
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            benchCard.style.position = 'relative';
            benchCard.style.transform = 'none';
            benchCard.style.margin = '0';
            benchCard.style.width = '80px';
            benchCard.style.height = '80px';
            benchCard.style.borderRadius = '50%';
        } else {
            benchCard.style.position = 'absolute';
            benchCard.style.top = '50%';
            benchCard.style.left = '50%';
            benchCard.style.transform = 'translate(-50%, -50%) scale(1)';
            benchCard.style.margin = '0';
            benchCard.style.width = '140px';
            benchCard.style.height = '200px';
        }
        
        slot.appendChild(benchCard);
        slot.classList.add('occupied');
        
        benchPlaced = true;
        break;
      }
    }

    if (!benchPlaced) {
      alert('Bu oyuncu için ne sahada ne de yedek kulübesinde uygun pozisyon bulunamadı!');
    }
  }

  private isPositionAllowed(card: HTMLElement, allowedRoles: string[]): boolean {
    if (!card || !allowedRoles) return false;

    const cardType = card.dataset['position'];
    if (cardType === 'MAN') {
      return false;
    }

    const positionMappings: { [key: string]: string[] } = {
      'ST': ['ST', 'CF'],
      'CF': ['ST', 'CF'],
      'LW': ['LW', 'LM'],
      'RW': ['RW', 'RM'],
      'LM': ['LM', 'LW'],
      'RM': ['RM', 'RW'],
      'CAM': ['CAM', 'CM'],
      'CM': ['CM', 'CAM', 'CDM'],
      'CDM': ['CDM', 'CM'],
      'LB': ['LB', 'LWB'],
      'RB': ['RB', 'RWB'],
      'CB': ['CB', 'SW'],
      'GK': ['GK']
    };

    const possiblePositions = positionMappings[cardType || ''] || [];
    return possiblePositions.some(pos => allowedRoles.includes(pos));
  }

  private makeDraggable(element: HTMLElement) {
    let isDragging = false;
    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;
    let xOffset = 0;
    let yOffset = 0;

    const dragStart = (e: MouseEvent) => {
      if (e.target === element || element.contains(e.target as Node)) {
        const rect = element.getBoundingClientRect();
        xOffset = rect.left + rect.width / 2;
        yOffset = rect.top + rect.height / 2;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        isDragging = true;
        element.style.zIndex = '1000';
        element.classList.add('dragging');
      }
    };

    const drag = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        const field = document.querySelector('.right-panel') as HTMLElement;
        if (!field) return;

        const fieldRect = field.getBoundingClientRect();
        const x = (currentX - fieldRect.left) / fieldRect.width * 100;
        const y = (currentY - fieldRect.top) / fieldRect.height * 100;

        const points = document.querySelectorAll('.formation-point');
        let closestPoint: HTMLElement | null = null;
        let minDistance = Infinity;

        points.forEach(point => {
          const pointElement = point as HTMLElement;
          const pointX = parseFloat(pointElement.style.left);
          const pointY = parseFloat(pointElement.style.top);
          const distance = Math.sqrt(
            Math.pow(x - pointX, 2) +
            Math.pow(y - pointY, 2)
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = pointElement;
          }
        });

        points.forEach(p => p.classList.remove('highlight'));
        if (minDistance < 15 && closestPoint) {
          (closestPoint as HTMLElement).classList.add('highlight');
        }

        const cardWidth = (element.offsetWidth / fieldRect.width) * 100;
        const cardHeight = (element.offsetHeight / fieldRect.height) * 100;

        const boundedX = Math.max(cardWidth / 2, Math.min(100 - cardWidth / 2, x));
        const boundedY = Math.max(cardHeight / 2, Math.min(100 - cardHeight / 2, y));

        element.style.left = `${boundedX}%`;
        element.style.top = `${boundedY}%`;
      }
    };

    const dragEnd = () => {
      if (isDragging) {
        isDragging = false;
        element.style.zIndex = '10';
        element.classList.remove('dragging');

        const rect = element.getBoundingClientRect();
        const field = document.querySelector('.right-panel') as HTMLElement;
        if (!field) return;

        const fieldRect = field.getBoundingClientRect();
        const x = ((rect.left + rect.width / 2) - fieldRect.left) / fieldRect.width * 100;
        const y = ((rect.top + rect.height / 2) - fieldRect.top) / fieldRect.height * 100;

        const points = document.querySelectorAll('.formation-point');
        let closestPoint: HTMLElement | null = null;
        let minDistance = Infinity;

        points.forEach(point => {
          const pointElement = point as HTMLElement;
          const pointX = parseFloat(pointElement.style.left);
          const pointY = parseFloat(pointElement.style.top);
          const distance = Math.sqrt(
            Math.pow(x - pointX, 2) +
            Math.pow(y - pointY, 2)
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = pointElement;
          }
        });

        if (minDistance < 15 && closestPoint) {
          element.style.left = (closestPoint as HTMLElement).style.left;
          element.style.top = (closestPoint as HTMLElement).style.top;
          (closestPoint as HTMLElement).classList.add('active');
        }

        points.forEach(p => p.classList.remove('highlight'));
      }
    };

    element.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
  }

  clearField() {
    const cardContainer = document.getElementById('cardContainer');
    if (cardContainer) {
      cardContainer.innerHTML = '';
    }
    
    const managerArea = document.getElementById('managerArea');
    if (managerArea) {
      const placeholder = document.createElement('div');
      placeholder.className = 'manager-placeholder';
      placeholder.textContent = 'TEKNİK DİREKTÖR';
      placeholder.style.color = '#ffffff';
      placeholder.style.textAlign = 'center';
      placeholder.style.fontSize = '16px';
      placeholder.style.opacity = '0.7';
      placeholder.style.fontWeight = '500';
      placeholder.style.textTransform = 'uppercase';
      placeholder.style.letterSpacing = '0.5px';
      placeholder.style.fontFamily = "'Roboto', sans-serif";
      managerArea.innerHTML = '';
      managerArea.appendChild(placeholder);
    }
    
    document.querySelectorAll('.formation-point').forEach(point => {
      point.classList.remove('occupied');
    });

    const benchSlots = document.querySelectorAll('.bench-slot');
    benchSlots.forEach(slot => {
      const card = slot.querySelector('.player-card');
      if (card) {
        this.returnCardToContainer(card as HTMLElement);
      }
      slot.classList.remove('occupied');
      const placeholder = slot.querySelector('.bench-placeholder') as HTMLElement;
      if (placeholder) placeholder.style.display = '';
    });
  }

  private returnCardToContainer(card: HTMLElement) {
    const cardsContainer = document.getElementById('cardsContainer');
    if (cardsContainer) {
      card.style.position = '';
      card.style.transform = '';
      card.style.margin = '';
      cardsContainer.appendChild(card);
    }
  }

  onFormationChange() {
    // Store existing players before changing formation
    const existingPlayers = document.querySelectorAll('#cardContainer .player-card');
    const playerData: Array<{card: HTMLElement, left: string, top: string}> = [];
    
    existingPlayers.forEach(player => {
      const card = player as HTMLElement;
      playerData.push({
        card: card,
        left: card.style.left,
        top: card.style.top
      });
    });

    // Create new formation points
    this.createFormationPoints(this.selectedFormation);

    // Restore players to their positions
    playerData.forEach(data => {
      const cardContainer = document.getElementById('cardContainer');
      if (cardContainer) {
        cardContainer.appendChild(data.card);
        data.card.style.left = data.left;
        data.card.style.top = data.top;
      }
    });
  }

  private clearManagerArea() {
    const managerArea = document.getElementById('managerArea');
    if (managerArea) {
      const placeholder = document.createElement('div');
      placeholder.className = 'manager-placeholder';
      placeholder.textContent = 'TEKNİK DİREKTÖR';
      placeholder.style.color = '#ffffff';
      placeholder.style.textAlign = 'center';
      placeholder.style.fontSize = '16px';
      placeholder.style.opacity = '0.7';
      placeholder.style.fontWeight = '500';
      placeholder.style.textTransform = 'uppercase';
      placeholder.style.letterSpacing = '0.5px';
      placeholder.style.fontFamily = "'Roboto', sans-serif";
      managerArea.innerHTML = '';
      managerArea.appendChild(placeholder);
      managerArea.classList.remove('occupied');
    }
  }

  private updateCardPositions() {
    // Update bench card positions based on screen size
    const isMobile = window.innerWidth <= 768;
    const benchCards = document.querySelectorAll('.bench-slot .player-card');
    
    benchCards.forEach(card => {
      const cardElement = card as HTMLElement;
      if (isMobile) {
        cardElement.style.position = 'relative';
        cardElement.style.transform = 'none';
        cardElement.style.margin = '0';
        cardElement.style.width = '80px';
        cardElement.style.height = '80px';
        cardElement.style.borderRadius = '50%';
      } else {
        cardElement.style.position = 'absolute';
        cardElement.style.top = '50%';
        cardElement.style.left = '50%';
        cardElement.style.transform = 'translate(-50%, -50%) scale(1)';
        cardElement.style.margin = '0';
        cardElement.style.width = '140px';
        cardElement.style.height = '200px';
        cardElement.style.borderRadius = '12px';
      }
    });
  }
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransfersService, TransferData, TransferPlayer } from '../../services/transfers.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-transfers',
  imports: [CommonModule],
  templateUrl: './transfers.html',
  styleUrl: './transfers.scss'
})
export class Transfers implements OnInit, AfterViewInit {
  transferData: TransferData | null = null;
  loading = true;
  error = false;
  activeFilter = 'all';
  selectedTeam = 'fenerbahce';

  constructor(
    private transfersService: TransfersService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    // Subscribe to team changes
    this.teamService.selectedTeam$.subscribe(team => {
      this.selectedTeam = team;
      this.loadTransfers();
    });
  }

  ngAfterViewInit() {
    // Enable enhanced scroll functionality
    this.enableEnhancedScroll();
  }

  private enableEnhancedScroll(): void {
    // Add touch event listeners for better mobile scroll experience
    const transfersContainer = document.querySelector('.transfers-wrapper') as HTMLElement;
    if (transfersContainer) {
      // Prevent default touch behaviors that might interfere with scrolling
      transfersContainer.addEventListener('touchstart', (e) => {
        // Allow default scroll behavior
      }, { passive: true });
      
      transfersContainer.addEventListener('touchmove', (e) => {
        // Allow default scroll behavior
      }, { passive: true });
      
      // Ensure the container is scrollable on mobile
      (transfersContainer.style as any).webkitOverflowScrolling = 'touch';
      transfersContainer.style.overflowY = 'auto';
    }

    // Add scroll animations for transfer cards
    this.addScrollAnimations();
  }

  private addScrollAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe transfer cards with a slight delay to allow DOM to render
    setTimeout(() => {
      const transferCards = document.querySelectorAll('.transfer-card');
      transferCards.forEach(card => observer.observe(card));
    }, 100);
  }

  async loadTransfers() {
    this.loading = true;
    this.error = false;
    try {
      this.transferData = await this.transfersService.getTransfers(this.selectedTeam);
      this.loading = false;
      
      // Re-apply scroll animations after data loads
      setTimeout(() => this.addScrollAnimations(), 100);
    } catch (error) {
      console.error('Error loading transfers:', error);
      this.error = true;
      this.loading = false;
    }
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    
    // Smooth scroll to top when filter changes
    const transfersWrapper = document.querySelector('.transfers-wrapper');
    if (transfersWrapper) {
      transfersWrapper.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getFilteredTransfers(): TransferPlayer[] {
    if (!this.transferData) return [];

    switch (this.activeFilter) {
      case 'incoming':
        return this.transferData.incomingTransfers;
      case 'outgoing':
        return this.transferData.outgoingTransfers;
      case 'all':
      default:
        return [...this.transferData.incomingTransfers, ...this.transferData.outgoingTransfers];
    }
  }

  getTransferTypeClass(transferType: string): string {
    switch (transferType.toLowerCase()) {
      case 'bedelsiz':
        return 'free';
      case 'kiralık':
        return 'loan';
      case 'diğer':
        return 'transfer';
      case 'bilinmiyor':
        return 'unknown';
      default:
        return 'transfer';
    }
  }

  formatLastUpdated(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('tr-TR', options);
  }

  formatNationalities(nationalities: string[]): string {
    return nationalities.join(', ');
  }

  getPlayerImageUrl(imageUrl: string): string {
    // Assuming images are stored in assets/players/ directory
    return `assets/players/${imageUrl}`;
  }

  getTotalTransferValue(): string {
    if (!this.transferData) return '0';
    
    let totalValue = 0;
    
    // Calculate incoming transfer values
    this.transferData.incomingTransfers.forEach(transfer => {
      const value = this.extractNumericValue(transfer.transferDetails);
      if (value > 0) totalValue += value;
    });

    // Subtract outgoing transfer values
    this.transferData.outgoingTransfers.forEach(transfer => {
      const value = this.extractNumericValue(transfer.transferDetails);
      if (value > 0) totalValue -= value;
    });

    return this.formatValue(totalValue);
  }

  private extractNumericValue(valueString: string): number {
    const match = valueString.match(/(\d+\.?\d*)\s*mil/);
    return match ? parseFloat(match[1]) : 0;
  }

  private formatValue(value: number): string {
    if (value === 0) return '0 €';
    const sign = value >= 0 ? '+' : '-';
    const absValue = Math.abs(value);
    return `${sign}${absValue.toFixed(2)} mil. €`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/default-player.png';
    }
  }

  trackByPlayerId(index: number, transfer: TransferPlayer): number {
    return transfer.playerId;
  }
} 
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.scss'
})
export class Player implements OnInit, AfterViewInit {

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    // Enable mobile scroll functionality
    this.enableMobileScroll();
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

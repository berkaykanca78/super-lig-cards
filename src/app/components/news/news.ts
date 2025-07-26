import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-news',
  imports: [],
  templateUrl: './news.html',
  styleUrl: './news.scss'
})
export class News implements OnInit, AfterViewInit {

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    // Enable mobile scroll functionality
    this.enableMobileScroll();
  }

  private enableMobileScroll(): void {
    // Add touch event listeners for better mobile scroll experience
    const newsContainer = document.querySelector('.news-container') as HTMLElement;
    if (newsContainer) {
      // Prevent default touch behaviors that might interfere with scrolling
      newsContainer.addEventListener('touchstart', (e) => {
        // Allow default scroll behavior
      }, { passive: true });
      
      newsContainer.addEventListener('touchmove', (e) => {
        // Allow default scroll behavior
      }, { passive: true });
      
      // Ensure the container is scrollable on mobile
      (newsContainer.style as any).webkitOverflowScrolling = 'touch';
      newsContainer.style.overflowY = 'auto';
    }
  }
}

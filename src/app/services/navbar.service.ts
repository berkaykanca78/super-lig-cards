import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
  public mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  setMobileMenuOpen(isOpen: boolean) {
    this.mobileMenuOpenSubject.next(isOpen);
  }

  getMobileMenuOpen(): boolean {
    return this.mobileMenuOpenSubject.value;
  }
} 
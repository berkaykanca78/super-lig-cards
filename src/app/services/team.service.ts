import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private selectedTeamSubject = new BehaviorSubject<string>('galatasaray');
  selectedTeam$ = this.selectedTeamSubject.asObservable();

  selectTeam(teamId: string) {
    console.log('TeamService: Selecting team:', teamId);
    this.selectedTeamSubject.next(teamId);
    console.log('TeamService: Current team is now:', this.selectedTeamSubject.value);
  }

  getCurrentTeam(): string {
    return this.selectedTeamSubject.value;
  }
} 
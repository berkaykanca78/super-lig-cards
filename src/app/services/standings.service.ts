import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TeamStanding {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StandingsService {

  constructor(private http: HttpClient) { }

  async getStandings(): Promise<TeamStanding[]> {
    // Return custom standings data
    const response = await fetch(`${environment.apiUrl}/api/standings`);
    const data = await response.json();
    console.log('standings data', data);
    return data as TeamStanding[];
    //return of(this.getCustomStandings());
  }

  // Method to manually refresh standings
  async refreshStandings(): Promise<TeamStanding[]> {
    return this.getStandings();
  }
} 
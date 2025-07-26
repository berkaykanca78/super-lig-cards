import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

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

  getStandings(): Observable<TeamStanding[]> {
    // Return custom standings data
    return of(this.getCustomStandings());
  }

  private getCustomStandings(): TeamStanding[] {
    return [
      {
        position: 1,
        teamName: 'ANTALYASPOR A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 2,
        teamName: 'BEŞİKTAŞ A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 3,
        teamName: 'CORENDON ALANYASPOR',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 4,
        teamName: 'ÇAYKUR RİZESPOR A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 5,
        teamName: 'FATİH KARAGÜMRÜK A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 6,
        teamName: 'FENERBAHÇE A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 7,
        teamName: 'GALATASARAY A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 8,
        teamName: 'GAZİANTEP FUTBOL KULÜBÜ A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 9,
        teamName: 'GENÇLERBİRLİĞİ',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 10,
        teamName: 'GÖZTEPE A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 11,
        teamName: 'İKAS EYÜPSPOR',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 12,
        teamName: 'KASIMPAŞA A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 13,
        teamName: 'KAYSERİSPOR FUTBOL A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 14,
        teamName: 'KOCAELİSPOR',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 15,
        teamName: 'KONYASPOR',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 16,
        teamName: 'RAMS BAŞAKŞEHİR FUTBOL KULÜBÜ',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 17,
        teamName: 'SAMSUNSPOR A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      },
      {
        position: 18,
        teamName: 'TRABZONSPOR A.Ş.',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: ['-', '-', '-', '-', '-']
      }
    ];
  }

  // Method to manually refresh standings
  refreshStandings(): Observable<TeamStanding[]> {
    return this.getStandings();
  }
} 
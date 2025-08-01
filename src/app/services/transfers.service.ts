import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface TransferPlayer {
  playerName: string;
  age: number;
  nationalities: string[];
  position: string;
  positionShort: string;
  marketValue: string;
  fromClub: string;
  fromClubUrl: string;
  toClub: string;
  toClubUrl: string;
  transferDetails: string;
  transferType: string;
  playerUrl: string;
  playerId: number;
  imageUrl: string;
  isIncoming: boolean;
}

export interface TransferData {
  teamName: string;
  season: string;
  lastUpdated: string;
  incomingTransfers: TransferPlayer[];
  outgoingTransfers: TransferPlayer[];
  totalIncoming: number;
  totalOutgoing: number;
  transferBalance: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransfersService {
  private readonly baseUrl = `${environment.apiUrl}/api/Transfers`;

  async getTransfers(teamName: string): Promise<TransferData> {
    try {
      const response = await fetch(`${this.baseUrl}/${teamName.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading transfers:', error);
      throw error;
    }
  }
} 
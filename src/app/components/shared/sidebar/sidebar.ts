import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../../services/team.service';
import { environment } from '../../../../environments/environment';

// TypeScript interfaces for team data
interface Team {
  id: string;
  name: string;
  logo: string;
  stadium: string;
}

interface TeamsData {
  teams: Team[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  @Output() teamSelected = new EventEmitter<string>();
  version: string = '1.0.0';

  teams: Team[] = [];
  loading = true;
  error: string | null = null;
  isSidebarOpen = false;
  currentTeamId: string = 'galatasaray';

  constructor(public teamService: TeamService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.generateTeamsList();
    this.getVersion();

    // Set initial current team
    this.currentTeamId = this.teamService.getCurrentTeam();

    // Subscribe to team changes to update active state
    this.teamService.selectedTeam$.subscribe(teamId => {
      console.log('Sidebar received team update:', teamId);
      this.currentTeamId = teamId;
      console.log('Sidebar currentTeamId set to:', this.currentTeamId);
      this.cdr.detectChanges(); // Force change detection
    });
  }

  async getVersion() {
    const response = await fetch(`${environment.apiUrl}/api/version`);
    const data = await response.json();
    this.version = data.version;
    console.log('Version:', this.version);
  }

  async generateTeamsList() {
    try {
      this.loading = true;
      this.error = null;

      const response = await fetch('/data/teams.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TeamsData = await response.json();
      this.teams = data.teams;

    } catch (error) {
      console.error('Error loading teams:', error);
      this.error = 'Failed to load teams data';
    } finally {
      this.loading = false;
    }
  }

  onTeamSelect(teamId: string) {
    console.log('Team selected:', teamId);
    this.currentTeamId = teamId; // Immediately update current team
    console.log('Current team ID updated to:', this.currentTeamId);
    this.teamService.selectTeam(teamId);
    this.teamSelected.emit(teamId);
    this.cdr.detectChanges(); // Force change detection
    this.closeSidebar(); // Close sidebar on mobile after selection
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}

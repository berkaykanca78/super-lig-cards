import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/shared/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/shared/sidebar/sidebar';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  constructor(private teamService: TeamService) {}

  onTeamSelected(teamId: string) {
    this.teamService.selectTeam(teamId);
  }
}

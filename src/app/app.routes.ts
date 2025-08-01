import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Standings } from './components/standings/standings';
import { News } from './components/news/news';
import { Results } from './components/results/results';
import { Stats } from './components/stats/stats';
import { Lineup } from './components/lineup/lineup';
import { Fixtures } from './components/fixtures/fixtures';
import { Player } from './components/player/player';
import { Transfers } from './components/transfers/transfers';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'standings', component: Standings },
      { path: 'results', component: Results },
      { path: 'news', component: News },
      { path: 'stats', component: Stats },
      { path: 'fixtures', component: Fixtures },
      { path: 'transfers', component: Transfers },
      { path: 'player/:id', component: Player },
    ]
  },
  {
    path: 'lineup',
    component: Lineup,
    children: [
    ]
  }
];

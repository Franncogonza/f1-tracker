import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./pages/welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'pilots-search',
    loadComponent: () =>
      import('./pages/pilots-search/pilots-search.component').then((m) => m.PilotsSearchComponent),
  },
  {
    path: 'standings',
    loadComponent: () =>
      import('./pages/standings/standings.component').then((m) => m.StandingsComponent),
  },
  {
  path: 'teams',
  loadComponent: () =>
    import('./pages/teams/teams.component').then((m) => m.TeamsComponent),
},
{
  path: 'teams/:teamId/drivers/:year',
  loadComponent: () =>
    import('./pages/team-drivers/team-drivers.component').then(m => m.TeamDriversComponent),
}



];

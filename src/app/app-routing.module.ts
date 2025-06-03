import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'teams', loadChildren: () => import('./features/teams/teams.module').then(m => m.TeamsModule) }, 
  { path: 'drivers', loadChildren: () => import('./features/drivers/drivers.module').then(m => m.DriversModule) },
  { path: 'constructors', loadChildren: () => import('./features/constructors/constructors.module').then(m => m.ConstructorsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

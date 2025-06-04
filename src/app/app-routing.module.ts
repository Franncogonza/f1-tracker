import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },        // redirección por defecto
  { path: 'home', component: HomeComponent },                 // landing accesible como /home
  { path: 'teams', loadChildren: () => import('./features/teams/teams.module').then(m => m.TeamsModule) },
  { path: 'drivers', loadChildren: () => import('./features/drivers/drivers.module').then(m => m.DriversModule) },
  { path: 'constructors', loadChildren: () => import('./features/constructors/constructors.module').then(m => m.ConstructorsModule) },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

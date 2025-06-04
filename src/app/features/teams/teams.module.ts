import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { NzZorroModule } from '../../shared/modules/nz-zorro/nz-zorro.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TeamsComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    NzZorroModule,
    FormsModule
  ]
})
export class TeamsModule { }

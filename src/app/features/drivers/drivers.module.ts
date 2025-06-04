import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriversRoutingModule } from './drivers-routing.module';
import { DriversComponent } from './drivers.component';
import { NzZorroModule } from '../../shared/modules/nz-zorro/nz-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DriversComponent
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    NzZorroModule,
    FormsModule,
   ReactiveFormsModule 
  ]
})
export class DriversModule { }

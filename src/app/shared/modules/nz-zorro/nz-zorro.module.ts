import { NgModule } from '@angular/core';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';

const zorroModules = [
  NzLayoutModule,
  NzMenuModule,
  NzIconModule,
  NzCardModule,
  NzSpinModule,
  NzPageHeaderModule,
  NzButtonModule,
  NzSpaceModule,
  NzSelectModule,
  NzAlertModule,
  NzPaginationModule,
  NzInputModule
];

@NgModule({
  imports: [...zorroModules],
  exports: [...zorroModules]
})
export class NzZorroModule {}

import { Component } from '@angular/core';

// NG-ZORRO modules
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    NzTypographyModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzTagModule
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  skills = [
  'Angular',
  'Node.js',
  'NestJS',
  'TypeScript',
  'OpenAI'
];

}

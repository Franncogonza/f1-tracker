import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class AppButtonComponent {
  @Input() buttonText: string = 'Botón';

  @Input() nzType: 'primary' | 'default' | 'dashed' | 'link' | 'text' = 'default';
  @Input() nzSize: 'large' | 'default' | 'small' = 'default';
  @Input() disabled: boolean = false;
  @Input() nzIcon: string = '';

  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}
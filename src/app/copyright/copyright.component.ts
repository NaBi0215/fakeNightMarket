import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// 自訂組件
// import { version_f } from '../../../../../version';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-copyright',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './copyright.component.html',
  styleUrl: './copyright.component.scss',
})
export class CopyrightComponent {
  @Input() version: string | null = null;

  constructor(public authService: AuthService) {}
  // version_f = version_f;

  // 秘密設置
  clickCount = 0;
  showVersion = false;

  handleClick() {
    this.clickCount++;
    if (this.clickCount === 5) {
      this.showVersion = true;
    }
  }
}

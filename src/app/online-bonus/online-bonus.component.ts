import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-online-bonus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './online-bonus.component.html',
  styleUrl: './online-bonus.component.scss',
})
export class OnlineBonusComponent {
  // 圖換圖
  defaultImg: string = 'imgs/onlineBonusWhite.png';
  hoverImg: string = 'imgs/onlineBonusBlue.png';
  currentImg: string = 'imgs/onlineBonusWhite.png';
  isOnlineBonus: boolean = false;

  changeImg(isHovered: boolean): void {
    this.currentImg = isHovered ? this.hoverImg : this.defaultImg;
  }

  showOnlineBonusModal(): void {
    this.isOnlineBonus = true;
  }

  closeModal(): void {
    this.isOnlineBonus = false;
  }

  confirmGet(): void {
    alert('領取成功');
    this.closeModal();
  }
}

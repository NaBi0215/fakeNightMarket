import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 自訂組件
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { ResponseHandlerService } from '../response-handler.service';

@Component({
  selector: 'app-egg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './egg.component.html',
  styleUrl: './egg.component.scss',
})
export class EggComponent {
  // 圖換圖
  defaultImg: string = 'imgs/luckyEggWhite.png';
  hoverImg: string = 'imgs/luckyEggBlue.png';
  currentImg: string = this.defaultImg;

  isConfirmUse: boolean = false;
  eggType: boolean = false;

  isModalVisible: { [key: string]: boolean } = {
    isluckyEgg: false,
    isEggGet: false,
    isEggConfirm: false,
    isEggKnocked: false,
    isEggReady: false,
  };

  giftList = {
    itemId: '',
    itemName: '',
    className: '',
    amount: '',
  };

  constructor(
    private dataService: DataService,
    public authService: AuthService,
    private responseHandlerService: ResponseHandlerService
  ) {}

  ngOnInit(): void {}

  changeImg(isHovered: boolean): void {
    this.currentImg = isHovered ? this.hoverImg : this.defaultImg;
  }

  showLuckyEggModal(): void {
    this.giftList = { itemId: '', itemName: '', className: '', amount: '' };
    this.authService.showModal('isluckyEgg');
    this.authService.showModal('isEggReady');
  }

  showConfirmUse(type: boolean): void {
    this.eggType = type;
    this.isConfirmUse = true;
  }

  confirmUse(): void {
    this.isConfirmUse = false;
    this.authService.showModal('isEggKnocked');
    this.authService.closeModal('isEggReady');
  }

  fetchLuckyEgg(isTenDraws: boolean = false): void {
    const token = localStorage.getItem('token');
    const params = this.dataService.prepareParams({
      token,
      ...(isTenDraws && { isTenDraws: 'true' }),
    });

    this.dataService
      .sendRequest('getLuckyEggGift', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          this.giftList = resultData.giftList;
          this.authService.showModal('isEggGet');
        }
      });
  }

  confirmGet(): void {
    this.fetchLuckyEgg(this.eggType);
    this.authService.closeModal('isEggKnocked');
    this.authService.isModalVisible['isEggConfirm'] = true;
  }
}

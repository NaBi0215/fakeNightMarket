import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// 自訂組件
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { ResponseHandlerService } from '../response-handler.service';

@Component({
  selector: 'app-lamp-ball',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lamp-ball.component.html',
  styleUrl: './lamp-ball.component.scss',
})
export class LampBallComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService
  ) {}

  // 共用 彈窗映射表
  isModalVisible: { [key: string]: boolean } = {
    isCostConfirm: false,
    isGiftConfirm: false,
  };

  // gift帶參數給後端轉換映射表
  private giftIdMap = new Map<number, number>([
    [6, 0],
    [13, 1],
    [20, 2],
    [29, 3],
  ]);

  lampList: { status: string; id: number }[] = [];
  selectedLampId: string | null = null;
  giftList: { status: string; id: number }[] = [];
  selectedGiftId: string | null = null;
  // 後端返回的gift item
  returnGiftList = {
    itemId: '',
    itemName: '',
    className: '',
    amount: '',
  };

  hasToken: boolean = false;
  tooltipIndex: number | null = null;

  isLargeCircle(index: number): boolean {
    const position = index + 1;
    return (position % 7 === 0 && position !== 28) || position === 30;
  }

  ngOnInit(): void {
    this.fetchLamp();
  }

  fetchLamp(): void {
    const token = localStorage.getItem('token');
    this.hasToken = !!token;

    if (!token) {
      return;
    } else {
      const params = this.dataService.prepareParams({
        token,
      });
      this.dataService
        .sendRequest('getDailyLoginList', params)
        .subscribe((response: any) => {
          const resultData =
            this.responseHandlerService.handleResponse(response);
          if (resultData) {
            const list = resultData.dailyLogin.list || [];
            const gift = resultData.dailyLogin.gift || [];
            // 測試用
            // const gift = ['0', '2', '0', '2'];

            // 0為false 1為true
            this.lampList = list.map((value: string, index: number) => ({
              status: value,
              id: index,
            }));

            // 深拷貝 lampList.length，並將 gift 中的值綁定到指定的 id 上
            this.giftList = this.lampList.map((lamp) => {
              // 检查是否是需要绑定的 id（6, 13, 20, 29）
              const giftIndex = [6, 13, 20, 29].indexOf(lamp.id);
              if (giftIndex !== -1 && gift[giftIndex] !== undefined) {
                // 使用淺拷貝更新狀態
                return { ...lamp, status: gift[giftIndex] };
              }
              // 其他 id 使用 lampList 的 status
              return { ...lamp };
            });

            // console.log(this.lampList);
            // console.log(this.giftList);
          }
        });
    }
  }

  onLampClick(index: number): void {
    // 檢查lampList status 是否為"0"
    if (this.lampList[index].status === '0') {
      this.authService.showModal('isCostConfirm');
    }

    const lampItem = this.lampList.find((lamp) => lamp.id === index);
    if (!lampItem) {
      return;
    }
    this.selectedLampId = String(lampItem.id);
  }

  fetchCompleteLamp(): void {
    const token = localStorage.getItem('token');
    const dailyId = this.selectedLampId;
    const params = this.dataService.prepareParams({
      token,
      dailyId,
    });
    this.dataService
      .sendRequest('refillDailyLogin', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          this.authService.closeModal('isCostConfirm');
        }
      });
  }

  getGiftImg(index: number): string {
    return this.giftList[index]?.status === '2'
      ? 'imgs/todayGift.png'
      : 'imgs/todayGiftClicked.png';
  }

  onGiftClick(index: number): void {
    const giftItem = this.giftList.find((gift) => gift.id === index);
    if (!giftItem) {
      return;
    }
    this.selectedGiftId = String(this.giftIdMap.get(index));
    // console.log('轉換後ㄉgiftId:', this.selectedGiftId);
    this.fetchGiftGet();
    this.authService.showModal('isGiftConfirm');
  }

  fetchGiftGet(): void {
    const token = localStorage.getItem('token');
    const giftId = this.selectedGiftId;
    const params = this.dataService.prepareParams({
      token,
      giftId,
    });
    this.dataService
      .sendRequest('getDailyLoginGift', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          this.returnGiftList = resultData.giftList;
        }
        // 因應即時更新
        this.fetchLamp();
      });
  }

  getTooltipTxt(index: number): number {
    return index + 1;
  }

  showTooltip(index: number): void {
    this.tooltipIndex = index;
  }

  hideTooltip(): void {
    this.tooltipIndex = null;
  }
}

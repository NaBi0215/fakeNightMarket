import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advertise-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advertise-modal.component.html',
  styleUrl: './advertise-modal.component.scss',
})
export class AdvertiseModalComponent {
  @Output() close = new EventEmitter<void>();

  selectedContainerBtn: string = '最新活動';
  selectedContentBtn: string = '歡慶聖誕節';

  // 假資料
  modalContainerData: { [key: string]: any } = {
    最新活動: {
      歡慶聖誕節: {
        title: '歡慶聖誕節',
        date: '12/04-12/11',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
      火雞大餐: {
        title: '火雞大餐',
        date: '12/03-12/12',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
      推推筒樂: {
        title: '推推筒樂',
        date: '12/05-12/24',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
      快樂賽跑: {
        title: '快樂賽跑',
        date: '12/12-12/27',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
      搗蛋鬼搗蛋: {
        title: '搗蛋鬼搗蛋',
        date: '12/20-12/23',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
    },
    新品上線: {
      歡慶聖誕節: {
        title: '新品上線歡慶聖誕節',
        date: '12/04-12/11',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
      火雞大餐: {
        title: '新品上線火雞大餐',
        date: '12/03-12/12',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
    },
    限定時裝: {
      歡慶聖誕節: {
        title: '限定時裝歡慶聖誕節',
        date: '12/04-12/11',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
    },
    專屬VIP: {
      聖誕大優惠: {
        title: '專屬VIP聖誕大優惠',
        date: '12/04-12/11',
        txt: '企劃架構是一個很廣泛的東西，我能告訴你，照著上面的這十四項寫絕對不會出錯，但是不同的活動、組織乃至個人（長官）都有自己特別關注的事情角度，可能這一場企業活動是很輕鬆的一場小活動',
      },
    },
  };

  keys(obj: object): string[] {
    return Object.keys(obj);
  }

  // 取得目前的 modalContainerData
  get modalContentData() {
    return this.modalContainerData[this.selectedContainerBtn] || {};
  }

  // 取得 modalContentData 的key作為按鈕
  get contentKeys() {
    return Object.keys(this.modalContentData);
  }

  changeContainerTxt(containerBtn: string) {
    this.selectedContainerBtn = containerBtn;
    // 預設選擇第一個內容
    this.selectedContentBtn = this.contentKeys[0] || '';
  }

  changeContentTxt(contentBtn: string) {
    this.selectedContentBtn = contentBtn;
  }

  closeModal() {
    this.close.emit();
  }
}

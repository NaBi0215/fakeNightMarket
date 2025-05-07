import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// 自定義組件
import { localstorageKeys } from '../../environments/localstorageKeys';
import { DataService, sendData } from '../../data.service';
// UI組件
import { HeaderComponent } from '../../header/header.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { CopyrightComponent } from '../../copyright/copyright.component';
import { PurseComponent } from '../../purse/purse.component';
// import { ResponseHandlerService } from '../../response-handler-service';

@Component({
  selector: 'app-game-record',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NavBarComponent,
    CopyrightComponent,
    FormsModule,
    PurseComponent,
  ],
  templateUrl: './game-record.component.html',
  styleUrl: './game-record.component.scss',
})
export class GameRecordComponent implements OnInit {
  selectedInfo: string = 'game';

  gamePreview: any[] = [];

  withdrawPreview: any[] = [];

  gameRecord: any[] = []; // 或者初始設為空數組

  selectedDate: string = ''; // 用戶選擇的日期

  constructor(
    private dataService: DataService // private responseHandlerService: ResponseHandlerService
  ) {}

  ngOnInit(): void {
    // 遊戲紀錄資訊
    const token = localStorage.getItem('token') || '';
    const account = localStorage.getItem('account') || '';
    const rows = localStorage.getItem('rows') || '';

    // const storedGamePreview = localStorage.getItem(
    //   localstorageKeys.gameRecordPreview
    // );
    // if (storedGamePreview) {
    //   this.gamePreview = JSON.parse(storedGamePreview);
    // } else {
    //   this.gameRecordInfo(token, account, rows);
    // }

    // 充值紀錄資訊
    //   const localData2 = localStorage.getItem(
    //     localstorageKeys.withdrawRecordPreview
    //   );
    //   if (localData2) {
    //     this.withdrawPreview = JSON.parse(localData2);
    //   }
    //   this.dataService
    //     .fetchApi('withdrawRecordPreview')
    //     .subscribe((response: any) => {
    //       if (response && response.result && response.result.withdrawPreview) {
    //         const apiData2 = response.result.withdrawPreview;
    //         localStorage.setItem(
    //           localstorageKeys.withdrawRecordPreview,
    //           JSON.stringify(apiData2)
    //         );
    //         this.withdrawPreview = apiData2;
    //       }
    //     });
  }

  // 遊戲紀錄資訊
  gameRecordInfo(token: string, account: string, rows: string): void {
    const params = this.dataService.prepareParams({ token, account, rows });

    //   this.dataService
    //     .sendRequest('gameRecordPreview', params)
    //     .subscribe((response: any) => {
    //       const resultData = this.responseHandlerService.handleResponse(response);
    //       if (resultData && resultData.gamePreview) {
    //         this.dataService.updateLocalstorage(
    //           localstorageKeys.gameRecordPreview,
    //           resultData.gamePreview
    //         );
    //         this.gamePreview = resultData.gamePreview;
    //       } else {
    //         console.log('API response handling failed or invalid response code.');
    //       }
    //     });
  }

  // 詳細遊戲紀錄 // 尚未post 參數
  gameRecordDetail(): void {
    this.gameRecord = [];

    // if (this.selectedDate) {
    //   const localData = localStorage.getItem(
    //     `${localstorageKeys.gameRecordQuery}_${this.selectedDate}`
    //   );

    //   if (localData) {
    //     // 如果localstorage中 已有此日期的資料 直接使用
    //     this.gameRecord = JSON.parse(localData);
    //   } else {
    // 調用api 根據日期查詢數據
    // const params: sendData[] = [{ key: 'date', value: this.selectedDate }]; // 創建參數數組
    // this.dataService
    //   .sendRequest('gameRecordQuery', params)
    //   .subscribe((response: any) => {
    //     if (response && response.result && response.result.gameRecord) {
    //       const apiData = response.result.gameRecord;

    //       // 將資料存入localstorage key 包含日期
    //       localStorage.setItem(
    //         `gameRecordQuery_${this.selectedDate}`,
    //         JSON.stringify(apiData)
    //       );

    //       // 更新要顯示的資料
    //       this.gameRecord = apiData;
    //     } else {
    //       // 如果api返回的資料沒有 gameRecord 清空gameRecord
    //       this.gameRecord = [];
    //     }
    //   });
    //   }
    // } else {
    //   // 如果selectedDate 為空 清空gameRecord
    //   this.gameRecord = [];
    // }
  }

  selectInfo(info: string) {
    this.selectedInfo = info;
    if (info === 'game') {
    }
  }
}

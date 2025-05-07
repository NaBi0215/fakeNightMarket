import {
  Component,
  Input,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// 自訂組件
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { ResponseHandlerService } from '../response-handler.service';
// ui組件
import { SynthesisComponent } from '../synthesis/synthesis.component';
import { response } from 'express';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, SynthesisComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  @Input() logoUrl: string | null = null;
  @ViewChild(SynthesisComponent) Synthesis!: SynthesisComponent;

  // 共用 彈窗映射表
  isModalVisible: { [key: string]: boolean } = {
    isLogOut: false,
    isContact: false,
    isQA: false,
    isLanguage: false,
    // battle
    isBattle: false,
    isInvitedBattle: false,
    // 打地鼠
    isWhackAMole: false,
    isBeforeBattele: false,
    isBattleStarted: false,
    isBattleOver: false,
    // 挖礦
    isMining: false,
    // mail
    isMail: false,
    isMailContentSystem: false,
    isMailContentTrade: false,
    isMailContentFriend: false,
  };

  // 子選單
  isVisible = false;
  subisVisible = false;
  // 子選單 volume
  isVolume: boolean = true;
  // QA
  selectedQuestion: number | null = null;
  // ballte
  isWaitingBattle: boolean = false;
  battleImg: string = 'imgs/battleWaiting.png';

  redDotStatus: { [key: string]: boolean } = {};

  // 打地鼠
  grounds = Array(9)
    .fill(false)
    .map(() => ({
      isVisible: false,
      isCrying: false,
      image: 'imgs/baby.png',
    }));
  score: number = 0;
  gameTime: number = 20;
  whackAMoleCountdown: number = 5;
  // 倒數計時器全局使用 方便"x"設置
  whackAMoleCountdownInterval: any;
  battleInterval: any;
  fasterBattleInterval: any;
  adjustSpeedTimeout: any;
  endGameTimeout: any;

  // 挖礦圖片
  numberOfImgs: number = 8;
  initialImg = 'imgs/mining.png';
  hoverImg = 'imgs/miningHover.png';
  // 挖礦剩餘次數
  remainingMining: number = 3;
  // 挖礦倒數計時器
  isCountingDown: boolean = false;
  // countdownInterval: any;
  // 儲存每個圖片的倒數計時器
  countdownTimers: any[] = [];
  // 初始化每張圖片的倒數狀態 並有各自的狀態
  imgStates: {
    isCountingDown: boolean;
    countdown: number;
    countdownTimer?: any;
    countdownText: string;
    // 根據指定長度建立一個新陣列
  }[] = Array.from({ length: this.numberOfImgs }, () => ({
    isCountingDown: false,
    countdown: 30 * 60, // 秒鐘轉為分鐘
    countdownText: '30:00',
  }));

  constructor(
    public authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService
  ) {}

  ngOnInit(): void {
    this.fetchRedDot();
  }

  fetchRedDot(): void {
    const token = localStorage.getItem('token');
    const params = this.dataService.prepareParams({
      token,
    });
    this.dataService
      .sendRequest('getMenuNotify', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          this.redDotStatus = response;
        }
      });
  }

  isRedDotVisible(key: string): boolean {
    return this.redDotStatus[key] || false;
  }

  navigateCheck(path: string): void {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      // this.authService.showModal('isLogin');
      this.router.navigate([path]);
    } else {
      this.router.navigate([path]);
    }
  }

  onImgClick(
    page:
      | 'pet'
      | 'restaurant'
      | 'bossDuel'
      | 'event'
      | 'gameRecord'
      | 'playerRankings'
  ): void {
    this.navigateCheck(`/${page}`);
  }

  onImgClickModal(modalName: string) {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      this.authService.showModal(modalName);
      // this.authService.showModal('isLogin');
    } else {
      this.authService.showModal(modalName);
    }
  }

  isSelected(route: string): boolean {
    return this.router.url === `/${route}`;
  }

  logOut() {
    this.authService.logout();
    this.authService.closeModal('isLogOut');
    this.router.navigate(['/index']);
  }

  // 子選單
  toggleOffcanvas() {
    this.isVisible = !this.isVisible;
  }

  closeOffcanvas() {
    this.isVisible = false;
  }

  // 子選單 volume
  volumeToggle() {
    this.isVolume = !this.isVolume;
  }

  // QA的A
  showAnswer(questionNumber: number) {
    this.selectedQuestion = questionNumber;
  }

  // 素材合成
  showSynthesisModal() {
    this.Synthesis.showSynthesis();
  }

  // bag
  showBagModal() {
    this.Synthesis.showBagOnly();
  }

  // 開關雙mail彈窗
  showMailContent(prefix: 'System' | 'Friend' | 'Trade') {
    // 先關閉所有mail相關彈窗
    Object.keys(this.authService.isModalVisible).forEach((key) => {
      if (key.startsWith('isMailContent')) {
        this.authService.closeModal(key);
      }
    });
    // 開啟指定的mail彈窗
    this.authService.showModal(`isMailContent${prefix}`);
    this.authService.showModal('isMail');
  }

  // 挖礦 判斷是否在倒數計時中
  handleClicked(i: number) {
    // 若剩餘次數為0 退出
    if (this.remainingMining === 0) {
      return;
    }

    if (!this.imgStates[i].isCountingDown) {
      this.imgStates[i].isCountingDown = true;
      this.startCountdown(i);
      this.remainingMining--;
    }
  }

  // 啟動倒數計時器
  startCountdown(i: number) {
    const countdownInterval = setInterval(() => {
      if (this.imgStates[i].countdown > 0) {
        this.imgStates[i].countdown--;
        // 計算分鐘和秒數
        const minutes = Math.floor(this.imgStates[i].countdown / 60); // 整數分鐘
        const seconds = this.imgStates[i].countdown % 60; // 剩餘秒數

        this.imgStates[i].countdownText = `${minutes}:${seconds
          .toString()
          .padStart(2, '0')}`;
      } else {
        clearInterval(countdownInterval); // 停止倒數計時
        this.imgStates[i].isCountingDown = false;
      }
    }, 1000);

    // 將倒數計時器儲存於陣列中 以便將來可做清除
    this.imgStates[i].countdownTimer = countdownInterval;
  }

  // 打地鼠
  autoChangeBattleImg(): void {
    this.authService.closeModal('isBattle');
    this.isWaitingBattle = true;
    setTimeout(() => {
      this.battleImg = 'imgs/battleAccept.png';
      setTimeout(() => {
        this.isWaitingBattle = false;
        this.startBattleCountdown();
      }, 2000);
    }, 2000);
  }

  startBattleCountdown(): void {
    this.whackAMoleCountdown = 5;
    this.authService.showModal('isWhackAMole');
    this.authService.showModal('isBeforeBattele');
    this.authService.closeModal('isBattleOver');

    this.whackAMoleCountdownInterval = setInterval(() => {
      this.whackAMoleCountdown--;
      if (this.whackAMoleCountdown <= 0) {
        clearInterval(this.whackAMoleCountdownInterval);
        this.startGame();
      }
    }, 1000);
  }

  startGame(): void {
    this.authService.showModal('isBattleStarted');
    this.authService.closeModal('isBeforeBattele');
    this.endGameTimeout = setTimeout(() => {
      this.endGame();
      // 20秒後結束遊戲
    }, this.gameTime * 1000);

    this.startBattle();
  }

  startBattle(): void {
    // 初始img出現的間隔時間
    let battleIntervalTime = 1500;
    this.battleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.grounds.length);
      this.grounds[randomIndex].isVisible = true;
      this.grounds[randomIndex].image = 'imgs/baby.png';

      setTimeout(() => {
        this.grounds[randomIndex].isVisible = false;
      }, 1000);
    }, battleIntervalTime);

    this.adjustSpeedTimeout = setTimeout(() => {
      // 清除原本的間隔
      clearInterval(this.battleInterval);
      battleIntervalTime = 800;
      this.fasterBattleInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.grounds.length);
        this.grounds[randomIndex].isVisible = true;
        this.grounds[randomIndex].image = 'imgs/baby.png';

        setTimeout(() => {
          this.grounds[randomIndex].isVisible = false;
        }, 1000);
      }, battleIntervalTime);

      // 清除更快的間隔
      setTimeout(() => {
        clearInterval(this.fasterBattleInterval);
      }, (this.gameTime - 12) * 1000);
    }, 12000); // 12秒後執行

    // 清除所有計時器
    setTimeout(() => {
      this.clearGameTimers();
    }, this.gameTime * 1000);
  }

  onGroundClick(index: number): void {
    if (this.grounds[index].isVisible && !this.grounds[index].isCrying) {
      this.score++;
      this.grounds[index].image = 'imgs/cryBaby.png';
      this.grounds[index].isCrying = true;
    }
    setTimeout(() => {
      this.grounds[index].image = 'imgs/baby.png';
      this.grounds[index].isCrying = false;
    }, 2000);
  }

  // 遊戲結束"時"的畫面顯現
  endGame(): void {
    this.authService.closeModal('isBattleStarted');
    this.authService.showModal('isBattleOver');
  }

  closeWhackAMoleModal() {
    this.clearGameTimers();
    this.authService.closeModal('isWhackAMole');
    this.authService.closeModal('isBeforeBattele');
    this.authService.closeModal('isBattle');
    this.authService.closeModal('isBattleStarted');
    this.score = 0;
    this.whackAMoleCountdown = 5;
  }

  clearGameTimers(): void {
    // 清除倒數
    if (this.whackAMoleCountdownInterval) {
      clearInterval(this.whackAMoleCountdownInterval);
    }
    // 清除原始地鼠間隔
    if (this.battleInterval) {
      clearInterval(this.battleInterval);
    }
    // 清除加速地鼠間隔
    if (this.fasterBattleInterval) {
      clearInterval(this.fasterBattleInterval);
    }
    // 清除調整速度
    if (this.adjustSpeedTimeout) {
      clearInterval(this.adjustSpeedTimeout);
    }
    if (this.endGameTimeout) {
      clearInterval(this.endGameTimeout);
    }
  }
}

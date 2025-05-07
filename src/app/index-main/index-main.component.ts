import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// 自訂組件
import { localstorageKeys } from '../environments/localstorageKeys';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { ResponseHandlerService } from '../response-handler.service';
// UI組件
import { AdvertiseModalComponent } from '../advertise-modal/advertise-modal.component';
import { HeaderComponent } from '../header/header.component';
import { CopyrightComponent } from '../copyright/copyright.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { PurseComponent } from '../purse/purse.component';
import { GameService } from '../game.service';
import { LoadingComponent } from '../shared/loading/loading.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { GameListComponent } from '../game-list/game-list.component';
import { MarqueeComponent } from '../marquee/marquee.component';
import { LampBallComponent } from '../lamp-ball/lamp-ball.component';
import { OnlineBonusComponent } from '../online-bonus/online-bonus.component';
import { RedEnvelopeComponent } from '../red-envelope/red-envelope.component';
import { EggComponent } from '../egg/egg.component';
import { MassangeComponent } from '../massange/massange.component';
import { NeonLightsComponent } from '../neon-lights/neon-lights.component';

@Component({
  selector: 'app-index-main',
  standalone: true,
  imports: [
    AdvertiseModalComponent,
    HeaderComponent,
    CopyrightComponent,
    NavBarComponent,
    PurseComponent,
    RouterModule,
    CommonModule,
    LoadingComponent,
    GameInfoComponent,
    GameListComponent,
    MarqueeComponent,
    LampBallComponent,
    OnlineBonusComponent,
    RedEnvelopeComponent,
    EggComponent,
    MassangeComponent,
    NeonLightsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './index-main.component.html',
  styleUrl: './index-main.component.scss',
})
export class IndexMainComponent implements OnInit {
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('captchaInput') captchaInput!: ElementRef;

  @ViewChild('rg_emailInput') rg_emailInput!: ElementRef;
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('rg_passwordInput') rg_passwordInput!: ElementRef;
  @ViewChild('passwordCheckInput') passwordCheckInput!: ElementRef;
  @ViewChild('statuteInput') statuteInput!: ElementRef;

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  public mainTitle: string = '';
  public subTitle: string = '';
  version: string = '';
  isLoading: boolean = true;
  isAdvertiseModal: boolean = true;
  isLogInHidden: boolean = false;

  // 預備讓header 取logo
  logoUrl: string | null = null;
  lang: string = 'tw';

  favoriteList: any[] = [];

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService,
    public gameService: GameService
  ) {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  ngOnInit(): void {
    this.isLogInHidden = !!localStorage.getItem('token');

    const params = this.dataService.prepareParams({
      uid: '',
    });

    this.dataService
      .sendRequest('launch', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (!resultData) return;

        const key = localstorageKeys.launch;
        const storedData = localStorage.getItem(key);
        // coinUrl存入localstorage 方便其他組件調用
        const coinsUrl = response.result.coinsUrl;
        localStorage.setItem('coinsUrl', JSON.stringify(coinsUrl));
        // 傳給子組件copyright的version設置
        this.version = response.info.version;

        // 先在這邊比對新舊資料 1.不是已存入的舊資料 2.轉譯後的api不是已存入的舊資料
        const isNewData =
          !storedData || JSON.stringify(response) !== storedData;

        // 如果資料不同或不存在 存入新資料 否則使用舊資料
        const dataToUse = isNewData ? response : JSON.parse(storedData || '{}');
        if (dataToUse) {
          // 將所有資料儲存
          localStorage.setItem(key, JSON.stringify(response));
          // 單獨存logoUrl
          localStorage.setItem('logoUrl', response.result.logoUrl || '');
        }

        //更新UI綁定的變數
        this.mainTitle = dataToUse?.result.mainTitle || '';
        this.subTitle = dataToUse?.result.subTitle || '';
        this.logoUrl = dataToUse?.result.logoUrl || '';
      });

    const favoriteGames = localStorage.getItem('favoriteList');
    if (favoriteGames) {
      this.favoriteList = JSON.parse(favoriteGames);
    }

    this.gameService.loadGameData();
    this.logoUrl = localStorage.getItem('logoUrl');
    this.gameService.getFavorite('');
  }

  closeModal() {
    this.isAdvertiseModal = false;
  }
}

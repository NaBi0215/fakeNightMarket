import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
// 自訂組件
import { DataService } from '../../data.service';
import { ResponseHandlerService } from '../../response-handler.service';
import { NightMarketConfig } from '../../environments/nightMarket';
// UI組件
import { HeaderComponent } from '../../header/header.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { GameInfoComponent } from '../../game-info/game-info.component';
import { GameListComponent } from '../../game-list/game-list.component';
import { CopyrightComponent } from '../../copyright/copyright.component';
import { PurseComponent } from '../../purse/purse.component';
import { GameService } from '../../game.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MarqueeComponent } from '../../marquee/marquee.component';
import { EggComponent } from '../../egg/egg.component';
import { OnlineBonusComponent } from '../../online-bonus/online-bonus.component';

interface GoodsList {
  id: number;
  show_name: string;
  name: string;
  main_title: string;
  sub_title: string;
  classId: number;
  sort: number;
  amount: number;
  imgUrl?: string;
}

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    HeaderComponent,
    NavBarComponent,
    GameListComponent,
    CopyrightComponent,
    CommonModule,
    PurseComponent,
    LoadingComponent,
    GameInfoComponent,
    EggComponent,
    OnlineBonusComponent,
    MarqueeComponent,
  ],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.scss',
})
export class ShoppingComponent implements OnInit {
  logoUrl: string | null = null;
  isLoading: boolean = true;
  isPurchase: boolean = false;
  isBuyInstructions: boolean = true;
  isPriceInstructions: boolean = false;
  purchaseAmount: number = 0;
  purchaseName: string = '';
  // 存儲選中要購買的商品
  selectedItem: any;
  // 存放按分類合併的商品數據
  combinedGoodsData: { category: string; items: GoodsList[] }[] = [];
  iconUrlDomain: string = '';
  selectedCategory: string = NightMarketConfig.selectedCategory;
  // 篩選後顯示的商品數據
  filteredGoods: GoodsList[] = [];
  // 存儲後端獲取的分類
  categoryList: string[] = [];
  favoriteList: any[] = [];

  CATEGORY_MAPPING: { [key: string]: string } = {
    coins: '遊戲幣',
    items: '道具',
  };

  constructor(
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService,
    public gameService: GameService
  ) {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  ngOnInit(): void {
    this.logoUrl = localStorage.getItem('logoUrl');

    const favoriteGames = localStorage.getItem('favoriteList');
    if (favoriteGames) {
      this.favoriteList = JSON.parse(favoriteGames);
    }

    this.fetchStoreData();
    this.gameService.showGameList();
  }

  fetchStoreData(): void {
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');
    const params = this.dataService.prepareParams({
      token,
      account,
    });
    forkJoin([
      this.dataService.sendRequest('getShoppingMallLayout', params),
      this.dataService.sendRequest('getShoppingMallList', params),
    ]).subscribe({
      next: ([layoutData, goodsData]) => {
        const resultLayoutData =
          this.responseHandlerService.handleResponse(layoutData);
        if (!resultLayoutData) return;

        const resultGoodsData =
          this.responseHandlerService.handleResponse(goodsData);
        if (!resultGoodsData) return;

        this.processLayoutData(layoutData);
        this.combineData(layoutData, goodsData);
        this.updateFilteredGoods();
        this.extractCategories(layoutData);
      },
    });
  }

  // 處理layout數據
  private processLayoutData(layoutData: any): void {
    const result = layoutData.result;
    this.iconUrlDomain = result.iconUrlLogic.domain;
  }

  // 合併layoutData goodsData
  private combineData(layoutData: any, goodsData: any): void {
    const goodsClassify = layoutData.result.goodsClassify;
    const goodsList = goodsData.result.goodsList;
    const iconUrlDomain = this.iconUrlDomain;

    // 創建新組合列表
    this.combinedGoodsData = Object.keys(goodsClassify).map((category) => {
      const goodsIds = goodsClassify[category];
      const items = goodsList
        .filter((item: GoodsList) => goodsIds.includes(item.id))
        .map((item: GoodsList) => ({
          ...item,
          imgUrl: `${iconUrlDomain}${item.name}.png`,
        }));
      return { category, items };
    });
  }

  // 提取商品分類
  private extractCategories(layoutData: any): void {
    const goodsClass = layoutData.result.goodsClass;
    this.categoryList = goodsClass;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.updateFilteredGoods();
  }

  updateFilteredGoods(): void {
    const selectedCategoryData = this.combinedGoodsData.find(
      (group) => group.category === this.selectedCategory
    );
    this.filteredGoods = selectedCategoryData ? selectedCategoryData.items : [];
  }

  showPurchase(item: GoodsList, category: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      return alert('請先登入後再選擇商品購入');
    }
    this.purchaseName = category;
    this.purchaseAmount = item.amount;
    this.selectedItem = item;
    this.isPurchase = true;
  }

  closeModal(): void {
    this.isPurchase = false;
    this.isBuyInstructions = false;
    this.isPriceInstructions = false;
  }

  confirmPurchase(): void {
    const goodsId = String(this.selectedItem.id);
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');
    const params = this.dataService.prepareParams({
      token,
      account,
      goodsId,
    });
    if (this.selectedItem) {
      this.dataService
        .sendRequest('buyShoppingMallGoods', params)
        .subscribe((response) => {
          const resultData =
            this.responseHandlerService.handleResponse(response);
          // console.log('resultData', resultData);
          if (resultData) {
            alert('購買成功');
            this.closeModal();
            return;
          }
          alert('購買失敗');
          this.closeModal();
        });
    }
  }

  showBuyInstructions(): void {
    this.isBuyInstructions = true;
  }

  showPriceInstructions(): void {
    this.isPriceInstructions = true;
  }

  // 轉換商品類別名稱
  // 目前沒有用到 但姑且留著
  // getCategoryName(englishName: string): string {
  //   const classMapping = NightMarketConfig.goodsClassMapping;
  //   return classMapping[englishName] || englishName;
  // }

  // 目前沒有用到 但姑且留著
  // getBalance(): void {
  //   const token = localStorage.getItem('token');
  //   const account = localStorage.getItem('account');
  //   const params = this.dataService.prepareParams({ token, account });
  //   if (token || account) {
  //     this.dataService
  //       .sendRequest('getPlayerBalance', params)
  //       .subscribe((response: any) => {
  //         const resultData =
  //           this.responseHandlerService.handleResponse(response);
  //         if (resultData) {
  //           this.balance = resultData.balance || '';
  //         }
  //       });
  //   }
  // }
}

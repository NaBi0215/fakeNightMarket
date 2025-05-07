import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../data.service';
import { ResponseHandlerService } from '../../response-handler.service';
import { NightMarketConfig } from '../../environments/nightMarket';
// UI組件
import { HeaderComponent } from '../../header/header.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { GameListComponent } from '../../game-list/game-list.component';
import { GameInfoComponent } from '../../game-info/game-info.component';
import { CopyrightComponent } from '../../copyright/copyright.component';
import { PurseComponent } from '../../purse/purse.component';
import { GameService } from '../../game.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { EggComponent } from '../../egg/egg.component';
import { OnlineBonusComponent } from '../../online-bonus/online-bonus.component';
import { MarqueeComponent } from '../../marquee/marquee.component';

interface GameData {
  category: string;
  games: {
    gameId: number;
    gameCode: string;
    gameName: string;
    imgUrl: string;
  }[];
}

interface GameListItem {
  gameId: number;
  gameCode: string;
  gameName: string;
  imgUrl: string;
}

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NavBarComponent,
    GameListComponent,
    CopyrightComponent,
    PurseComponent,
    LoadingComponent,
    EggComponent,
    OnlineBonusComponent,
    GameInfoComponent,
    MarqueeComponent,
  ],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
})
export class GamesComponent implements OnInit {
  isLoading: boolean = true;
  gameCategories: GameData[] = [];
  gameClass: string[] = [];
  selectedGameCategory: string = NightMarketConfig.selectedGameCategory;
  // 儲存過濾後的遊戲數據
  filteredGames: GameListItem[] = [];
  token: string | null = null;
  isFavoriteIcon: boolean = false;
  logoUrl: string | null = null;

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
    let gameList = [];
    let gameClass = [];
    let gameClassify = {};
    let iconUrlLogic = {};

    const gameData = JSON.parse(
      localStorage.getItem('allGameClassData') || '{}'
    );

    if (gameData) {
      gameList = gameData.gameList || [];
      gameClass = gameData.gameClass || [];
      gameClassify = gameData.gameClassify || {};
      iconUrlLogic = gameData.iconUrlLogic || {};
    }
    this.processGameData(gameList, gameClass, gameClassify, iconUrlLogic);

    const favoriteGames = localStorage.getItem('favoriteList');
    if (favoriteGames) {
      this.gameService.favoriteList = JSON.parse(favoriteGames);
    }

    // localstorage 取得logo
    this.logoUrl = localStorage.getItem('logoUrl');

    this.showFavoriteIcon();
    this.gameService.showGameList();
    this.gameService.getFavorite('');
  }

  // 轉換遊戲類別名稱
  getCategoryName(englishName: string): string {
    const classMapping = NightMarketConfig.classMapping;
    return classMapping[englishName] || englishName;
  }
  // 控制愛心icon是否顯示
  showFavoriteIcon() {
    this.isFavoriteIcon = !!localStorage.getItem('token');
  }

  processGameData(
    gameList: any[],
    gameClass: string[],
    gameClassify: any,
    iconUrlLogic: any
  ): void {
    this.gameCategories = gameClass.map((category: string) => {
      const categoryGameIds = gameClassify[category] || [];

      const games = categoryGameIds
        .map((id: number) => {
          const game = gameList.find((g: any) => g.gameId === id);
          return game
            ? {
                gameId: game.gameId,
                gameCode: game.gameCode,
                gameName: game.gameName,
                sort: game.sort,
                imgUrl: `${iconUrlLogic.domain}${iconUrlLogic.route}${iconUrlLogic.langRoute}${game.gameCode}${iconUrlLogic.fileName}${iconUrlLogic.langName}${iconUrlLogic.extension}`,
              }
            : null;
        })
        .filter((game: any) => game !== null);
      return {
        category,
        games,
      };
    });

    this.updateFilteredGames();
  }

  // 當選擇一個遊戲列別時 更新filteredGames
  selectGame(category: string): void {
    this.selectedGameCategory = category;
    this.updateFilteredGames();
  }

  updateFilteredGames(): void {
    const selectedCategory = this.gameCategories.find(
      (c) => c.category === this.selectedGameCategory
    );

    const games = selectedCategory ? selectedCategory.games : [];
    const favoriteGames = games.filter((game) => this.isFavorite(game.gameId));
    const nonFavoriteGames = games.filter(
      (game) => !this.isFavorite(game.gameId)
    );

    this.filteredGames = [...favoriteGames, ...nonFavoriteGames];
  }

  addFavorite(game: any): void {
    if (
      !this.gameService.favoriteList.some(
        (fav: any) => fav.gameId === game.gameId
      )
    ) {
      if (this.gameService.favoriteList.length >= 5) {
        this.gameService.favoriteList.shift();
      }
      this.gameService.favoriteList.push(game);
      localStorage.setItem(
        'favoriteList',
        JSON.stringify(this.gameService.favoriteList)
      );
      const token = localStorage.getItem('token');
      const account = localStorage.getItem('account');

      // 只將目前被選擇的遊戲傳遞
      const gameCodeTosend = game.gameCode;

      const params = this.dataService.prepareParams({
        token,
        account,
        method: 'add',
        gameCode: String(gameCodeTosend),
      });
      this.dataService
        .sendRequest('GameFavoriteUpdate', params)
        .subscribe((response) => {
          const resultData =
            this.responseHandlerService.handleResponse(response);
          if (resultData) {
            console.log('已成功同步到後端並更新 localstorage');
          } else {
            console.error('同步到後端失敗,請檢查後端回應');
          }
        });
    }
  }

  isFavorite(gameId: number): boolean {
    return this.gameService.favoriteList.some((fav) => fav.gameId === gameId);
  }

  toggleFavorite(game: any): void {
    const existingIndex = this.gameService.favoriteList.findIndex(
      (fav) => fav.gameId === game.gameId
    );

    // 點選愛心加入我的最愛 再點選一次移除我的最愛
    if (existingIndex !== -1) {
      this.gameService.removeFavorite(existingIndex);
    } else {
      this.addFavorite(game);
    }
  }
}

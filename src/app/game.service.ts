import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// 自訂組件
import { DataService } from './data.service';
import { ResponseHandlerService } from './response-handler.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  favoriteList: any[] = [];

  token: string | null = null;
  isGameList: boolean = false;

  constructor(
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService,
    private router: Router
  ) {}

  // 判斷是否顯示game-list子組件
  showGameList() {
    const token = localStorage.getItem('token');
    this.isGameList = token !== null;
  }

  loadGameData(): void {
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');

    const paramsObj = {
      token,
      account,
    };

    this.dataService
      .sendRequest(
        'getGameLobbyList',
        this.dataService.prepareParams(paramsObj)
      )
      .subscribe((gameListData) => {
        localStorage.setItem(
          'gameListData',
          JSON.stringify(gameListData.result.gameList)
        );

        this.dataService
          .sendRequest(
            'getGameLobbyLayout',
            this.dataService.prepareParams(paramsObj)
          )
          .subscribe((gameClassData) => {
            const allGameClassData = {
              gameList: gameListData.result.gameList,
              gameClass: gameClassData.result.gameClass,
              gameClassify: gameClassData.result.gameClassify,
              iconUrlLogic: gameClassData.result.iconUrlLogic,
            };
            localStorage.setItem(
              'allGameClassData',
              JSON.stringify(allGameClassData)
            );
          });
      });
  }

  // api串接 我的最愛遊戲列表
  getFavorite(rows: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const account = localStorage.getItem('account');
    const params = this.dataService.prepareParams({
      token,
      account,
      rows,
    });

    this.dataService
      .sendRequest('getGameFavorite', params)
      .subscribe((response) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          // 過濾與映射數據
          const gameData = JSON.parse(
            localStorage.getItem('allGameClassData') || '{}'
          );
          const gameList = gameData.gameList || [];

          const iconUrlLogic = gameData.iconUrlLogic || {
            domain: '',
            route: '',
            langRoute: '',
            fileName: '',
            langName: '',
          };

          // 映射並過濾遊戲數據
          this.favoriteList = resultData.favoriteList
            .map((gameId: any) => {
              const game = gameList.find((game: any) => game.gameId === gameId);
              return game
                ? {
                    gameId: game.gameId,
                    gameCode: game.gameCode,
                    imgUrl: `${iconUrlLogic.domain}${iconUrlLogic.route}${iconUrlLogic.langRoute}${game.gameCode}${iconUrlLogic.fileName}${iconUrlLogic.langName}${iconUrlLogic.extension}`,
                  }
                : null;
            })
            .filter((game: any) => game !== null);

          localStorage.setItem(
            'favoriteList',
            JSON.stringify(this.favoriteList)
          );
        }
      });
  }

  // 正式啟動遊戲
  navigateToGame(gameCode: string, device: string, lang: string): void {
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');
    const params = this.dataService.prepareParams({
      token,
      account,
      gameCode,
      device,
      lang,
    });
    this.dataService
      .sendRequest('gameLaunch', params)
      .subscribe((response: any) => {
        const gameUrl = response?.result.url;
        console.log('gameUrl:', gameUrl);
        if (gameUrl) {
          window.open(gameUrl, '_blank');
        }
      });
  }

  // 試玩遊戲
  navigateToGameFree(gameCode: string, device: string, lang: string): void {
    const params = this.dataService.prepareParams({
      gameCode,
      device,
      lang,
    });
    this.dataService
      .sendRequest('gameDemoLaunch', params)
      .subscribe((response: any) => {
        const gameUrl = response?.result.url;
        console.log('gameUrl:', gameUrl);
        if (gameUrl) {
          window.open(gameUrl, '_blank');
        }
      });
  }

  // 移除我的最愛
  removeFavorite(index: number): void {
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');
    const gameToRemove = this.favoriteList[index];
    const params = this.dataService.prepareParams({
      token,
      account,
      method: 'delete',
      gameCode: gameToRemove.gameCode,
    });

    this.dataService
      .sendRequest('GameFavoriteUpdate', params)
      .subscribe((response) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          console.log('Favorite removed:', response);
          this.favoriteList.splice(index, 1);
          localStorage.setItem(
            'favoriteList',
            JSON.stringify(this.favoriteList)
          );
        }
      });
  }

  goToGames() {
    this.router.navigate(['/games']);
  }
}

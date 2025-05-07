import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// ui組件
import { HeaderComponent } from '../../header/header.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
// import { LampBallComponent } from '../../lamp-ball/lamp-ball.component';
import { MarqueeComponent } from '../../marquee/marquee.component';
import { EggComponent } from '../../egg/egg.component';
import { OnlineBonusComponent } from '../../online-bonus/online-bonus.component';
import { PurseComponent } from '../../purse/purse.component';
import { CopyrightComponent } from '../../copyright/copyright.component';

@Component({
  selector: 'app-player-rankings',
  standalone: true,
  imports: [
    HeaderComponent,
    NavBarComponent,
    // LampBallComponent,
    MarqueeComponent,
    EggComponent,
    OnlineBonusComponent,
    PurseComponent,
    CopyrightComponent,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './player-rankings.component.html',
  styleUrl: './player-rankings.component.scss',
})
export class PlayerRankingsComponent {
  selectedBtn: string = '等級排行榜';
  btns: string[] = [
    '等級排行榜',
    '商城積分',
    '遊戲之王',
    '在線積分',
    '魅力積分',
  ];
  isFading = false;

  // 假資料
  dataMap: {
    [key: string]: { rank: number; playerName: string; points: number }[];
  } = {
    等級排行榜: [
      { rank: 1, playerName: '玩家名稱1(等級)', points: 545035 },
      { rank: 2, playerName: '玩家名稱2(等級)', points: 542030 },
      { rank: 3, playerName: '玩家名稱3(等級)', points: 530025 },
      { rank: 4, playerName: '玩家名稱4(等級)', points: 520015 },
      { rank: 5, playerName: '玩家名稱5(等級)', points: 510010 },
      { rank: 6, playerName: '玩家名稱6(等級)', points: 510010 },
      { rank: 7, playerName: '玩家名稱7(等級)', points: 510010 },
      { rank: 8, playerName: '玩家名稱8(等級)', points: 510010 },
    ],
    商城積分: [
      { rank: 1, playerName: '玩家名稱1(商城)', points: 545035 },
      { rank: 2, playerName: '玩家名稱2(商城)', points: 542030 },
      { rank: 3, playerName: '玩家名稱3(商城)', points: 530025 },
      { rank: 4, playerName: '玩家名稱4(商城)', points: 520015 },
      { rank: 5, playerName: '玩家名稱5(商城)', points: 510010 },
    ],
    遊戲之王: [
      { rank: 1, playerName: '玩家名稱1(遊戲)', points: 545035 },
      { rank: 2, playerName: '玩家名稱2(遊戲)', points: 542030 },
      { rank: 3, playerName: '玩家名稱3(遊戲)', points: 530025 },
      { rank: 4, playerName: '玩家名稱4(遊戲)', points: 520015 },
      { rank: 5, playerName: '玩家名稱5(遊戲)', points: 510010 },
    ],
    在線積分: [
      { rank: 1, playerName: '玩家名稱1(在線)', points: 545035 },
      { rank: 2, playerName: '玩家名稱2(在線)', points: 542030 },
      { rank: 3, playerName: '玩家名稱3(在線)', points: 530025 },
      { rank: 4, playerName: '玩家名稱4(在線)', points: 520015 },
      { rank: 5, playerName: '玩家名稱5(在線)', points: 510010 },
    ],
    魅力積分: [
      { rank: 1, playerName: '玩家名稱1(魅力)', points: 545035 },
      { rank: 2, playerName: '玩家名稱2(魅力)', points: 542030 },
      { rank: 3, playerName: '玩家名稱3(魅力)', points: 530025 },
      { rank: 4, playerName: '玩家名稱4(魅力)', points: 520015 },
      { rank: 5, playerName: '玩家名稱5(魅力)', points: 510010 },
    ],
  };
  rankings = this.dataMap['等級排行榜'];

  onSelectBtn(btnName: string): void {
    this.isFading = true; // 開啟淡出效果
    setTimeout(() => {
      this.selectedBtn = btnName;
      this.rankings = this.dataMap[btnName] || [];
      this.isFading = false; // 淡入效果
    }, 500);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// UI組件
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss',
})
export class GameListComponent implements OnInit {
  @Input() games: { gameId: number; gameCode: string; imgUrl: string }[] = [];
  // 傳遞最愛遊戲列表 add的部分
  @Input() favoriteList: any[] = [];
  @Input() showRemoveButton: boolean = true;
  // 建立事件名稱 用於向父組件發送事件
  @Output() removeFavoriteEvent = new EventEmitter<number>();

  constructor(public gameService: GameService) {}

  ngOnInit(): void {}

  // 用於發送刪除事件給父組件
  removeFavorite(index: number): void {
    this.removeFavoriteEvent.emit(index);
  }
}

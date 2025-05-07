import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// UI組件
import { HeaderComponent } from '../../header/header.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MarqueeComponent } from '../../marquee/marquee.component';
import { CopyrightComponent } from '../../copyright/copyright.component';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [
    HeaderComponent,
    NavBarComponent,
    MarqueeComponent,
    CopyrightComponent,
    CommonModule,
  ],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
})
export class RestaurantComponent {
  logoUrl: string | null = null;
  // 料理圖鑑
  isDishesHandbook: boolean = false;
  // 稱號
  isAppellation: boolean = false;

  showDishesHandbook() {
    this.isDishesHandbook = true;
  }
  showAppellation() {
    this.isAppellation = true;
  }

  closeModal() {
    this.isDishesHandbook = false;
    this.isAppellation = false;
  }

  // 根據 foodItem 數量動態生成 dots 數組
  // @param foodItemsCount number of food items
  // @returns an array with the appropriate number of dots
  getDots(foodItemsCount: number): string[] {
    const totalDots = foodItemsCount === 2 ? 7 : foodItemsCount === 3 ? 4 : 3;
    return Array(totalDots).fill('•');
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// UI組件
import { HeaderComponent } from '../../header/header.component';
import { MarqueeComponent } from '../../marquee/marquee.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { CopyrightComponent } from '../../copyright/copyright.component';
import { SynthesisComponent } from '../../synthesis/synthesis.component';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [
    HeaderComponent,
    MarqueeComponent,
    NavBarComponent,
    CopyrightComponent,
    CommonModule,
    SynthesisComponent,
  ],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.scss',
})
export class PetComponent implements OnInit {
  @ViewChild(SynthesisComponent) Synthesis!: SynthesisComponent;
  logoUrl: string | null = null;

  // 餵食
  isFeedingfoods = false;
  isPlayingGame = false;
  boxes = Array(5).fill(0);

  // 換寵物
  isPet: boolean = false;

  ngOnInit(): void {
    // localstorage 取得logo
    this.logoUrl = localStorage.getItem('logoUrl');
  }

  toggleFeedingFood(): void {
    this.isFeedingfoods = !this.isFeedingfoods;
    if (this.isFeedingfoods) {
      this.isPlayingGame = false;
    }
  }

  togglePlayingGame(): void {
    this.isPlayingGame = !this.isPlayingGame;
    if (this.isPlayingGame) {
      this.isFeedingfoods = false;
    }
  }

  changePet() {
    this.isPet = !this.isPet;
  }

  // 裝備
  showEquipmentModal() {
    this.Synthesis.showEquipment();
  }

  // 強化裝備
  showStrengthenModal() {
    this.Synthesis.showStrengthen();
  }
}

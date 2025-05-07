import { Component } from '@angular/core';
// UI組件
import { HeaderComponent } from '../../header/header.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MarqueeComponent } from '../../marquee/marquee.component';
import { PurseComponent } from '../../purse/purse.component';
import { CopyrightComponent } from '../../copyright/copyright.component';

@Component({
  selector: 'app-boss-duel',
  standalone: true,
  imports: [
    HeaderComponent,
    NavBarComponent,
    MarqueeComponent,
    PurseComponent,
    CopyrightComponent,
  ],
  templateUrl: './boss-duel.component.html',
  styleUrl: './boss-duel.component.scss',
})
export class BossDuelComponent {}

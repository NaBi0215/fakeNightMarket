import { Component } from '@angular/core';
// ui組件
import { HeaderComponent } from '../../header/header.component';
import { MarqueeComponent } from '../../marquee/marquee.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { EventListComponent } from '../../event-list/event-list.component';
import { PurseComponent } from '../../purse/purse.component';
import { CopyrightComponent } from '../../copyright/copyright.component';

@Component({
  selector: 'app-event-list-content',
  standalone: true,
  imports: [
    HeaderComponent,
    MarqueeComponent,
    NavBarComponent,
    EventListComponent,
    PurseComponent,
    CopyrightComponent,
  ],
  templateUrl: './event-list-content.component.html',
  styleUrl: './event-list-content.component.scss',
})
export class EventListContentComponent {}

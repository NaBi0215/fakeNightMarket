import { Routes } from '@angular/router';
// UI組件
import { IndexMainComponent } from './index-main/index-main.component';
import { GamesComponent } from './pages/games/games.component';
import { PersonalComponent } from './pages/personal/personal.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { PetComponent } from './pages/pet/pet.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { BossDuelComponent } from './pages/boss-duel/boss-duel.component';
import { EventComponent } from './pages/event/event.component';
import { GameRecordComponent } from './pages/game-record/game-record.component';
import { PlayerRankingsComponent } from './pages/player-rankings/player-rankings.component';
import { EventListContentComponent } from './pages/event-list-content/event-list-content.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexMainComponent,
  },
  {
    path: 'index',
    component: IndexMainComponent,
  },
  {
    path: 'games',
    component: GamesComponent,
  },
  {
    path: 'personal',
    component: PersonalComponent,
  },
  {
    path: 'shopping',
    component: ShoppingComponent,
  },
  {
    path: 'pet',
    component: PetComponent,
  },
  {
    path: 'restaurant',
    component: RestaurantComponent,
  },
  {
    path: 'bossDuel',
    component: BossDuelComponent,
  },
  {
    path: 'event',
    component: EventComponent,
  },
  {
    path: 'gameRecord',
    component: GameRecordComponent,
  },
  {
    path: 'playerRankings',
    component: PlayerRankingsComponent,
  },
  {
    path: 'eventListContent',
    component: EventListContentComponent,
  },
];

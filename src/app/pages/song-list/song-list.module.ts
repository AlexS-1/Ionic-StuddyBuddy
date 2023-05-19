import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SongListPageRoutingModule } from './song-list-routing.module';

import { SongListPage } from './song-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SongListPageRoutingModule
  ],
  declarations: [SongListPage]
})
export class SongListPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SongListPage } from './song-list.page';

const routes: Routes = [
  {
    path: '',
    component: SongListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SongListPageRoutingModule {}

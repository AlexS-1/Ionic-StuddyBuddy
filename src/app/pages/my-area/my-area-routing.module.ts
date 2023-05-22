import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAreaPage } from './my-area.page';

const routes: Routes = [
  {
    path: '',
    component: MyAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAreaPageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAreaPageRoutingModule } from './my-area-routing.module';

import { MyAreaPage } from './my-area.page';
import { ImageUploadFormComponent } from './image-upload-form/image-upload-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAreaPageRoutingModule
  ],
  declarations: [
    MyAreaPage,
    ImageUploadFormComponent
  ]
})
export class MyAreaPageModule {
  
}

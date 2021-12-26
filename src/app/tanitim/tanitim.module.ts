import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TanitimPageRoutingModule } from './tanitim-routing.module';

import { TanitimPage } from './tanitim.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TanitimPageRoutingModule
  ],
  declarations: [TanitimPage]
})
export class TanitimPageModule {}

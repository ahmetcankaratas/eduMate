import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TanitimPage } from './tanitim.page';

const routes: Routes = [
  {
    path: '',
    component: TanitimPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TanitimPageRoutingModule {}

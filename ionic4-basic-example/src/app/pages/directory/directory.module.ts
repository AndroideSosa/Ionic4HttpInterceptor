import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DirectoryPage } from './directory.page';
import { AddAreaPage } from './../add-area/add-area.page';
import { EditAreaPage } from './../edit-area/edit-area.page';

const routes: Routes = [
  {
    path: '',
    component: DirectoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DirectoryPage,AddAreaPage, EditAreaPage],
  entryComponents: [AddAreaPage, EditAreaPage]
})
export class DirectoryPageModule {}

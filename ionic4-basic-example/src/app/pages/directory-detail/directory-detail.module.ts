import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DirectoryDetailPage } from './directory-detail.page';
import { AddEmployeePage } from './../add-employee/add-employee.page';
import { EditEmployeePage } from './../edit-employee/edit-employee.page';


const routes: Routes = [
  {
    path: '',
    component: DirectoryDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DirectoryDetailPage, AddEmployeePage, EditEmployeePage],
  entryComponents: [AddEmployeePage,EditEmployeePage]
})
export class DirectoryDetailPageModule {}

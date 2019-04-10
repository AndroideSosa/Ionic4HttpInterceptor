import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'directory', loadChildren: './pages/directory/directory.module#DirectoryPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'logout', loadChildren: './pages/logout/logout.module#LogoutPageModule' },
  { path: 'directory-detail/:name', loadChildren: './pages/directory-detail/directory-detail.module#DirectoryDetailPageModule' },
  { path: 'add-employee', loadChildren: './pages/add-employee/add-employee.module#AddEmployeePageModule' },
  { path: 'edit-employee', loadChildren: './pages/edit-employee/edit-employee.module#EditEmployeePageModule' },
  { path: 'add-area', loadChildren: './pages/add-area/add-area.module#AddAreaPageModule' },
  { path: 'edit-area', loadChildren: './pages/edit-area/edit-area.module#EditAreaPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

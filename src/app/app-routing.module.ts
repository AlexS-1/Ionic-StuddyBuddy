import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'my-courses',
    loadChildren: () =>
      import('./pages/my-courses/my-courses.module').then( m => m.MyCoursesPageModule),
      canActivate: [AuthGuardService]
  },
  {
    path: 'courses/:id',
    loadChildren: () =>
      import('./pages/course-detail/course-detail.module').then( m => m.CourseDetailPageModule)
  },
  {
    path: "create-account",
    loadChildren: () =>
      import("./pages/create-account/create-account.module").then((m) => m.CreateAccountPageModule),
  },
  {
    path: "log-in",
    loadChildren: () =>
      import("./pages/log-in/log-in.module").then((m) => m.LogInPageModule),
  },
  {
    path: "my-area",
    loadChildren: () =>
      import("./pages/my-area/my-area.module").then((m) => m.MyAreaPageModule),
      canActivate: [AuthGuardService]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

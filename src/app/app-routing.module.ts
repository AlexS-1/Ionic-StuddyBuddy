import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'animals',
    loadChildren: () =>
      import('./pages/animal-list/animal-list.module').then( m => m.AnimalListPageModule)
  },
  {
    path: 'animals/:id',
    loadChildren: () =>
      import('./pages/animal-detail/animal-detail.module').then( m => m.AnimalDetailPageModule)
  },
  {
    path: 'developers',
    loadChildren: () => 
      import('./pages/developers/developers.module').then( m => m.DevelopersPageModule)
  },
  {
    path: 'developers/:id',
    loadChildren: () => 
      import('./pages/developer/developer.module').then( m => m.DeveloperPageModule)
  },
  {
    path: 'songs',
    loadChildren: () => 
    import('./pages/song-list/song-list.module').then( m => m.SongListPageModule)
  },
  {
    path: 'songs/:id',
    loadChildren: () => 
    import('./pages/song-details/song-details.module').then( m => m.SongDetailsPageModule)
  },
  {
    path: "folder/:id",
    loadChildren: () =>
      import("./pages/folder/folder.module").then((m) => m.FolderPageModule),
  },
  {
    path: "category",
    loadChildren: () =>
      import("./pages/category/category.module").then((m) => m.CategoryPageModule),
  },
  {
    path: "person",
    loadChildren: () =>
      import("./pages/person/person.module").then((m) => m.PersonPageModule),
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvayaComponent } from './pages/avaya/avaya.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeinComponent } from './pages/in/homein/homein.component';
import { PreloadinComponent } from './pages/in/preloadin/preloadin.component';
import { ItComponent } from './pages/it/it.component';
import { PreloadComponent } from './pages/preload/preload.component';
import { Trouble1Component } from './pages/trouble1/trouble1.component';

const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'HomeIn', component: HomeinComponent },
  { path: 'It', component: ItComponent },
  { path: 'Avaya', component: AvayaComponent },
  { path: 'Trouble1', component: Trouble1Component },
  { path: 'Preload', component: PreloadComponent },
  { path: 'PreloadIn', component: PreloadinComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'Home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

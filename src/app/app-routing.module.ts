import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvayaComponent } from './pages/avaya/avaya.component';
import { HomeComponent } from './pages/home/home.component';
import { ItComponent } from './pages/it/it.component';
import { PreloadComponent } from './pages/preload/preload.component';
import { Trouble1Component } from './pages/trouble1/trouble1.component';
import { Trouble14Component } from './pages/trouble14/trouble14.component';

const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'It', component: ItComponent },
  { path: 'Avaya', component: AvayaComponent },
  { path: 'Trouble1', component: Trouble1Component },
  { path: 'Trouble14', component: Trouble14Component },
  { path: 'Preload', component: PreloadComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'Home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

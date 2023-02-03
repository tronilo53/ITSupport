import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvayaComponent } from './pages/avaya/avaya.component';
import { HomeComponent } from './pages/home/home.component';
import { ItComponent } from './pages/it/it.component';

const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'It', component: ItComponent },
  { path: 'Avaya', component: AvayaComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'Avaya' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

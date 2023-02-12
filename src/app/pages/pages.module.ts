import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { HomeComponent } from './home/home.component';
import { ItComponent } from './it/it.component';
import { AvayaComponent } from './avaya/avaya.component';



@NgModule({
  declarations: [
    HomeComponent,
    ItComponent,
    AvayaComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    HomeComponent,
    ItComponent,
    AvayaComponent
  ]
})
export class PagesModule { }

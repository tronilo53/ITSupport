import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { HomeComponent } from './home/home.component';
import { ItComponent } from './it/it.component';
import { AvayaComponent } from './avaya/avaya.component';
import { Trouble1Component } from './trouble1/trouble1.component';
import { PreloadComponent } from './preload/preload.component';
import { Trouble14Component } from './trouble14/trouble14.component';



@NgModule({
  declarations: [
    HomeComponent,
    ItComponent,
    AvayaComponent,
    Trouble1Component,
    PreloadComponent,
    Trouble14Component
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    HomeComponent,
    ItComponent,
    AvayaComponent,
    Trouble1Component,
    PreloadComponent,
    Trouble14Component
  ]
})
export class PagesModule { }

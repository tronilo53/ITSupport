import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { HomeComponent } from './home/home.component';
import { ItComponent } from './it/it.component';
import { AvayaComponent } from './avaya/avaya.component';
import { Trouble1Component } from './trouble1/trouble1.component';
import { PreloadComponent } from './preload/preload.component';
import { HomeinComponent } from './in/homein/homein.component';
import { PreloadinComponent } from './in/preloadin/preloadin.component';



@NgModule({
  declarations: [
    HomeComponent,
    ItComponent,
    AvayaComponent,
    Trouble1Component,
    PreloadComponent,
    HomeinComponent,
    PreloadinComponent
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
    HomeinComponent,
    PreloadinComponent
  ]
})
export class PagesModule { }

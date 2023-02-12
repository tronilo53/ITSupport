import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-avaya',
  templateUrl: './avaya.component.html',
  styleUrls: ['./avaya.component.css']
})
export class AvayaComponent implements OnInit {

  public problema: string = '???';

  constructor( 
    private renderer: Renderer2,
    private __alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  public solucionar(): void {
    console.log( this.problema );
  }
}

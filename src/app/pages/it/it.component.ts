import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-it',
  templateUrl: './it.component.html',
  styleUrls: ['./it.component.css']
})
export class ItComponent implements OnInit {

  @ViewChild( 'hostname' ) hostname: ElementRef;
  @ViewChild( 'hostnameErr' ) hostnameErr: ElementRef;
  @ViewChild( 'serialTag' ) serialTag: ElementRef;
  @ViewChild( 'serialTagErr' ) serialTagErr: ElementRef;
  @ViewChild( 'user' ) userErr: ElementRef;
  @ViewChild( 'userErr' ) userErrErr: ElementRef;
  @ViewChild( 'extAvaya' ) extAvaya: ElementRef;
  @ViewChild( 'extAvayaErr' ) extAvayaErr: ElementRef;
  @ViewChild( 'logAvaya' ) logAvaya: ElementRef;
  @ViewChild( 'logAvayaErr' ) logAvayaErr: ElementRef;

  

  constructor() { }

  ngOnInit(): void {
  }

}

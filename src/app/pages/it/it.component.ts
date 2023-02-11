import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-it',
  templateUrl: './it.component.html',
  styleUrls: ['./it.component.css']
})
export class ItComponent implements OnInit, AfterViewInit {

  @ViewChild( 'hostname' ) hostname: ElementRef;
  @ViewChild( 'hostnameErr' ) hostnameErr: ElementRef;
  @ViewChild( 'serialTag' ) serialTag: ElementRef;
  @ViewChild( 'serialTagErr' ) serialTagErr: ElementRef;
  @ViewChild( 'user' ) user: ElementRef;
  @ViewChild( 'userErr' ) userErr: ElementRef;
  @ViewChild( 'extAvaya' ) extAvaya: ElementRef;
  @ViewChild( 'extAvayaErr' ) extAvayaErr: ElementRef;
  @ViewChild( 'logAvaya' ) logAvaya: ElementRef;
  @ViewChild( 'logAvayaErr' ) logAvayaErr: ElementRef;

  constructor( 
    private renderer: Renderer2,
    private __ipcService: IpcService
  ) { }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.renderer.addClass( this.hostnameErr.nativeElement, 'none' );
    this.renderer.addClass( this.serialTagErr.nativeElement, 'none' );
    this.renderer.addClass( this.userErr.nativeElement, 'none' );
    this.renderer.addClass( this.extAvayaErr.nativeElement, 'none' );
    this.renderer.addClass( this.logAvayaErr.nativeElement, 'none' );

    this.__ipcService.send( 'getDataOs' );
    this.__ipcService.on( 'getDataOs', ( event, args ) => {
      const data: string = args.data;
      if( data[1] === 'error'){
        this.renderer.removeClass( this.serialTagErr.nativeElement, 'none' );
        this.renderer.addClass( this.serialTag.nativeElement, 'none' );
      }else {
        const serialNumber = data[1].split( '\n' )[1].trim();
        this.renderer.setProperty( this.serialTag.nativeElement, 'innerHTML', serialNumber );
      }
      const hostnameValue = data[0];
      this.renderer.setProperty( this.hostname.nativeElement, 'innerHTML', hostnameValue );
      const userValue = data[2];
      this.renderer.setProperty( this.user.nativeElement, 'innerHTML', userValue );
    });
  }
}

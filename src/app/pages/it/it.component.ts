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

    //INFORMACION O.S de Hostname, SerialTag y User
    this.__ipcService.send( 'getDataOsExcludeAvaya' );
    this.__ipcService.on( 'getDataOsExcludeAvaya', ( event, args ) => this.getDataOsExcludeAvaya( event, args ));

    //INFORMACION O.S de Extension y Login Avaya.
    this.__ipcService.send( 'getDataOsAvaya' );
    this.__ipcService.on( 'getDataOsAvaya', ( event, args ) => this.getDataOsAvaya( event, args ));
  }

  //INFORMACION O.S de Hostname, SerialTag y User
  private getDataOsExcludeAvaya( event: any, args: any ): void {
    const data: string = args.data;
      const serialNumber = data[1].split( '\n' )[1].trim();
      
      if( data[1] === 'error' || serialNumber === 'To be filled by O.E.M.'){
        this.renderer.removeClass( this.serialTagErr.nativeElement, 'none' );
        this.renderer.addClass( this.serialTag.nativeElement, 'none' );
      }else {
        this.renderer.setProperty( this.serialTag.nativeElement, 'innerHTML', serialNumber );
      }
      const hostnameValue = data[0];
      this.renderer.setProperty( this.hostname.nativeElement, 'innerHTML', hostnameValue );
      const userValue = data[2];
      this.renderer.setProperty( this.user.nativeElement, 'innerHTML', userValue );
  }
  //INFORMACION O.S de Extension y Login Avaya.
  private getDataOsAvaya( event: any, args: any ): void {
    console.log( args );
  }
}

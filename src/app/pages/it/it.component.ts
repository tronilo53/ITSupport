import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-it',
  templateUrl: './it.component.html',
  styleUrls: ['./it.component.css']
})
export class ItComponent implements OnInit, AfterViewInit {

  //IDENTIFICAR ELEMENTOS DEL DOM
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
  @ViewChild( 'sp' ) sp: ElementRef;
  @ViewChild( 'in' ) in: ElementRef;
  @ViewChild( 'pt' ) pt: ElementRef;

  constructor( 
    private renderer: Renderer2,
    private __ipcService: IpcService,
    private __alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //OCULTAR CAMPOS DE "SIN INFO";
    this.renderer.addClass( this.hostnameErr.nativeElement, 'none' );
    this.renderer.addClass( this.serialTagErr.nativeElement, 'none' );
    this.renderer.addClass( this.userErr.nativeElement, 'none' );
    this.renderer.addClass( this.extAvayaErr.nativeElement, 'none' );
    this.renderer.addClass( this.logAvayaErr.nativeElement, 'none' );
    this.renderer.addClass( this.sp.nativeElement, 'none' );
    this.renderer.addClass( this.in.nativeElement, 'none' );
    this.renderer.addClass( this.pt.nativeElement, 'none' );

    //Detectar el idioma guardado
    this.__ipcService.send( 'checkLanguage' );
    this.__ipcService.on( 'checkLanguage', ( event, args ) => {
      if( args.data === '' || args.data === 'sp' ) {
        //Mostrar contenido en español
        this.renderer.removeClass( this.sp.nativeElement, 'none' );
      }else if( args.data === 'in' ) {
        //Mostrar contenido en Ingles
        this.renderer.removeClass( this.in.nativeElement, 'none' );
      }else {
        //Mostrar contenido en Portugues
        this.renderer.removeClass( this.pt.nativeElement, 'none' );
      }
    });

    /* HOSTNAME, SERIALTAG Y USUARIO DE WINDOWS*/
    this.__ipcService.send( 'getDataOsExcludeAvaya' );
    this.__ipcService.on( 'getDataOsExcludeAvaya', ( event, args ) => this.getDataOsExcludeAvaya( event, args ));
    /* EXTENSION Y LOGIN DE AVAYA */
    this.__ipcService.send( 'getDataOsAvaya' );
    this.__ipcService.on( 'getDataOsAvaya', ( event, args ) => this.getDataOsAvaya( event, args ));
  }



  //FUNCIONES INTERNAS;
  //---------------------------

  //HOSTNAME, SERIALTAG Y USUARIO DE WINDOWS
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
  //EXTENSION Y LOGIN DE AVAYA
  private getDataOsAvaya( event: any, args: any ): void {
    if( args.data === 'notRead' || args.data === 'notJson' ) {
      this.__ipcService.send( 'cleanAvaya' ); //TODO: configurar esta función de copiar carpeta.
      this.renderer.removeClass( this.extAvayaErr.nativeElement, 'none' );
      this.renderer.addClass( this.extAvaya.nativeElement, 'none' );
      this.renderer.removeClass( this.logAvayaErr.nativeElement, 'none' );
      this.renderer.addClass( this.logAvaya.nativeElement, 'none' );
    }else {
      const extension: string = args.data[0];
      const login: string = args.data[1];
      if( extension === '' ) {
        this.renderer.removeClass( this.extAvayaErr.nativeElement, 'none' );
        this.renderer.addClass( this.extAvaya.nativeElement, 'none' );
      }
      else this.renderer.setProperty( this.extAvaya.nativeElement, 'innerHTML', extension );
      if( login === '' ) {
        this.renderer.removeClass( this.logAvayaErr.nativeElement, 'none' );
        this.renderer.addClass( this.logAvaya.nativeElement, 'none' );
      }
      else this.renderer.setProperty( this.logAvaya.nativeElement, 'innerHTML', login );
    }
  }
}

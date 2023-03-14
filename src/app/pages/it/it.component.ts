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
  /* ---- Español ---- */
  @ViewChild( 'sp' ) sp: ElementRef;
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
  /* ---- Ingles ---- */
  @ViewChild( 'in' ) in: ElementRef;
  @ViewChild( 'hostnameIn' ) hostnameIn: ElementRef;
  @ViewChild( 'hostnameErrIn' ) hostnameErrIn: ElementRef;
  @ViewChild( 'serialTagIn' ) serialTagIn: ElementRef;
  @ViewChild( 'serialTagErrIn' ) serialTagErrIn: ElementRef;
  @ViewChild( 'userIn' ) userIn: ElementRef;
  @ViewChild( 'userErrIn' ) userErrIn: ElementRef;
  @ViewChild( 'extAvayaIn' ) extAvayaIn: ElementRef;
  @ViewChild( 'extAvayaErrIn' ) extAvayaErrIn: ElementRef;
  @ViewChild( 'logAvayaIn' ) logAvayaIn: ElementRef;
  @ViewChild( 'logAvayaErrIn' ) logAvayaErrIn: ElementRef;
  /* ---- Portugues ---- */
  @ViewChild( 'pt' ) pt: ElementRef;
  @ViewChild( 'hostnamePt' ) hostnamePt: ElementRef;
  @ViewChild( 'hostnameErrPt' ) hostnameErrPt: ElementRef;
  @ViewChild( 'serialTagPt' ) serialTagPt: ElementRef;
  @ViewChild( 'serialTagErrPt' ) serialTagErrPt: ElementRef;
  @ViewChild( 'userPt' ) userPt: ElementRef;
  @ViewChild( 'userErrPt' ) userErrPt: ElementRef;
  @ViewChild( 'extAvayaPt' ) extAvayaPt: ElementRef;
  @ViewChild( 'extAvayaErrPt' ) extAvayaErrPt: ElementRef;
  @ViewChild( 'logAvayaPt' ) logAvayaPt: ElementRef;
  @ViewChild( 'logAvayaErrPt' ) logAvayaErrPt: ElementRef;

  constructor( 
    private renderer: Renderer2,
    private __ipcService: IpcService,
    private __alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //OCULTAR CAMPOS DE "SIN INFO"; Español
    this.hiddenDom();
    //OCULTAR CAMPOS DE "SIN INFO"; Ingles
    this.hiddenDomIn();
    //OCULTAR CAMPOS DE "SIN INFO"; Portugues
    this.hiddenDomPt();

    //Detectar el idioma guardado
    this.__ipcService.send( 'checkLanguage' );
    this.__ipcService.on( 'checkLanguage', ( event, args ) => {
      if( args.data === '' || args.data === 'sp' ) {
        //Mostrar contenido en español
        this.renderer.removeClass( this.sp.nativeElement, 'none' );
        this.getData();
      }else if( args.data === 'in' ) {
        //Mostrar contenido en Ingles
        this.renderer.removeClass( this.in.nativeElement, 'none' );
        this.getDataIn();
      }else {
        //Mostrar contenido en Portugues
        this.renderer.removeClass( this.pt.nativeElement, 'none' );
        this.getDataPt();
      }
    });
  }

  //OCULTAR CAMPOS DE "SIN INFO"; Español
  private hiddenDom(): void {
    /* ---- Español ---- */
    this.renderer.addClass( this.sp.nativeElement, 'none' );
    this.renderer.addClass( this.hostnameErr.nativeElement, 'none' );
    this.renderer.addClass( this.serialTagErr.nativeElement, 'none' );
    this.renderer.addClass( this.userErr.nativeElement, 'none' );
    this.renderer.addClass( this.extAvayaErr.nativeElement, 'none' );
    this.renderer.addClass( this.logAvayaErr.nativeElement, 'none' );
  }
  //OCULTAR CAMPOS DE "SIN INFO"; Ingles
  private hiddenDomIn(): void {
    /* ---- Ingles ---- */
    this.renderer.addClass( this.in.nativeElement, 'none' );
    this.renderer.addClass( this.hostnameErrIn.nativeElement, 'none' );
    this.renderer.addClass( this.serialTagErrIn.nativeElement, 'none' );
    this.renderer.addClass( this.userErrIn.nativeElement, 'none' );
    this.renderer.addClass( this.extAvayaErrIn.nativeElement, 'none' );
    this.renderer.addClass( this.logAvayaErrIn.nativeElement, 'none' );
  }
  //OCULTAR CAMPOS DE "SIN INFO"; Portugues
  private hiddenDomPt(): void {
    /* ---- Portugues ---- */
    this.renderer.addClass( this.pt.nativeElement, 'none' );
    this.renderer.addClass( this.hostnameErrPt.nativeElement, 'none' );
    this.renderer.addClass( this.serialTagErrPt.nativeElement, 'none' );
    this.renderer.addClass( this.userErrPt.nativeElement, 'none' );
    this.renderer.addClass( this.extAvayaErrPt.nativeElement, 'none' );
    this.renderer.addClass( this.logAvayaErrPt.nativeElement, 'none' );
  }
  
  //Obtener datos en Español
  private getData(): void {
    /* HOSTNAME, SERIALTAG Y USUARIO DE WINDOWS*/
    this.__ipcService.send( 'getDataOsExcludeAvaya' );
    this.__ipcService.on( 'getDataOsExcludeAvaya', ( event, args ) => {
      const data: string = args.data;
      const serialNumber = data[1].split( '\n' )[1].trim();

      if( data[1] === 'error' || serialNumber === 'A completar por O.E.M.'){
        this.renderer.removeClass( this.serialTagErr.nativeElement, 'none' );
        this.renderer.addClass( this.serialTag.nativeElement, 'none' );
      }else this.renderer.setProperty( this.serialTag.nativeElement, 'innerHTML', serialNumber );

      const hostnameValue = data[0];
      this.renderer.setProperty( this.hostname.nativeElement, 'innerHTML', hostnameValue );
      const userValue = data[2];
      this.renderer.setProperty( this.user.nativeElement, 'innerHTML', userValue );
    });
    /* EXTENSION Y LOGIN DE AVAYA */
    this.__ipcService.send( 'getDataOsAvaya' );
    this.__ipcService.on( 'getDataOsAvaya', ( event, args ) => {
      if( args.data === 'noExist' ) {
        //Mostrar alerta de: Nunca se ha iniciado avaya
        this.__alertService.alertInfo( 'Avaya nunca se ha iniciado, no se ha podido recopilar la información de la extensión y Login.' );
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
    });
  }
  //Obtener datos en Ingles
  private getDataIn(): void {
    /* HOSTNAME, SERIALTAG Y USUARIO DE WINDOWS*/
    this.__ipcService.send( 'getDataOsExcludeAvaya' );
    this.__ipcService.on( 'getDataOsExcludeAvaya', ( event, args ) => {
      const data: string = args.data;
      const serialNumber = data[1].split( '\n' )[1].trim();

      if( data[1] === 'error' || serialNumber === 'To be completed by O.E.M.'){
        this.renderer.removeClass( this.serialTagErrIn.nativeElement, 'none' );
        this.renderer.addClass( this.serialTagIn.nativeElement, 'none' );
      }else this.renderer.setProperty( this.serialTagIn.nativeElement, 'innerHTML', serialNumber );

      const hostnameValue = data[0];
      this.renderer.setProperty( this.hostnameIn.nativeElement, 'innerHTML', hostnameValue );
      const userValue = data[2];
      this.renderer.setProperty( this.userIn.nativeElement, 'innerHTML', userValue );
    });
    /* EXTENSION Y LOGIN DE AVAYA */
    this.__ipcService.send( 'getDataOsAvaya' );
    this.__ipcService.on( 'getDataOsAvaya', ( event, args ) => {
      if( args.data === 'noExist' ) {
        //Mostrar alerta de: Nunca se ha iniciado avaya
        this.__alertService.alertInfo( 'Avaya has never started, extension and login information could not be collected.' );
        this.renderer.removeClass( this.extAvayaErrIn.nativeElement, 'none' );
        this.renderer.addClass( this.extAvayaIn.nativeElement, 'none' );
        this.renderer.removeClass( this.logAvayaErrIn.nativeElement, 'none' );
        this.renderer.addClass( this.logAvayaIn.nativeElement, 'none' );
      }else {
        const extension: string = args.data[0];
        const login: string = args.data[1];
        if( extension === '' ) {
          this.renderer.removeClass( this.extAvayaErrIn.nativeElement, 'none' );
          this.renderer.addClass( this.extAvayaIn.nativeElement, 'none' );
        }
        else this.renderer.setProperty( this.extAvayaIn.nativeElement, 'innerHTML', extension );
        if( login === '' ) {
          this.renderer.removeClass( this.logAvayaErrIn.nativeElement, 'none' );
          this.renderer.addClass( this.logAvayaIn.nativeElement, 'none' );
        }
        else this.renderer.setProperty( this.logAvayaIn.nativeElement, 'innerHTML', login );
      }
    });
  }
  //Obtener datos en Portugues
  private getDataPt(): void {
    /* HOSTNAME, SERIALTAG Y USUARIO DE WINDOWS*/
    this.__ipcService.send( 'getDataOsExcludeAvaya' );
    this.__ipcService.on( 'getDataOsExcludeAvaya', ( event, args ) => {
      const data: string = args.data;
      const serialNumber = data[1].split( '\n' )[1].trim();

      if( data[1] === 'error' || serialNumber === 'A ser preenchido por O.E.M.'){
        this.renderer.removeClass( this.serialTagErrPt.nativeElement, 'none' );
        this.renderer.addClass( this.serialTagPt.nativeElement, 'none' );
      }else this.renderer.setProperty( this.serialTagPt.nativeElement, 'innerHTML', serialNumber );

      const hostnameValue = data[0];
      this.renderer.setProperty( this.hostnamePt.nativeElement, 'innerHTML', hostnameValue );
      const userValue = data[2];
      this.renderer.setProperty( this.userPt.nativeElement, 'innerHTML', userValue );
    });
    /* EXTENSION Y LOGIN DE AVAYA */
    this.__ipcService.send( 'getDataOsAvaya' );
    this.__ipcService.on( 'getDataOsAvaya', ( event, args ) => {
      if( args.data === 'noExist' ) {
        //Mostrar alerta de: Nunca se ha iniciado avaya
        this.__alertService.alertInfo( 'A Avaya nunca começou, não foi possível recolher informações de extensão e login.' );
        this.renderer.removeClass( this.extAvayaErrPt.nativeElement, 'none' );
        this.renderer.addClass( this.extAvayaPt.nativeElement, 'none' );
        this.renderer.removeClass( this.logAvayaErrPt.nativeElement, 'none' );
        this.renderer.addClass( this.logAvayaPt.nativeElement, 'none' );
      }else {
        const extension: string = args.data[0];
        const login: string = args.data[1];
        if( extension === '' ) {
          this.renderer.removeClass( this.extAvayaErrPt.nativeElement, 'none' );
          this.renderer.addClass( this.extAvayaPt.nativeElement, 'none' );
        }
        else this.renderer.setProperty( this.extAvayaPt.nativeElement, 'innerHTML', extension );
        if( login === '' ) {
          this.renderer.removeClass( this.logAvayaErrPt.nativeElement, 'none' );
          this.renderer.addClass( this.logAvayaPt.nativeElement, 'none' );
        }
        else this.renderer.setProperty( this.logAvayaPt.nativeElement, 'innerHTML', login );
      }
    });
  }
}
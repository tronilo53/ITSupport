import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { IpcService } from 'src/app/services/ipc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('avaya__ok') avaya__ok: ElementRef;
  @ViewChild('avaya__fail') avaya__fail: ElementRef;
  @ViewChild('versionValue') versionValue: ElementRef;
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('containerProgressBar') containerProgressBar: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('appLanguage') appLanguage: ElementRef;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  })

  constructor( 
    private __ipcService: IpcService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private __alertService: AlertService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.renderer.addClass( this.avaya__fail.nativeElement, 'none' );
    this.renderer.addClass( this.avaya__ok.nativeElement, 'none' );
    this.renderer.addClass( this.modal.nativeElement, 'none' );
    this.renderer.addClass( this.appLanguage.nativeElement, 'none' );

    this.checkAvayaInstall();
  }

  //ABRIR VENTANA DE IT
  public openIt(): void {
    this.__ipcService.send( 'openIt' );
    this.changeDetectorRef.detectChanges();
  }
  //ABRIR DENTANA DE CONFIGURACION DE AVAYA
  public openAvaya(): void {
    this.__ipcService.send( 'openAvaya' );
    this.changeDetectorRef.detectChanges();
  }
  //ESTABLECER IDIOMA SELECCIONADO
  public setLanguage( lan: string ): void {
    this.__ipcService.send( 'setLanguage', { data: lan } );
    this.__ipcService.on( 'setLanguage', ( event, args ) => {
      if( args.data === 'norRead' || args.data === 'notJson' || args.data === 'notWrite' ) {
        console.log( 'Ha habido un error al procesar el idioma, se establecerá como predeterminado el idioma: Español' );
      }else {
        if( args.data === 'change__sp' ) console.log( 'Se ha cambiado al idioma: Español' );
        else console.log( 'Se ha cambiado al idioma: Inglés' );
      }
    });
  }
  //COMPROBAR QUE AVAYA ESTÉ INSTALADO
  private checkAvayaInstall(): void {
    this.__ipcService.send( 'checkAvayaInstall' );
    this.__ipcService.on( 'checkAvayaInstall', ( event, args ) => {
      if( args.data === 'fail' ) {
        this.renderer.removeClass( this.avaya__fail.nativeElement, 'none' );
        this.__alertService.alertError( 'No se ha encontrado Avaya One X Agent' );
      }else {
        this.__ipcService.send( 'checkLanguage' );
        this.__ipcService.on( 'checkLanguage', ( event, args ) => {
          if( args.data === 'notRead' ) {
            console.log( 'No se ha podido leer el archivo' );
            this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
          }else if( args.data === 'notJson' ) {
            console.log( 'No se ha podido pasar a json' );
          }else {
            if( args.data === '' ) {
              this.renderer.removeClass( this.appLanguage.nativeElement, 'none' );
              //this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' ); //TODO: Mostrar app
            }else if( args.data === 'sp' ) {
              console.log( 'El idioma está en español' );
              this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
              this.setVersion();
              this.checkUpdates();
            }else {
              console.log( 'El idioma está en inglés' );
              this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
              this.setVersion();
              this.checkUpdates();
            }
          }
        });
      }
    });
  }
  //MOSTRAR VERSION DE LA APLICACION
  private setVersion(): void {
    this.__ipcService.send( 'setVersion' );
    this.__ipcService.on( 'setVersion', ( event, args ) => this.renderer.setProperty( this.versionValue.nativeElement, 'innerHTML', `V.${args.data}` ) );
  }
  //ACTUALIZACIONES AUTOMATICAS
  private checkUpdates(): void {
    //ACTUALIZACION DISPONIBLE
    this.__ipcService.on( 'update_available', () => {
      this.__ipcService.removeAllListeners( 'update_available' );
      this.__alertService.alertAvailableUpdate();
    });

    //ACTUALIZACION NO DISPONIBLE
    this.__ipcService.on( 'update_not_available', () => {
      this.__ipcService.removeAllListeners( 'update_not_available' );
      this.Toast.fire({
        icon: 'warning',
        title: 'No hay actualizaciones Disponibles'
      });
    });

    //ERROR EN ACTUALIZACION
    this.__ipcService.on( 'error_update', () => {
      this.__ipcService.removeAllListeners( 'error_update' );
      this.Toast.fire({
        icon: 'error',
        title: 'Error en actualizaciones'
      });
    });

    //PROGRESO DE DESCARGA
    this.__ipcService.on( 'download_progress', ( event, args ) => {
      this.renderer.removeClass( this.modal.nativeElement, 'none' );
      this.renderer.setProperty( this.containerProgressBar.nativeElement, 'aria-valuenow', args );
      this.renderer.setProperty( this.progressBar.nativeElement, 'style', `width:${args}%` );
      this.renderer.setProperty( this.progressBar.nativeElement, 'innerHTML', `${args}%` );
      if( args == 100 ) this.renderer.addClass( this.modal.nativeElement, 'none' );
    });    

    //ACTUALIZACIÓN DESCARGADA
    this.__ipcService.on( 'update_downloaded', () => {
      this.__ipcService.removeAllListeners( 'update_downloaded' );
      this.__alertService.alertDownloadUpdate();
    });
  }
}
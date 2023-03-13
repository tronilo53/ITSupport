import { ElementRef, Injectable, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from './alert.service';
import { IpcService } from './ipc.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  /* ----- Ingles ----- */
  @ViewChild('avaya__ok__in') avaya__ok__in: ElementRef;
  @ViewChild('avaya__fail__in') avaya__fail__in: ElementRef;
  @ViewChild('modalIn') modalIn: ElementRef;
  @ViewChild('containerProgressBarIn') containerProgressBarIn: ElementRef;
  @ViewChild('progressBarIn') progressBarIn: ElementRef;
  @ViewChild('settingsIn') settingsIn: ElementRef;
  @ViewChild('changeLanguageWindowIn') changeLanguageWindowIn: ElementRef;

  /* ----- Portugues ----- */
  @ViewChild('avaya__ok__pt') avaya__ok__pt: ElementRef;
  @ViewChild('avaya__fail__pt') avaya__fail__pt: ElementRef;
  @ViewChild('modalPt') modalPt: ElementRef;
  @ViewChild('containerProgressBarPt') containerProgressBarPt: ElementRef;
  @ViewChild('progressBarPt') progressBarPt: ElementRef;
  @ViewChild('settingsPt') settingsPt: ElementRef;
  @ViewChild('changeLanguageWindowPt') changeLanguageWindowPt: ElementRef;
  
  @ViewChild('versionValue') versionValue: ElementRef;

  //PREPARACIÓN DE ALERT POP (SWEETALERT2)
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  });

  constructor( 
    private __ipcService: IpcService,
    private renderer: Renderer2,
    private  __alertService: AlertService
  ) { }

  //COMPROBAR QUE AVAYA ESTÉ INSTALADO
  public checkAvayaInstall(): void {
    //Comunicacion entre procesos: verificar si avaya está instalado.
    this.__ipcService.send( 'checkAvayaInstall' );
    this.__ipcService.on( 'checkAvayaInstall', ( event, args ) => {
      //Si avaya no está instalado...
      if( args.data === 'fail' ) {
        //muestra la ventana de: Avaya no está instalado
        this.renderer.removeClass( this.avaya__fail.nativeElement, 'none' );
        //Muestra una alerta diciendo que: Avaya no está instalado
        this.__alertService.alertError( 'No se ha encontrado Avaya One X Agent' );
        //Si avaya está instalado...
      }else {
        //Mostrar ventana principal de avaya
        this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
        //Mostrar version de la aplicación
        this.setVersion();
        //Actualizaciones automáticas
        this.checkUpdates();
      }
    });
  }
  //MOSTRAR VERSION DE LA APLICACION
  public setVersion(): void {
    this.__ipcService.send( 'setVersion' );
    this.__ipcService.on( 'setVersion', ( event, args ) => this.renderer.setProperty( this.versionValue.nativeElement, 'innerHTML', `V.${args.data}` ) );
  }
  //ACTUALIZACIONES AUTOMATICAS
  public checkUpdates(): void {
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
  //Ocultar elementos del DOM
  public hiddenDom(): void {
    
    /* ----- Ingles ----- */
    //Ocultar la ventana de: instalacion de avaya fallida
    this.renderer.addClass( this.avaya__fail__in.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya ok
    this.renderer.addClass( this.avaya__ok__in.nativeElement, 'none' );
    //Ocultar la ventana de: progress bar, descarga de actualizacion
    this.renderer.addClass( this.modalIn.nativeElement, 'none' );
    //Ocultar ventana de Settings
    this.renderer.addClass( this.settingsIn.nativeElement, 'none' );
    //Ocultar ventana de cambio de idioma
    this.renderer.addClass( this.changeLanguageWindowIn.nativeElement, 'none' );


    /* ----- Portugues ----- */
    //Ocultar la ventana de: instalacion de avaya fallida
    this.renderer.addClass( this.avaya__fail__pt.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya ok
    this.renderer.addClass( this.avaya__ok__pt.nativeElement, 'none' );
    //Ocultar la ventana de: progress bar, descarga de actualizacion
    this.renderer.addClass( this.modalPt.nativeElement, 'none' );
    //Ocultar ventana de Settings
    this.renderer.addClass( this.settingsPt.nativeElement, 'none' );
    //Ocultar ventana de cambio de idioma
    this.renderer.addClass( this.changeLanguageWindowPt.nativeElement, 'none' );
  }
  //Cambiar idioma
  public setLanguage(): void {
    this.__ipcService.send( 'setLanguage' );
    this.__ipcService.on( 'setLanguage', ( event, args ) => {
      if( args.data === 'notRead' ) {

      }
    });
  }
}

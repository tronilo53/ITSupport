import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { IpcService } from 'src/app/services/ipc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  //DECLARACION DE ELEMENTOS DOM
  @ViewChild('avaya__ok') avaya__ok: ElementRef;
  @ViewChild('avaya__ok__in') avaya__ok__in: ElementRef;
  @ViewChild('avaya__fail') avaya__fail: ElementRef;
  @ViewChild('avaya__fail__in') avaya__fail__in: ElementRef;
  @ViewChild('versionValue') versionValue: ElementRef;
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('modalIn') modalIn: ElementRef;
  @ViewChild('containerProgressBar') containerProgressBar: ElementRef;
  @ViewChild('containerProgressBarIn') containerProgressBarIn: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('progressBarIn') progressBarIn: ElementRef;
  @ViewChild('appLanguage') appLanguage: ElementRef;

  //PREPARACIÓN DE ALERT POP (SWEETALERT2)
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  })

  //CONSTRUCTOR DE CLASE IMPLEMENTANDO: Servicios ipc, detector de cambios en dom, renderer para manipular dom y Servicios de alerta.
  constructor( 
    private __ipcService: IpcService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private __alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Ocultar la ventana de: instalacion de avaya fallida Español
    this.renderer.addClass( this.avaya__fail.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya fallida Ingles
    this.renderer.addClass( this.avaya__fail__in.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya ok Español
    this.renderer.addClass( this.avaya__ok.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya ok Ingles
    this.renderer.addClass( this.avaya__ok__in.nativeElement, 'none' );
    //Ocultar la ventana de: progress bar, descarga de actualizacion Español
    this.renderer.addClass( this.modal.nativeElement, 'none' );
    //Ocultar la ventana de: progress bar, descarga de actualizacion Ingles
    this.renderer.addClass( this.modalIn.nativeElement, 'none' );
    //Ocultar la ventana de: seleccion de idioma
    this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
    //Comprobar que avaya esté instalado
    this.checkAvayaInstall();
  }

  //ABRIR VENTANA DE IT (Español)
  public openIt(): void {
    this.__ipcService.send( 'openIt' );
    this.changeDetectorRef.detectChanges();
  }
  //ABRIR VENTANA DE IT (Ingles)
  public openItIn(): void {
    this.__ipcService.send( 'openItIn' );
    this.changeDetectorRef.detectChanges();
  }
  //ABRIR DENTANA DE CONFIGURACION DE AVAYA (Español)
  public openAvaya(): void {
    this.__ipcService.send( 'openAvaya' );
    this.changeDetectorRef.detectChanges();
  }
  //ABRIR DENTANA DE CONFIGURACION DE AVAYA (Ingles)
  public openAvayaIn(): void {
    this.__ipcService.send( 'openAvayaIn' );
    this.changeDetectorRef.detectChanges();
  }
  //ESTABLECER IDIOMA SELECCIONADO
  public setLanguage( lan: string ): void {
    //Comunicación entre procesos: Modificar archivo language.xml con el idioma seleccionado
    this.__ipcService.send( 'setLanguage', { data: lan } );
    this.__ipcService.on( 'setLanguage', ( event, args ) => {
      //Si hay algun error en lectura, json o modificar el archivo...
      if( args.data === 'norRead' || args.data === 'notJson' || args.data === 'notWrite' ) {  // Error: 0045
        //Ocultar ventana de selección de idioma
        this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
        //Mostrar ventana principal de avaya - español
        this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
        //Mostrar alerta de error en cambio de idioma
        this.__alertService.alertError( 'Ha habido un problema al establecer el idioma "Error: 0045" Se establecerá el idioma a español' );
      //Si no hay ningún problema en lectura, json y modificar el archivo...
      }else {
        //Si se modifica a español...
        if( args.data === 'change__sp' ) {
          //Ocultar ventana de seleccion de idioma
          this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
          //Mostrar ventana principal de avaya - español
          this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
        //Si se modifica a ingles...
        }else {
          //Redireccionar a HomeIn
          this.router.navigateByUrl( 'HomeIn' );
        }
      }
    });
  }
  //COMPROBAR QUE AVAYA ESTÉ INSTALADO
  private checkAvayaInstall(): void {
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
  //Mostrar ventana de: Avaya no está instalado - con codigo de error en language
  private showFailInstallAvayaErrorLanguage( error: string ): void {
    //Mostrar ventana de: Avaya no está instalado - Por defecto español
    this.renderer.removeClass( this.avaya__fail.nativeElement, 'none' );
    //Mostrar alerta de error en la lectura de language.xml
    this.__alertService.alertError( `Ha habido un problema con la selección del idioma. Se establecerá el idioma Español por defecto. Error: ${error}` );
  }
}
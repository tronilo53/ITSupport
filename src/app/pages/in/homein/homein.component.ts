import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertinService } from 'src/app/services/alertin.service';
import { IpcService } from 'src/app/services/ipc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './homein.component.html',
  styleUrls: ['./homein.component.css']
})
export class HomeinComponent implements OnInit, AfterViewInit {

  //DECLARACION DE ELEMENTOS DOM
  @ViewChild('avaya__ok') avaya__ok: ElementRef;
  @ViewChild('avaya__fail') avaya__fail: ElementRef;
  @ViewChild('versionValue') versionValue: ElementRef;
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('containerProgressBar') containerProgressBar: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('appLanguage') appLanguage: ElementRef;

  //PREPARACIÓN DE ALERT POP (SWEETALERT2)
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  })

  //CONSTRUCTOR DE CLASE IMPLEMENTANDO: Servicios ipc, detector de cambios en dom, renderer para manipular dom, Servicios de alerta y navegación entre rutas.
  constructor( 
    private __ipcService: IpcService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private __alertService: AlertinService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Ocultar la ventana de: instalacion de avaya fallida
    this.renderer.addClass( this.avaya__fail.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya ok
    this.renderer.addClass( this.avaya__ok.nativeElement, 'none' );
    //Ocultar la ventana de: progress bar, descarga de actualizacion
    this.renderer.addClass( this.modal.nativeElement, 'none' );
    //Ocultar la ventana de: seleccion de idioma
    this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
    //Comprobar que avaya esté instalado
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
  //ESTABLECER IDIOMA SELECCIONADO //TODO: Aprovechar función para cambiar idioma con boton
  /*public setLanguage( lan: string ): void {
    //Comunicación entre procesos: Modificar archivo language.xml con el idioma seleccionado
    this.__ipcService.send( 'setLanguage', { data: lan } );
    this.__ipcService.on( 'setLanguage', ( event, args ) => {
      //Si hay algun error en lectura, json o modificar el archivo...
      if( args.data === 'norRead' || args.data === 'notJson' || args.data === 'notWrite' ) {
        //TODO: Establecer idioma a español
        console.log( 'Ha habido un error al procesar el idioma, se establecerá como predeterminado el idioma: Español' );
        //Ocultar ventana de selección de idioma
        this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
        //Mostrar ventana principal de avaya
        this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
      //Si no hay ningún problema en lectura, json y modificar el archivo...
      }else {
        //Si se modifica a español...
        if( args.data === 'change__sp' ) {
          //TODO: Establecer idioma a español
          console.log( 'Se ha cambiado al idioma: Español' );
          //Ocultar ventana de selección de idioma
          this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
          //Mostrar ventana principal de avaya
          this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
        //Si se modifica a ingles...
        }else {
          //TODO: Establecer idioma a ingles
          console.log( 'Se ha cambiado al idioma: Inglés' );
          //Ocultar ventana de selección de idioma
          this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
          //Mostrar ventana principal de avaya
          this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
        }
      }
    });
  }*/
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
        this.__alertService.alertError( 'Avaya One X Agent not found' );
        //Si avaya está instalado...
      }else {
        //Mostrar la ventana principal de avaya
        this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
        this.setVersion();
        this.checkUpdates();
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
        title: 'No updates available'
      });
    });

    //ERROR EN ACTUALIZACION
    this.__ipcService.on( 'error_update', () => {
      this.__ipcService.removeAllListeners( 'error_update' );
      this.Toast.fire({
        icon: 'error',
        title: 'Error in updates'
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
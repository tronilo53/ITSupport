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
    //Ocultar la ventana de: instalacion de avaya fallida
    this.renderer.addClass( this.avaya__fail.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya ok
    this.renderer.addClass( this.avaya__ok.nativeElement, 'none' );
    //Ocultar la ventana de: progress bar, descarga de actualizacion
    this.renderer.addClass( this.modal.nativeElement, 'none' );
    //Ocultar la ventana de: seleccion de idioma
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
        this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
        this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
      }else {
        if( args.data === 'change__sp' ) {
          console.log( 'Se ha cambiado al idioma: Español' );
          this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
          this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
        }else {
          console.log( 'Se ha cambiado al idioma: Inglés' );
          this.renderer.addClass( this.appLanguage.nativeElement, 'none' );
          this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
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
        //Comunicación entre procesos: Verificar si hay un idioma en el archivo: language.xml
        this.__ipcService.send( 'checkLanguage' );
        this.__ipcService.on( 'checkLanguage', ( event, args ) => {
          //Si no lee el archivo language.xml...
          if( args.data === 'notRead' ) {
            //TODO: Establecer idioma a español.
            console.log( 'No se ha podido leer el archivo' );
            //Mostrar ventana principal de avaya;
            this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
            //Si lee el archivo language.xml pero no procesa el JSON...
          }else if( args.data === 'notJson' ) {
            //TODO: Establecer idioma a español.
            console.log( 'No se ha podido pasar a json' );
            //Si lee el archivo language.xml y se procesa el JSON...
          }else {
            //Si el idioma del archivo language.xml está vacío...
            if( args.data === '' ) {
              //Muestra la ventana de selección de idioma.
              this.renderer.removeClass( this.appLanguage.nativeElement, 'none' );
            }else if( args.data === 'sp' ) {
              console.log( 'El idioma está en español' );
              //TODO: PONER APP EN ESPAÑOL
              this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
              this.setVersion();
              this.checkUpdates();
            }else {
              console.log( 'El idioma está en inglés' );
              //TODO: PONER APP EN INGLÉS
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
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AlertinService } from 'src/app/services/alertin.service';
import { AlertptService } from 'src/app/services/alertpt.service';
import { IpcService } from 'src/app/services/ipc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  //DECLARACION DE ELEMENTOS DOM
  /* ----- Español ----- */
  @ViewChild('sp') sp: ElementRef;
  @ViewChild('avaya__ok') avaya__ok: ElementRef;
  @ViewChild('avaya__fail') avaya__fail: ElementRef;
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('containerProgressBar') containerProgressBar: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('settings') settings: ElementRef;
  @ViewChild('changeLanguageWindow') changeLanguageWindow: ElementRef;

  /* ----- Ingles ----- */
  @ViewChild('in') in: ElementRef;
  @ViewChild('avaya__ok__in') avaya__ok__in: ElementRef;
  @ViewChild('avaya__fail__in') avaya__fail__in: ElementRef;
  @ViewChild('modalIn') modalIn: ElementRef;
  @ViewChild('containerProgressBarIn') containerProgressBarIn: ElementRef;
  @ViewChild('progressBarIn') progressBarIn: ElementRef;
  @ViewChild('settingsIn') settingsIn: ElementRef;
  @ViewChild('changeLanguageWindowIn') changeLanguageWindowIn: ElementRef;

  /* ----- Portugues ----- */
  @ViewChild('pt') pt: ElementRef;
  @ViewChild('avaya__ok__pt') avaya__ok__pt: ElementRef;
  @ViewChild('avaya__fail__pt') avaya__fail__pt: ElementRef;
  @ViewChild('modalPt') modalPt: ElementRef;
  @ViewChild('containerProgressBarPt') containerProgressBarPt: ElementRef;
  @ViewChild('progressBarPt') progressBarPt: ElementRef;
  @ViewChild('settingsPt') settingsPt: ElementRef;
  @ViewChild('changeLanguageWindowPt') changeLanguageWindowPt: ElementRef;

  //PROPIEDADES DE CAMBIO DE IDIOMA (SELECT) - ngModel
  /* ----- Español ----- */
  public dataLan: string = '???';
  /* ----- Ingles ----- */
  public dataLanIn: string = '???';
  /* ----- Portugues ----- */
  public dataLanPt: string = '???';

  //PREPARACIÓN DE ALERT POP (SWEETALERT2)
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  });

  @ViewChild('versionValue') versionValue: ElementRef;

  constructor(
    private __ipcService: IpcService,
    private renderer: Renderer2,
    private __alertService: AlertService,
    private __alertServiceIn: AlertinService,
    private __alertServicePt: AlertptService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Ocultar elementos del DOM (Español)
    this.hiddenDom();   
    //Ocultar elementos del DOM (Ingles)
    this.hiddenDomIn();   
    //Ocultar elementos del DOM (Portugues)
    this.hiddenDomPt();   
    //Comprobar que avaya esté instalado
    this.checkAvayaInstall();
  }
  
  /* ----------- OTROS ---------- */
  //COMPROBAR QUE AVAYA ESTÉ INSTALADO
  public checkAvayaInstall(): void {
    //Comunicacion entre procesos: verificar si avaya está instalado.
    this.__ipcService.send( 'checkAvayaInstall' );
    this.__ipcService.on( 'checkAvayaInstall', ( event, args ) => {
      //Si avaya no está instalado...
      if( args.data === 'fail' ) {
        this.__ipcService.send( 'checkLanguage' );
        this.__ipcService.on( 'checkLanguage', ( event, args ) => {
          if( args.data === '' || args.data === 'sp' ) {
            //Muestra el contenedor Español
            this.renderer.removeClass( this.sp.nativeElement, 'none' );
            //muestra la ventana de: Avaya no está instalado (Español)
            this.renderer.removeClass( this.avaya__fail.nativeElement, 'none' );
            //Muestra una alerta diciendo que: Avaya no está instalado (Español)
            this.__alertService.alertError( 'No se ha encontrado Avaya One X Agent' );
          }else if( args.data === 'in' ) {
            //Muestra el contenedor Ingles
            this.renderer.removeClass( this.in.nativeElement, 'none' );
            //muestra la ventana de: Avaya no está instalado (Español)
            this.renderer.removeClass( this.avaya__fail__in.nativeElement, 'none' );
            //Muestra una alerta diciendo que: Avaya no está instalado (Español)
            this.__alertServiceIn.alertError( 'Avaya One X Agent not found' );
          }else {
            //Muestra el contenedor Portugues
            this.renderer.removeClass( this.pt.nativeElement, 'none' );
            //muestra la ventana de: Avaya no está instalado (Español)
            this.renderer.removeClass( this.avaya__fail__pt.nativeElement, 'none' );
            //Muestra una alerta diciendo que: Avaya no está instalado (Español)
            this.__alertServicePt.alertError( 'Avaya One X Agent não encontrado' );
          }
        });
        //Si avaya está instalado...
      }else {
        this.__ipcService.send( 'checkLanguage' );
        this.__ipcService.on( 'checkLanguage', ( event, args ) => {
          if( args.data === '' || args.data === 'sp' ) {
            //Muestra el contenedor Español
            this.renderer.removeClass( this.sp.nativeElement, 'none' );
            //Mostrar ventana principal de avaya (Español)
            this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
            //Mostrar version de la aplicación
            this.setVersion();
            //Actualizaciones automáticas (Español)
            this.checkUpdates();
          }else if( args.data === 'in' ) {
            //Muestra el contenedor Ingles
            this.renderer.removeClass( this.in.nativeElement, 'none' );
            //Mostrar ventana principal de avaya (Ingles)
            this.renderer.removeClass( this.avaya__ok__in.nativeElement, 'none' );
            //Mostrar version de la aplicación
            this.setVersion();
            //Actualizaciones automáticas (Ingles)
            this.checkUpdatesIn();
          }else {
            //Muestra el contenedor Portugues
            this.renderer.removeClass( this.pt.nativeElement, 'none' );
            //Mostrar ventana principal de avaya (Portugues)
            this.renderer.removeClass( this.avaya__ok__pt.nativeElement, 'none' );
            //Mostrar version de la aplicación
            this.setVersion();
            //Actualizaciones automáticas (Portugues)
            this.checkUpdatesPt();
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
  //CERRAR APLICACIÓN
  public closeApp(): void {
    this.__ipcService.send( 'closeApp' );
  }
  //Cambiar idioma
  private setLanguage(): void {
    this.__ipcService.send( 'setLanguage' );
    this.__ipcService.on( 'setLanguage', ( event, args ) => {
      if( args.data === 'notRead' ) {

      }
    });
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
  /* ------------------------------------------------------------------------------------------------------------------------------------------ */

  /* ------- Español ------- */
  //ABRIR VENTANA DE SETTINGS
  public showSettings(): void {
    this.renderer.removeClass( this.settings.nativeElement, 'none' ); 
  }
  //CERRAR VENTANA DE SETTINGS
  public closeSettings(): void {
    //Ocultar la ventana de settings
    this.renderer.addClass( this.settings.nativeElement, 'none' );
    //Ocultar la ventana de cambio de idioma
    this.renderer.addClass( this.changeLanguageWindow.nativeElement, 'none' );
    //Resetea el campo del idioma(Select)
    this.dataLan = '???';
  }
  //MOSTRAR VENTANA DE CAMBIO DE IDIOMA
  public showChangeLanguage(): void {
    this.renderer.removeClass( this.changeLanguageWindow.nativeElement, 'none' );
  }
  //Cambiar el idioma de la app
  public changeLanguageBtn(): void { //TODO: Pendiente...
    if( this.dataLan === '???' ) this.__alertService.alertError( 'Por favor, seleccione un idioma' );
    else {
      if( this.dataLan === '1' ) this.__alertService.alertError( 'El idioma español ya está establecido' );
      else if( this.dataLan === '2' ) {
        //TODO: Ocultar español y mostrar ingles
        this
        this.setLanguage();
      }else {
        //TODO: Ocultar español y mostrar Portugues
      }
    }
    this.__ipcService.on( 'changeLanguage', ( event, args ) => {
 
    });
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
  public hiddenDom(): void {
    /* ----- Español ----- */
    //Ocultar contenedor
    this.renderer.addClass( this.sp.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya fallida
    this.renderer.addClass( this.avaya__fail.nativeElement, 'none' );
    //Ocultar la ventana de: instalacion de avaya ok
    this.renderer.addClass( this.avaya__ok.nativeElement, 'none' );
    //Ocultar la ventana de: progress bar, descarga de actualizacion
    this.renderer.addClass( this.modal.nativeElement, 'none' );
    //Ocultar ventana de Settings
    this.renderer.addClass( this.settings.nativeElement, 'none' );
    //Ocultar ventana de cambio de idioma
    this.renderer.addClass( this.changeLanguageWindow.nativeElement, 'none' );
  }
  //ABRIR PORTAL DE INCIDENCIAS (Español)
  public openIncident(): void {
    this.__ipcService.send( 'openIncident' );
    //Ocultar ventana de cambio de idioma
    this.renderer.addClass( this.changeLanguageWindow.nativeElement, 'none' );
    //Rsetear campo de seleccion de idioma
    this.dataLan = '???';
  }

  /* ------- Ingles ------- */
  //OCULTAR ELEMENTOS DEL DOM
  public hiddenDomIn(): void {
    /* ----- Ingles ----- */
    //Ocultar contenedor
    this.renderer.addClass( this.in.nativeElement, 'none' );
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
  }
  //MOSTRAR VENTANA DE CAMBIO DE IDIOMA (Ingles)
  public showChangeLanguageIn(): void {
    this.renderer.removeClass( this.changeLanguageWindowIn.nativeElement, 'none' );
  }
  //ABRIR VENTANA DE SETTINGS (Ingles)
  public showSettingsIn(): void {
    this.renderer.removeClass( this.settingsIn.nativeElement, 'none' ); 
  }
  //CERRAR VENTANA DE SETTINGS (Ingles)
  public closeSettingsIn(): void {
    //Ocultar la ventana de settings (Ingles)
    this.renderer.addClass( this.settingsIn.nativeElement, 'none' );
    //Ocultar la ventana de cambio de idioma (Ingles)
    this.renderer.addClass( this.changeLanguageWindowIn.nativeElement, 'none' );
    //Resetea el campo del idioma(Select)(Ingles)
    this.dataLanIn = '???';
  }
  //ACTUALIZACIONES AUTOMATICAS
  public checkUpdatesIn(): void {
    //ACTUALIZACION DISPONIBLE
    this.__ipcService.on( 'update_available', () => {
      this.__ipcService.removeAllListeners( 'update_available' );
      this.__alertServiceIn.alertAvailableUpdate();
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
      this.renderer.removeClass( this.modalIn.nativeElement, 'none' );
      this.renderer.setProperty( this.containerProgressBarIn.nativeElement, 'aria-valuenow', args );
      this.renderer.setProperty( this.progressBarIn.nativeElement, 'style', `width:${args}%` );
      this.renderer.setProperty( this.progressBarIn.nativeElement, 'innerHTML', `${args}%` );
      if( args == 100 ) this.renderer.addClass( this.modalIn.nativeElement, 'none' );
    });    

    //ACTUALIZACIÓN DESCARGADA
    this.__ipcService.on( 'update_downloaded', () => {
      this.__ipcService.removeAllListeners( 'update_downloaded' );
      this.__alertServiceIn.alertDownloadUpdate();
    });
  }
  //Cambiar el idioma de la app
  public changeLanguageBtnIn(): void { //TODO: Pendiente...
    if( this.dataLan === '???' ) this.__alertServiceIn.alertError( 'Por favor, seleccione un idioma' );
    else {
      if( this.dataLan === '1' ) this.__alertServiceIn.alertError( 'El idioma español ya está establecido' );
      else if( this.dataLan === '2' ) {
        //TODO: Ocultar español y mostrar ingles
        this.setLanguage();
      }else {
        //TODO: Ocultar español y mostrar Portugues
      }
    }
    this.__ipcService.on( 'changeLanguage', ( event, args ) => {
 
    });
  }
  //ABRIR PORTAL DE INCIDENCIAS (Ingles)
  public openIncidentIn(): void {
    this.__ipcService.send( 'openIncident' );
    //Ocultar ventana de cambio de idioma
    this.renderer.addClass( this.changeLanguageWindowIn.nativeElement, 'none' );
    //Rsetear campo de seleccion de idioma
    this.dataLanIn = '???';
  }

  /* ------- Portugues ------- */
  //OCULTAR ELEMENTOS DEL DOM
  public hiddenDomPt(): void {
    /* ----- Portugues ----- */
    //Ocultar contenedor
    this.renderer.addClass( this.pt.nativeElement, 'none' );
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
  //MOSTRAR VENTANA DE CAMBIO DE IDIOMA (Portugues)
  public showChangeLanguagePt(): void {
    this.renderer.removeClass( this.changeLanguageWindowPt.nativeElement, 'none' );
  }
  //ABRIR VENTANA DE SETTINGS (Portugues)
  public showSettingsPt(): void {
    this.renderer.removeClass( this.settingsPt.nativeElement, 'none' ); 
  }
  //CERRAR VENTANA DE SETTINGS (Portugues)
  public closeSettingsPt(): void {
    //Ocultar la ventana de settings (Ingles)
    this.renderer.addClass( this.settingsPt.nativeElement, 'none' );
    //Ocultar la ventana de cambio de idioma (Ingles)
    this.renderer.addClass( this.changeLanguageWindowPt.nativeElement, 'none' );
    //Resetea el campo del idioma(Select)(Ingles)
    this.dataLanPt = '???';
  }
  //ACTUALIZACIONES AUTOMATICAS
  public checkUpdatesPt(): void {
    //ACTUALIZACION DISPONIBLE
    this.__ipcService.on( 'update_available', () => {
      this.__ipcService.removeAllListeners( 'update_available' );
      this.__alertServicePt.alertAvailableUpdate();
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
      this.renderer.removeClass( this.modalPt.nativeElement, 'none' );
      this.renderer.setProperty( this.containerProgressBarPt.nativeElement, 'aria-valuenow', args );
      this.renderer.setProperty( this.progressBarPt.nativeElement, 'style', `width:${args}%` );
      this.renderer.setProperty( this.progressBarPt.nativeElement, 'innerHTML', `${args}%` );
      if( args == 100 ) this.renderer.addClass( this.modalPt.nativeElement, 'none' );
    });    

    //ACTUALIZACIÓN DESCARGADA
    this.__ipcService.on( 'update_downloaded', () => {
      this.__ipcService.removeAllListeners( 'update_downloaded' );
      this.__alertServicePt.alertDownloadUpdate();
    });
  }
  //Cambiar el idioma de la app
  public changeLanguageBtnPt(): void { //TODO: Pendiente...
    if( this.dataLan === '???' ) this.__alertServicePt.alertError( 'Por favor, seleccione un idioma' );
    else {
      if( this.dataLan === '1' ) this.__alertServicePt.alertError( 'El idioma español ya está establecido' );
      else if( this.dataLan === '2' ) {
        //TODO: Ocultar español y mostrar ingles
        this.setLanguage();
      }else {
        //TODO: Ocultar español y mostrar Portugues
      }
    }
    this.__ipcService.on( 'changeLanguage', ( event, args ) => {
 
    });
  }
  //ABRIR PORTAL DE INCIDENCIAS (Portugues)
  public openIncidentPt(): void {
    this.__ipcService.send( 'openIncident' );
    //Ocultar ventana de cambio de idioma
    this.renderer.addClass( this.changeLanguageWindowPt.nativeElement, 'none' );
    //Rsetear campo de seleccion de idioma
    this.dataLanPt = '???';
  } 
}
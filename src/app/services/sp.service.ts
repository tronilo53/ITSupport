import { ChangeDetectorRef, ElementRef, Injectable, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from './alert.service';
import { GeneralService } from './general.service';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class SpService {

  //DECLARACION DE ELEMENTOS DOM
  /* ----- Español ----- */
  @ViewChild('avaya__ok') avaya__ok: ElementRef;
  @ViewChild('avaya__fail') avaya__fail: ElementRef;
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('containerProgressBar') containerProgressBar: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('settings') settings: ElementRef;
  @ViewChild('changeLanguageWindow') changeLanguageWindow: ElementRef;

  //PROPIEDADES DE CAMBIO DE IDIOMA (SELECT) - ngModel
  /* ----- Español ----- */
  public dataLan: string = '???';

  constructor( 
    private __ipcService: IpcService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private __alertService: AlertService,
    private __generalService: GeneralService
  ) { }

  /* -----------  Español ----------- */
  //ABRIR VENTANA DE IT (Español)
  public openIt(): void {
    this.__ipcService.send( 'openIt' );
    this.changeDetectorRef.detectChanges();
  }
  //ABRIR DENTANA DE CONFIGURACION DE AVAYA (Español)
  public openAvaya(): void {
    this.__ipcService.send( 'openAvaya' );
    this.changeDetectorRef.detectChanges();
  }
  //ABRIR VENTANA DE SETTINGS (Español)
  public showSettings(): void {
    this.renderer.removeClass( this.settings.nativeElement, 'none' ); 
  }
  //CERRAR VENTANA DE SETTINGS (Español)
  public closeSettings(): void {
    //Ocultar la ventana de settings
    this.renderer.addClass( this.settings.nativeElement, 'none' );
    //Ocultar la ventana de cambio de idioma
    this.renderer.addClass( this.changeLanguageWindow.nativeElement, 'none' );
    //Resetea el campo del idioma(Select)
    this.dataLan = '???';
  }
  //MOSTRAR VENTANA DE CAMBIO DE IDIOMA (Español)
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
        this.__generalService.setLanguage();
      }else {
        //TODO: Ocultar español y mostrar Portugues
      }
    }
    this.__ipcService.on( 'changeLanguage', ( event, args ) => {
 
    });
  }
  public hiddenDom(): void {
    /* ----- Español ----- */
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
}

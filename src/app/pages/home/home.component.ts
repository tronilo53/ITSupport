import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { GeneralService } from 'src/app/services/general.service';
import { IpcService } from 'src/app/services/ipc.service';
import { SpService } from 'src/app/services/sp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  //PROPIEDADES DE CAMBIO DE IDIOMA (SELECT) - ngModel
  /* ----- Ingles ----- */
  public dataLanIn: string = '???';
  /* ----- Portugues ----- */
  public dataLanPt: string = '???';

  //CONSTRUCTOR DE CLASE IMPLEMENTANDO: Servicios ipc, detector de cambios en dom, renderer para manipular dom y Servicios de alerta.
  constructor( 
    private __ipcService: IpcService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private __generalService: GeneralService,
    private __spService: SpService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Ocultar elementos del DOM (Español)
    this.__spService.hiddenDom();   
    //Ocultar elementos del DOM (Ingles)
    this.__inService.hiddenDomIn();   
    //Ocultar elementos del DOM (Portugues)
    this.__ptService.hiddenDomPt();   
    //Comprobar que avaya esté instalado
    this.__generalService.checkAvayaInstall();
  }

  /* -----------  Inglés ----------- */
  //ABRIR VENTANA DE IT (Ingles)
  public openItIn(): void {
    this.__ipcService.send( 'openItIn' );
    this.changeDetectorRef.detectChanges();
  }
  //ABRIR DENTANA DE CONFIGURACION DE AVAYA (Ingles)
  public openAvayaIn(): void {
    this.__ipcService.send( 'openAvayaIn' );
    this.changeDetectorRef.detectChanges();
  }
  //MOSTRAR VENTANA DE CAMBIO DE IDIOMA (Ingles)
  public showChangeLanguageIn(): void {
    this.renderer.removeClass( this.__generalService.changeLanguageWindowIn.nativeElement, 'none' );
  }
  //CERRAR VENTANA DE SETTINGS (Ingles)
  public closeSettingsIn(): void {
    //Ocultar la ventana de settings (Ingles)
    this.renderer.addClass( this.__generalService.settingsIn.nativeElement, 'none' );
    //Ocultar la ventana de cambio de idioma (Ingles)
    this.renderer.addClass( this.__generalService.changeLanguageWindowIn.nativeElement, 'none' );
    //Resetea el campo del idioma(Select)(Ingles)
    this.dataLanIn = '???';
  }
  //Cambiar el idioma de la app
  public changeLanguageBtnIn(): void { } //TODO: Pendiente...

  /* -----------  Portugues ----------- */
  //ABRIR VENTANA DE IT (Portugues)
  public openItPt(): void {
    this.__ipcService.send( 'openItPt' );
    this.changeDetectorRef.detectChanges();
  }
  //ABRIR DENTANA DE CONFIGURACION DE AVAYA (Portugues)
  public openAvayaPt(): void {
    this.__ipcService.send( 'openAvayaPt' );
    this.changeDetectorRef.detectChanges();
  }
  //MOSTRAR VENTANA DE CAMBIO DE IDIOMA (Portugues)
  public showChangeLanguagePt(): void {
    this.renderer.removeClass( this.__generalService.changeLanguageWindowPt.nativeElement, 'none' );
  }
  //CERRAR VENTANA DE SETTINGS (Portugues)
  public closeSettingsPt(): void {
    //Ocultar la ventana de settings (Ingles)
    this.renderer.addClass( this.__generalService.settingsIn.nativeElement, 'none' );
    //Ocultar la ventana de cambio de idioma (Ingles)
    this.renderer.addClass( this.__generalService.changeLanguageWindowIn.nativeElement, 'none' );
    //Resetea el campo del idioma(Select)(Ingles)
    this.dataLanIn = '???';
  }
  //Cambiar el idioma de la app
  public changeLanguageBtnPt(): void { } //TODO: Pendiente...
  
  /* ----------- OTROS ---------- */
  //ABRIR PORTAL DE INCIDENCIAS
  public openIncident(): void {
    this.__ipcService.send( 'openIncident' );
    //Ocultar ventana de cambio de idioma
    this.renderer.addClass( this.__generalService.changeLanguageWindow.nativeElement, 'none' );
    //Rsetear campo de seleccion de idioma
    this.dataLan = '???';
  }
  //CERRAR APLICACIÓN
  public closeApp(): void {
    this.__ipcService.send( 'closeApp' );
  }
}
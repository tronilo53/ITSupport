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
  /* ----- Español ----- */
  @ViewChild('avaya__ok') avaya__ok: ElementRef;
  @ViewChild('avaya__fail') avaya__fail: ElementRef;
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('containerProgressBar') containerProgressBar: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('settings') settings: ElementRef;
  @ViewChild('changeLanguageWindow') changeLanguageWindow: ElementRef;

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

  //CONSTRUCTOR DE CLASE IMPLEMENTANDO: Servicios ipc, detector de cambios en dom, renderer para manipular dom y Servicios de alerta.
  constructor( 
    private __ipcService: IpcService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private __alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Ocultar elementos del DOM
    this.hiddenDom();    
    //Comprobar que avaya esté instalado
    this.checkAvayaInstall();
  }

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
        this.setLanguage();
      }else {
        //TODO: Ocultar español y mostrar Portugues
      }
    }
    this.__ipcService.on( 'changeLanguage', ( event, args ) => {
 
    });
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
    this.renderer.removeClass( this.changeLanguageWindowIn.nativeElement, 'none' );
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
    this.renderer.removeClass( this.changeLanguageWindowPt.nativeElement, 'none' );
  }
  //CERRAR VENTANA DE SETTINGS (Portugues)
  public closeSettingsPt(): void {
    //Ocultar la ventana de settings (Ingles)
    this.renderer.addClass( this.settingsIn.nativeElement, 'none' );
    //Ocultar la ventana de cambio de idioma (Ingles)
    this.renderer.addClass( this.changeLanguageWindowIn.nativeElement, 'none' );
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
    this.renderer.addClass( this.changeLanguageWindow.nativeElement, 'none' );
    //Rsetear campo de seleccion de idioma
    this.dataLan = '???';
  }
  //CERRAR APLICACIÓN
  public closeApp(): void {
    this.__ipcService.send( 'closeApp' );
  }
  
  

}
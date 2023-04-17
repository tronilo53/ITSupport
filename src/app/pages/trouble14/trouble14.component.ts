import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-trouble14',
  templateUrl: './trouble14.component.html',
  styleUrls: ['./trouble14.component.css']
})
export class Trouble14Component implements OnInit, AfterViewInit {

  //Se guarada el componente loading del DOM
  @ViewChild('loading') loading: ElementRef;
  //Se guarda el contenedor de no hay botones del DOM
  @ViewChild('existButtons') existButtons: ElementRef;
  //Se guarda el contenedor de que hay botones del DOM
  @ViewChild('notExistButtons') notExistButtons: ElementRef;

  //Se crea un objeto, para guardar todos los checkbox
  public checksSelected: string[] = [];

  //Se declara variable para guardar los botones favoritos obtenidos del servicio
  public buttons: any = {
    Marc_Abrev_4: false,
    AutoInACD: false,
    TrabAux: false,
    DespLlam: false,
    Marc_Abrev_8: false,
    Directorio: false,
    Proximo: false,
    Hacer_Llamada: false,
    Estacion_Llam: false,
    Tomar_Llam: false,
    Env_Cola_521: false,
    Liberar: false,
    normal: false,
    voice_mail_112: false
  };

  //Se declara variable para guardar count de botones activos
  public countButtonsActive: number = 0;

  constructor( 
    private __ipcService: IpcService,
    private renderer: Renderer2,
    private __dataService: DataService,
    private __alertService: AlertService 
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {

    //Ocultar alerta error: no hay botones añadidos
    this.renderer.addClass( this.existButtons.nativeElement, 'none' );
    //Ocultar alerta success: hay botones añadidos
    this.renderer.addClass( this.notExistButtons.nativeElement, 'none' );

    //Obtener botones añadidos de avaya
    this.__ipcService.send( 'getButtonsAvaya' );
    this.__ipcService.removeAllListeners( 'getButtonsAvaya' );
    this.__ipcService.on( 'getButtonsAvaya', ( event, args ) => {
      //Si no hay botones añadidos de avaya
      if( args.data === 'notButtons' ) {
        //Se muestra el contenedor de que no hay botones
        this.renderer.removeClass( this.notExistButtons.nativeElement, 'none' );
      //Si hay botones añadidos de avaya
      }else {
        //Se muestra el contenedor de que hay botones seleccionados
        this.renderer.removeClass( this.existButtons.nativeElement, 'none' );

        for( let i = 0; i < args.data.length; i++ ) {
          switch( args.data[i].$.Label ) {
            case 'Marc Abrev 4':
              this.buttons.Marc_Abrev_4 = true;
              break;
            case 'AutoInACD':
              this.buttons.AutoInACD = true;
              break;
            case 'TrabAux':
              this.buttons.TrabAux = true;
              break;
            case 'DespLlam':
              this.buttons.DespLlam = true;
              break;
            case 'Marc Abrev 8':
              this.buttons.Marc_Abrev_8 = true;
              break;
            case 'Directorio':
              this.buttons.Directorio = true;
              break;
            case 'Proximo':
              this.buttons.Proximo = true;
              break;
            case 'Hacer Llamada':
              this.buttons.Hacer_Llamada = true;
              break;
            case 'Estacion Llam':
              this.buttons.Estacion_Llam = true;
              break;
            case 'Tomar Llam':
              this.buttons.Tomar_Llam = true;
              break;
            case 'Env Cola 521':
              this.buttons.Env_Cola_521 = true;
              break;
            case 'Liberar':
              this.buttons.Liberar = true;
              break;
            case 'normal ':
              this.buttons.normal = true;
              break;
            default:
              this.buttons.voice_mail_112 = true;
              break;
          }
          this.checksSelected.push( args.data[i].$.Label );
        }

        this.countButtonsActive = this.checksSelected.length;

        /*
        <SelectedFeature Name="abrv-dial" Location="10" Label="Marc Abrev 4" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="auto-in" Location="11" Label="AutoInACD" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="aux-work" Location="12" Label="TrabAux" State="On" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="after-call" Location="13" Label="DespLlam" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="abrv-dial" Location="14" Label="Marc Abrev 8" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="directory" Location="15" Label="Directorio" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="next" Location="16" Label="Proximo" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="call-disp" Location="17" Label="Hacer Llamada" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="call-park" Location="18" Label="Estacion Llam" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="call-pkup" Location="19" Label="Tomar Llam" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="q-calls" Location="20" Label="Env Cola 521" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="release" Location="21" Label="Liberar" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="normal" Location="22" Label="normal " State="On" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        <SelectedFeature Name="voice-mail" Location="23" Label="voice-mail 112" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
        */
      }
    });

    //Ocultar loading
    this.renderer.addClass( this.loading.nativeElement, 'none' );
  }

  //DETECTAR LOS CAMBIOS EN LOS CHECKS.
  public selectChecks( value: any, label: string ): void {
    //TODO: REVISAR ESTA FUNCION.. NO ESTA BIEN
    if( value.target.checked ) {
      this.checksSelected.push( label );
    }else {
      if( this.checksSelected.indexOf( label ) > -1 ) {
        this.checksSelected.splice( this.checksSelected.indexOf( label ), 1 );
      }
    }
    this.countButtonsActive = this.checksSelected.length;
  }
  public modifyButtons(): void {
    if( this.checksSelected.length > 8 ) this.__alertService.alertError( 'Solo se permiten 8 botones, compruebe la cantidad de botones seleccionados.' );
    else {
      this.__ipcService.send( 'modifyButtonsAvaya', { data: this.checksSelected } );
      this.__ipcService.removeAllListeners( 'modifyButtonsAvaya' );
      this.__ipcService.on( 'modifyButtonsAvaya', ( event, args ) => {
        console.log( args.data );
      });
    }
  }
}

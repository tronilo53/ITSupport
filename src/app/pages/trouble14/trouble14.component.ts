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

  //Se guarada el componente loading del DOM
  @ViewChild('loading') loading: ElementRef;
  //Se guarda el contenedor de no hay botones del DOM
  @ViewChild('existButtons') existButtons: ElementRef;
  //Se guarda el contenedor de que hay botones del DOM
  @ViewChild('notExistButtons') notExistButtons: ElementRef;

  //Se crea un objeto, para guardar todos los checkbox ngModel
  public checksSelected: string[] = [];

  //Se declara variable para guardar los botones favoritos obtenidos del servicio
  public buttons: any[] = [];
  //Se declara variable para guardar los botones favoritos que ya tiene avaya
  public buttonsExist: any[] = [];

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

    //Obtener botones favoritos del servicio
    this.__dataService.getButtons().subscribe( (data: any) => {
      this.buttons = data;

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
          //Se muestra el contenedor de que hay botones seleccionados..
          this.renderer.removeClass( this.existButtons.nativeElement, 'none' );
          //Se guarda en la variable los botones que hay ya agregados
          this.buttonsExist = args.data;
          
        }
      });
    });
  }

  public selectChecks( value: any ): void {
    if( value.target.checked ) this.checksSelected.push( value.target.id );
    else {
      if( this.checksSelected.indexOf( value.target.id ) > -1 ) {
        this.checksSelected.splice( this.checksSelected.indexOf( value.target.id ), 1 );
      }
    }
  }
  public modifyButtons(): void {
    if( this.checksSelected.length > 8 ) this.__alertService.alertError( 'Solo se permite seleccionar 8 botones' );
    else {
      console.log( this.checksSelected );
    }
  }
}

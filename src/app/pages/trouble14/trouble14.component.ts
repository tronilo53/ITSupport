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
  
  @ViewChild('loading') loading: ElementRef;

  @ViewChild('sp') sp: ElementRef;
  @ViewChild('in') in: ElementRef;
  @ViewChild('pt') pt: ElementRef;

  //ESPAÑOL
  @ViewChild('alertInfoSp') alertInfoSp: ElementRef;
  @ViewChild('alertWarningSp') alertWarningSp: ElementRef;
  @ViewChild('selectButtonsSp') selectButtonsSp: ElementRef;
  @ViewChild('buttonAddSp') buttonAddSp: ElementRef;

  //INGLES
  @ViewChild('alertInfoIn') alertInfoIn: ElementRef;
  @ViewChild('alertWarningIn') alertWarningIn: ElementRef;
  @ViewChild('selectButtonsIn') selectButtonsIn: ElementRef;
  @ViewChild('buttonAddIn') buttonAddIn: ElementRef;

  //PORTUGUES
  @ViewChild('alertInfoPt') alertInfoPt: ElementRef;
  @ViewChild('alertWarningPt') alertWarningPt: ElementRef;
  @ViewChild('selectButtonsPt') selectButtonsPt: ElementRef;
  @ViewChild('buttonAddPt') buttonAddPt: ElementRef;

  //Array de todos los botones
  public allButtons: any[] = [];

  //Se crea un objeto, para guardar todos los checkbox
  //public buttonsSelected: string[] = [];

  //Se crea un objeto para guardar los botones obtenidos de avaya, (string)
  public buttonsAvayaExists: any = [];
  //public buttonsAvayaTest: string[] = [ 'Marc Abrev 8', 'Marc Abrev 4', 'Normal' ];

  //Se declara variable para guardar count de botones activos
  //public countButtonsActive: number = 0;

  constructor( 
    private __ipcService: IpcService,
    private renderer: Renderer2,
    private __dataService: DataService,
    private __alertService: AlertService 
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {

    this.__dataService.getButtons().subscribe((e: any) => this.allButtons = e);
    this.__ipcService.send('getButtonsAvaya');
    this.__ipcService.removeAllListeners('getButtonsAvaya');
    this.__ipcService.on('getButtonsAvaya', (e, args) => {
      this.buttonsAvayaExists = args.data;
      console.log(this.buttonsAvayaExists);
    });

    /*
    //Petición al servicio "dataService" para obtener todos los botones
    this.__dataService.getButtons().subscribe( (data: any) => {
      //Guarda todos los botones en la variable "allButtons"
      this.allButtons = data;

      //Petición IPC para obtener botones ya añadidos en Avaya
      this.__ipcService.sendSync( 'getButtonsAvaya' );
      this.__ipcService.removeAllListeners( 'getButtonsAvaya' );
      this.__ipcService.on( 'getButtonsAvaya', ( event, args ) => {

        this.buttonsAvayaExists = args.data;
        console.log( this.buttonsAvayaExists );

        //Si no existe el fichero de avaya "SelectedPhoneFeatures.xml"
        if( args.data === 'notExist' ) {

          //DETECTAR EL IDIOMA SELECCIONADO
          this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.removeAllListeners( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, args ) => {
            //ESPAÑOL
            if( args.data === '' || args.data === 'sp' ) {
              //Muestra el contenedor Español
              this.renderer.removeClass( this.sp.nativeElement, 'none' );
              //Muestra contenedor de alerta de "Sin información"
              this.renderer.removeClass( this.alertWarningSp.nativeElement, 'none' );
              //Desactiva el Select
              this.renderer.setProperty( this.selectButtonsSp.nativeElement, 'disabled', 'true' );
              //Desactiva el botón de añadir
              this.renderer.setProperty( this.buttonAddSp.nativeElement, 'disabled', 'true' );
              //Muestra una alerta de error
              this.__alertService.alertError( 'Avaya no se ha iniciado nunca, por favor, cierre este programa y ejecute avaya por primera vez' );
            //INGLES
            }else if( args.data === 'in' ) {
              //Muestra el contenedor Ingles
              this.renderer.removeClass( this.in.nativeElement, 'none' );
              //Muestra contenedor de alerta de "Sin información"
              this.renderer.removeClass( this.alertWarningIn.nativeElement, 'none' );
              //Desactiva el Select
              this.renderer.setProperty( this.selectButtonsIn.nativeElement, 'disabled', 'true' );
              //Desactiva el botón de añadir
              this.renderer.setProperty( this.buttonAddIn.nativeElement, 'disabled', 'true' );
              //Muestra una alerta de error
              this.__alertService.alertError( 'Avaya has never started, please close this program and run avaya for the first time.' );
            //PORTUGUES
            }else {
              //Muestra el contenedor Portugues
              this.renderer.removeClass( this.pt.nativeElement, 'none' );
              //Muestra contenedor de alerta de "Sin información"
              this.renderer.removeClass( this.alertWarningPt.nativeElement, 'none' );
              //Desactiva el Select
              this.renderer.setProperty( this.selectButtonsPt.nativeElement, 'disabled', 'true' );
              //Desactiva el botón de añadir
              this.renderer.setProperty( this.buttonAddPt.nativeElement, 'disabled', 'true' );
              //Muestra una alerta de error
              this.__alertService.alertError( 'O Avaya nunca foi iniciado, feche este programa e execute o avaya pela primeira vez.' );
            }

            //Ocultar loading
            this.renderer.addClass( this.loading.nativeElement, 'none' );
          });
        //En caso contrario...
        }else {

          //Guarda los botones ya añadidos de avaya en la variable.
          this.buttonsAvayaExists = args.data;  //TODO: NO SE MUESTRAN LOS BOTONES YA AÑADIDOS EN EL DOM!!

          //DETECTAR EL IDIOMA SELECCIONADO
          this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.removeAllListeners( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, args ) => {
            //ESPAÑOL
            if( args.data === '' || args.data === 'sp' ) {
              //Muestra el contenedor Español
              this.renderer.removeClass( this.sp.nativeElement, 'none' );
              //Muestra contenedor de alerta con los botones ya añadidos en avaya
              this.renderer.removeClass( this.alertInfoSp.nativeElement, 'none' );
            //INGLES
            }else if( args.data === 'in' ) {
              //Muestra el contenedor Ingles
              this.renderer.removeClass( this.in.nativeElement, 'none' );
              //Muestra contenedor de alerta con los botones ya añadidos en avaya
              this.renderer.removeClass( this.alertInfoIn.nativeElement, 'none' );
            //PORTUGUES
            }else {
              //Muestra el contenedor Portugues
              this.renderer.removeClass( this.pt.nativeElement, 'none' );
              //Muestra contenedor de alerta con los botones ya añadidos en avaya
              this.renderer.removeClass( this.alertInfoPt.nativeElement, 'none' );
            }

            //Ocultar loading
            this.renderer.addClass( this.loading.nativeElement, 'none' );
          });
        }
      });
    });
    */

    //this.countButtonsActive = this.checksSelected.length;
  }

  //DETECTAR LOS CAMBIOS EN LOS CHECKS.
  /*public selectChecks( value: any, label: string ): void {
    //Mostrar el Loading
    this.renderer.removeClass( this.loading.nativeElement, 'none' );
    //Si el boton está seleccionado...
    if( value.target.checked ) {
      //Si el boton seleccionado ya se encuentra en favoritos
      if( this.buttonsAvaya.indexOf( value ) > -1 ) {
        //Mostrar alerta de error
        this.__alertService.alertError( 'Este botón ya lo tienes en favoritos' );
      //En el caso de que no se encuentre el boton seleccionado en favoritos
      }else {
        //Se añade al array
        this.checksSelected.push( label );
      }
    //Si el boton se deselecciona...
    }else {
      //Si el boton que se deselecciona está en el array...
      if( this.checksSelected.indexOf( label ) > -1 ) {
        //Se borra el boton del array.
        this.checksSelected.splice( this.checksSelected.indexOf( label ), 1 );
      }
    }
    //Se guarda la longitud del array en el contador de botones.
    this.countButtonsActive = this.checksSelected.length;
    //Ocultar Loading
    this.renderer.addClass( this.loading.nativeElement, 'none' );
  }*/
  /*public modifyButtons(): void {
    if( this.checksSelected.length > 8 ) this.__alertService.alertError( 'Solo se permiten 8 botones, compruebe la cantidad de botones seleccionados.' );
    else {
      this.__ipcService.send( 'modifyButtonsAvaya', { data: this.checksSelected } );
      this.__ipcService.removeAllListeners( 'modifyButtonsAvaya' );
      this.__ipcService.on( 'modifyButtonsAvaya', ( event, args ) => {
        console.log( args.data );
        this.__alertService.alertSuccess( 'Botones cambiados con éxito!' );
      });
    }
  }*/
  // public deleteButton( button: string ): void {
  //   console.log( event.target );
  // }
}

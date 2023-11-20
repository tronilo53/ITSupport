import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-trouble14',
  templateUrl: './trouble14.component.html',
  styleUrls: ['./trouble14.component.css']
})
export class Trouble14Component implements OnInit, OnDestroy {
  
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

  //Variable para guardar el idioma de la App
  private currentLan: string = '';
  //Array de todos los botones
  public allButtons: any[] = [];
  //Variables ngModel para los select
  public select: any = {
    sp: '???',
    in: '???',
    pt: '???'
  };
  //Se crea un objeto para guardar los botones obtenidos de avaya
  public buttonsAvayaExists: any = [];
  //Se declara variable para guardar count de botones activos
  public countButtonsActive: number = 0;

  /**
   * Constructor de Trouble14Component
   * @param __ipcService Comunicaciones con IPC
   * @param renderer Manipulación del DOM
   * @param __dataService Peticiones http con la BBDD
   * @param __changeDetectorRef Detección de cambios
   */
  constructor( 
    private __ipcService: IpcService,
    private renderer: Renderer2,
    private __dataService: DataService,
    private __changeDetectorRef: ChangeDetectorRef
  ) { }
  
  /**
   * Ciclo de Vida antes de cargar los elementos del DOM
   * * Antes de que cargue el DOM identifica las variables
   */
  ngOnInit(): void {
    /* Se detecta el idioma y se obtienen los botones ya añadidos de avaya */
    this.checkLanguage_getButtonsAdded();
    //Petición al servicio para obtener todos los botones generales
    this.__dataService.getButtons().subscribe( (data: any) => {
      //Guarda todos los botones generales en la variable "allButtons"
      this.allButtons = data;
    });

  }
  /**
   * Esta función elimina el borde rojo del select
   * * Se identifica el idoma dentro de la función
   */
  public deleteBorderErrorSelect(): void {
    if(this.currentLan === 'sp') this.renderer.removeClass(this.selectButtonsSp.nativeElement, 'border__error');
    else if(this.currentLan === 'in') this.renderer.removeClass(this.selectButtonsIn.nativeElement, 'border__error');
    else this.renderer.removeClass(this.selectButtonsPt.nativeElement, 'border__error');
  }
  /**
   * Esta función Añade o Elimina botones de Avaya
   * * Se detectan los cambios en el ngZone
   * * Se remueve el Listener
   * @param {string} mode 'add' or 'delete'
   */
  public delete_add_Checks(mode: string): void {
    /* Si el idioma es español... */
    if(this.currentLan === 'sp') {
      /* Si se agregan botones... */
      if(mode === 'add') {
        /* Si no se selecciona ningun boton... */
        if(this.select.sp === '???') {
          /* Se muestra un dialog */
          this.dialog('error', 'Tienes que seleccionar algún botón.');
          /* Se pone el borde rojo en el select español */
          this.setBorderErrorSelect();
          /* Si se selecciona un boton... */
        }else {
          /* Si ya hay ocho botones en avaya... */
          if(this.buttonsAvayaExists.length == 8) {
            /* Se muestra un dialog */
            this.dialog('error', 'Ha superado el límite de botones para agregar en: 8');
            /* Si hay menos de ocho botones en avaya... */
          }else {
            /* IPC para agregar botones */
            this.__ipcService.send('trouble_14', { mode: 'add', buttons: this.select.sp });
            this.__ipcService.removeAllListeners('trouble_14');
            this.__ipcService.on('trouble_14', (a, args) => {
              console.log(args);
            });
          }
        }
      /* Si se eliminan botones... */
      }else {
        /* Variable para guardar la cantidad de botones que hay checkeados */
        let count: number = 0;
        /* Se recorren todos los botones */
        for(let i = 0; i < this.buttonsAvayaExists.length; i++) {
          /* Si hay alguno checkeado.. */
          if(this.buttonsAvayaExists[i].check) count++;
        }
        /* Si no se selecciona ningun boton Se muestra un dialog... */
        if(count < 1) this.dialog('error', 'No has seleccionado ningún botón para eliminar');
        /* Si se selecciona algun boton... */
        else {
          /* Se guarda en la variable itemsSelected, los botones que están seleccionados */
          const itemsSelected: any[] = this.buttonsAvayaExists.filter((item: any) => item.check);
          /* Se recorren los botones que están ya agregados en avaya */
          for(let i = 0; i < this.buttonsAvayaExists.length; i++) {
            if(itemsSelected.length > 1) {
              /* Se iguala la variable i a la cantidad de botones que hay ya en avaya */
              i = itemsSelected.length;
              /* Se agregan objetos vacios al array para completar las posiciones con las que hay en los botones ya añadidos */
              itemsSelected.push({ Label: '' });
            }
          }
          /* IPC para eliminar los botones seleccionados en avaya */
          this.__ipcService.send('trouble_14', { mode: 'delete', buttonsDelete: itemsSelected });
          this.__ipcService.removeAllListeners('trouble_14');
          this.__ipcService.on('trouble_14', (e, args) => {
            /* Si no se eliminan los botones Se muestra un Dialog */
            if(args.status === '001') this.dialog('error', 'No ha sido posible quitar los botones seleccionados.');
            /* Si se eliminan los botones... */
            else {
              this.buttonsAvayaExists = args.buttons.map((item: any) => {
                return { Label: item.$.Label, Name: item.$.Name, check: false };
              });
              if(this.buttonsAvayaExists.length < 1) {
                /* Oculta la ventana de botones en español */
                this.renderer.addClass( this.alertInfoSp.nativeElement, 'none' );
                //Muestra la alerta de "Sin información" en español
                this.renderer.removeClass( this.alertWarningSp.nativeElement, 'none' );
              }else {
                this.countButtonsActive = this.buttonsAvayaExists.length;
              }
              this.__changeDetectorRef.detectChanges();
            }
          });
        }
      }
    /* Si el idioma es ingles... */
    }else if(this.currentLan === 'in') {

    /* Si el idioma es portugues... */
    }else {


    }
  }
  /**
   * Esta función establece el borde rojo en el select
   * * Se identifica el idioma dentro de la función
   */
  private setBorderErrorSelect(): void {
    if(this.currentLan === 'sp') this.renderer.addClass(this.selectButtonsSp.nativeElement, 'border__error');
    else if(this.currentLan === 'in') this.renderer.addClass(this.selectButtonsIn.nativeElement, 'border__error');
    else this.renderer.addClass(this.selectButtonsPt.nativeElement, 'border__error');
  }
  /**
   * Esta función identifica el idioma que tiene la APP
   * y obtiene los botones ya agregados en Avaya
   * * Se detectan los cambios en el ngZone
   * * Se remueve el Listener
   */
  private checkLanguage_getButtonsAdded(): void {
    //Peticion IPC para detectar el idioma
    this.__ipcService.send( 'checkLanguage' );
    this.__ipcService.removeAllListeners('checkLanguage');
    this.__ipcService.on('checkLanguage', (e, args) => {
      /* Si el idioma está en español, la variable currentLan se pone en español */
      if(args.data === '' || args.data === 'sp') this.currentLan = 'sp';
      /* Si el idioma está en inglés, la variable currentLan se pone en ingles */
      else if(args.data === 'in') this.currentLan = 'in';
      /* Si el idioma está en portugues, la variable currentLan se pone en portugues */
      else this.currentLan = 'pt';
      /* Se muestra el contenedor correspondiente al idioma */
      if(this.currentLan === 'sp') this.renderer.removeClass( this.sp.nativeElement, 'none' );
      else if(this.currentLan === 'in') this.renderer.removeClass( this.in.nativeElement, 'none' );
      else this.renderer.removeClass( this.pt.nativeElement, 'none' );
      //Peticion IPC para obtener los botones ya añadidos en avaya
      this.__ipcService.send('getButtonsAvaya');
      this.__ipcService.removeAllListeners('getButtonsAvaya');
      this.__ipcService.on('getButtonsAvaya', (e, args) => {
        //Si no hay botones añadidos...
        if( args.data === 'notButtons' ) {
          /* Muestra la alerta de "Sin información" correspondiente al idioma */
          if(this.currentLan === 'sp') this.renderer.removeClass( this.alertWarningSp.nativeElement, 'none' );
          else if(this.currentLan === 'in') this.renderer.removeClass( this.alertWarningIn.nativeElement, 'none' );
          else this.renderer.removeClass( this.alertWarningPt.nativeElement, 'none' );
        //Si hay botones añadidos...
        }else {
          /* Guarda los botones ya añadidos de avaya en la variable */
          this.buttonsAvayaExists = args.data.map((item: any) => {
            return { Name: item.$.Name, Label: item.$.Label, check: false }
          });
          /* Muestra la información correspondiente al idioma */
          if(this.currentLan === 'sp') this.renderer.removeClass( this.alertInfoSp.nativeElement, 'none' );
          else if(this.currentLan === 'in') this.renderer.removeClass( this.alertInfoIn.nativeElement, 'none' );
          else this.renderer.removeClass( this.alertInfoPt.nativeElement, 'none' );
          /* Se guarda en la variable el contador de botones añadidos */
          this.countButtonsActive = this.buttonsAvayaExists.length;
        }
        /* Se detectan los cambios */
        this.__changeDetectorRef.detectChanges();
      });
    });
  }
  /**
   * Esta función Transmite un IPC para mostrar una alerta Nativa
   * * Se remueve el Listener
   * @param {string} type Tipo de alerta
   * @param {string} text Mensaje de Alerta
   */
  private dialog(type: string, text: string): void {
    this.__ipcService.send('dialog', { type, parent: 'trouble14', text });
    this.__ipcService.removeAllListeners('dialog');
  }
  /**
   * Ciclo de Vida cuando se destruye el constructor
   * * Se eliminan los Listeners de todos los IPC
   */
  ngOnDestroy(): void {
    this.__ipcService.removeAllListeners('getButtonsAvaya');
    this.__ipcService.removeAllListeners('checkLanguage');
    this.__ipcService.removeAllListeners('trouble_14');
  }
}

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

  constructor( 
    private __ipcService: IpcService,
    private renderer: Renderer2,
    private __dataService: DataService,
    private __changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    /* Se detecta el idioma y se obtienen los botones ya añadidos de avaya */
    this.checkLanguage_getButtonsAdded();
    //Petición al servicio para obtener todos los botones generales
    this.__dataService.getButtons().subscribe( (data: any) => {
      //Guarda todos los botones generales en la variable "allButtons"
      this.allButtons = data;
    });

  }
  /* Elimina el borde rojo del select por odioma */
  public deleteBorderErrorSelect(): void {
    if(this.currentLan === 'sp') this.renderer.removeClass(this.selectButtonsSp.nativeElement, 'border__error');
    else if(this.currentLan === 'in') this.renderer.removeClass(this.selectButtonsIn.nativeElement, 'border__error');
    else this.renderer.removeClass(this.selectButtonsPt.nativeElement, 'border__error');
  }
  /* Eliminar botones ya insertados en avaya o agregar nuevos botones */
  public delete_add_Checks(mode: string): void {
    /* Si el idioma es español... */
    if(this.currentLan === 'sp') {
      /* Si se agregan botones... */
      if(mode === 'add') {
        /* Si no se selecciona ningun boton... */
        if(this.select.sp === '???') {
          /* Se muestra un dialog */
          this.__ipcService.send('dialog', { type: 'error', parent: 'trouble14', text: 'Tienes que elegir un botón' });
          /* Se pone el borde rojo en el select español */
          this.setBorderErrorSelect();
          /* Si se selecciona un boton... */
        }else {
          /* Si ya hay ocho botones en avaya... */
          if(this.buttonsAvayaExists.length == 8) {
            /* Se muestra un dialog */
            this.__ipcService.send('dialog', { type: 'error', parent: 'trouble14', text: 'Ha superado el límite de botones para agregar en: 8' });
            /* Si hay menos de ocho botones en avaya... */
          }else {
            console.log( this.select.sp );
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
        /* Si no se selecciona ningun boton... */
        if(count < 1) {
          /* Se muestra un Dialog */
          this.__ipcService.send('dialog', { type: 'error', parent: 'trouble14', text: 'No has seleccionado ningún botón para eliminar' });
          this.__ipcService.removeAllListeners('dialog');
        }else {
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
            /* Si no se eliminan los botones... */
            if(args.status === '001') {
              /* Se muestra un Dialog */
              this.__ipcService.send('dialog', { type: 'error', parent: 'trouble14', text: 'No ha sido posible quitar los botones seleccionados.' })
            /* Si se eliminan los botones... */
            }else {
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
  /* aplica el borde rojo del select por idioma */
  private setBorderErrorSelect(): void {
    if(this.currentLan === 'sp') this.renderer.addClass(this.selectButtonsSp.nativeElement, 'border__error');
    else if(this.currentLan === 'in') this.renderer.addClass(this.selectButtonsIn.nativeElement, 'border__error');
    else this.renderer.addClass(this.selectButtonsPt.nativeElement, 'border__error');
  }
  /* Se detecta el idioma de la App */
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
  ngOnDestroy(): void {
    this.__ipcService.removeAllListeners('getButtonsAvaya');
    this.__ipcService.removeAllListeners('checkLanguage');
    this.__ipcService.removeAllListeners('trouble_14');
  }
}

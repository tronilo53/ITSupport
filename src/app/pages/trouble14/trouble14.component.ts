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
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    //Petición al servicio dataService para obtener todos los botones
    this.__dataService.getButtons().subscribe( (data: any) => {
      //Guarda todos los botones en la variable "allButtons"
      this.allButtons = data;
      //Peticion IPC para detectar el idioma
      this.__ipcService.send( 'checkLanguage' );
      this.__ipcService.on('checkLanguage', (e, argslan) => {
        //Peticion IPC para obtener los botones ya añadidos en avaya
        this.__ipcService.send('getButtonsAvaya');
        this.__ipcService.on('getButtonsAvaya', (e, argsBtn) => {
          //Si no existe el fichero de avaya "SelectedPhoneFeatures.xml"
          if( argsBtn.data === 'notExist' ) {
            /* Si el idioma está en español... */
            if(argslan.data === '' || argslan.data === 'sp') {
              /* Muestra el contenedor en español */
              this.showContainer('sp');
              //Muestra la alerta de "Sin información" en español
              this.renderer.removeClass( this.alertWarningSp.nativeElement, 'none' );
              /* Desactiva los botones en español */
              this.DesactivateButtons('sp');
            /* Si el idioma está en inglés... */
            }else if(argslan.data === 'in') {
              /* Muestra el contenedor en ingles */
              this.showContainer('in');
              //Muestra la alerta de "Sin información" en ingles
              this.renderer.removeClass( this.alertWarningIn.nativeElement, 'none' );
              /* Desactiva los botones en ingles */
              this.DesactivateButtons('in');
            /* Si el idioma está en portugues... */
            }else {
              /* Muestra el contenedor en portugues */
              this.showContainer('pt');
              //Muestra la alerta de "Sin información" en portugues
              this.renderer.removeClass( this.alertWarningPt.nativeElement, 'none' );
              /* Desactiva los botones en portugues */
              this.DesactivateButtons('pt');
            }
          //Si existe el fichero de avaya pero no existen botones...
          }else if(argsBtn.data === 'notButtons') {
            /* Si el idioma es español... */
            if(argslan.data === '' || argslan.data === 'sp') {
              /* Muestra el contenedor en español */
              this.showContainer('sp');
              //Muestra contenedor de no hay botones en español
              this.renderer.removeClass( this.alertWarningSp.nativeElement, 'none' );
            /* Si el idioma es ingles... */
            }else if(argslan.data === 'in') {
              /* Muestra el contenedor en ingles */
              this.showContainer('in');
              //Muestra contenedor de no hay botones en ingles
              this.renderer.removeClass( this.alertWarningIn.nativeElement, 'none' );
            /* Si el idioma es portugues... */
            }else {
              /* Muestra el contenedor en portugues */
              this.showContainer('pt');
              //Muestra contenedor de no hay botones en portugues
              this.renderer.removeClass( this.alertWarningPt.nativeElement, 'none' );
            }
          //Si existe el fichero de avaya y existen botones...
          }else {
            //Guarda los botones ya añadidos de avaya en la variable.
            this.buttonsAvayaExists = argsBtn.data.map((item: any) => {
              return { Name: item.$.Name, Label: item.$.Label, check: false }
            });
            /* Si el idioma está en español... */
            if(argslan.data === '' || argslan.data === 'sp') {
              /* Muestra el contenedor en español */
              this.showContainer('sp');
              //Muestra contenedor de alerta con los botones ya añadidos en avaya en español
              this.renderer.removeClass( this.alertInfoSp.nativeElement, 'none' );
            /* Si el idioma está en inglés... */
            }else if(argslan.data === 'in') {
              /* Muestra el contenedor en ingles */
              this.showContainer('in');
              //Muestra contenedor de alerta con los botones ya añadidos en avaya en ingles
              this.renderer.removeClass( this.alertInfoIn.nativeElement, 'none' );
            /* Si el idioma está en portugues... */
            }else {
              /* Muestra el contenedor en portugues */
              this.showContainer('pt');
              //Muestra contenedor de alerta con los botones ya añadidos en avaya en portugues
              this.renderer.removeClass( this.alertInfoPt.nativeElement, 'none' );
            }
          }
          this.countButtonsActive = this.buttonsAvayaExists.length;
          /* Detectar los cambios */
          this._changeDetectorRef.detectChanges();
        });
      });
    });
  }
  /* Elimina el borde rojo del select por odioma */
  public deleteBorderErrorSelect(lan: string): void {
    if(lan === 'sp') this.renderer.removeClass(this.selectButtonsSp.nativeElement, 'border__error');
    else if(lan === 'in') this.renderer.removeClass(this.selectButtonsIn.nativeElement, 'border__error');
    else this.renderer.removeClass(this.selectButtonsPt.nativeElement, 'border__error');
  }
  /* Agregar nuevos botones a avaya */
  public addButtons(lan: string): void {
    /* Si el idioma es español... */
    if(lan === 'sp') {
      /* Si no se selecciona ningun boton... */
      if(this.select.sp === '???') {
        /* Se muestra un dialog */
        this.__ipcService.send('dialog', { type: 'error', parent: 'trouble14', text: 'Tienes que elegir un botón' });
        /* Se pone el borde rojo en el select español */
        this.setBorderErrorSelect('sp');
      }
    /* Si el idioma es ingles... */
    }else if(lan === 'in') {
    
    /* Si el idioma es portugues... */
    }else {

    }
  }
  /* Eliminar botones ya insertados en avaya */
  public deleteChecksSelected(lan: string): void {
    /* Si el idioma es español... */
    if(lan === 'sp') {
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
        /* IPC para eliminar los botones seleccionado en avaya */
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
            this._changeDetectorRef.detectChanges();
          }
        });
      }
    /* Si el idioma es ingles... */
    }else if(lan === 'in') {

    /* Si el idioma es portugues... */
    }else {


    }
  }
  /* aplica el borde rojo del select por idioma */
  private setBorderErrorSelect(lan: string): void {
    if(lan === 'sp') this.renderer.addClass(this.selectButtonsSp.nativeElement, 'border__error');
    else if(lan === 'in') this.renderer.addClass(this.selectButtonsIn.nativeElement, 'border__error');
    else this.renderer.addClass(this.selectButtonsPt.nativeElement, 'border__error');
  }
  /* Desactiva los botones*/
  private DesactivateButtons(lan: string): void {
    if(lan === 'sp') {
      //Desactiva el Select
      this.renderer.setProperty( this.selectButtonsSp.nativeElement, 'disabled', 'true' );
      //Desactiva el botón de añadir
      this.renderer.setProperty( this.buttonAddSp.nativeElement, 'disabled', 'true' );
    }else if(lan === 'in') {
      //Desactiva el Select
      this.renderer.setProperty( this.selectButtonsIn.nativeElement, 'disabled', 'true' );
      //Desactiva el botón de añadir
      this.renderer.setProperty( this.buttonAddIn.nativeElement, 'disabled', 'true' );
    }else {
      //Desactiva el Select
      this.renderer.setProperty( this.selectButtonsPt.nativeElement, 'disabled', 'true' );
      //Desactiva el botón de añadir
      this.renderer.setProperty( this.buttonAddPt.nativeElement, 'disabled', 'true' );
    }
  }
  /* Muestra el contenedor en el idioma elegido */
  private showContainer(lan: string): void {
    if(lan === 'sp') {
      //Muestra el contenedor Español
      this.renderer.removeClass( this.sp.nativeElement, 'none' );
    }else if(lan === 'in') {
      //Muestra el contenedor Ingles
      this.renderer.removeClass( this.in.nativeElement, 'none' );
    }else {
      //Muestra el contenedor Portugues
      this.renderer.removeClass( this.pt.nativeElement, 'none' );
    }
  }
  ngOnDestroy(): void {
    this.__ipcService.removeAllListeners('getButtonsAvaya');
    this.__ipcService.removeAllListeners('checkLanguage');
    this.__ipcService.removeAllListeners('trouble_14');
  }
}

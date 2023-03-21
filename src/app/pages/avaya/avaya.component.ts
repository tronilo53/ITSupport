import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AlertinService } from 'src/app/services/alertin.service';
import { AlertptService } from 'src/app/services/alertpt.service';
import { DataService } from 'src/app/services/data.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-avaya',
  templateUrl: './avaya.component.html',
  styleUrls: ['./avaya.component.css']
})
export class AvayaComponent implements OnInit, AfterViewInit {
  
  //DECLARACIÓN E INICIALIZACIÓN DE VARIABLES ngModel
  //Español
  @ViewChild('sp') sp: ElementRef;
  public problema: string = '???';
  public troublesGeneral: any[] = [];
  public troublesSonido: any[] = [];
  public troublesLlamadas: any[] = [];
  public troublesInterfaz: any[] = [];
  public troublesConexion: any[] = [];
  public troublesContactos: any[] = [];
  public troublesRegistro: any[] = [];
  public troublesEstado: any[] = [];
  public troublesPerfiles: any[] = [];
  public troublesOtros: any[] = [];
  //Ingles
  @ViewChild('in') in: ElementRef;
  public problemaIn: string = '???';
  public troublesGeneralIn: any[] = [];
  public troublesSonidoIn: any[] = [];
  public troublesLlamadasIn: any[] = [];
  public troublesInterfazIn: any[] = [];
  public troublesConexionIn: any[] = [];
  public troublesContactosIn: any[] = [];
  public troublesRegistroIn: any[] = [];
  public troublesEstadoIn: any[] = [];
  public troublesPerfilesIn: any[] = [];
  public troublesOtrosIn: any[] = [];
  //Portugues
  @ViewChild('pt') pt: ElementRef;
  public problemaPt: string = '???';
  public troublesGeneralPt: any[] = [];
  public troublesSonidoPt: any[] = [];
  public troublesLlamadasPt: any[] = [];
  public troublesInterfazPt: any[] = [];
  public troublesConexionPt: any[] = [];
  public troublesContactosPt: any[] = [];
  public troublesRegistroPt: any[] = [];
  public troublesEstadoPt: any[] = [];
  public troublesPerfilesPt: any[] = [];
  public troublesOtrosPt: any[] = [];

  constructor( 
    private __alertService: AlertService,
    private __ipcService: IpcService,
    private __dataService: DataService,
    private __alertServiceIn: AlertinService,
    private __alertServicePt: AlertptService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getDataIn();
    this.getDataPt();
  }
  ngAfterViewInit(): void {

    //OCULTAR CONTENIDOS
    //Español
    this.renderer.addClass( this.sp.nativeElement, 'none' );
    //Ingles
    this.renderer.addClass( this.in.nativeElement, 'none' );
    //Portugues
    this.renderer.addClass( this.pt.nativeElement, 'none' );

    //COMPROBAR EL IDIOMA GUARDADO EN language.xml
    this.__ipcService.send( 'checkLanguage' );
    this.__ipcService.on( 'checkLanguage', ( event, args ) => {
      if( args.data === '' || args.data === 'sp' ) {
        //Mostrar contenido en Español
        this.renderer.removeClass( this.sp.nativeElement, 'none' );
        //Mostrar alerta de que los problemas solo se solucionarán con avaya cerrado.
        this.__alertService.alertInfo( 'Los problemas se solucionarán, solo si Avaya One X Agent está cerrado.' );
      }else if( args.data === 'in' ) {
        //Mostrar contenido en Ingles
        this.renderer.removeClass( this.in.nativeElement, 'none' );
        //Mostrar alerta de que los problemas solo se solucionarán con avaya cerrado.
        this.__alertService.alertInfo( 'The problems will be solved, only if Avaya One X Agent is closed.' );
      }else {
        //Mostrar contenido en Portugues
        this.renderer.removeClass( this.pt.nativeElement, 'none' );
        //Mostrar alerta de que los problemas solo se solucionarán con avaya cerrado.
        this.__alertService.alertInfo( 'Os problemas serão resolvidos, apenas se o Avaya One X Agent for fechado.' );
      }
    });
  }

  //Botón de solucionar problema Español
  public solucionar(): void {
    if( this.problema === '1' || this.problema === '2' ) this.trouble_1_2();
    else if( this.problema === '3' || this.problema === '4' ) this.trouble_3_4();
    else if( this.problema === '5' ) this.trouble_5();
  }
  //Botón de solucionar problema Ingles
  public solucionarIn(): void {
    if( this.problema === '1' ) {
      this.__ipcService.send( 'trouble1' );
      this.__ipcService.on( 'trouble1', ( event, args ) => {
        if( args.data === 'notRead' || args.data === 'notJson' ) {
          this.__alertService.alertError( 'No se ha podido solucionar el problema, inténtalo de nuevo más tarde o ponte en contacto con IT - HelpDesk' );
        }else {
          console.log( args.data );
        }
      });
    }
  }
  //Botón de solucionar problema Portugues
  public solucionarPt(): void {
    if( this.problema === '1' ) {
      this.__ipcService.send( 'trouble1' );
      this.__ipcService.on( 'trouble1', ( event, args ) => {
        if( args.data === 'notRead' || args.data === 'notJson' ) {
          this.__alertService.alertError( 'No se ha podido solucionar el problema, inténtalo de nuevo más tarde o ponte en contacto con IT - HelpDesk' );
        }else {
          console.log( args.data );
        }
      });
    }
  }

  //Obtener problemas Español
  private getData(): void {
    this.__dataService.getTroubles().subscribe( ( data: any ) => {
      this.troublesGeneral = data;
      this.troublesSonido = data.filter( obj => obj.category === 'sonido' );
      this.troublesLlamadas = data.filter( obj => obj.category === 'llamadas' ); 
      this.troublesInterfaz = data.filter( obj => obj.category === 'interfaz_de_usuario' ); 
      this.troublesConexion = data.filter( obj => obj.category === 'conexion' ); 
      this.troublesContactos = data.filter( obj => obj.category === 'contactos' );
      this.troublesRegistro = data.filter( obj => obj.category === 'registro_de_tareas' );
      this.troublesEstado = data.filter( obj => obj.category === 'estado_del_usuario' );
      this.troublesPerfiles = data.filter( obj => obj.category === 'perfiles' );
      this.troublesOtros = data.filter( obj => obj.category === 'otros' );
    });
  }
  //Obtener problemas Ingles
  private getDataIn(): void {
    this.__dataService.getTroublesIn().subscribe( ( data: any ) => {
      this.troublesGeneralIn = data;
      this.troublesSonidoIn = data.filter( obj => obj.category === 'sonido' );
      this.troublesLlamadasIn = data.filter( obj => obj.category === 'llamadas' ); 
      this.troublesInterfazIn = data.filter( obj => obj.category === 'interfaz_de_usuario' ); 
      this.troublesConexionIn = data.filter( obj => obj.category === 'conexion' ); 
      this.troublesContactosIn = data.filter( obj => obj.category === 'contactos' );
      this.troublesRegistroIn = data.filter( obj => obj.category === 'registro_de_tareas' );
      this.troublesEstadoIn = data.filter( obj => obj.category === 'estado_del_usuario' );
      this.troublesPerfilesIn = data.filter( obj => obj.category === 'perfiles' );
      this.troublesOtrosIn = data.filter( obj => obj.category === 'otros' );
    });
  }
  //Obtener problemas Portugues
  private getDataPt(): void {
    this.__dataService.getTroublesPt().subscribe( ( data: any ) => {
      this.troublesGeneralPt = data;
      this.troublesSonidoPt = data.filter( obj => obj.category === 'sonido' );
      this.troublesLlamadasPt = data.filter( obj => obj.category === 'llamadas' ); 
      this.troublesInterfazPt = data.filter( obj => obj.category === 'interfaz_de_usuario' ); 
      this.troublesConexionPt = data.filter( obj => obj.category === 'conexion' ); 
      this.troublesContactosPt = data.filter( obj => obj.category === 'contactos' );
      this.troublesRegistroPt = data.filter( obj => obj.category === 'registro_de_tareas' );
      this.troublesEstadoPt = data.filter( obj => obj.category === 'estado_del_usuario' );
      this.troublesPerfilesPt = data.filter( obj => obj.category === 'perfiles' );
      this.troublesOtrosPt = data.filter( obj => obj.category === 'otros' );
    });
  }

  /*
    PROBLEMA 1: Oigo demasiado alto a los clientes [ Value: 1 - CAT: Sonido ]
    PROBLEMA 2: Oigo demasiado Bajo a los clientes [ Value: 2 - CAT: Sonido ]
*/
  private trouble_1_2(): void {
    this.__ipcService.send( 'trouble_1_2' );
      this.__ipcService.on( 'trouble_1_2', ( event, argsTrouble ) => {
        if( argsTrouble.data === 'notExist' ) {
          this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, argsLan ) => {
            if( argsLan.data === '' || argsLan.data === 'sp' ) this.__alertService.alertError( 'Avaya One X Agent nunca se ha iniciado, ponte en contacto con " IT" para configurar avaya por primera vez' );
            else if( argsLan.data === 'in' ) this.__alertServiceIn.alertError( 'Avaya One X Agent has never been started, contact "IT" to configure avaya for the first time.' );
            else this.__alertServicePt.alertError( 'Avaya One X Agent nunca foi iniciado, contacte "IT" para criar a avaya pela primeira vez.' );
          });
        }else if( argsTrouble.data === 'gananMod' ) {
          this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, argsLan ) => {
            if( argsLan.data === '' || argsLan.data === 'sp' ) this.__alertService.alertSuccess( 'Problema solucionado con éxito' );
            else if( argsLan.data === 'in' ) this.__alertServiceIn.alertSuccess( 'Problem solved successfully' );
            else this.__alertServicePt.alertSuccess( 'Problema resolvido com sucesso' );
          });
        }else {
          this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, argsLan ) => {
            if( argsLan.data === '' || argsLan.data === 'sp' ) this.__alertService.alertInfo( 'Este problema ya estaba resuelto. Si el problema persiste, ponte en contacto con "IT"' );
            else if( argsLan.data === 'in' ) this.__alertServiceIn.alertInfo( 'This problem was already solved. If the problem persists, please contact "IT".' );
            else this.__alertServicePt.alertInfo( 'Este problema já se encontrava resolvido. Se o problema persistir, por favor contactar "IT".' );
          });
        }
      });
  }

  /*
    PROBLEMA 3: Los clientes me oyen demasiado alto [ Value: 3 - CAT: Sonido ]
    PROBLEMA 4: Los clientes me oyen demasiado Bajo [ Value: 4 - CAT: Sonido ]
*/
  private trouble_3_4(): void {
    this.__ipcService.send( 'trouble_3_4' );
      this.__ipcService.on( 'trouble_3_4', ( event, argsTrouble ) => {
        if( argsTrouble.data === 'notExist' ) {
          this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, argsLan ) => {
            if( argsLan.data === '' || argsLan.data === 'sp' ) this.__alertService.alertError( 'Avaya One X Agent nunca se ha iniciado, ponte en contacto con " IT" para configurar avaya por primera vez' );
            else if( argsLan.data === 'in' ) this.__alertServiceIn.alertError( 'Avaya One X Agent has never been started, contact "IT" to configure avaya for the first time.' );
            else this.__alertServicePt.alertError( 'Avaya One X Agent nunca foi iniciado, contacte "IT" para criar a avaya pela primeira vez.' );
          });
        }else if( argsTrouble.data === 'gananMod' ) {
          this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, argsLan ) => {
            if( argsLan.data === '' || argsLan.data === 'sp' ) this.__alertService.alertSuccess( 'Problema solucionado con éxito' );
            else if( argsLan.data === 'in' ) this.__alertServiceIn.alertSuccess( 'Problem solved successfully' );
            else this.__alertServicePt.alertSuccess( 'Problema resolvido com sucesso' );
          });
        }else {
          this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, argsLan ) => {
            if( argsLan.data === '' || argsLan.data === 'sp' ) this.__alertService.alertInfo( 'Este problema ya estaba resuelto. Si el problema persiste, ponte en contacto con "IT"' );
            else if( argsLan.data === 'in' ) this.__alertServiceIn.alertInfo( 'This problem was already solved. If the problem persists, please contact "IT".' );
            else this.__alertServicePt.alertInfo( 'Este problema já se encontrava resolvido. Se o problema persistir, por favor contactar "IT".' );
          });
        }
      });
  }

  /*
    PROBLEMA 5: La llamada se transfiere directamente [ Value: 5 - CAT: llamadas ]
*/
  private trouble_5(): void {
    this.__ipcService.send( 'trouble_5' );
    this.__ipcService.on( 'trouble_5', ( event, argsTrouble ) => {
      if( argsTrouble.data === 'notExist' ) {
        this.__ipcService.send( 'checkLanguage' );
        this.__ipcService.on( 'checkLanguage', ( event, args ) => {
          if( args.data === '' || args.data === 'sp' ) this.__alertService.alertError( 'Avaya One X Agent nunca se ha iniciado, ponte en contacto con " IT" para configurar avaya por primera vez' );
          else if( args.data === 'in' ) this.__alertServiceIn.alertError( 'Avaya One X Agent has never been started, contact "IT" to configure avaya for the first time.' );
          else this.__alertServicePt.alertError( 'Avaya One X Agent nunca foi iniciado, contacte "IT" para criar a avaya pela primeira vez.' );
        });
      }else if( argsTrouble.data === 'solved' ) {
        this.__ipcService.send( 'checkLanguage' );
          this.__ipcService.on( 'checkLanguage', ( event, argsLan ) => {
            if( argsLan.data === '' || argsLan.data === 'sp' ) this.__alertService.alertInfo( 'Este problema ya estaba resuelto. Si el problema persiste, ponte en contacto con "IT"' );
            else if( argsLan.data === 'in' ) this.__alertServiceIn.alertInfo( 'This problem was already solved. If the problem persists, please contact "IT".' );
            else this.__alertServicePt.alertInfo( 'Este problema já se encontrava resolvido. Se o problema persistir, por favor contactar "IT".' );
          });
      }else {
        this.__ipcService.send( 'checkLanguage' );
        this.__ipcService.on( 'checkLanguage', ( event, args ) => {
          if( args.data === '' || args.data === 'sp' ) this.__alertService.alertSuccess( 'Problema solucionado con éxito' );
          else if( args.data === 'in' ) this.__alertServiceIn.alertSuccess( 'Problem solved successfully' );
          else this.__alertServicePt.alertSuccess( 'Problema resolvido com sucesso' );
        });
      }
    });
  }
}

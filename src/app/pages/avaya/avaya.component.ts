import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-avaya',
  templateUrl: './avaya.component.html',
  styleUrls: ['./avaya.component.css']
})
export class AvayaComponent implements OnInit {

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

  constructor( 
    private __alertService: AlertService,
    private __ipcService: IpcService,
    private __dataService: DataService
  ) { }

  ngOnInit(): void {
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

  public solucionar(): void {
    if( this.problema === '1' ) this.__ipcService.send( 'openTrouble1' );
    else if( this.problema === '2' ) {
      this.__ipcService.send( 'trouble2' );
      this.__ipcService.on( 'trouble2', ( event, args ) => {
        if( args.data === 'notRead' || args.data === 'notJson' || args.data === 'notModify' ) this.__alertService.alertError( 'No se ha podido solucionar el problema, inténtalo de nuevo más tarde o ponte en contacto con IT - HelpDesk' );
        else this.__alertService.alertPopSuccess( 'Problema solucionado con éxito!' );
      });
    }else if( this.problema === '3' ) {
      this.__ipcService.send( 'pruebaTask' );
      this.__ipcService.on( 'pruebaTask', ( event, args ) => {
        this.__alertService.alertInfo( args.data );
      });
    }
  }
}

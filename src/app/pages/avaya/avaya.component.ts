import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-avaya',
  templateUrl: './avaya.component.html',
  styleUrls: ['./avaya.component.css']
})
export class AvayaComponent implements OnInit {

  public problema: string = '???';

  constructor( 
    private renderer: Renderer2,
    private __alertService: AlertService,
    private __ipcService: IpcService
  ) { }

  ngOnInit(): void {
  }

  public solucionar(): void {
    if( this.problema === '1' ) {
      this.__ipcService.send( 'trouble1' );
      /*this.__ipcService.on( 'trouble1', ( event, args ) => {
        if( args.data === 'notRead' ) this.__alertService.alertError( 'No se ha podido solucionar el problema, inténtalo de nuevo más tarde o ponte en contacto con Soporte' );
        else if( args.data === 'notJson' ) this.__alertService.alertError( 'No se ha podido solucionar el problema, inténtalo de nuevo más tarde o ponte en contacto con Soporte' );
        else if( args.data === 'notModify' ) this.__alertService.alertError( 'No se ha podido Cambiar la extensión' );
        else {
          this.__alertService.alertSuccess( `Extensión Modificada con éxito` );
        }
      });*/
    }
  }
}

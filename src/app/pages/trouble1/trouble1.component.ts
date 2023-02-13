import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-trouble1',
  templateUrl: './trouble1.component.html',
  styleUrls: ['./trouble1.component.css']
})
export class Trouble1Component implements OnInit {

  public data: any = {
    extension: '',
    login: ''
  };
  private regExtension: RegExp = /^[2][0][2]([0-9]{4,4})$/;
  private regLogin: RegExp = /^[5][0][2]([0-9]{4,4})$/;

  constructor( 
    private __alertService: AlertService,
    private __ipcService: IpcService,
  ) { }

  ngOnInit(): void {
  }

  public solucionar(): void {
    if( this.data.extension === '' && this.data.login === '' ) this.__alertService.alertError( 'Todos los campos son requeridos' );
    else {
      if( this.data.extension === '' ) this.__alertService.alertError( 'La extensión es requerida' );
      else if( this.data.login === '' ) this.__alertService.alertError( 'El Login es requerido' );
      else {
        if( !this.regExtension.test( this.data.extension ) ) this.__alertService.alertError( 'Extensión con formato incorrecto. Por favor, indique una extensión válida.' );
        else if( !this.regLogin.test( this.data.login ) ) this.__alertService.alertError( 'Login con formato incorrecto. Por favor, indique un Login válido.' );
        else {
          this.__ipcService.send('trouble1', [ this.data.extension, this.data.login ] );
          this.__ipcService.on( 'trouble1', ( event, args ) => {
            if( args.data === 'notDeleteOriginalXML' || args.data === 'notCopySettingsFile' || args.data === 'notRead' || args.data === 'notJson' || args.data === 'notModify' ) this.__alertService.alertError( 'No se ha podido solucionar el problema, inténtalo de nuevo más tarde o ponte en contacto con IT - HelpDesk' );
            else {
              this.data.extension = '';
              this.data.login = '';
              
              this.__alertService.alertSuccess( 'Problema Solucionado con éxito. Cierre Avaya y vuelva a iniciarlo.' );
            }
          });
        }
      }
    }
  }
}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-avaya',
  templateUrl: './avaya.component.html',
  styleUrls: ['./avaya.component.css']
})
export class AvayaComponent implements OnInit, AfterViewInit {

  public problema: string = '???';

  constructor( 
    private __alertService: AlertService,
    private __ipcService: IpcService,
    private __dataService: DataService
  ) { }

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this.__dataService.getTroubles().subscribe( ( data ) => {
      console.log( data );
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

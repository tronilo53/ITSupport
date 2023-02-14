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
    if( this.problema === '1' ) this.__ipcService.send( 'openTrouble1' );
    else if( this.problema === '2' ) {
      this.__ipcService.send( 'trouble2' );
      this.__ipcService.on( 'trouble2', ( event, args ) => {
        if( args.data === 'notRead' || args.data === 'notJson' ) this.__alertService.alertError( 'No se ha podido solucionar el problema, inténtalo de nuevo más tarde o ponte en contacto con IT - HelpDesk' );
      });
    }
  }
}

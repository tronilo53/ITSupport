import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-preload',
  templateUrl: './preload.component.html',
  styleUrls: ['./preload.component.css']
})
export class PreloadComponent implements OnInit, AfterViewInit {

  public year: number = new Date().getFullYear();
  @ViewChild('versionValue') versionValue: ElementRef;

  constructor( 
    private __ipcService: IpcService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this.__ipcService.send( 'setVersion' );
    this.__ipcService.on( 'setVersion', ( event, args ) => {
      this.renderer.setProperty( this.versionValue.nativeElement, 'innerHTML', `v${args.data} &copy;${this.year} ITSupport` );
      console.log( args );
    });
  }
}

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { IpcService } from 'src/app/services/ipc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('avaya__ok') avaya__ok: ElementRef;
  @ViewChild('avaya__fail') avaya__fail: ElementRef;
  @ViewChild('versionValue') versionValue: ElementRef;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  })

  constructor( 
    private __ipcService: IpcService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private __alertService: AlertService) {
      this.__ipcService.send( 'checkAvayaInstall' );
      this.__ipcService.on( 'checkAvayaInstall', ( event, args ) => {
        if( args.data === 'fail' ) {
          this.renderer.removeClass( this.avaya__fail.nativeElement, 'none' );
          this.__alertService.alertError( 'No se ha encontrado Avaya One X Agent' );
        }else {
          this.renderer.removeClass( this.avaya__ok.nativeElement, 'none' );
        }
      });
    }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
    this.renderer.addClass( this.avaya__fail.nativeElement, 'none' );
    this.renderer.addClass( this.avaya__ok.nativeElement, 'none' );

    this.__ipcService.on( 'setVersion', ( event, args ) => {
      this.renderer.setProperty( this.versionValue.nativeElement, 'innerHTML', args );
      console.log( args );
    });

    this.__ipcService.on( 'update_available', () => {
      this.__ipcService.removeAllListeners( 'update_available' );
      this.__alertService.alertAvailableUpdate();
    });
    this.__ipcService.on( 'update_not_available', () => {
      this.__ipcService.removeAllListeners( 'update_not_available' );
      this.Toast.fire({
        icon: 'warning',
        title: 'No hay actualizaciones Disponibles'
      });
    });
    this.__ipcService.on( 'error_update', () => {
      this.__ipcService.removeAllListeners( 'error_update' );
      this.Toast.fire({
        icon: 'error',
        title: 'Error en actualizaciones'
      });
    });
    this.__ipcService.on( 'update_downloaded', () => {
      this.__ipcService.removeAllListeners( 'update_downloaded' );
      this.__alertService.alertDownloadUpdate();
    });
    /*this.__ipcService.on( 'checks', ( event, args ) => {
      console.log( args );
    });*/
  }

  public openIt(): void {
    this.__ipcService.send( 'openIt' );
    this.changeDetectorRef.detectChanges();
  }
  public openAvaya(): void {
    this.__ipcService.send( 'openAvaya' );
    this.changeDetectorRef.detectChanges();
  }
}
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor( private __ipcService: IpcService ) { }

  public alertSuccess( message: string ): void {
    Swal.fire({
      icon: 'success',
      text: message,
      allowOutsideClick: false
    });
  }
  public alertInfo( message: string ): void {
    Swal.fire({
      icon: 'info',
      text: message,
      allowOutsideClick: false
    });
  }
  public alertPopSuccess( message: string ): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
      allowOutsideClick: false
    });
  }
  public alertPopInfo( message: string ): void {
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500,
      allowOutsideClick: false
    });
  }
  public alertError( message: string ): void {
    Swal.fire({
      icon: 'error',
      text: message,
      allowOutsideClick: false
    });
  }
  public alertPopError( message: string ): void {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500,
      allowOutsideClick: false
    })
  }
  public alertDownloadUpdate(): void {
    Swal.fire({
      title: 'Actualización Descargada',
      html: `
        <p>Se ha descargado una nueva actualización</p>,
        <p>¿Quieres instalarla ahora?</p>
        <p><strong>* Se cerrará la aplicación.</strong></p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.__ipcService.send( 'installApp' );
      }
    });
  }
  public alertAvailableUpdate(): void {
    Swal.fire({
      title: 'Actualización Disponible!',
      html: `
        <p>Hay una nueva actualización disponible</p>,
        <p>¿Quieres descargarla ahora?</p>
        <p>* Te avisaremos cuando se haya descargado</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Descargar Ahora',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.__ipcService.send( 'downloadApp' );
        this.alertPopInfo( 'Descargando Actualización' );
      }
    });
  }
}

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
      text: message
    });
  }
  public alertInfo( message: string ): void {
    Swal.fire({
      icon: 'info',
      text: message
    });
  }
  public alertPopSuccess( message: string ): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
  public alertPopInfo( message: string ): void {
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
  public alertError( message: string ): void {
    Swal.fire({
      icon: 'error',
      text: message
    });
  }
  public alertPopError( message: string ): void {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }
  public alertResetForUpdate(): void {
    Swal.fire({
      title: 'Actualización Descargada',
      html: `
        <p>Se ha descargado una nueva actualización</p>,
        <p>¿Quieres instalarla ahora?</p>
        <p><strong>Se instalará al reiniciar</strong></p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.__ipcService.send( 'restartApp' );
      }
    });
  }
}

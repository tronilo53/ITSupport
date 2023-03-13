import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class AlertptService {

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
      title: 'Actualização descarregada',
      html: `
        <p>Uma nova actualização foi descarregada</p>,
        <p>Quer instalá-lo agora?</p>
        <p><strong>* A candidatura será encerrada.</strong></p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualização',
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
      title: 'Actualização disponível!',
      html: `
        <p>Uma nova actualização está disponível</p>,
        <p>Deseja descarregá-lo agora?</p>
        <p>* Iremos notificá-lo quando tiver sido descarregado</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Descarregar agora',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.__ipcService.send( 'downloadApp' );
        this.alertPopInfo( 'Actualização de descarregamento' );
      }
    });
  }
}

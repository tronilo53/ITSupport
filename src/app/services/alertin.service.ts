import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class AlertinService {

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
      title: 'Downloaded Update',
      html: `
        <p>A new update has been downloaded</p>,
        <p>Do you want to install it now?</p>
        <p><strong>* The application will close.</strong></p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.__ipcService.send( 'installApp' );
      }
    });
  }
  public alertAvailableUpdate(): void {
    Swal.fire({
      title: 'Upgrade Available!',
      html: `
        <p>A new update is available</p>,
        <p>Do you want to download it now?</p>
        <p>* We will notify you when it has been downloaded</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Download Now',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.__ipcService.send( 'downloadApp' );
        this.alertPopInfo( 'Downloading Update' );
      }
    });
  }
}

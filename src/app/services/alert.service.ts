import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public alertSuccess( message: string ): void {
    Swal.fire({
      icon: 'success',
      text: message
    });
  }
  public alertPopSuccess( message: string ) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }
  public alertError( message: string ): void {
    Swal.fire({
      icon: 'error',
      text: message
    });
  }
  public alertPopError( message: string ) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }
}

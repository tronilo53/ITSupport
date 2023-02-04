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
  public alertError( message: string ): void {
    Swal.fire({
      icon: 'error',
      text: message
    });
  }
}

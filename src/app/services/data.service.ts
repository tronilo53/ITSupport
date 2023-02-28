import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private __httpClient: HttpClient ) { }

  public getTroubles () {
    return this.__httpClient.get( '/assets/troubles.json' );
  }
}

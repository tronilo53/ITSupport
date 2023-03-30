import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private __httpClient: HttpClient ) { }

  public getTroubles () {
    return this.__httpClient.get( 'assets/troubles.json' );
  }
  public getTroublesIn () {
    return this.__httpClient.get( 'assets/troublesIn.json' );
  }
  public getTroublesPt () {
    return this.__httpClient.get( 'assets/troublesPt.json' );
  }
  public getButtons() {
    return this.__httpClient.get( 'assets/buttons.json' );
  }
}

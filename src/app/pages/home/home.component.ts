import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor( private __ipcService: IpcService, private changeDetectorRef: ChangeDetectorRef ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
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

import { Component, OnInit, HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './store/reducers';
import * as AppActions from './store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private _store: Store<AppState>) {}
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._store.dispatch(new AppActions.WindowResized(event.target.innerHeight, event.target.innerWidth));
  }
}

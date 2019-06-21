import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './store/reducers';
import * as AppActions from './store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  constructor(private _store: Store<AppState>) { }
  ngAfterViewInit() {
    this._store.dispatch(new AppActions.WindowResized(window.innerHeight, window.innerWidth));
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._store.dispatch(new AppActions.WindowResized(event.target.innerHeight, event.target.innerWidth));
  }
  // Dispatch an event to save the state upon tab close
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    this._store.dispatch(new AppActions.AppClosed());
  }
}

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
export class AppComponent implements AfterViewInit, OnInit {
  title = 'app';
  constructor(private _store: Store<AppState>) { }
  ngAfterViewInit() {
    this._store.dispatch(new AppActions.WindowResized(window.innerHeight, window.innerWidth));
  }
  ngOnInit() {

    // TODO -- probbaly could be in a better place
    this._store.pipe(select(a => a.appState)).subscribe(val => {
      localStorage.setItem('state', JSON.stringify(val));
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._store.dispatch(new AppActions.WindowResized(event.target.innerHeight, event.target.innerWidth));
  }
}

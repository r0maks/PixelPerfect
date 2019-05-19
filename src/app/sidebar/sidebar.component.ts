import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as AppActions from '../store/app.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private _currentColor: string;
  private _usedColors: string[];

  constructor(private _store: Store<AppState>) { }

  ngOnInit() {
    this._store.pipe(select(a => a.appState.currentColor)).subscribe(val => this._currentColor = val);
    this._store.pipe(select(a => a.appState.lastColors)).subscribe(val => this._usedColors = val);
  }

  public colorChanged($event: string) {
    this._store.dispatch(new AppActions.ChangeColor($event));
  }

  public setColor(color: string) {
    this._store.dispatch(new AppActions.UsePriorColor(color));
  }

}

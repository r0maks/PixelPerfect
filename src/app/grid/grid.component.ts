import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { Observable } from 'rxjs';
import { Pixel } from '../store/app.reducer';
import * as AppActions from '../store/app.actions';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  public pixels: Pixel[][];
  public size: number;
  public sizeOptions: number[];

  constructor(
    private _store: Store<AppState>,
  ) { }

  public ngOnInit() {
    this._store.pipe(select(a => a.appState.pixels)).subscribe(val => this.pixels = val);
    this._store.pipe(select(a => a.appState.size)).subscribe(val => this.size = val);
    this._store.pipe(select(a => a.appState.sizeOptions)).subscribe(val => this.sizeOptions = val);
  }

  public setSize(size: number) {
    console.log('set size: ' + size);
    this._store.dispatch(new AppActions.SetSize(size));
  }

}
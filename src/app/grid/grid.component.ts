import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { Observable } from 'rxjs';
import { Pixel } from '../store/app.reducer';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  public pixels: Observable<Pixel[][]>;

  constructor(
    private _store: Store<AppState>,
  ) { }

  public ngOnInit() {
    this.pixels = this._store.pipe(select(a => a.appState.pixels));
  }

}

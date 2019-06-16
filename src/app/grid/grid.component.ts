import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('pixelGrid') pixelGrid: ElementRef;

  public pixels: Pixel[];
  public size: number;
  public _currentColor: string;
  public dimension: number;
  public sizeOptions: number[];
  public appMode: number;
  public hovered: string; // rowIndex-colIndex of what is currently being hovered
  public hoveredPixels: any;

  constructor(
    private _store: Store<AppState>,
  ) { }

  public ngOnInit() {
    this._store.pipe(select(a => a.appState.pixels)).subscribe(val => this.pixels = val);
    this._store.pipe(select(a => a.appState.size)).subscribe(val => {
      this.size = val;
      this.dimension = 720 / this.size;
      if (this.pixelGrid && this.pixelGrid.nativeElement) {
        this.pixelGrid.nativeElement.style = 'grid-template-columns: repeat('+ this.size +',1fr)'
      }
    });
    this._store.pipe(select(a => a.appState.sizeOptions)).subscribe(val => this.sizeOptions = val);
    this._store.pipe(select(a => a.appState.appMode)).subscribe(val => this.appMode = val);
    this._store.pipe(select(a => a.appState.currentColor)).subscribe(val => this._currentColor = val);

  }

  public setSize(size: number) {
    this._store.dispatch(new AppActions.SetSize(size));
  }

  // TODO don't do this if the same color
  public setColor(pixel: Pixel) {
    this._store.dispatch(new AppActions.FillCell(pixel));
  }

  public trackByFn(index, item) {
    return index;
  }

}

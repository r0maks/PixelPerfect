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
  @ViewChild('pixelGrid', {static: false}) pixelGrid: ElementRef;

  public pixels: Pixel[];
  public size: number;
  public brushSize: number;
  public _currentColor: string;
  public dimension: number;
  public sizeOptions: number[];
  public appMode: number;
  public hoveredPixels: any;
  public focusedPixelId: string;

  constructor(
    private _store: Store<AppState>,
  ) { }

  public ngOnInit() {
    this.hoveredPixels = {};
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
    this._store.pipe(select(a => a.appState.brushSize)).subscribe(val => this.brushSize = val);

  }

  public setSize(size: number) {
    this._store.dispatch(new AppActions.SetSize(size));
  }

  // TODO don't do this if the same color
  public setColor(pixel: Pixel) {
    this._store.dispatch(new AppActions.FillCell(pixel));
  }

  public hovered(pixel: Pixel) {
    this.hoveredPixels = {};
    this.focusedPixelId = pixel.id;
    const range = this.brushSize - 1;
    const minCol = pixel.colIndex;
    const maxRow = pixel.rowIndex;
    const minRow = maxRow - range;
    const maxCol = minCol + range;
    this.pixels.forEach(p => {
        if (p.colIndex >= minCol && p.colIndex <= maxCol
            && p.rowIndex >= minRow && p.rowIndex <= maxRow) {
            this.hoveredPixels[p.id] = true;
        }
    });
  }

  public isHovered(id: string): boolean {
    return this.hoveredPixels[id];
  }

  public hoverStopped() {
    this.hoveredPixels = {};
    this.focusedPixelId = null;
  }

  public trackByFn(index, item) {
    return index;
  }

}

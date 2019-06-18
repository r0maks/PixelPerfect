import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class GridComponent implements OnInit, AfterViewInit {
  @ViewChild('pixelGrid', { static: false }) pixelGrid: ElementRef;

  public pixels: Pixel[];
  public size: number;
  public brushSize: number;
  public _currentColor: string;
  public appMode: number;
  public dimension: number;
  private _gridSize: number;
  public sizeOptions: number[];
  public hoveredPixels: any;
  public focusedPixelId: string;

  constructor(
    private _store: Store<AppState>,
  ) { }

  public ngOnInit() {
    this.hoveredPixels = {};
    this._store.pipe(select(a => a.appState.pixels)).subscribe(val => this.pixels = val);
    this._store.pipe(select(a => a.appState.sizeOptions)).subscribe(val => this.sizeOptions = val);
    this._store.pipe(select(a => a.appState.currentColor)).subscribe(val => this._currentColor = val);
    this._store.pipe(select(a => a.appState.brushSize)).subscribe(val => this.brushSize = val);
    this._store.pipe(select(a => a.appState.appMode)).subscribe(appMode => {this.appMode = appMode});
  }

  public ngAfterViewInit() {
    this._store.pipe(select(a => a.appState.size)).subscribe(val => {
      this.size = val;
      this.dimension = this._gridSize / this.size;
      if (this.pixelGrid && this.pixelGrid.nativeElement) {
        this.pixelGrid.nativeElement.style = 'grid-template-columns: repeat(' + this.size + ',1fr)'
      }
    });
    this._store.pipe(select(a => a.appState.gridSize)).subscribe(val => {
      this._gridSize = val;
      this.dimension = this._gridSize / this.size;
    });
    this._store.pipe(select(a => a.appState.appMode)).subscribe(appMode => {
      this.appMode = appMode;
      if (this.pixelGrid && this.pixelGrid.nativeElement ) {
        this.pixelGrid.nativeElement.style.display = (appMode === 1 ? 'grid' : 'none');
      }
    });
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

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { Observable } from 'rxjs';
import { Pixel } from '../store/app.reducer';
import * as AppActions from '../store/app.actions';
import { Destroyable } from '../destroyable';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent extends Destroyable implements OnInit, AfterViewInit {
  @ViewChild('pixelGrid', { static: false }) pixelGrid: ElementRef;

  public pixels: Pixel[];
  public size: number;
  public brushSize: number;
  public _currentColor: string;
  public appMode: number;
  public dimension: number;
  private _gridSize: number;
  public sizeOptions = [8, 12, 16, 24, 32, 48, 64];
  public hoveredPixels: any;
  public focusedPixelId: string;
  public _eyeDropperMode: boolean;

  constructor(
    private _store: Store<AppState>,
    private _changeDetectionRef: ChangeDetectorRef
  ) {
    super();
  }
  public ngOnInit() {
    this.hoveredPixels = {};
    this._store.pipe(select(a => a.appState.eyeDropperMode), takeUntil(this._destroy$)).subscribe(val => this._eyeDropperMode = val);
    this._store.pipe(select(a => a.appState.pixels), takeUntil(this._destroy$)).subscribe(val => this.pixels = val);
    this._store.pipe(select(a => a.appState.currentColor), takeUntil(this._destroy$)).subscribe(val => this._currentColor = val);
    this._store.pipe(select(a => a.appState.brushSize), takeUntil(this._destroy$)).subscribe(val => this.brushSize = val);
    this._store.pipe(select(a => a.appState.appMode), takeUntil(this._destroy$)).subscribe(appMode => { this.appMode = appMode });
  }
  public ngAfterViewInit() {
    this._store.pipe(select(a => a.appState.size), takeUntil(this._destroy$)).subscribe(val => {
      this.size = val;
      this.dimension = this._gridSize / this.size;
      if (this.pixelGrid && this.pixelGrid.nativeElement) {
        this.pixelGrid.nativeElement.style = 'grid-template-columns: repeat(' + this.size + ',1fr)'
      }
    });
    this._store.pipe(select(a => a.appState.gridSize), takeUntil(this._destroy$)).subscribe(val => {
      this._gridSize = val;
      this.dimension = this._gridSize / this.size;
    });
    this._store.pipe(select(a => a.appState.appMode), takeUntil(this._destroy$)).subscribe(appMode => {
      this.appMode = appMode;
      if (this.pixelGrid && this.pixelGrid.nativeElement) {
        this.pixelGrid.nativeElement.style.display = (appMode === 1 ? 'grid' : 'none');
      }
    });
    this._changeDetectionRef.detectChanges();
  }
  public setSize(size: number) {
    this._store.dispatch(new AppActions.SetSize(size));
  }

  public cellClicked(pixel: Pixel) {
    if (this._eyeDropperMode) {
      this._store.dispatch(new AppActions.EyeDropperCellClick(pixel));
    } else {
      this._store.dispatch(new AppActions.FillCell(pixel));
    }
  }
  public hovered(pixel: Pixel) {
    this.hoveredPixels = {};

    if (this._eyeDropperMode) {
      return;
    }

    this.focusedPixelId = pixel.id;
    const range = this.brushSize - 1;
    const minCol = pixel.colIndex;
    const maxRow = pixel.rowIndex;
    const minRow = maxRow - range;
    const maxCol = minCol + range;
    for (var i = 0, len = this.pixels.length; i < len; i++) {
      const p = this.pixels[i];
      if (p.colIndex >= minCol && p.colIndex <= maxCol
        && p.rowIndex >= minRow && p.rowIndex <= maxRow) {
        this.hoveredPixels[p.id] = true;
      }
    }
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

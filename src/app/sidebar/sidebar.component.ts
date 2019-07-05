import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as AppActions from '../store/app.actions';
import { ModalService } from '../modal.service';
import { Destroyable } from '../destroyable';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends Destroyable implements OnInit {

  public _currentColor: string;
  public _usedColors: string[];
  public _brushSize: number;
  public _gridSize: number;
  public sliderValue: number;
  public _colorPickerOpen: boolean;
  public canUndo: boolean;
  public canRedo: boolean;
  public exportChoice = 0;

  constructor(private _store: Store<AppState>, private _modalService: ModalService) {
    super();
  }

  ngOnInit() {
    this._store.pipe(select(a => a.appState.currentColor), takeUntil(this._destroy$)).subscribe(val => this._currentColor = val);
    this._store.pipe(select(a => a.appState.palette), takeUntil(this._destroy$)).subscribe(val => this._usedColors = val);
    this._store.pipe(select(a => a.appState.brushSize), takeUntil(this._destroy$)).subscribe(val => { 
      this._brushSize = val;
      this.sliderValue = val;
    });
    this._store.pipe(select(a => a.appState.size), takeUntil(this._destroy$)).subscribe(val => this._gridSize = val);
    this._store.pipe(select(a => a.appState.colorPickerOpen), takeUntil(this._destroy$)).subscribe(val => this._colorPickerOpen = val);
    this._store.pipe(select(a => a.appState.historyIndex), takeUntil(this._destroy$)).subscribe(val => this.canUndo = val == 0 ? false : true);
    this._store.pipe(select(a => a.appState.historyIndex < a.appState.previousStates.length - 1), takeUntil(this._destroy$)).subscribe(val => this.canRedo = val);
  }
  public colorChanged($event: string) {
    this._store.dispatch(new AppActions.ChangeColor($event));
  }
  public pickerState($event: boolean) {
    if ($event) {
      this._store.dispatch(new AppActions.ColorPickerOpen());
    } else {
      this._store.dispatch(new AppActions.ColorPickerClosed());
    }
  }
  public setColor(color: string) {
    this._store.dispatch(new AppActions.UsePriorColor(color));
  }
  public brushSizeChanged(val: any) {
    this._store.dispatch(new AppActions.BrushSizeChanged(this.sliderValue));
  }
  public openExportModal() {
    this._modalService.open('export-options-modal');
  }
  public export() {
    this.closeExportModal();
    this._store.dispatch(new AppActions.ExportImage(this.exportChoice));
  }
  public closeExportModal() {
    this._modalService.close('export-options-modal');
  }
  public undo() {
    this._store.dispatch(new AppActions.Undo());
  }
  public redo() {
    this._store.dispatch(new AppActions.Redo());
  }
  public reset() {
    this._modalService.open('reset-confirm-modal');
  }
  public confirmReset() {
    this.closeConfirmModal();
    this._store.dispatch(new AppActions.Reset());
  }
  public closeConfirmModal() {
    this._modalService.close('reset-confirm-modal');
  }
  public randomizePalette() {
    this._store.dispatch(new AppActions.RandomizePalette());
  }
}

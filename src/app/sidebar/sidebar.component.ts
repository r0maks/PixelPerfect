import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as AppActions from '../store/app.actions';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private _currentColor: string;
  private _usedColors: string[];
  private _brushSize: number;
  private _gridSize: number;
  public sliderValue: number;
  private _colorPickerOpen: boolean;

  constructor(private _store: Store<AppState>, private _modalService: ModalService) { }

  ngOnInit() {
    this._store.pipe(select(a => a.appState.currentColor)).subscribe(val => this._currentColor = val);
    this._store.pipe(select(a => a.appState.lastColors)).subscribe(val => this._usedColors = val);
    this._store.pipe(select(a => a.appState.brushSize)).subscribe(val => { 
      this._brushSize = val;
      this.sliderValue = val;
    });
    this._store.pipe(select(a => a.appState.size)).subscribe(val => this._gridSize = val);
    this._store.pipe(select(a => a.appState.colorPickerOpen)).subscribe(val => this._colorPickerOpen = val);
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
  public export() {
    this._store.dispatch(new AppActions.ExportImage());
  }
  public undo() {
    this._store.dispatch(new AppActions.Undo());
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
}

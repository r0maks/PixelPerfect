import { Action } from '@ngrx/store';
import { Pixel } from './app.reducer';

export const SET_SIZE = 'SET_SIZE'
export const FILL_CELL = 'FILL_CELL';
export const CHANGE_COLOR = 'CHANGE_COLOR';
export const USE_PRIOR_COLOR = 'USE_PRIOR_COLOR';
export const BRUSH_SIZE_CHANGED = 'BRUSH_SIZE_CHANGED';
export const INCREMENT_BRUSH_SIZE = 'INCREMENT_BRUSH_SIZE';
export const DECREMENT_BRUSH_SIZE = 'DECREMENT_BRUSH_SIZE';
export const EXPORT_IMAGE = 'EXPORT_IMAGE';
export const UNDO = 'UNDO';
export const REDO = 'REDO';
export const RESET = 'RESET';
export const COLOR_PICKER_OPEN = 'COLOR_PICKER_OPEN';
export const COLOR_PICKER_CLOSED = 'COLOR_PICKER_CLOSED';
export const WINDOW_RESIZED = 'WINDOW_RESIZED';
export const APP_CLOSED = 'APP_CLOSED';

export class SetSize implements Action {
  readonly type = SET_SIZE;
  constructor(public size: number) { }
}
export class FillCell implements Action {
  readonly type = FILL_CELL;
  constructor(public pixel: Pixel) { }
}
export class ChangeColor implements Action {
  readonly type = CHANGE_COLOR;
  constructor(public newColor: string) {}
}
export class UsePriorColor implements Action {
  readonly type = USE_PRIOR_COLOR;
  constructor(public color: string) {}
}
export class BrushSizeChanged implements Action {
  readonly type = BRUSH_SIZE_CHANGED;
  constructor(public size: number){}
}
export class IncrementBrushSize implements Action {
  readonly type = INCREMENT_BRUSH_SIZE;
}
export class DecrementBrushSize implements Action {
  readonly type = DECREMENT_BRUSH_SIZE;
}
export class ExportImage implements Action {
  readonly type = EXPORT_IMAGE;
  constructor(public config: ExportSize) {}
}
export class Undo implements Action {
  readonly type = UNDO;
}
export class Redo implements Action {
  readonly type = REDO;
}
export class Reset implements Action  {
  readonly type = RESET;
}
export class ColorPickerOpen implements Action {
  readonly type = COLOR_PICKER_OPEN;
}
export class ColorPickerClosed implements Action {
  readonly type = COLOR_PICKER_CLOSED;
}
export class WindowResized implements Action {
  readonly type = WINDOW_RESIZED;
  constructor(public height: number, public width: number) {}
}
export class AppClosed implements Action {
  readonly type = APP_CLOSED;
}

export type AppActions
  = 
  SetSize |
  FillCell |
  ChangeColor | 
  UsePriorColor |
  BrushSizeChanged |
  IncrementBrushSize |
  DecrementBrushSize |
  ExportImage |
  Undo |
  Redo |
  Reset |
  ColorPickerOpen | 
  ColorPickerClosed |
  WindowResized | 
  AppClosed

  export enum ExportSize {
    Actual = 0,
    Small = 1,
    Medium = 2, 
    Large = 3,
}

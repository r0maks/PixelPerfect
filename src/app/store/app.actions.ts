import { Action } from '@ngrx/store';

export const SET_SIZE = 'SET_SIZE'
export const FILL_CELL = 'FILL_CELL';
export const CHANGE_COLOR = 'CHANGE_COLOR';
export const USE_PRIOR_COLOR = 'USE_PRIOR_COLOR';
export const BRUSH_SIZE_CHANGED = 'BRUSH_SIZE_CHANGED';

export class SetSize implements Action {
  readonly type = SET_SIZE;
  constructor(public size: number) { }
}
export class FillCell implements Action {
  readonly type = FILL_CELL;
  constructor(public rowIndex: number, public colIndex: number) { }
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

export type AppActions
  = 
  SetSize |
  FillCell |
  ChangeColor | 
  UsePriorColor |
  BrushSizeChanged

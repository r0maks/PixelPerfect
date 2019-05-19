import { Action } from '@ngrx/store';

export const SET_SIZE = 'SET_SIZE'
export const FILL_CELL = 'FILL_CELL';

export class SetSize implements Action {
  readonly type = SET_SIZE;
  constructor(public size: number) { }
}

export class FillCell implements Action {
  readonly type = FILL_CELL;
  constructor(public rowIndex: number, public colIndex: number) { }
}

export type AppActions
  = 
  SetSize |
  FillCell

import { Action } from '@ngrx/store';

export const SET_SIZE = 'SET_SIZE'

export class SetSize implements Action {
  readonly type = SET_SIZE;
  constructor(public size: number) { }
}

export type AppActions
  = 
  SetSize 

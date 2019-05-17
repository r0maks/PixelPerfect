import { Action } from '@ngrx/store';

export const TOGGLE_EXPANDER = 'TOGGLE_EXPANDER'

export class ToggleExpander implements Action {
  readonly type = TOGGLE_EXPANDER;
  constructor() { }
}

export type AppActions
  = 
  ToggleExpander 

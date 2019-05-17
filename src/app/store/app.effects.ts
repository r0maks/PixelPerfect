import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
    map,
    exhaustMap
} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppState } from './reducers';
import { Observable, of, from } from 'rxjs';
import * as AppActions from './app.actions';
@Injectable()
export class AppEffects {

    constructor(
        private actions$: Actions,
        private store$: Store<AppState>,
    ) { }
}
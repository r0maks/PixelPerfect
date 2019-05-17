import * as appActions from './app.actions';
import { ActionReducer, Action } from '@ngrx/store';

export interface State {
 
};

export const initialState: State = {

};

export const reducer: ActionReducer<State> = (state: State = initialState, action: appActions.AppActions) => {
    switch (action.type) {
        default:
            return state;
    }
};




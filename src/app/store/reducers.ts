import * as fromAppReducer from './app.reducer';
import { MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment'; // Angular CLI environment // Angular CLI environment


export interface AppState {
    appState?: fromAppReducer.State;
}

export const reducers = {
    appState: fromAppReducer.reducer,
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
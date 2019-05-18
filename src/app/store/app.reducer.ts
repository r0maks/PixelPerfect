import * as appActions from './app.actions';
import { ActionReducer, Action } from '@ngrx/store';

export interface State {
    size: number;
    pixels: Pixel[][]; // entire pixel grid in a 2d array
    currentColor: string;
    sizeOptions: number[],
};
export const initialState: State = {
    size: null,
    pixels: null,
    currentColor: null,
    sizeOptions: [32, 64, 128, 256, 512],
};
export const reducer: ActionReducer<State> = (state: State = initialState, action: appActions.AppActions) => {
    switch (action.type) {
        // create pixel grid from the specified size
        case appActions.SET_SIZE:
            const pixels = new Array<Pixel[]>();
            for (let rowIndex = 0; rowIndex < action.size; rowIndex++) {
                pixels[rowIndex] = new Array<Pixel>();
                for (let columnIndex = 0; columnIndex < action.size; columnIndex++) {
                    pixels[rowIndex][columnIndex] = new Pixel();
                }
            }
            return { 
                ...state,
                size: action.size,
                pixels: pixels
            };
        default:
            return state;
    }
};

export class Pixel {
    public color: string; // hex color of the pixel
}




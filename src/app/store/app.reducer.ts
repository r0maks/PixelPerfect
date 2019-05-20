import * as appActions from './app.actions';
import { ActionReducer, Action } from '@ngrx/store';

export enum AppMode {
    Config = 0,
    Drawing = 1,
}

export interface State {
    size: number;
    previousStates: Pixel[][][];
    pixels: Pixel[][]; // entire pixel grid in a 2d array
    currentColor: string;
    lastColors: string[];
    backgroundColor: string;
    sizeOptions: number[],
    appMode: AppMode;
    brushSize: number;
    brushSizeMax: number;
};
export const initialState: State = {
    size: null,
    pixels: null,
    currentColor: '#000',
    lastColors: ['#000'],
    backgroundColor: '#fff',
    sizeOptions: [8, 12, 16, 24, 32, 48, 64],
    appMode: AppMode.Config,
    previousStates: [],
    brushSize: 1,
    brushSizeMax: 8,

};
export const reducer: ActionReducer<State> = (state: State = initialState, action: appActions.AppActions) => {
    switch (action.type) {
        // create pixel grid from the specified size
        case appActions.SET_SIZE:
            const pixels1 = new Array<Pixel[]>();
            for (let rowIndex = 0; rowIndex < action.size; rowIndex++) {
                pixels1[rowIndex] = new Array<Pixel>();
                for (let columnIndex = 0; columnIndex < action.size; columnIndex++) {
                    pixels1[rowIndex][columnIndex] = new Pixel(rowIndex + '-' + columnIndex);
                }
            }
            return {
                ...state,
                size: action.size,
                pixels: pixels1,
                appMode: AppMode.Drawing,
            };
        case appActions.FILL_CELL:
            const pixels = Object.assign([], state.pixels);
            const cell = pixels[action.rowIndex][action.colIndex] as Pixel;
            cell.color = state.currentColor;
            return {
                ...state,
                pixels: pixels,
                previousStates: saveNewState(state.previousStates, pixels),
            };
        case appActions.CHANGE_COLOR:
            if (state.currentColor === action.newColor) {
                return { ...state };
            }
            // take the last 9 colors
            let colors = Object.assign([], state.lastColors);
            if (state.lastColors.length > 9) {
                colors = Object.assign([], state.lastColors.slice(1));
            }

            colors.push(action.newColor);
            return {
                ...state,
                currentColor: action.newColor,
                lastColors: colors,
            };
        case appActions.USE_PRIOR_COLOR:
            if (state.currentColor === action.color) {
                return { ...state };
            }
            return {
                ...state,
                currentColor: action.color,
            };
        case appActions.BRUSH_SIZE_CHANGED:
            return {
                ...state,
                brushSize: action.size,
            };
        default:
            return state;
    }
};

export class Pixel {
    public color: string; // hex color of the pixel
    constructor(public id: string) { }
}

function saveNewState(previousStates: any[], newState: Pixel[][]): any[] {
    const allStates = Object.assign([], previousStates);
    allStates.push(newState);
    return allStates;
}





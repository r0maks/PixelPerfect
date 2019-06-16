import * as appActions from './app.actions';
import { ActionReducer, Action } from '@ngrx/store';
import PNGImage from 'pnglib-es6';
import * as _ from 'lodash';

export enum AppMode {
    Config = 0,
    Drawing = 1,
}

export interface State {
    size: number;
    previousStates: Pixel[][][];
    pixels: Pixel[]; // entire pixel grid in a 2d array
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
            const pixels1 = new Array<Pixel>();
            for (let rowIndex = 0; rowIndex < action.size; rowIndex++) {
                for (let columnIndex = 0; columnIndex < action.size; columnIndex++) {
                    pixels1.push(new Pixel(rowIndex, columnIndex));
                }
            }
            return {
                ...state,
                size: action.size,
                pixels: pixels1,
                appMode: AppMode.Drawing,
                previousStates: saveNewState(state.previousStates, pixels1),
            };
        case appActions.FILL_CELL:
            const pixels = clone(state.pixels);
            const pixelsToFill = getCellsToFill(pixels, action.pixel, state.brushSize);
            for (var i = 0, len = pixelsToFill.length; i < len; i++) {
                pixelsToFill[i].color = state.currentColor;
            }
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
            let colors = clone(state.lastColors);
            if (state.lastColors.length > 9) {
                colors = clone(state.lastColors.slice(1));
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
        case appActions.UNDO:
            let lastPixels = clone(state.pixels);
            let previousStates = clone(state.previousStates);
            if (previousStates.length && previousStates.length > 1) {
                lastPixels = clone(previousStates[previousStates.length - 2]);
                previousStates = _.dropRight(previousStates);
            }
            return {
                ...state,
                pixels: lastPixels,
                previousStates: previousStates
            };
        case appActions.RESET:
            return initialState;
        case appActions.EXPORT_IMAGE: {
            // buildImage(state.size, state.pixels);
            return state;
        }
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
    public id: string;
    constructor(public rowIndex: number, public colIndex: number) {
        this.id = rowIndex + '-' + colIndex;
    }
}

function saveNewState(previousStates: any[], newState: Pixel[]): any[] {
    const allStates = clone(previousStates);
    allStates.push(clone(newState));
    return allStates;
}

// Code should probably be in effects
function buildImage(size: number, pixels: Pixel[][]) {
    // If no third argument, transparent
    const image = new PNGImage(size, size, 8);

    for (let rowIndex = 0; rowIndex < pixels[0].length; rowIndex++) {
        const row = pixels[rowIndex];

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const pixel = row[colIndex];
            const color = image.createColor(pixel.color);
            image.setPixel(rowIndex, colIndex, color);
        }
    }

    const base64 = image.getBase64();
    // Or get the data-url which can be passed directly to an <img src>
    const dataUri = image.getDataURL(); // data:image/png;base64,...
    // TODO: do something with the data uri

}

function getCellsToFill(pixels: Pixel[], pixel: Pixel, brushSize: number): Pixel[] {
    const range = brushSize - 1;
    let pixelsToFill = new Array<Pixel>();

    // normal draw
    if (range === 0) {
        pixelsToFill.push(pixels.find(a => a.id === pixel.id));
    } else {
        const minCol = pixel.colIndex;
        const maxRow = pixel.rowIndex;
        const minRow = maxRow - range;
        const maxCol = minCol + range;
        pixels.forEach(p => {
            if (p.colIndex >= minCol && p.colIndex <= maxCol
                && p.rowIndex >= minRow && p.rowIndex <= maxRow) {
                pixelsToFill.push(p);
            }
        });
    }

    return pixelsToFill;
}
function clone(target: any[]): any[] {
    return _.cloneDeep(target);
}
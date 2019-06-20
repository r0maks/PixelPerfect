import * as appActions from './app.actions';
import { ActionReducer, Action } from '@ngrx/store';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';

export enum AppMode {
    Config = 0,
    Drawing = 1,
}

export interface State {
    size: number;
    previousStates: Pixel[][];
    historyIndex: number;
    pixels: Pixel[]; // entire pixel grid in a 2d array
    currentColor: string;
    palette: string[];
    backgroundColor: string;
    sizeOptions: number[],
    gridSize: number,
    appMode: AppMode;
    brushSize: number;
    colorPickerOpen: boolean;
};
export const initialState: State = {
    size: null,
    pixels: null,
    currentColor: '#000000',
    palette: ['#000000'],
    backgroundColor: '#fff',
    sizeOptions: [8, 12, 16, 24, 32, 48, 64],
    gridSize: 720,
    appMode: 0,
    previousStates: [],
    historyIndex: 0,
    brushSize: 1,
    colorPickerOpen: false,
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

            let prevStates = clone(state.previousStates);
            // cut the previous states at current index and save the new state on top
            const numToDrop = (state.previousStates.length - 1) - state.historyIndex;

            if (numToDrop > 0) {
                prevStates = _.dropRight(prevStates, numToDrop);
            }

            return {
                ...state,
                pixels: pixels,
                previousStates: saveNewState(prevStates, pixels),
                historyIndex: state.historyIndex + 1,
            };
        case appActions.CHANGE_COLOR:
            if (state.currentColor === action.newColor) {
                return { ...state };
            }
            // take the last 9 colors
            let colors = clone(state.palette);
            if (state.palette.length > 9) {
                colors = clone(state.palette.slice(1));
            }
            colors.push(action.newColor);
            return {
                ...state,
                currentColor: action.newColor,
                palette: colors,
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
            let thisIndex = state.historyIndex;
            let lastPixels = clone(state.pixels);
            if (thisIndex > 0) {
                thisIndex = thisIndex - 1;
                lastPixels = clone(state.previousStates[thisIndex]);
            }
            return {
                ...state,
                pixels: lastPixels,
                historyIndex: thisIndex
            };
        case appActions.REDO:
            let currentIndex = state.historyIndex;
            let redoPixels = clone(state.pixels);
            if (currentIndex < state.previousStates.length - 1) {
                currentIndex = currentIndex + 1;
                redoPixels = clone(state.previousStates[currentIndex]);
            }
            return {
                ...state,
                pixels: redoPixels,
                historyIndex: currentIndex
            };
        case appActions.RESET:
            return initialState;
        case appActions.EXPORT_IMAGE: {
            buildImage(state.size, state.pixels);
            return state;
        }
        case appActions.BRUSH_SIZE_CHANGED:
            return {
                ...state,
                brushSize: action.size,
            };
        case appActions.COLOR_PICKER_OPEN:
            return {
                ...state,
                colorPickerOpen: true
            };
        case appActions.COLOR_PICKER_CLOSED:
            return {
                ...state,
                colorPickerOpen: false
            };
        case appActions.WINDOW_RESIZED:
            let newSize = 720;
            if (action.height > action.width) {
                newSize = action.width * .7;
            } else {
                newSize = action.height * .8;
            }
            return {
                ...state,
                gridSize: newSize
            };
        default:
            if (retrieveState()) {
                var newState = JSON.parse(retrieveState())
                return newState
            }
            else {
                return state;
            }
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
function buildImage(size: number, pixels: Pixel[]) {
    var canvas = document.createElement('canvas');
    canvas.height = size;
    canvas.width = size;
    // getting the context will allow to manipulate the image
    var context = canvas.getContext("2d");

    // We create a new imageData.
    var imageData = context.createImageData(size, size);
    // The property data will contain an array of int8
    var data = imageData.data;
    for (var i = 0; i < size * size; i++) {
        const p = pixels[i];
        const rgb = hexToRgb(p.color);
        data[i * 4 + 0] = rgb.r; // Red
        data[i * 4 + 1] = rgb.g; // Green
        data[i * 4 + 2] = rgb.b; // Blue
        data[i * 4 + 3] = 255; // alpha (transparency)
    }
    // we put this random image in the context
    context.putImageData(imageData, 0, 0); // at coords 0,0
    var pngData = createData("png","image/png");
    saveAs(pngData.value as any);
    function createData(type, mimetype) {
        var value=canvas.toDataURL(mimetype);
        if (value.indexOf(mimetype)>0) { // we check if the format is supported
            return {
                type:type,
                value:value
            }
        }
    }
}

function hexToRgb(hex) {
    // default is white
    const defaultColor = {
        r: 255,
        g: 255,
        b: 255,
    };
    if (!hex) {
        defaultColor;
    }
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : defaultColor;
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
function retrieveState(): string {
    return localStorage.getItem('state');
}
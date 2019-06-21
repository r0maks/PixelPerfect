import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class Destroyable implements OnDestroy {
    public _destroy$ = new Subject(); 
    public ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }
}

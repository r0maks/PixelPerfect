import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { AppMode } from '../store/app.reducer';
import { Destroyable } from '../destroyable';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends Destroyable implements OnInit {

  public appMode: AppMode;

  constructor(private _store: Store<AppState>) {
    super();
  }

  public ngOnInit() {
    this._store.pipe(select(a => a.appState.appMode), takeUntil(this._destroy$)).subscribe(val => this.appMode = val);
  }

}

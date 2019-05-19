import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { AppMode } from '../store/app.reducer';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public appMode: AppMode;

  constructor(private _store: Store<AppState>) { }

  public ngOnInit() {
    this._store.pipe(select(a => a.appState.appMode)).subscribe(val => this.appMode = val);
  }

}

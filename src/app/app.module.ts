import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './store/app.effects';
import { environment } from '../environments/environment';
import { MainComponent } from './main/main.component';
import { GridComponent } from './grid/grid.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';

export const AppRoutes: Routes = [
  { path: '', component: MainComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GridComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    FormsModule,
    RouterModule.forRoot(
      AppRoutes,
      { enableTracing: true }
    ),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      AppEffects
    ]),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './store/app.effects';
import { environment } from '../environments/environment';

export const AppRoutes: Routes = [
  { path: '', component: AppComponent },

];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
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

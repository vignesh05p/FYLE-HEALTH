import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

import { AppComponent } from './app.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { WorkoutChartComponent } from './components/workout-chart/workout-chart.component';
import { TotalMinutesPipe } from './pipes/total-minutes.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    UserListComponent,
    WorkoutChartComponent,
    TotalMinutesPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

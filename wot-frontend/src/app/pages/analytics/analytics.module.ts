import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { LayoutModule } from 'src/app/common/layout/layout.module';
import { ButtonsModule } from 'src/app/common/buttons/buttons.module';
import { AnalyticsRoutingModule } from './analytics-routing.module';



@NgModule({
  declarations: [
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ButtonsModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }

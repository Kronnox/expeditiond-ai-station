import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { NgxDrawingCanvasModule } from 'src/app/ngx-drawing-canvas/ngx-drawing-canvas.module';
import { ButtonsModule } from 'src/app/common/buttons/buttons.module';


@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    NgxDrawingCanvasModule,
    ButtonsModule
  ]
})
export class GameModule { }

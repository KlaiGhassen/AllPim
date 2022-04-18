import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorblindComponent } from './colorblind.component';
import { SharedModule } from 'app/shared/shared.module';
import { colorblindRoutes } from './colorblind.routing';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
  
    ColorblindComponent
  ],
  imports: [
    RouterModule.forChild(colorblindRoutes),
    CommonModule,
    SharedModule
  ]
})
export class ColorblindModule { }

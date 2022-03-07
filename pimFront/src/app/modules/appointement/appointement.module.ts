import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointementComponent } from './appointement.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { Route, RouterModule } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';





const tabRoutes: Route[] = [
  {
      path     : '',
      component: AppointementComponent
  }
];
@NgModule({
  declarations: [AppointementComponent],
  imports: [
    CommonModule,
    MatIconModule,

    SharedModule,
    MatTableModule,
    RouterModule.forChild(tabRoutes)
  ]
})
export class AppointementModule { }

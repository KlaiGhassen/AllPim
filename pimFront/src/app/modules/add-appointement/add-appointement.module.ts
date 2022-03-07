import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointementComponent } from './appointement.component';
import {MatDialogModule} from '@angular/material/dialog';



@NgModule({
  declarations: [
    AppointementComponent,
    
  ],
  imports: [
    CommonModule
  ]
})
export class AddAppointementModule { }

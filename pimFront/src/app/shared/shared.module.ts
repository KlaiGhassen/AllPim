import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatTableModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatTableModule,
        ReactiveFormsModule
    ]
})
export class SharedModule
{
}

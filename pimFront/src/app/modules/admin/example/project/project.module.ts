import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { projectRoutes } from './project.routing';
import { ProjectComponent } from './project.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    declarations: [
        
        ProjectComponent
    ],
    imports     : [
        RouterModule.forChild(projectRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        SharedModule,
        TranslateModule,
        NgxDropzoneModule,
        MatDialogModule
        
        
    ]
})
export class ProjectModule
{
}

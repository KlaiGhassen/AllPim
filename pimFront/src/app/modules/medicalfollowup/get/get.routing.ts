import { Route } from '@angular/router';
import { MedicalfollowupComponent } from 'app/modules/medicalfollowup/addmfu/medicalfollowup.component';
import { GetComponent } from './get.component';

export const getMedicalfollowupRoutes: Route[] = [
    {
        path     : '',
        component: GetComponent
    }
];

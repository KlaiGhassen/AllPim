import { Route } from '@angular/router';
import { PrescriptationComponent } from 'app/modules/medicalfollowup/prescriptation/prescriptation.component';

export const prescriptionRoutes: Route[] = [
    {
        path: '',
        component: PrescriptationComponent
    }
];
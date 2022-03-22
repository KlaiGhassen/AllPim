import { Route } from '@angular/router';
import { ConfirmationRequiredClassicComponent } from 'app/modules/auth/confirmation-required/confirmation-required.component';

export const authConfirmationRequiredRoutes: Route[] = [
    {
        path     : '',
        component: ConfirmationRequiredClassicComponent
    }
];

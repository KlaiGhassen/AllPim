import { Route } from '@angular/router';
import { ResetPasswordClassicComponent } from 'app/modules/auth/reset-password/reset-password.component';

export const authResetPasswordRoutes: Route[] = [
    {
        path     : '',
        component: ResetPasswordClassicComponent
    }
];
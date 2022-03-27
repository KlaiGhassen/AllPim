import { Route } from '@angular/router';
import { ForgotPasswordClassicComponent } from 'app/modules/auth/forgot-password/forgot-password.component';

export const authForgotPasswordRoutes: Route[] = [
    {
        path     : '',
        component: ForgotPasswordClassicComponent
    }
];
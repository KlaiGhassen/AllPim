import { Route } from '@angular/router';
import { SignUpClassicComponent } from 'app/modules/auth/sign-up/sign-up.component';

export const authSignupRoutes: Route[] = [
    {
        path     : '',
        component: SignUpClassicComponent
    }
];

import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { MedicalfollowupComponent } from './modules/medicalfollowup/addmfu/medicalfollowup.component';
import { AllmdfComponent } from './modules/medicalfollowup/allmdf/allmdf.component';
import { PrescriptationComponent } from './modules/medicalfollowup/prescriptation/prescriptation.component';


// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmed/:token', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)},
            {path: 'confirmation-required/:email', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password/:id', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},

        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/example/project/project.module').then(m => m.ProjectModule)},
            {path: 'settings', loadChildren: () => import('app/modules/settings/settings.module').then(m => m.SettingsModule)},        
            {path: 'calendar', loadChildren: () => import('app/modules/calendar/calendar.module').then(m => m.CalendarModule)},
            {path: 'colorblind', loadChildren: () => import('app/modules/colorblind/colorblind.module').then(m => m.ColorblindModule)},
            {path: 'notes', loadChildren: () => import('app/modules/notes/notes.module').then(m => m.NotesModule)},
            {path: 'pricing', loadChildren: () => import('app/modules/pricing/pricing.module').then(m => m.PricingModule)},
            { path: 'get', loadChildren: () => import('app/modules/medicalfollowup/get/get.module').then(m => m.GetModule) },
            { path: 'update', loadChildren: () => import('app/modules/medicalfollowup/addmfu/medicalfollowup.module').then(m => m.MedicalfollowupModule) },
            { path: 'patient', loadChildren: () => import('app/modules/patient/patient.module').then(m => m.patientModule) },
            { path: 'MedicalfollowupModule', loadChildren: () => import('app/modules/medicalfollowup/addmfu/medicalfollowup.module').then(m => m.MedicalfollowupModule) },
            { path: 'allmdf', loadChildren: () => import('app/modules/medicalfollowup/allmdf/allmdf.module').then(m => m.allmdfModule) },
            { path: "medicalFollowUp/:id", component: MedicalfollowupComponent, },
            { path: "allmdf/:id", component: AllmdfComponent, },
            { path: 'prescription', loadChildren: () => import('app/modules/medicalfollowup/prescriptation/prescriptation.module').then(m => m.prescriptionModule) },
            { path: "prescription/:id", component: PrescriptationComponent, },
            {path: 'chat', loadChildren: () => import('app/modules/home/home.module').then(m => m.HomeModule)},
            //{path: 'Appointements', loadChildren: () => import('app/modules/appointement/appointement.module').then(m => m.CalendarModule)},
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'},
            //
            
         
           
            
          
        ]
   
    },
    




]
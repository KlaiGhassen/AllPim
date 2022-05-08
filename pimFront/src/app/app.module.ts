import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { AuthService } from './core/auth/auth.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth-interceptor.service';
import { GlobalService } from './global.service';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider,FacebookLoginProvider} from 'angularx-social-login';
import { CalendarModule } from './modules/calendar/calendar.module';
import { NotesModule } from './modules/notes/notes.module';
import { AppointementModule } from './modules/appointement/appointement.module';
import { SharedModule } from './shared/shared.module';
import { environment } from "../environments/environment";
import { initializeApp } from "firebase/app";
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, getApp } from '@angular/fire/app';
import { PricingModule } from './modules/pricing/pricing.module';
import { ColorblindModule } from './modules/colorblind/colorblind.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import {TranslateLoader, TranslateModule,} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogAppointementComponent } from './modules/admin/dialog-appointement/dialog-appointement.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogContentExample, DialogContentExampleDialog } from './modules/Dialog/dialog-content-example';
import { MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { COMMA, ENTER } from '@angular/cdk/keycodes';



initializeApp(environment.firebase);
export function HttpLoaderFactory(http:HttpClient){
return new TranslateHttpLoader(http,"./assets/i18n/",".json")
  
}


  

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        DialogAppointementComponent,
        DialogContentExample,
        DialogContentExampleDialog
        
    ],
    imports     : [
        TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })   ,  
        SocialLoginModule,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        RouterModule.forRoot(appRoutes),
        provideFirestore(() => getFirestore()),
        provideFirebaseApp(() => initializeApp( environment.firebase )),
        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
         MatDialogModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
          ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
          })
    ],

    providers: [
       {
            provide: MAT_CHIPS_DEFAULT_OPTIONS,
            useValue: {
                separatorKeyCodes: [ENTER, COMMA]
            }
            
        },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor ,
        multi: true,
      },
      {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [
              {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider(
                  '992171802483-b2509a16j76clmmkr32965uvm5gvu3jt.apps.googleusercontent.com'
                )
              },
              {
                id: FacebookLoginProvider.PROVIDER_ID,
                provider: new FacebookLoginProvider('759678765418980')
                //              471159557632201
  
              }
            ]
          } as SocialAuthServiceConfig,
        }
     
  
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}

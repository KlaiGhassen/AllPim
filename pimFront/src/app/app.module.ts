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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth-interceptor.service';
import { GlobalService } from './global.service';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider,FacebookLoginProvider} from 'angularx-social-login';
import { CalendarModule } from './modules/calendar/calendar.module';
import { AppointementModule } from './modules/appointement/appointement.module';
import { SharedModule } from './shared/shared.module';
import { environment } from "../environments/environment";
import { initializeApp } from "firebase/app";
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, getApp } from '@angular/fire/app';



initializeApp(environment.firebase);



  

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        
    ],
    imports     : [
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

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({})
    ],

    providers: [
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

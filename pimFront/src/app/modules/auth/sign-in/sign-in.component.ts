import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { GlobalService } from 'app/global.service';

@Component({
    selector: 'sign-in-classic',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SignInClassicComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    signInForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _Us: UserService,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private gs: GlobalService,
        private authService: SocialAuthService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
       

        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [''],
        });
    }

    signInWithGoogle(){
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.authService.authState.subscribe((user) => {
          let data={
            full_name:user.firstName+" "+user.lastName,
            email:user.email,
            image:user.photoUrl,
            social:true,
            verified:true,            
          }
          this._authService.socialLog(data).subscribe((res)=>{
            if (res.accessToken && res.user) {
                console.log("res",res);
                this._authService.accessToken =res.accessToken
                const redirectURL =
              this._activatedRoute.snapshot.queryParamMap.get(
                  'redirectURL'
              ) || '/signed-in-redirect';

          // // Navigate to the redirect url
          this._router.navigateByUrl(redirectURL);

            }
else{
    this._router.navigateByUrl("sign-up");


}

           })
        });
     


    }
    signInWithFaceBook(){
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
        this.authService.authState.subscribe((user) => {
            let data={
              full_name:user.firstName+ " "+user.lastName,
              email:user.email,
              image:user.photoUrl,
              social:true,
              verified:true,            
            }
            this._authService.socialLog(data).subscribe((res)=>{
              if (res.accessToken && res.user) {
                  console.log("res",res);
                  this._authService.accessToken =res.accessToken
                  const redirectURL =
                this._activatedRoute.snapshot.queryParamMap.get(
                    'redirectURL'
                ) || '/signed-in-redirect';
  
            // // Navigate to the redirect url
            this._router.navigateByUrl(redirectURL);
  
              }
             })
          });
       
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        let email = this.signInForm.controls['email'].value;

        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value).subscribe(
            (res) => {
                console.log('Success', res);
                // Set the redirect url.
                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                if (res.user.verified == true) {
                    const redirectURL =
                        this._activatedRoute.snapshot.queryParamMap.get(
                            'redirectURL'
                        ) || '/signed-in-redirect';

                    // // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);
                } else {
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message:
                            'an email have been send please verify your email',
                    };

                    // Show the alert
                    this.showAlert = true;
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    this._router.navigateByUrl(
                        'confirmation-required/' + email
                    );
                }
            },
            (response) => {
                console.log(response);
                // Re-enable the form

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                };

                // Show the alert
                this.showAlert = true;

                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();
            }
        );
    }
}

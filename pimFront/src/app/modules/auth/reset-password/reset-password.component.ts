import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'reset-password-classic',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ResetPasswordClassicComponent implements OnInit {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router,


    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.resetPasswordForm = this._formBuilder.group(
            {
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        {
            // Return if the form is invalid
            if (this.resetPasswordForm.invalid) {
                return;
            }

            // Disable the form
            this.resetPasswordForm.disable();

            // Hide the alert
            this.showAlert = false;

            // Send the request to the server
            this._authService
                .resetPassword(
                    this.resetPasswordForm.get('password').value,
                    this._activatedRoute.snapshot.params.id
                )
                .pipe(
                    finalize(() => {
                        // Re-enable the form
                        this.resetPasswordForm.enable();

                        // Reset the form
                        this.resetPasswordForm.reset();

                        // Show the alert
                        this.showAlert = true;
                        setTimeout(() => {
                            this._router.navigateByUrl('/sign-in');
                        }, 2000);
                    })
                )
                .subscribe(
                    (response) => {
                        // Set the alert
                        this.alert = {
                            type: 'success',
                            message: 'Your password has been reset.',
                        };
                    },
                    (response) => {
                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: 'Something went wrong, please try again.',
                        };
                    }
                );
        }
    }
}
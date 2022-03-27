import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalService } from 'app/global.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: FormGroup;
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
        private _authService: AuthService,
        private gs: GlobalService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        console.log("the user id ", this.gs.getUser()
        );
        this.securityForm = this._formBuilder.group(
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
        // Create the form
    }
    update() {
        console.log(this.gs.getUser().id
        );
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
                    this.gs.getUser()._id
                )

                .pipe(
                    finalize(() => {
                        // Re-enable the form
                        this.resetPasswordForm.enable();

                        // Reset the form
                        this.resetPasswordForm.reset();

                        // Show the alert
                        this.showAlert = true;
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
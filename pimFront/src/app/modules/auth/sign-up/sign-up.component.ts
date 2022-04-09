import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'sign-up-classic',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SignUpClassicComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _formBuilder: FormBuilder
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            full_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            agreements: ['', Validators.requiredTrue],
            description: ['', Validators.required],
            role:['simple', Validators.required]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signUp(): void {
        if (this.signUpForm.valid)
            this._authService.signUp(this.signUpForm.value).subscribe((res) => {
                console.log(res);

                if (!res.email && res.newOphto) {
                    this._router.navigateByUrl(
                        '/confirmation-required/' + res.newOphto.email
                    );
                } else {
                    this.alert = {
                        type: 'error',
                        message: 'check email',
                    };
                    this.showAlert = true;
                }
            });
    }
}

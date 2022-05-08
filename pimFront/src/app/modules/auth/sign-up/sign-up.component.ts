import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { ProjectService } from 'app/modules/admin/example/project/project.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'sign-up-classic',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.html'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SignUpClassicComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    files: File[] = [];
    picture;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    data: any = [];

    signUpForm: FormGroup;
    showAlert: boolean = false;
    checkingOphto:boolean = false;
    /**
     * Constructor
     */
     onSelect(event: any) {
        console.log(event);
        this.files.push(...event.addedFiles);
    }
    onRemove(event: any) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _Us: UserService,
        private sanitizer: DomSanitizer,


    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        this._projectService.getData()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data) => {
            console.log(data);
            data.forEach((elm) => {
                console.log(elm.profilePicture);
                this._projectService
                    .downloadMedia(elm.profilePicture)
                    .subscribe((blob) => {
                        // var myFile = this.blobToFile(blob, 'my-image1.png');
                        const objectURL = URL.createObjectURL(blob);
                        this.picture =
                            this.sanitizer.bypassSecurityTrustUrl(
                                objectURL
                            );
                        // this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
                        elm.profilePicture = this.picture;
                        console.log(elm.profilePicture);
                        this.data.push(elm);
                    });
            });
            // Store the data
            // Prepare the chart data
            // this._prepareChartData();
        });




        // Create the form
        this.signUpForm = this._formBuilder.group({
            full_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            agreements: ['', Validators.requiredTrue],
            description: [''],
            role:['simple', Validators.required],
            contacts:[""],
        });
      
        



    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectChanged($event){
        console.log(this.signUpForm.value)
    this.checkingOphto = !this.checkingOphto;
    }

    load = true;



    savelicense() {
        
        this._Us.updateLicensefromSignup(this.files[0]).subscribe((data) => {
            console.log(data);
            if(data == true){
                this.load = false;
                this.alert = {
                    type: 'success',
                    message: 'License Accepted',
                };
                this.showAlert = true;
            }
            else {
                this.alert = {
                    type: 'error',
                    message: 'Rejected License',
                };
                this.showAlert = true;
            }
            
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

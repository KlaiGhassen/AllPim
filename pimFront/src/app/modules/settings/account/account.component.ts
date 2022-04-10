import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { GlobalService } from 'app/global.service';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SettingsAccountComponent implements OnInit {
    files: File[] = [];
    filesProfilePicture: File[] = [];

    accountForm: FormGroup;
    user;
    updatepicture = false;
    updateLicense = true;
    formData = new FormData();
    load = false;
    img = false;

    profilePicture = undefined;

    /**
     * Constructor
     */
    constructor(
        private sanitizer: DomSanitizer,
        private _formBuilder: FormBuilder,
        private _Us: UserService,
        private gs: GlobalService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.user = this.gs.getUser();
        console.log(this.user);
        this.donMedia();

        let formControls = {
            full_name: new FormControl(this.user.full_name, [
                Validators.required,
            ]),
            email: new FormControl(this.user.email, [
                Validators.required,
                Validators.email,
            ]),
            phone_number: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            title: new FormControl(this.user.title, [Validators.required]),
            description: new FormControl(this.user.description, [
                Validators.required,
            ]),
            country: new FormControl(this.user.country, [Validators.required]),
        };

        this.accountForm = this._formBuilder.group(formControls);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void {
        this.user = this.gs.getUser();
        console.log(this.user);
        console.log('user profilepic', this.user.profilePicture);
        this.donMedia();
        // Create the form
    }
    donMedia() {
        this._Us.downloadMedia(this.user.profilePicture).subscribe((blob) => {
            // var myFile = this.blobToFile(blob, 'my-image1.png');
            const objectURL = URL.createObjectURL(blob);
            this.profilePicture =
                this.sanitizer.bypassSecurityTrustUrl(objectURL);

            // this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        });
    }
    blobToFile(theBlob: Blob, fileName: string) {
        var b: any = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;

        //Cast to a File() type
        return <File>theBlob;
    }
    onSelect(event: any) {
        console.log(event);
        this.files.push(...event.addedFiles);
    }
    onRemove(event: any) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }
    onSelectProfilePecture(event: any) {
        console.log(event);
        this.filesProfilePicture.push(...event.addedFiles);
    }
    onRemoveProfilePecture(event: any) {
        console.log(event);
        this.filesProfilePicture.splice(this.filesProfilePicture.indexOf(event), 1);
    }

    updatePic() {
        console.log('hi');
        this.updatepicture = !this.updatepicture;
    }

    update() {
        this._Us.update(this.accountForm.value).subscribe((data) => {
            console.log(data);
        });
        // console.log(this.accountForm.value);
    }
    onSelectedFile(event) {
        //console.log("fillllllllllllllllllllllllllllllllllllle",event.target.files)

        const file = event.target.files[0];

        // Store form name as "file" with file data
        this.formData.append('file', file, event.target.files[0].name);
    }

    savelicense() {
        this.load = true;
        this._Us.postFile(this.files[0]).subscribe((data) => {
            console.log(data);
            this.load = false;
        });
    }

    checkLicence(): Boolean {
        const current = this.gs.getUser();
        if (current.diploma === true) {
            return true;
        } else {
            return false;
        }
    }
}

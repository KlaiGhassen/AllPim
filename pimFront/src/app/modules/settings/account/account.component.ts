import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { GlobalService } from 'app/global.service';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountComponent implements OnInit {
    files: File[] = [];
    private sanitizer: DomSanitizer;
    accountForm: FormGroup;
    user;
    updatepicture = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _Us: UserService,
        private gs: GlobalService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.user = this.gs.getUser();
        console.log(this.gs.getUser());
        // Create the form
        this.accountForm = this._formBuilder.group({
            full_name: [this.user.full_name],
            phone_number: [this.user.phone_number],
            title: [this.user.title],
            about: [this.user.description],
            email: [this.user.email, Validators.email],
            country: [this.user.country],
        });
    }

    getSafeUrl() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.user.image);
    }
    onSelect(event: any) {
        console.log(event);
        this.files.push(...event.addedFiles);
    }
    onRemove(event: any) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }
    updatePic() {
        console.log('hi')
        this.updatepicture = !this.updatepicture
    }
}

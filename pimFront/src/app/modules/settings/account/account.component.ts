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
    updateLicense = true;
    formData = new FormData(); 
    load = false;

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
        this._Us;
        // Create the form
        this.accountForm = this._formBuilder.group({
            full_name: [this.user.full_name],
            phone_number: [this.user.phone_number],
            title: [this.user.title],
            description: [this.user.description],
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
        console.log('hi');
        this.updatepicture = !this.updatepicture;
    }

    
    update() {
        this._Us.update(this.accountForm.value).subscribe((data) => {
         console.log(data);
        });
        // console.log(this.accountForm.value);
    }
    onSelectedFile(event){
        //console.log("fillllllllllllllllllllllllllllllllllllle",event.target.files)
        
          const file = event.target.files[0];
          
        
      // Store form name as "file" with file data
      this.formData.append("file", file, event.target.files[0].name);
         
         
           
        
      }

      savelicense(){
          this.load = true;
        this._Us.postFile(this.files[0]).subscribe((data) => {
            console.log(data);
            this.load = false;
           });
      }
    
}
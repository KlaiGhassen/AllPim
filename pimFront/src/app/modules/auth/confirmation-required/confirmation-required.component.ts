import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'confirmation-required-classic',
    templateUrl: './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ConfirmationRequiredClassicComponent implements OnInit {
    disabledBtn = false;
    i =0;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private route: ActivatedRoute
    ) {}

    confirmation() {
        console.log('email have been send ');
     return this._authService
         .confirmationMail(this.route.snapshot.params.email)
         .subscribe((res) => {
             console.log('done', res);
         });
    }
    ngOnInit(): void {
        this.confirmation();
    }

    confirmationBtn() {
        this.confirmation();
        this.disabledBtn = true;
    
       setTimeout(() => {
        this.disabledBtn = false;


       },10000)
    }
}

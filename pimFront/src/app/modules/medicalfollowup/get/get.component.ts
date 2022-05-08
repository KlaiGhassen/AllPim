import { Component, OnInit, Inject } from '@angular/core';
import { MedicalfollowupService } from '../Service/medicalfollowupService.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { IgxFilterOptions } from 'igniteui-angular';


@Component({
    selector: 'app-get',
    templateUrl: './get.component.html',
    styleUrls: ['./get.component.scss'],
})
export class GetComponent implements OnInit {
    today: any = Date.now();
    medicalfollowup: any;
    patient: any;
    Details: any;
    searchInputControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public density = 'comfortable';
    public displayDensities;
    public searchContact: string;
    constructor(
        private service: MedicalfollowupService,
        private router: Router,
        private route: ActivatedRoute
    ) { }
    ngOnInit() {

        this.service.listMedicalfollowup().subscribe(
            (response) => {
                this.medicalfollowup = response;
            }
        );
        [
            { label: 'comfortable', selected: this.density === 'comfortable', togglable: true },
            { label: 'cosy', selected: this.density === 'cosy', togglable: true },
            { label: 'compact', selected: this.density === 'compact', togglable: true }
        ];
    }
    DetailsPatients(myObj: any) {
        console.log(myObj);

        this.router.navigate(['medicalFollowUp' + '/' + myObj['_id']]);
    }
    refreshListPatient() {
        this.service.listMedicalfollowup().subscribe((response) => {
            this.medicalfollowup = response;
        });
    }

    AddPatient() {
        this.router.navigate(['patient']);
    }





    get filterContacts() {
        const fo = new IgxFilterOptions();
        fo.key = 'full_name';
        fo.inputValue = this.searchContact;
        return fo;
    }
    get filterContactsEmail() {
        const fo = new IgxFilterOptions();
        fo.key = 'email';
        fo.inputValue = this.searchContact;
        return fo;
    }
    get filterContactsphoneNumbre() {
        const fo = new IgxFilterOptions();
        fo.key = 'phoneNumber';
        fo.inputValue = this.searchContact;
        return fo;
    }
}

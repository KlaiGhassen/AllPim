import { MarkdownModule } from 'ngx-markdown';
import { Patient as Patient1 } from 'app/Models/Patient.model';
import { patientModule } from './../../patient/patient.module';
import { Subscription } from 'rxjs';
import { Patient } from './../../../entities/patient';
import { MedicalfollowupService } from '../Service/medicalfollowupService.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogContentExample } from 'app/modules/Dialog/dialog-content-example'
@Component({
    selector: 'app-allmdf',
    templateUrl: './allmdf.component.html',
    styleUrls: ['./allmdf.component.scss']
})
export class AllmdfComponent implements OnInit {
    @Output() data = new EventEmitter();
    datamdf: any;
    today: any = Date.now();
    medicalfollowup: any;
    medicalfollowupDetail: any;
    Patient: Patient1;
    patientId: any;
    date: any
    id: any;
    Details: any;
    searchInputControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public density = 'comfortable';
    public displayDensities;
    public searchContact: string;
    constructor(
        private service: MedicalfollowupService,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {


        this.Patient = new Patient1("", "", "","", null, null);
        this.route.paramMap.subscribe(params => { this.patientId = params.get('id'); });
        this.service.GetPatientById(this.patientId).toPromise().then((res: Patient1) => {
            this.Patient = res
        });

        this.route.paramMap.subscribe(params => { this.patientId = params.get('id'); });
        this.service.getMFUbyid(this.patientId).subscribe(
            //role de .subscribe
            (response) => {
                this.medicalfollowup = response["medicalfollowup"];
            }
        );

    }
    AddPatient() {
        this.router.navigate(['patient']);
    }
    details(id: string) {
        this.service.getMFUdetailsbyid(id).toPromise().then(
            (Response: any) => {
                if (Response != null) {
                    this.medicalfollowupDetail = Response["medicalfollowup"];
                    this.datamdf = this.medicalfollowupDetail;
                    this.dialog.open(DialogContentExample);
                    localStorage.setItem("mdf", JSON.stringify(this.medicalfollowupDetail));
                }
            }
        );
    }
}

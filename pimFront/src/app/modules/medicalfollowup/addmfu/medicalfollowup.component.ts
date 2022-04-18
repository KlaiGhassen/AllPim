import { Patient as Patient1 } from 'app/Models/Patient.model';
import { patientModule } from './../../patient/patient.module';
import { Subscription } from 'rxjs';
import { Patient } from './../../../entities/patient';
import { MedicalfollowupService } from '../Service/medicalfollowupService.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
    selector: 'app-medicalfollowup',
    templateUrl: './medicalfollowup.component.html',
    styleUrls: ['./medicalfollowup.component.scss'],
    //encapsulation: ViewEncapsulation.None
})

export class MedicalfollowupComponent implements OnInit {

    alertColor: string = "alert alert-danger";
    public patientId: any;
    public profilePicture: any;
    @Input('master') masterName ="test";
    @Input('master') full_name ="hello";
    public notes: any;
    public medical_analysis_interpretation: any;
    public chronic_diseases: any;
    public updatemedicalfollowup : any;
    //public full_name : any;
    x : Number;
    Patient: Patient1;
    Medicalfollowup: any;
    medicalfollowup: any;
    constructor(private service: MedicalfollowupService, private router: Router, private route: ActivatedRoute) { }
    ngOnInit(): void {
        this.Patient = new Patient1("","","","",null,null,);
        this.route.paramMap.subscribe(params => {this.patientId = params.get('id');});
        this.service.GetPatientById(this.patientId).toPromise().then((res:Patient1)=>{
            this.Patient=res
        });

        this.route.paramMap.subscribe(params => {this.full_name = params.get('full_name');});
        this.masterName=this.patientId;
        this.full_name=this.full_name;
        console.log(this.masterName);
        console.log(this.full_name);


    }



    addMedicalfollowup(myform: any) {
        this.service.createMedicalfollowup(myform,this.patientId).subscribe(
            response => {
                this.Medicalfollowup,
                //alert(this.Medicalfollowup);
                console.log(this.Medicalfollowup);

            this.router.navigate(['get']);
            }

        );
        console.log(this.Medicalfollowup.value);


    }
    DetailsPatients() {
        this.router.navigate(['get']);
      }
      DetailsMFU() {
        this.router.navigate(['allmdf']);
      }

      age(){
       this.x= -Date.now();
      }




}



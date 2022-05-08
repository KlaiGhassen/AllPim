import { Patient as Patient1 } from 'app/Models/Patient.model';
import { patientModule } from '../../patient/patient.module';
import { Subscription } from 'rxjs';
import { Patient } from '../../../entities/patient';
import { MedicalfollowupService } from '../Service/medicalfollowupService.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { User } from 'app/core/user/user.types';
import { GlobalService } from 'app/global.service';

@Component({
  selector: 'app-prescriptation',
  templateUrl: './prescriptation.component.html',
  styleUrls: ['./prescriptation.component.scss']
})
export class PrescriptationComponent implements OnInit {

  alertColor: string = "alert alert-danger";
  user: User;
  public patientId: any;
  public profilePicture: any;
  @Input('master') masterName = "test";
  @Input('master') fullname = "hello";
  public notes: any;
  public prescription: any;
  public chronic_diseases: any;
  public updatemedicalfollowup: any;
  public full_name: any;
  x: Number;
  Patient: Patient1;
  Prescription: any;
  medicalfollowup: any;
  constructor(private service: MedicalfollowupService, private router: Router, private route: ActivatedRoute,private gs:GlobalService,) { }
  ngOnInit(): void {
    this.user= this.gs.getUser();
    this.Patient = new Patient1("","","","", null, null);
    this.route.paramMap.subscribe(params => { this.patientId = params.get('id'); });
    this.service.GetPatientById(this.patientId).toPromise().then((res: Patient1) => {
      this.Patient = res
    });

    this.route.paramMap.subscribe(params => { this.fullname = params.get('fullname'); });
    this.masterName = this.patientId;
    console.log(this.masterName);


  }
  submit(addform) {

    //alert(addform.value.num + " " + addform.value.name + " " + addform.value.country);
    this.Prescription = {
      prescription: addform.value.prescription,


    }
    console.log(this.prescription);
    this.addPrescription(addform);

  }



  addPrescription(myform: any) {

    this.service.createPrescription(myform, this.patientId).subscribe(

    );
    console.log(this.Prescription);


  }
  DetailsPatients() {
    this.router.navigate(['get']);
  }
  DetailsMFU() {
    this.router.navigate(['allmdf']);
  }

  age() {
    this.x = -Date.now();
  }

onPrint(){
    window.print();
}


}

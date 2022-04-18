import { Patient as Patient1 } from 'app/Models/Patient.model';
import { Patient } from './../../entities/patient';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MedicalfollowupService } from '../medicalfollowup/Service/medicalfollowupService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {




    Medicalfollowup: any;
    patient: Patient1;
    Details: any;
    public email: any;
    public phoneNumber: any;
    public full_name: any;
    public Bday: any;
    //public gender: any;
gender: Gender[] = [
    {value: 'Male', viewValue: 'Male'},
    {value: 'Female', viewValue: 'Female'},
    
  ];
   selectedGender: string;
    constructor(private service: MedicalfollowupService, private router: Router, private formBuilder: FormBuilder) { }

    ngOnInit(): void {
    }
    submit(addform) {

        //alert(addform.value.num + " " + addform.value.name + " " + addform.value.country);
        this.patient = {
            full_name: addform.value.full_name,
            phoneNumber: addform.value.phoneNumber,
            email:addform.value.email,
            Bday:addform.value.Bday,
            profilePicture:addform.value.profilePicture,
            gender:addform.value.gender,
            _id:addform.value._id,
            deserialize:addform.value._id,

        }
    }


    AddPatient(myform: any) {
        this.service.AddPatient(myform).subscribe(
            response => {
                this.Medicalfollowup,
                    alert("added successfully");
                  //  this.router.navigate(['get']);
                console.log(this.Medicalfollowup.Bday);

            }

        );


    }



}
interface Gender {
  value: string;
  viewValue: string;
}

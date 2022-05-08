import { Patient as Patient1 } from 'app/Models/Patient.model';
import { Patient } from './../../entities/patient';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MedicalfollowupService } from '../medicalfollowup/Service/medicalfollowupService.service';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormGroupDirective,
    NgForm,
} from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.scss'],
})
export class PatientComponent implements OnInit {
    TestForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        birth: new FormControl('', [Validators.required]),
        gender: new FormControl('', Validators.required),
        phone: new FormControl('', [Validators.required,Validators.pattern("[0-9]{8}")]),
        email: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),
    });
    Medicalfollowup: any;
    patient: Patient1;
    Details: any;
    public email: any;
    public phoneNumber: any;
    public full_name: any;
    public Bday: any;
    //public gender: any;
    GenderControl = new FormControl('', Validators.required);
    selectFormControl = new FormControl('', Validators.required);
    gender: Gender[] = [
        { value: 'Male', viewValue: 'Male' },
        { value: 'Female', viewValue: 'Female' },
    ];
    selectedGender: string;
    constructor(
        private service: MedicalfollowupService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {}
    submit() {
        if(this.TestForm.valid){
            this.patient = {
                full_name: this.TestForm.value.name,
                phoneNumber: this.TestForm.value.phone,
                email: this.TestForm.value.email,
                Bday: this.TestForm.value.birth,
                profilePicture: this.TestForm.value.profilePicture,
                gender: this.TestForm.value.gender,
                _id: this.TestForm.value._id,
                deserialize: this.TestForm.value._id,
            };
            this.service.AddPatient2(this.patient).subscribe((response) => {
                this.Medicalfollowup, alert('added successfully');
                this.router.navigate(['get']);
            },
            (error: HttpErrorResponse) => {
                if(error.status==400){
                    alert("email already exists")
                }else{
                    alert(error.status)
                }
            });
        }else{
alert("please fill all the fields")
        }
    }
    AddPatient(myform: any) {
        ///////////////////////////////////////
        if (
            myform.Bday == undefined ||
            myform.full_name == undefined ||
            myform.email == undefined ||
            myform.gender == undefined ||
            myform.phoneNumber == undefined
        ) {
            alert(myform.value.full_name);
        } else {
            this.service.AddPatient(myform).subscribe((response) => {
                this.Medicalfollowup, alert('added successfully');
                this.router.navigate(['get']);
                console.log(this.patient.Bday);
            });
        }
        ///////////////////////////
    }
    matcher = new MyErrorStateMatcher();
    getErrorMessage() {
        return 'You must enter a value';
    }
}
interface Gender {
    value: string;
    viewValue: string;
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        const isSubmitted = form && form.submitted;
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched || isSubmitted)
        );
    }
}

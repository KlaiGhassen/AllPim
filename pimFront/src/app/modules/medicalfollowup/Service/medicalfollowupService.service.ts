import { Patient as Patient1 } from 'app/Models/Patient.model';
import { Data } from '@angular/router';
import { Patient } from './../../../entities/patient';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { GlobalService } from 'app/global.service';
@Injectable({
  providedIn: 'root'
})
export class MedicalfollowupService {
  returnVal: any;
  // urlMedicalfollowup :'http://localhost:3000/', //url mode dev
  // urlMedicalfollowupupdate :'http://localhost:3000/medicalFollowUp', //url mode dev
  // urlGetPatient :'http://localhost:3000/patient' //url mode dev
  //  urlPrescription: 'http://localhost:3000/Prescription'


  Patient: any;
  Prescription: any;
  urlMedicalfollowupupdate = environment.urlMedicalfollowupupdate;
  urlMedicalfollowup = environment.urlMedicalfollowup;
  urlGetPatient = environment.urlGetPatient;
  urlPrescription = environment.urlPrescription;

  Medicalfollowup: any;
  constructor(private Http: HttpClient) { }
  listMedicalfollowup() {
    return this.Http.get(this.urlGetPatient);
   // return this.Http.get(this.urlMedicalfollowup + 'patient');
  }

  headers = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };


  createMedicalfollowup(myform: any, patientId: any) {
    this.Medicalfollowup = {
      'patientId': patientId,
      'notes': myform.value.notes,
      'medical_analysis_interpretation': myform.value.medical_analysis_interpretation,
      'chronic_diseases': myform.value.chronic_diseases
    }
    return this.Http.post(this.urlMedicalfollowupupdate, this.Medicalfollowup);
  }

  updatemedicalfu(myObj: any) {
    return this.Http.put(this.urlGetPatient + '/' + '/' + myObj['patientId'], myObj);
  }
  getpatientbiid(patentId: any) {
    return this.Http.get(this.urlMedicalfollowupupdate + '/' + patentId)
  }
  DetailsPatients(myObj: any) {
    return this.Http.put(this.urlMedicalfollowupupdate + '/' + myObj['id'], myObj);
  }

  AddPatient(myform: any) {
    this.Patient = {
      'email': myform.value.email,
      'phoneNumber': myform.value.phoneNumber,
      'full_name': myform.value.full_name,
      'Bday': myform.value.Bday,
      'gender': myform.value.gender,
    }
    return this.Http.post(this.urlGetPatient, this.Patient);
  }
  AddPatient2(p: Patient1) {
    this.Patient = p
    return this.Http.post(this.urlGetPatient, this.Patient);
  }
  GetPatientById(patentId: any): Observable<Patient1> {
    return this.Http.get<Patient1>(this.urlGetPatient + "/patientById/" + patentId, this.headers).pipe()
  }

  getMFUbyid(patentId: any) {
    return this.Http.get(this.urlMedicalfollowupupdate + "/" + patentId)
  }
  getMFUdetailsbyid(Id: any) {
    return this.Http.get(this.urlMedicalfollowupupdate + "/detail/" + Id)
  }

  createPrescription(myform: any, patientId: any) {
    this.Prescription = {
      'patientId': patientId,
      'prescription': myform.value.prescription,
    }
    return this.Http.post(this.urlPrescription, this.Prescription);
  }





}


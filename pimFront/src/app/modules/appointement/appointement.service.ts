import { Injectable } from '@angular/core';
import { Appointement } from './appointement.model';
import { GlobalService } from 'app/global.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Moment } from 'moment';
import { parse } from 'crypto-js/enc-base64';

@Injectable({
  providedIn: 'root'
})
export class AppointementService {
  appointements : Appointement[]

 /**
     * Constructor
     */
  constructor(private _httpClient: HttpClient, private Gs:GlobalService)
  {
  }
      //import from database
      getFromDatabase(){
          return this._httpClient.get<any>(this.Gs.uri+'/appointement');
      }
    
      getAllAppointements(){
        return this.getFromDatabase().pipe(map((res:any)=>{
          return res;
        }));
      }

      confirmAppointement(id: string, bolbol: Boolean){
        var nstate: string;
        const tmpApp = this._httpClient.get(`${this.Gs.uri}/appointement/${id}`);
        const myObjStr = JSON.stringify(tmpApp);

        console.log('stringify', myObjStr);
        console.log(JSON.parse(myObjStr));
        var parsedApp = JSON.parse(myObjStr);
        
        console.log(parsedApp);
        console.log("confirmdoc ===== ", parsedApp.doctorConfirm);
        console.log("partient confirm ===== ", parsedApp.patientConfirm);

        if(parsedApp.patientConfirm == true && parsedApp.doctorConfirm == true) {
          nstate = "Confirmed";
          
          return this._httpClient.patch(`${this.Gs.uri}/appointement/${id}`,{doctorConfirm: bolbol, state: "Confirmed"});
        }
        else if ((parsedApp.patientConfirm == false && parsedApp.doctorConfirm == true) || (parsedApp.patientConfirm == true && parsedApp.doctorConfirm == false)){
          nstate = "Pending";
         
         return this._httpClient.patch(`${this.Gs.uri}/appointement/${id}`,{doctorConfirm: bolbol, state: "Pending"});
        }
        else if (parsedApp.patientConfirm == false && parsedApp.doctorConfirm == false){
          nstate = "Declined"
          
          return this._httpClient.patch(`${this.Gs.uri}/appointement/${id}`,{doctorConfirm: bolbol, state: "Declined"});
        }
        //console.log("el state ##################",nstate)
        return this._httpClient.patch(`${this.Gs.uri}/appointement/${id}`,{doctorConfirm: bolbol, state: "Declined"});
      }

      addAppointement(a: Appointement) {
        return this._httpClient.post(this.Gs.uri+'/appointement', a);
      }
      
    }

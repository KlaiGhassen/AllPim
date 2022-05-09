import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalService } from 'app/global.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
       private gs: GlobalService, )
    {
    }

getUsersOfDoc(){
    return this._httpClient.get(this.gs.uri+'/ophto/prderctionList:id')


}


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }
    downloadMedia(fileName: any): Observable<Blob> {
        return this._httpClient.get(
          ` ${this.gs.uri}/upload/download/` + fileName,
          {
            responseType: "blob",
          }
        );
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get(this.gs.uri+'/ophto/role').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

getPatients(){
    return this._httpClient.get(this.gs.uri+'/patient');


}
getPendingAppointments(){
    return this._httpClient.get(`${this.gs.uri}/appointement/app/pending`);
}
getConfirmedApp(){
    return this._httpClient.get(`${this.gs.uri}/appointement/app/confirmed`);
}
}

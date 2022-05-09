import { Injectable } from '@angular/core';
import { Transaction } from './pricing.model';
import { GlobalService } from 'app/global.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Moment } from 'moment';
import { parse } from 'crypto-js/enc-base64';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  transaction : Transaction[]

 /**
     * Constructor
     */
  constructor(private _httpClient: HttpClient, private Gs:GlobalService)
  {
  }
      //import from database
      getFromDatabase(){
          return this._httpClient.get<any>(this.Gs.uri+'/transaction');
      }
    
      getAllTransaction(){
        return this.getFromDatabase().pipe(map((res:any)=>{
          return res;
        }));
      }

      getAllTransactionsByDocId(id: String): Observable<Transaction[]>{
    return this._httpClient.get<Transaction[]>(`${this.Gs.uri}/transaction/byDocId/${id}`);

      }

      //if subscription expires (out of date range el state yetchagleb false)
      updateAllTransactions(){
                return this._httpClient.patch(`${this.Gs.uri}/transaction/updateAll`,{});
      }

      checkout(t: Transaction, periodP:String) {
        return this._httpClient.post(this.Gs.uri+'/transaction', {t,period: periodP});
      }
      
    }

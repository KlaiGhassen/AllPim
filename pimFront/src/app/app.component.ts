import { Component, OnInit } from '@angular/core';
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { TranslateService } from '@ngx-translate/core';
import { PricingService } from './modules/pricing/pricing.service';
import { NotificationsService } from './layout/common/notifications/notifications.service';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { GlobalService } from './global.service';


@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
  notification: Notification= {
    id: null,
_id:null,
icon: null,
image: null,
title: null,
description: null,
time: '',
link: null,
useRouter: null,
read: false,
docId: null,
patientId: null
};

  
    /**
     * Constructor
     */
 
    title = 'af-notification';
    message:any = null;
    constructor(private _pricingService:PricingService, private _notifservice: NotificationsService, private gs: GlobalService,) {
    

    }
    ngOnInit(): void {
      this.requestPermission();
      this.listen();
      this._pricingService.updateAllTransactions().subscribe(() => {
        console.log("aaaa");
        /* this.notification.description = "your subscription has expired ";
                 this.notification.icon = 'heroicons_solid:star';
                 this.notification.title = "subscription";
                 this.notification.time = Date();
                 this.notification.read = false;
                 this.notification.docId = "6240a1584a263be7668ff03f";
                 this.notification.patientId = "6240a1584a263be7668ff03f";
                 this.notification.useRouter = true;
                 this.notification.link = '/pricing';
                
                 this._notifservice.create(this.notification).subscribe((res) => {
                     console.log(res);
                     
                     
                 });*/
      });
      
    }
    requestPermission() {
        const messaging = getMessaging();
        getToken(messaging, 
         { vapidKey: environment.firebase.vapidKey}).then(
           (currentToken) => {
             if (currentToken) {
               console.log("Hurraaa!!! we got the token.....");
               console.log(currentToken);
             } else {
               console.log('No registration token available. Request permission to generate one.');
             }
         }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
      }
      listen() {
        const messaging = getMessaging();
        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload);
          this.message=payload;
        });
      }
      
}

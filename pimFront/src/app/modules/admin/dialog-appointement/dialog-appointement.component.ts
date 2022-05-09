import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GlobalService } from 'app/global.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { CalendarService } from 'app/modules/calendar/calendar.service';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { CalendarEvent } from 'app/modules/calendar/calendar.types';
import { FuseAlertType } from '@fuse/components/alert';


export interface DialogData {
  docId: string;
  place: string;
  brag: Date
}

@Component({
  selector: 'app-dialog-appointement',
  templateUrl: './dialog-appointement.component.html',
  styleUrls: ['./dialog-appointement.component.scss']
})
export class DialogAppointementComponent  {
  newEvent;

    notification: Notification = {
        id: null,
        _id: null,
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

    alert: { type: FuseAlertType; message: string } = {
      type: 'error',
      message: 'Choose a valid date',
  };
  showAlert: boolean = false;

   
  brag;
  constructor(
    public dialogRef: MatDialogRef<DialogAppointementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private gs: GlobalService,
    private _calendarService: CalendarService,
    private _notifservice: NotificationsService
  ) {}
  

  onNoClick(): void {
    this.dialogRef.close();
  }

   formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
 parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}


  addEvent(docId: string, place:string,dd) {
       
    var now = new Date();
    // Get the clone of the event form value
    let newEvent = new CalendarEvent( this.gs.getUser().full_name + now,'1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc', this.gs.getUser()._id, this.gs.getUser().full_name, docId , true, false, 'Pending', dd, place);
    console.log("evvvvvvvvvvvvvvvvv::::::",newEvent.date)
    console.log("dd::::", this.parseDate(dd).getTime())
    console.log("now:::",this.formatDate(now))
    if(this.parseDate(dd).getTime() < now.getTime()){
      
    this.showAlert = true;
    window.document.getElementById("skivipapa").hidden = false;
    } else {
      console.log("yeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeees")
    

    // Add the event
    this._calendarService.addEvent(newEvent).subscribe(() => {
            this.notification.description = `${this.gs.getUser().full_name} have submitted an appointement`;
            this.notification.icon = 'heroicons_solid:star';
            this.notification.title = "new Appointement";
            this.notification.time = Date();
            this.notification.read = false;
            //this.notification.docId = this.gs.getUser()._id;
            this.notification.docId = docId;
            this.notification.patientId = this.gs.getUser()._id;
            this.notification.useRouter = true;
            this.notification.link = '/calendar';

            this._notifservice.create(this.notification).subscribe((res) => {
                console.log(res);
                //this.notification_component.ngOnInit();
                
            });
            //this.ngOnInit();
        
  
  });
}
}

}

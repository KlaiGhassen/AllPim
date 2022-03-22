import { Component, OnInit } from '@angular/core';
import { AppointementService } from './appointement.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Appointement } from './appointement.model';
import { SharedModule } from 'app/shared/shared.module';


@Component({
  selector: 'table-expandable-rows-example',
  templateUrl: './appointement.component.html',
  styleUrls: ['./appointement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [AppointementService]
})
export class AppointementComponent implements OnInit {
  constructor(private appointementService: AppointementService) { }
  dataSource
  columnsToDisplay = ['date', 'place', 'patientId','state'];
  appointement: Appointement;

  ngOnInit(): void {
    this.dataSource = this.appointementService.getFromDatabase();
    
    
    //throw new Error('Method not implemented.');
  }

  onPatchAppointement(id: string, bolbol: Boolean, state: string): void {
    this.appointementService.confirmAppointement(id, bolbol).subscribe(
      (response) => {
        
        this.ngOnInit();
      }
      
    );
  }
  onSaveAppointement(d: Date): void {
    
    var patientId = "11111111";
    var docId = "2222222";
    var patientConfirm = true;
    var doctorConfirm = false ;
    var id = "33333";
    var date = d;
    var state = "Pending";
    var place = "Menzah";
    var a = new Appointement(id, patientId, docId, patientConfirm,doctorConfirm,state, date,place);

    this.appointementService.addAppointement(a).subscribe(
      (response) => {
        this.ngOnInit();
      }
      
    );
    console.log("saved");
  }

  expandedElement: PeriodicElement | null;
  /*dataSource : any;
  columnsToDisplay = ['date', 'place', 'patient', 'state'];
  
  constructor(private appointementService: AppointementService) { }

  ngOnInit(): void {
  }
  
  getAllAppointements(){
    this.appointementService.getAllAppointements().subscribe(res => {
        this.dataSource = res;
    })
  }
  */
 
}

export interface PeriodicElement {
    _id: string;
    id: string;
    patientId: string; 
    docId: string ; 
    patientConfirm: Boolean; 
    doctorConfirm: Boolean; 
    state: string; 
    date: string; 
    place: string; 
}




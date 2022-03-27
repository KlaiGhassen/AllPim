import { Component, OnInit } from '@angular/core';
import { AppointementService } from './appointement.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Appointement } from './appointement.model';
import { SharedModule } from 'app/shared/shared.module';
import { GlobalService } from 'app/global.service';
import { Timestamp } from 'rxjs/internal/operators/timestamp';



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
  constructor(private appointementService: AppointementService, private gs: GlobalService) { }
  dataSource;
  
  columnsToDisplay = ['date', 'place', 'patientId','state'];
  appointement: Appointement;

  ngOnInit(): void {
    this.dataSource = this.appointementService.getFromDatabase().subscribe(val => { this.dataSource = val; console.log(val)});
    //console.log(this.testDateInstance());
    
    
    
    //throw new Error('Method not implemented.');
  }

  testDateInstance(myVar) {
    //console.log("test time ::::::::: ",this.dataSource.subscribe(val => console.log(val[0].date)));
    return (this.dataSource.subscribe(val => console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",typeof(myVar) ) ) )
  }

  onPatchAppointement(id: string, bolbol: Boolean, state: string) {
    this.appointementService.confirmAppointement(id, bolbol).subscribe(
      (response) => {
        
        this.ngOnInit();
      }
      
    );
  }

  

  onSaveAppointement(d: Date): void {
    
    var patientId = "11111111";
    var docId = this.gs.getUser()._id;
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
    date: Date; 
    place: string; 
}




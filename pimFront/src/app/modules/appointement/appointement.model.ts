export class Appointement {
    _id: string;
    id: string;
    patientId: string; 
    docId: string ; 
    patientConfirm: Boolean; 
    doctorConfirm: Boolean; 
    state: string; 
    date: Date; 
    place: string; 

    constructor(id: string, patientId: string, docId: string , patientConfirm: Boolean, doctorConfirm: Boolean, state: string, date: Date, place: string,){
this.patientId = patientId
this.docId = docId;
this.patientConfirm = patientConfirm;
this.doctorConfirm = doctorConfirm;
this.id = id;
this.date = date ;
this.state =state;
this.place =place;

    }
}

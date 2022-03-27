export interface Calendar
{
    id: string;
    title: string;
    color: string;
    visible: boolean;
}

export type CalendarDrawerMode = 'over' | 'side';

export class CalendarEvent
{
    id: string;
    calendarId: string;
    _id: string;
    patientId: string; 
    title: string;
    docId: string ; 
    patientConfirm: Boolean; 
    doctorConfirm: Boolean; 
    state: string; 
    date: Date; 
    place: string; 
    
    constructor(id: string,calendarId: string, patientId: string, title: string, docId: string , patientConfirm: Boolean, doctorConfirm: Boolean, state: string, date: Date, place: string,){
        this.patientId = patientId
        this.calendarId =calendarId;
        this.title = title;
        this.docId = docId;
        this.patientConfirm = patientConfirm;
        this.doctorConfirm = doctorConfirm;
        this.id = id;
        this.date = date ;
        this.state =state;
        this.place =place;
    }
   
}
/*
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
*/

export interface CalendarEventException
{
    id: string;
    eventId: string;
    exdate: string;
}

export type CalendarEventPanelMode = 'view' | 'add' | 'edit';
export type CalendarEventEditMode = 'single' | 'future' | 'all';

export interface CalendarSettings
{
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'll';
    timeFormat: '12' | '24';
    startWeekOn: 6 | 0 | 1;
}

export interface CalendarWeekday
{
    abbr: string;
    label: string;
    value: string;
}

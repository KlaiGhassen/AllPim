
export interface Calendar
{
    id: string;
    title: string;
    color: string;
    visible: boolean;
}

export type CalendarDrawerMode = 'over' | 'side';

export interface CalendarEvent
{
    
    
    id: string;
    patientId: string; // calendarId
    calendarId: string;
    docId: string ; // recurringEventId
    patientConfirm: Boolean; // allDay: boolean;
    doctorConfirm: Boolean; // isFirstInstance 
    state: string; // recurrence
    date: string; // start
    place: string; // title
    description: string;
}

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
/*
export interface Calendar
{
    id: string;
    title: string;
    color: string;
    visible: boolean;
}

export type CalendarDrawerMode = 'over' | 'side';

export interface CalendarEvent
{
    id: string;
    patientId: string;
    docId: string ;
    patientConfirm: Boolean;
    doctorConfirm: Boolean;
    state: String;
    date: string;
    place: String;
}

/*
    id: string;
    calendarId: string;
    recurringEventId: string | null;
    isFirstInstance: boolean;
    title: string;
    description: string;
    start: string | null;
    end: string | null;
    allDay: boolean;
    recurrence: string;

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
*/
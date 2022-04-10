import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar as FullCalendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import rrulePlugin from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';
import { clone, cloneDeep, isEqual, omit } from 'lodash-es';
import * as moment from 'moment';
import { RRule } from 'rrule';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CalendarRecurrenceComponent } from 'app/modules/calendar/recurrence/recurrence.component';
import { CalendarService } from 'app/modules/calendar/calendar.service';
import { Calendar, CalendarDrawerMode, CalendarEvent, CalendarEventEditMode, CalendarEventPanelMode, CalendarSettings } from 'app/modules/calendar/calendar.types';
import { GlobalService } from 'app/global.service';
import { HttpClient } from '@angular/common/http';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';


@Component({
    selector       : 'calendar',
    templateUrl    : './calendar.component.html',
    styleUrls      : ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation  : ViewEncapsulation.None
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('eventPanel') private _eventPanel: TemplateRef<any>;
    @ViewChild('fullCalendar') private _fullCalendar: FullCalendarComponent;
    @ViewChild('drawer') private _drawer: MatDrawer;
    notification_component: NotificationsComponent;
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
    durationInSeconds = 5;
    minimumDate;
    calendars: Calendar[];
    calendarPlugins: any[] = [dayGridPlugin, interactionPlugin, listPlugin, momentPlugin, rrulePlugin, timeGridPlugin];
    drawerMode: CalendarDrawerMode = 'side';
    drawerOpened: boolean = true;
    event: CalendarEvent;
    eventEditMode: CalendarEventEditMode = 'single';
    eventForm: FormGroup;
    eventFormByDoc: FormGroup;
    eventTimeFormat: any;
    events: CalendarEvent[] = [];
    panelMode: CalendarEventPanelMode = 'view';
    settings: CalendarSettings;
    view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listYear' = 'dayGridMonth';
    views: any;
    viewTitle: string;
    private _eventPanelOverlayRef: OverlayRef;
    private _fullCalendarApi: FullCalendar;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _calendarService: CalendarService,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: Document,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _overlay: Overlay,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _viewContainerRef: ViewContainerRef,
        private gs: GlobalService,
        private _httpClient: HttpClient,
        private _notifservice: NotificationsService,
        private _snackBar: MatSnackBar
    ) {
    }

    openSnackBar() {
        this._snackBar.openFromComponent(CalendarComponent, {
          duration: this.durationInSeconds * 1000,
        });
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for event's recurrence status
     */
    get recurrenceStatus(): string {
        // Get the recurrence from event form
        const recurrence = this.eventForm.get('recurrence').value;

        // Return null, if there is no recurrence on the event
        if (!recurrence) {
            return null;
        }

        // Convert the recurrence rule to text
        let ruleText = RRule.fromString(recurrence).toText();
        ruleText = ruleText.charAt(0).toUpperCase() + ruleText.slice(1);

        // Return the rule text
        return ruleText;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the event form
        this.eventForm = this._formBuilder.group({
            id: ['23'],
            calendarId: [''],
            patientId: this.gs.getUser()._id,
            title: this.gs.getUser().full_name,
            docId: [''],
            date: [null],
            patientConfirm: [false],
            doctorConfirm: [true],
            state: ['Pending'],
            place: ['']
        });
        console.log("minnnnnnnnnnnnnnnnnnnnnnn:::::::", this.minimumDate)
        // var today = new Date();
        // var dd = today.getDate();
        // var mm = today.getMonth() + 1; //January is 0!
        // var yyyy = today.getFullYear();
        // if (dd < 10) {
        //     var ddd = '0' + dd
        // }
        // if (mm < 10) {
        //    var mmm = '0' + mm
        // }
        // var todayy = yyyy + '-' + mm + '-' + dd;
        // console.log(todayy)
        // console.log(todayy)
        // let tdd = moment(today,"YYYY-MM-DD")
        // let parsedDate = moment(todayy,"YYYY-MM-DD");
        // let outputDate = parsedDate.format("DD-MM-YYYY");
        // //this.minimumDate = todayy.form;
        // //window.document.getElementById("dateeee").setAttribute("min", todayy);

        //  window.document.getElementById("rtx").setAttribute("min",outputDate);

        // houni el form 7ajti bel getuser by name
        this.eventFormByDoc = this._formBuilder.group({
            id: ['23'],
            calendarId: [''],
            patientId: this.gs.getUser()._id,
            title: this.gs.getUser().full_name,
            docId: [''],
            date: [null],
            patientConfirm: [false],
            doctorConfirm: [true],
            state: ['Pending'],
            place: ['']
        });

        // Get calendars
        this._calendarService.calendars$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((calendars) => {

                // Store the calendars
                this.calendars = calendars;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get events
        this._calendarService.getFromDatabase()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {

                this.events = cloneDeep(res);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get settings
        this._calendarService.settings$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {

                // Store the settings
                this.settings = settings;

                // Set the FullCalendar event time format based on the time format setting
                this.eventTimeFormat = {
                    hour: settings.timeFormat === '12' ? 'numeric' : '2-digit',
                    hour12: settings.timeFormat === '12',
                    minute: '2-digit',
                    meridiem: settings.timeFormat === '12' ? 'short' : false
                };

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode and drawerOpened if the given breakpoint is active
                if (matchingAliases.includes('md')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Build the view specific FullCalendar options
        this.views = {
            dayGridMonth: {
                eventLimit: 3,
                eventTimeFormat: this.eventTimeFormat,
                fixedWeekCount: false
            },
            timeGrid: {
                allDayText: '',
                columnHeaderFormat: {
                    weekday: 'short',
                    day: 'numeric',
                    omitCommas: true
                },
                columnHeaderHtml: (date): string => `<span class="fc-weekday">${moment(date).format('ddd')}</span>
                                                       <span class="fc-date">${moment(date).format('D')}</span>`,
                slotDuration: '01:00:00',
                slotLabelFormat: this.eventTimeFormat
            },
            timeGridWeek: {},
            timeGridDay: {},
            listYear: {
                allDayText: 'All day',
                eventTimeFormat: this.eventTimeFormat,
                listDayFormat: false,
                listDayAltFormat: false
            }
        };
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Get the full calendar API
        this._fullCalendarApi = this._fullCalendar.getApi();

        // Get the current view's title
        this.viewTitle = this._fullCalendarApi.view.title;

        // Get the view's current start and end dates, add/subtract
        // 60 days to create a ~150 days period to fetch the data for
        const viewStart = moment(this._fullCalendarApi.view.currentStart).subtract(60, 'days');
        const viewEnd = moment(this._fullCalendarApi.view.currentEnd).add(60, 'days');

        // Get events
        this._calendarService.getEvents(viewStart, viewEnd, true).subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._eventPanelOverlayRef) {
            this._eventPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle Drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._drawer.toggle();
    }

    /**
     * Open recurrence panel
     */
    openRecurrenceDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(CalendarRecurrenceComponent, {
            panelClass: 'calendar-event-recurrence-dialog',
            data: {
                event: this.eventForm.value
            }
        });

        // After dialog closed
        dialogRef.afterClosed().subscribe((result) => {

            // Return if canceled
            if (!result || !result.recurrence) {
                return;
            }



            // If returned value is 'cleared'...
            if (result.recurrence === 'cleared') {
                // Clear the recurrence field if recurrence cleared
                this.eventForm.get('recurrence').setValue(null);
            }
            // Otherwise...
            else {
                // Update the recurrence field with the result
                this.eventForm.get('recurrence').setValue(result.recurrence);
            }
        });
    }

    /**
     * Change the event panel mode between view and edit
     * mode while setting the event edit mode
     *
     * @param panelMode
     * @param eventEditMode
     */
    changeEventPanelMode(panelMode: CalendarEventPanelMode, eventEditMode: CalendarEventEditMode = 'single'): void {
        // Set the panel mode
        this.panelMode = panelMode;

        // Set the event edit mode
        this.eventEditMode = eventEditMode;


    }

    /**
     * Get calendar by id
     *
     * @param id
     */
    getCalendar(id): Calendar {
        if (!id) {
            return;
        }

        return this.calendars.find(calendar => calendar.id === id);
    }

    /**
     * Change the calendar view
     *
     * @param view
     */
    changeView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listYear'): void {
        // Store the view
        this.view = view;

        // If the FullCalendar API is available...
        if (this._fullCalendarApi) {
            // Set the view
            this._fullCalendarApi.changeView(view);

            // Update the view title
            this.viewTitle = this._fullCalendarApi.view.title;
        }
    }

    /**
     * Moves the calendar one stop back
     */
    previous(): void {
        // Go to previous stop
        this._fullCalendarApi.prev();

        // Update the view title
        this.viewTitle = this._fullCalendarApi.view.title;

        // Get the view's current start date
        const start = moment(this._fullCalendarApi.view.currentStart);

        // Prefetch past events
        this._calendarService.prefetchPastEvents(start).subscribe();
    }

    /**
     * Moves the calendar to the current date
     */
    today(): void {
        // Go to today
        this._fullCalendarApi.today();

        // Update the view title
        this.viewTitle = this._fullCalendarApi.view.title;
    }

    /**
     * Moves the calendar one stop forward
     */
    next(): void {
        // Go to next stop
        this._fullCalendarApi.next();

        // Update the view title
        this.viewTitle = this._fullCalendarApi.view.title;

        // Get the view's current end date
        const end = moment(this._fullCalendarApi.view.currentEnd);

        // Prefetch future events
        this._calendarService.prefetchFutureEvents(end).subscribe();
    }

    /**
     * On date click
     *
     * @param calendarEvent
     */
    onDateClick(calendarEvent): void {
        var now = new Date().getTime();
        //var dd = String(today.getDate()).padStart(2, '0');
        // Prepare the event
        const event = {
            _id: null,
            id: this.gs.getUser().full_name + now,
            calendarId: '1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc',
            patientId: this.gs.getUser()._id,
            //docId: this.gs.getUser()._id,
            docId: "6240a1584a263be7668ff03f",
            title: this.gs.getUser().full_name,
            date: null,
            state: 'Pending',
            doctorConfirm: true,
            patientConfirm: false,
            place: 'Menzah',

        };

        // Set the event
        this.event = event;

        // Set the el on calendarEvent for consistency
        calendarEvent.el = calendarEvent.dayEl;
        // console.log("test1::",calendarEvent.el);

        // Reset the form and fill the event
        this.eventForm.reset();
        this.eventForm.patchValue(event);

        // Open the event panel
        this._openEventPanel(calendarEvent);

        // Change the event panel mode
        this.changeEventPanelMode('add');
    }

    /**
     * On event click
     *
     * @param calendarEvent
     */
    onEventClick(calendarEvent): void {

        // Find the event with the clicked event's id
        const event: any = cloneDeep(this.events.find(item => item.id === calendarEvent.event.id));

        console.log("clickedddddddddddd:    ", event.id)
        // Set the event
        this.event = event;

        // Prepare the end value
        let end;

        // If this is a recurring event...

        // Otherwise...


        // Set the range on the event


        // Reset the form and fill the event
        this.eventForm.reset();
        this.eventForm.patchValue(event);

        // Open the event panel
        this._openEventPanel(calendarEvent);
    }

    /**
     * On event render
     *
     * @param calendarEvent
     */
    onEventRender(calendarEvent): void {
        // Get event's calendar
        const calendar = this.calendars.find(item => item.id === calendarEvent.event.extendedProps.calendarId);

        // Return if the calendar doesn't exist...
        if (!calendar) {
            return;
        }

        // If current view is year list...
        if (this.view === 'listYear') {
            // Create a new 'fc-list-item-date' node
            const fcListItemDate1 = `<td class="fc-list-item-date">
                                            <span>
                                                <span>${moment(calendarEvent.event.start).format('D')}</span>
                                                <span>${moment(calendarEvent.event.start).format('MMM')}, ${moment(calendarEvent.event.start).format('ddd')}</span>
                                            </span>
                                        </td>`;

            // Insert the 'fc-list-item-date' into the calendar event element
            calendarEvent.el.insertAdjacentHTML('afterbegin', fcListItemDate1);

            // Set the color class of the event dot
            calendarEvent.el.getElementsByClassName('fc-event-dot')[0].classList.add(calendar.color);

            // Set the event's title to '(No title)' if event title is not available
            if (!calendarEvent.event.title) {
                calendarEvent.el.querySelector('.fc-list-item-title').innerText = '(No title)';
            }
        }
        // If current view is not month list...
        else {
            // Set the color class of the event
            calendarEvent.el.classList.add(calendar.color);

            // Set the event's title to '(No title)' if event title is not available
            if (!calendarEvent.event.title) {
                calendarEvent.el.querySelector('.fc-title').innerText = '(No title)';
            }
        }

        // Set the event's visibility
        calendarEvent.el.style.display = calendar.visible ? 'flex' : 'none';
    }

    /**
     * On calendar updated
     *
     * @param calendar
     */
    onCalendarUpdated(calendar): void {
        // Re-render the events
        this._fullCalendarApi.rerenderEvents();
    }

    /**
     * Add event
     */
    addEvent(): void {
        // Get the clone of the event form value
        let newEvent = clone(this.eventForm.value);





        // Add the event
        this._calendarService.addEvent(newEvent).subscribe(() => {

            // Reload events
            this._calendarService.reloadEvents().subscribe(() => {
                this._closeEventPanel();
                this.ngOnInit();

                this.notification.description = `${this.gs.getUser().full_name} have submitted an appointement`;
                this.notification.icon = 'heroicons_solid:star';
                this.notification.title = "new Appointement";
                this.notification.time = Date();
                this.notification.read = false;
                //this.notification.docId = this.gs.getUser()._id;
                this.notification.docId = "6240a1584a263be7668ff03f";
                this.notification.patientId = this.gs.getUser()._id;
                this.notification.useRouter = true;
                this.notification.link = '/calendar';

                this._notifservice.create(this.notification).subscribe((res) => {
                    console.log(res);
                    this.notification_component.ngOnInit();
                    
                });
                //this.ngOnInit();
            });
            
            //this.openSnackBar()

            // Close the event panel

        });


    }

    /**
     * Update the event
     */
    updateEvent(): void {
        // Get the clone of the event form value
        let event = clone(this.eventForm.value);
        const {
            range,
            ...eventWithoutRange
        } = event;

        // Get the original event
        const originalEvent = this.events.find(item => item.id === event.id);

        // Return if there are no changes made to the event
        if (isEqual(eventWithoutRange, originalEvent)) {
            // Close the event panel
            this._closeEventPanel();

            // Return
            return;
        }

        //el update dyell el rojla 
        // If the event is a recurring event...
        if (event.recurrence && event.recurringEventId) {
            // Update the recurring event on the server
            this._calendarService.updateRecurringEvent(event, originalEvent, this.eventEditMode).subscribe(() => {

                // Reload events
                this._calendarService.reloadEvents().subscribe();

                // Close the event panel
                this._closeEventPanel();

            });

            // Return
            return;

        }

        // If the event is a non-recurring event...
        if (!event.recurrence && !event.recurringEventId) {
            // Update the event on the server
            this._calendarService.updateEvent(originalEvent._id, event).subscribe(() => {

                // Close the event panel
                this._closeEventPanel();
                this.ngOnInit();
            });

            // Return
            return;
        }

        // If the event was a non-recurring event but now it will be a recurring event...
        if (event.recurrence && !event.recurringEventId) {
            // Set the event duration
            event.duration = moment(event.range.end).diff(moment(event.range.start), 'minutes');

            // Omit unnecessary fields
            event = omit(event, ['range', 'recurringEventId']);

            // Update the event on the server
            this._calendarService.updateEvent(event.id, event).subscribe(() => {

                // Reload events
                this._calendarService.reloadEvents().subscribe();

                // Close the event panel
                this._closeEventPanel();
            });

            // Return
            return;
        }

        // If the event was a recurring event but now it will be a non-recurring event...
        if (!event.recurrence && event.recurringEventId) {
            // Set the end date
            event.end = moment(event.start).add(event.duration, 'minutes').toISOString();

            // Set the duration as null
            event.duration = null;

            // Update the recurring event on the server
            this._calendarService.updateRecurringEvent(event, originalEvent, this.eventEditMode).subscribe(() => {

                // Reload events
                this._calendarService.reloadEvents().subscribe();

                // Close the event panel
                this._closeEventPanel();
            });
        }

    }

    /**
     * Delete the given event
     *
     * @param event
     * @param mode
     */
    deleteEvent(event, mode: CalendarEventEditMode = 'single'): void {
        // If the event is a recurring event...
        if (event.recurrence) {
            // Delete the recurring event on the server
            this._calendarService.deleteRecurringEvent(event, mode).subscribe(() => {

                // Reload events
                this._calendarService.reloadEvents().subscribe();

                // Close the event panel
                this._closeEventPanel();
                this.ngOnInit();
            });
            this.ngOnInit();
        }
        // If the event is a non-recurring, normal event...
        else {
            // Update the event on the server
            this._calendarService.deleteEvent(event._id).subscribe(() => {

                // Close the event panel
                this._closeEventPanel();
                this.ngOnInit();
            });
            this.ngOnInit();
        }
        this.ngOnInit();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the event panel overlay
     *
     * @private
     */
    private _createEventPanelOverlay(positionStrategy): void {
        // Create the overlay
        this._eventPanelOverlayRef = this._overlay.create({
            panelClass: ['calendar-event-panel'],
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.reposition(),
            positionStrategy
        });

        // Detach the overlay from the portal on backdrop click
        this._eventPanelOverlayRef.backdropClick().subscribe(() => {
            this._closeEventPanel();
        });
    }

    /**
     * Open the event panel
     *
     * @private
     */
    private _openEventPanel(calendarEvent): void {
        const positionStrategy = this._overlay.position().flexibleConnectedTo(calendarEvent.el).withFlexibleDimensions(false).withPositions([
            {
                originX: 'end',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
                offsetX: 8
            },
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'end',
                overlayY: 'top',
                offsetX: -8
            },
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'bottom',
                offsetX: -8
            },
            {
                originX: 'end',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'bottom',
                offsetX: 8
            }
        ]);

        // Create the overlay if it doesn't exist
        if (!this._eventPanelOverlayRef) {
            this._createEventPanelOverlay(positionStrategy);
        }
        // Otherwise, just update the position
        else {
            this._eventPanelOverlayRef.updatePositionStrategy(positionStrategy);
        }

        // Attach the portal to the overlay
        this._eventPanelOverlayRef.attach(new TemplatePortal(this._eventPanel, this._viewContainerRef));

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Close the event panel
     *
     * @private
     */
    private _closeEventPanel(): void {
        // Detach the overlay from the portal
        this._eventPanelOverlayRef.detach();

        // Reset the panel and event edit modes
        this.panelMode = 'view';
        this.eventEditMode = 'single';

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the recurrence rule based on the event if needed
     *
     * @private
     */
    private _updateRecurrenceRule(): void {
        // Get the event
        const event = this.eventForm.value;

        // Return if this is a non-recurring event
        if (!event.recurrence) {
            return;
        }

        // Parse the recurrence rule
        const parsedRules = {};
        event.recurrence.split(';').forEach((rule) => {

            // Split the rule
            const parsedRule = rule.split('=');

            // Add the rule to the parsed rules
            parsedRules[parsedRule[0]] = parsedRule[1];
        });

        // If there is a BYDAY rule, split that as well
        if (parsedRules['BYDAY']) {
            parsedRules['BYDAY'] = parsedRules['BYDAY'].split(',');
        }

        // Do not update the recurrence rule if ...
        // ... the frequency is DAILY,
        // ... the frequency is WEEKLY and BYDAY has multiple values,
        // ... the frequency is MONTHLY and there isn't a BYDAY rule,
        // ... the frequency is YEARLY,
        if (parsedRules['FREQ'] === 'DAILY' ||
            (parsedRules['FREQ'] === 'WEEKLY' && parsedRules['BYDAY'].length > 1) ||
            (parsedRules['FREQ'] === 'MONTHLY' && !parsedRules['BYDAY']) ||
            parsedRules['FREQ'] === 'YEARLY') {
            return;
        }

        // If the frequency is WEEKLY, update the BYDAY value with the new one
        if (parsedRules['FREQ'] === 'WEEKLY') {
            parsedRules['BYDAY'] = [moment(event.start).format('dd').toUpperCase()];
        }

        // If the frequency is MONTHLY, update the BYDAY value with the new one
        if (parsedRules['FREQ'] === 'MONTHLY') {
            // Calculate the weekday
            const weekday = moment(event.start).format('dd').toUpperCase();

            // Calculate the nthWeekday
            let nthWeekdayNo = 1;
            while (moment(event.start).isSame(moment(event.start).subtract(nthWeekdayNo, 'week'), 'month')) {
                nthWeekdayNo++;
            }

            // Set the BYDAY
            parsedRules['BYDAY'] = [nthWeekdayNo + weekday];
        }

        // Generate the rule string from the parsed rules
        const rules = [];
        Object.keys(parsedRules).forEach((key) => {
            rules.push(key + '=' + (Array.isArray(parsedRules[key]) ? parsedRules[key].join(',') : parsedRules[key]));
        });
        const rrule = rules.join(';');

        // Update the recurrence rule
        this.eventForm.get('recurrence').setValue(rrule);
    }

    /**
     * Update the end value based on the recurrence and duration
     *
     * @private
     */
    private _updateEndValue(): void {
        // Get the event recurrence
        const recurrence = this.eventForm.get('recurrence').value;

        // Return if this is a non-recurring event
        if (!recurrence) {
            return;
        }

        // Parse the recurrence rule
        const parsedRules = {};
        recurrence.split(';').forEach((rule) => {

            // Split the rule
            const parsedRule = rule.split('=');

            // Add the rule to the parsed rules
            parsedRules[parsedRule[0]] = parsedRule[1];
        });

        // If there is an UNTIL rule...
        if (parsedRules['UNTIL']) {
            // Use that to set the end date
            this.eventForm.get('end').setValue(parsedRules['UNTIL']);

            // Return
            return;
        }

        // If there is a COUNT rule...
        if (parsedRules['COUNT']) {
            // Generate the RRule string
            const rrule = 'DTSTART=' + moment(this.eventForm.get('start').value).utc().format('YYYYMMDD[T]HHmmss[Z]') + '\nRRULE:' + recurrence;

            // Use RRule string to generate dates
            const dates = RRule.fromString(rrule).all();

            // Get the last date from dates array and set that as the end date
            this.eventForm.get('end').setValue(moment(dates[dates.length - 1]).toISOString());

            // Return
            return;
        }

        // If there are no UNTIL or COUNT, set the end date to a fixed value
        this.eventForm.get('end').setValue(moment().year(9999).endOf('year').toISOString());
    }

    confirmDoctor(id: string, bolbol: Boolean) {
        if (this.gs.getUser().role == "ophto") {
            return this._httpClient.patch(`${this.gs.uri}/appointement/${id}`, { doctorConfirm: bolbol, state: "Confirmed", calendarId: "5dab5f7b-757a-4467-ace1-305fe07b11fe" }).subscribe(
                (response) => {

                    this.ngOnInit();
                }
            );
        } else if (this.gs.getUser().role == "simple") {
            return this._httpClient.patch(`${this.gs.uri}/appointement/${id}`, { patientConfirm: bolbol, state: "Confirmed", calendarId: "5dab5f7b-757a-4467-ace1-305fe07b11fe" }).subscribe(
                (response) => {

                    this.ngOnInit();
                }
            );
        }
    }

    declineDoctor(id: string, bolbol: Boolean) {
        if (this.gs.getUser().role == "ophto") {
            return this._httpClient.patch(`${this.gs.uri}/appointement/${id}`, { doctorConfirm: bolbol, state: "Declined", calendarId: "09887870-f85a-40eb-8171-1b13d7a7f529" }).subscribe(
                (response) => {

                    this.ngOnInit();
                }
            );
        } else if (this.gs.getUser().role == "simple") {
            return this._httpClient.patch(`${this.gs.uri}/appointement/${id}`, { patientConfirm: bolbol, state: "Declined", calendarId: "09887870-f85a-40eb-8171-1b13d7a7f529" }).subscribe(
                (response) => {

                    this.ngOnInit();
                }
            );
        }
    }


}

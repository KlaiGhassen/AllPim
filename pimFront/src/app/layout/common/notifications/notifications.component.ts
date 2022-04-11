import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { environment } from "app/../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { cloneDeep } from 'lodash';
import { GlobalService } from 'app/global.service';


@Component({
    selector       : 'notifications',
    templateUrl    : './notifications.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    exportAs       : 'notifications'
})
export class NotificationsComponent implements OnInit, OnDestroy
{
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    title = 'af-notification';
    message:any = null;
    notifications: Notification[];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private gs: GlobalService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        if(this.gs.getUser().role == "ophto"){
            this._notificationsService.getAllByDoc(this.gs.getUser()._id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res)=>{
                
                this.notifications = cloneDeep(res);

                // Mark for check
                this._changeDetectorRef.markForCheck();
                this._calculateUnreadCount();
                this._changeDetectorRef.markForCheck();
            });

        } else if(this.gs.getUser().role == "simple"){
            this._notificationsService.getAllByPatient(this.gs.getUser()._id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res)=>{
                
                this.notifications = cloneDeep(res);

                // Mark for check
                this._changeDetectorRef.markForCheck();
                this._calculateUnreadCount();
                this._changeDetectorRef.markForCheck();
            });
        }
        

            // Calculate the unread count
           
            
        //this.requestPermission();
    // this.listen();
    //     // Subscribe to notification changes
    //     this._notificationsService.notifications$
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe((notifications: Notification[]) => {

    //             // Load the notifications
    //             this.notifications = notifications;

    //             // Calculate the unread count
    //             this._calculateUnreadCount();

    //             // Mark for check
    //             this._changeDetectorRef.markForCheck();
    //         });
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
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._overlayRef )
        {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openPanel(): void
    {
        // Return if the notifications panel or its origin is not defined
        if ( !this._notificationsPanel || !this._notificationsOrigin )
        {
            return;
        }

        // Create the overlay if it doesn't exist
        if ( !this._overlayRef )
        {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    /**
     * Close the messages panel
     */
    closePanel(): void
    {
        this._overlayRef.detach();
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void
    {
        // Mark all as read
        //this._notificationsService.markAllAsRead().subscribe();
        this.notifications.forEach((notification, index) => {
                        
            this._notificationsService.update(notification.id, notification).subscribe();
            this.ngOnInit();
        });
        
    }

    /**
     * Toggle read status of the given notification
     */
    toggleRead(notification: Notification): void
    {
        // Toggle the read status
        notification.read = !notification.read;

        // Update the notification
        this._notificationsService.update(notification.id, notification).subscribe();
    }

    /**
     * Delete the given notification
     */
    delete(notification: Notification): void
    {
        // Delete the notification
        this._notificationsService.delete(notification._id).subscribe(() => {
            
            this.ngOnInit();
        });
        this.ngOnInit();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void
    {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                                  .withLockedPosition(true)
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void
    {
        let count = 0;

        if ( this.notifications && this.notifications.length )
        {
            count = this.notifications.filter(notification => !notification.read).length;
        }

        this.unreadCount = count;
    }
}

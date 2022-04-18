import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'app/layout/common/messages/messages.types';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { ChatService } from 'app/modules/home/chat.service';

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    encapsulation: ViewEncapsulation.None,
    exportAs: 'messages',
})
export class MessagesComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('messagesOrigin') private _messagesOrigin: MatButton;
    @ViewChild('messagesPanel') private _messagesPanel: TemplateRef<any>;

    messages: Message[];
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    contacts: any[] = [];

    /**
     * Constructor
     */
    constructor(
        public chatService: ChatService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _messagesService: MessagesService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ) {}
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        setTimeout(() => {
            this.contacts.push({
                _id: '625416c20eb71fb79d9bec74',
                full_name: 'mahmoud ahmadi',
                email: 'yassine.zitoun@esprit.tn',
                password:
                    '598d9f717a601658e4f7ff1653c97addf3bfe74130be4a2e244ae53d9e21f420',
                phone_number: 25665232,
                profilePicture: 'image-1649678697408.jpeg',
                diploma: true,
                social: false,
                verified: true,
                description: 'description',
                role: 'ophto',
                createdAt: '2022-04-11T11:53:38.062Z',
                updatedAt: '2022-04-11T12:34:36.726Z',
                __v: 0,
                country: 'Manouba',
                unreaded: {
                    count: 0,
                },
                undelivred: {
                    count: 0,
                },
                messages: [],
                typings: [],
                messages_loading: false,
                messages_end: true,
                messages_page: 0,
            });
            console.log('Time Out chat service list  ', this.contacts);

            this._changeDetectorRef.markForCheck();
        }, 5000);
        // Subscribe to message changes
        this._messagesService.messages$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((messages: Message[]) => {
                // Load the messages
                this.messages = messages;

                // Calculate the unread count
                this._calculateUnreadCount();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log('changes ', changes);
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the messages panel
     */
    openPanel(): void {
        // Return if the messages panel or its origin is not defined
        if (!this._messagesPanel || !this._messagesOrigin) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(
            new TemplatePortal(this._messagesPanel, this._viewContainerRef)
        );
    }

    /**
     * Close the messages panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Mark all messages as read
     */
    markAllAsRead(): void {
        // Mark all as read
        this._messagesService.markAllAsRead().subscribe();
    }

    /**
     * Toggle read status of the given message
     */
    toggleRead(message: Message): void {
        // Toggle the read status
        message.read = !message.read;

        // Update the message
        this._messagesService.update(message.id, message).subscribe();
    }

    /**
     * Delete the given message
     */
    delete(message: Message): void {
        // Delete the message
        this._messagesService.delete(message.id).subscribe();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(
                    this._messagesOrigin._elementRef.nativeElement
                )
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
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
    private _calculateUnreadCount(): void {
        let count = 0;

        if (this.messages && this.messages.length) {
            count = this.messages.filter((message) => !message.read).length;
        }
    }
}

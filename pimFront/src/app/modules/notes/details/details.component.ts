import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Note } from '../notes.types';
import { NotesService } from '../notes.service';
import { GlobalService } from 'app/global.service';
import { NgZone } from '@angular/core';

declare const annyang: any;

@Component({
    selector       : 'notes-details',
    templateUrl    : './details.component.html',
})
export class NotesDetailsComponent implements OnInit, OnDestroy
{
    voiceActiveSectionDisabled: boolean = true;
	voiceActiveSectionError: boolean = false;
	voiceActiveSectionSuccess: boolean = false;
	voiceActiveSectionListening: boolean = false;
	voiceText: any;
    note$: Observable<Note>;

    noteChanged: Subject<Note> = new Subject<Note>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { note: Note },
        private _notesService: NotesService,
        private _matDialogRef: MatDialogRef<NotesDetailsComponent>,
        private gs: GlobalService,
        private ngZone: NgZone
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------


    
initializeVoiceRecognitionCallback(): void {
		annyang.addCallback('error', (err: { error: string; }) => {
      if(err.error === 'network'){
        this.voiceText = "Internet is require";
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      } else if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('soundstart', () => {
      this.ngZone.run(() => this.voiceActiveSectionListening = true);
		});

		annyang.addCallback('end', () => {
      if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('result', (userSaid: any[]) => {
			this.ngZone.run(() => this.voiceActiveSectionError = false);

			let queryText: any = userSaid[0];

			annyang.abort();

      this.voiceText = queryText;

      var txt = <HTMLInputElement>window.document.getElementById("wiw");
    txt.value = this.voiceText;
      

			this.ngZone.run(() => this.voiceActiveSectionListening = false);
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
		});
	}

	startVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = false;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
    this.voiceText = undefined;

		if (annyang) {
			let commands = {
				'demo-annyang': () => { }
			};

			annyang.addCommands(commands);

      this.initializeVoiceRecognitionCallback();

			annyang.start({ autoRestart: false });
		}
	}

	closeVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = true;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
		this.voiceActiveSectionListening = false;
		this.voiceText = undefined;

		if(annyang){
      annyang.abort();
    }
	}


    /**
     * On init
     */
    ngOnInit(): void
    {
        // Edit
        if ( this._data.note.id )
        {
            // Request the data from the server
            this._notesService.getNoteById(this._data.note.id).subscribe();

            // Get the note
            this.note$ = this._notesService.note$;
        }
        // Add
        else
        {
            // Create an empty note
            var note = {
                _id: null,
                id: null,
                title: null,
                content: null,
                docId: this.gs.getUser()._id,
                archived: false
            };

            this.note$ = of(note);
        }

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create a new note
     *
     * @param note
     */
    createNote(note: Note): void
    {
        
      
        this._notesService.createNote(note,this.gs.getUser()._id).pipe(
            map(() => {
                // Get the note
                this.note$ = this._notesService.note$;
            })).subscribe();
    }

    


    /**
     * Toggle archived status on the given note
     *
     * @param note
     */
    toggleArchiveOnNote(note: Note): void
    {
        note.archived = !note.archived;

        // Update the note
        this.noteChanged.next(note);

        // Close the dialog
        this._matDialogRef.close();
    }

    /**
     * Update the note details
     *
     * @param note
     */
    updateNoteDetails(note: Note): void
    {
        this.noteChanged.next(note);
    }

    /**
     * Delete the given note
     *
     * @param note
     */
    deleteNote(note: Note): void
    {
        this._notesService.deleteNote(note,this.gs.getUser()._id)
            .subscribe((isDeleted) => {

                // Return if the note wasn't deleted...
                if ( !isDeleted )
                {
                    return;
                }

                // Close the dialog
                this._matDialogRef.close();
            });
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
     * Read the given file for demonstration purposes
     *
     * @param file
     */
    private _readAsDataURL(file: File): Promise<any>
    {
        // Return a new promise
        return new Promise((resolve, reject) => {

            // Create a new reader
            const reader = new FileReader();

            // Resolve the promise on success
            reader.onload = (): void => {
                resolve(reader.result);
            };

            // Reject the promise on error
            reader.onerror = (e): void => {
                reject(e);
            };

            // Read the file as the
            reader.readAsDataURL(file);
        });
    }
}

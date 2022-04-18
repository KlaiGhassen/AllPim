import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, concat, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';
import { Note } from './notes.types';
import { GlobalService } from 'app/global.service';

@Injectable({
    providedIn: 'root'
})
export class NotesService
{
    // Private
   
    private _note: BehaviorSubject<Note | null> = new BehaviorSubject(null);
    private _notes: BehaviorSubject<Note[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private Gs:GlobalService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------



    /**
     * Getter for notes
     */
    get notes$(): Observable<Note[]>
    {
        return this._httpClient.get<any>(this.Gs.uri+'/note');
    }

    /**
     * Getter for note
     */
    get note$(): Observable<Note>
    {
        return this._note.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------







   

    /**
     * Get notes
     */
    getNotes(id: String): Observable<Note[]>
    {
        return this._httpClient.get<Note[]>(`${this.Gs.uri}/note/byDocId/${id}`).pipe(
            tap((response: Note[]) => {
                this._notes.next(response);
            })
        );
    }

    /**
     * Get note by id
     */
    getNoteById(id: string): Observable<Note>
    {
        return this._notes.pipe(
            take(1),
            map((notes) => {

                // Find within the folders and files
                const note = notes.find(value => value.id === id) || null;

                // Update the note
                this._note.next(note);

                // Return the note
                return note;
            }),
            switchMap((note) => {

                if ( !note )
                {
                    return throwError('Could not found the note with id of ' + id + '!');
                }

                return of(note);
            })
        );
    }



    /**
     * Create note
     *
     * @param note
     */
    createNote(note: Note, id:String): Observable<Note>
    {
        return this._httpClient.post<Note>(`${this.Gs.uri}/note`,note).pipe(
            switchMap(response => this.getNotes(id).pipe(
                switchMap(() => this.getNoteById(response.id).pipe(
                    map(() => response)
                ))
            )));
    }

    

    /**
     * Delete the note
     *
     * @param note
     */
    deleteNote(note: Note, id:string): Observable<boolean>
    {
        return this._httpClient.delete<boolean>(`${this.Gs.uri}/note/${note._id}`).pipe(
            map((isDeleted: boolean) => {

                // Update the notes
                this.getNotes(id).subscribe();

                // Return the deleted status
                return isDeleted;
            })
        );
    }
}

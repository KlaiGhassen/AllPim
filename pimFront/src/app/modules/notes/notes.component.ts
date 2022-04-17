import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgZone } from '@angular/core';
@Component({
    selector       : 'notes',
    templateUrl    : './notes.component.html',
})
export class NotesComponent
{
    /**
     * Constructor
     */
    constructor(private ngZone: NgZone)
    {
    }
}

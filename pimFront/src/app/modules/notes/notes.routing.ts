import { Route } from '@angular/router';
import { NotesComponent } from './notes.component';
import { NotesListComponent } from './list/list.component';

export const notesRoutes: Route[] = [
    {
        path     : '',
        component: NotesComponent,
        children : [
            {
                path     : '',
                component: NotesListComponent
            }
        ]
    }
];

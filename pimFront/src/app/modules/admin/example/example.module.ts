import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { FuseCardModule } from '@fuse/components/card';
import { TranslateModule } from '@ngx-translate/core';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: ExampleComponent
    }
];

@NgModule({
    declarations: [
        ExampleComponent
    ],
    imports     : [
        TranslateModule,
        FuseCardModule,
        RouterModule.forChild(exampleRoutes)
    ]
})
export class ExampleModule
{
}

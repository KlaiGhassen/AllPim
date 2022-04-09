import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { PricingComponent } from 'app/modules/pricing/pricing.component';
import { pricingRoutes } from 'app/modules/pricing/pricing.routing';

@NgModule({
    declarations: [
        PricingComponent
    ],
    imports     : [
        RouterModule.forChild(pricingRoutes),
        MatButtonModule,
        MatIconModule,
        FuseCardModule,
        SharedModule
    ]
})
export class PricingModule
{
}

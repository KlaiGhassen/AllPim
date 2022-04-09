import { Component, OnInit ,ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PricingComponent implements OnInit {
  yearlyBilling: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}

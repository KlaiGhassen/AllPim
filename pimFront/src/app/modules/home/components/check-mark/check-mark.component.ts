import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-mark',
  templateUrl: './check-mark.component.html',
  styleUrls: ['./check-mark.component.scss'],
})
export class CheckMarkComponent implements OnInit {
  @Input('message') message: any;
  constructor() {}

  ngOnInit(): void {}
}

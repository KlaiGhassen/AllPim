import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent implements OnInit {
  @Input('src') picture: any;
  @Input('size') size: 'small' | 'normal' | 'large' = 'large';
  constructor() {}

  ngOnInit(): void {}
}

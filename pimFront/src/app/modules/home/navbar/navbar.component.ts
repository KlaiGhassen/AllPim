import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from 'app/global.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input('user') user: any;

  constructor(private globalService: GlobalService) {}

  ngOnInit(): void {



    
  }

  signOut() {
    this.globalService.signOut();
  }
}

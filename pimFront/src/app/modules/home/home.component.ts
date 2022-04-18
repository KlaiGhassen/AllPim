import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'app/global.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public user: any;

  constructor(
    private globalService: GlobalService,
    public chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.globalService.currentUser.subscribe((user) => {
      this.user = user;
    });
  }
}

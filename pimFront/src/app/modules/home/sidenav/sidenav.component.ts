import { Component, OnInit } from '@angular/core';
import { ChatService } from './../chat.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  public listOfContacts: any[] = this.chatService.list;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}
}

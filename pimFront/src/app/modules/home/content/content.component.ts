import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'app/global.service';
import { ChatService } from './../chat.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  contact: any;
  public currentUser: any;

  constructor(
    private globalService: GlobalService,
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.globalService.currentUser.subscribe((user) => {
      this.currentUser = user;

      this.route.params.subscribe((params) => {
        const { id } = params;

        this.chatService.currentContact = id;
        this.contact = this.chatService.currentContact;

        if (this.contact.messages_page === 0) {
          this.chatService.getMessages(id);
        }

        if (this.contact.unreaded.count > 0) {
          this.chatService.markAllAsReaded(this.contact).subscribe(() => {
            this.contact.unreaded.count = 0;
          });
        }
      });
    });
  }

  detectScroll(event: Event) {
    if (!this.contact.messages_end && !this.contact.messages_loading) {
      const element: any = event.target!;
      if (
        Math.ceil(element.offsetHeight - element.scrollTop) >=
        element.scrollHeight
      ) {
        this.chatService.getMessages(this.contact._id);
      }
    }
  }
}

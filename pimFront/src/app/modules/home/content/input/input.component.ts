import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from './../../chat.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  @Input('contact') contact: any;
  @Input('currentUser') currentUser: any;
  public text = '';

  ngOnInit(): void {}

  sendMessage() {
    this.text = this.text.trim();
    if (this.text !== '' && this.contact && this.currentUser) {
      const message = {
        from: this.currentUser._id,
        to: this.contact._id,
        message: this.text,
      };

      this.chatService.sendMessage(message).subscribe((message) => {
        this.chatService.addNewMessages(this.contact, message);
        this.text = '';
      });
    }
  }

  onFocus() {
    this.chatService.startTyping({
      user_id: this.currentUser._id,
      contact_id: this.contact._id,
    });
  }

  onblur() {
    this.chatService.stopTyping({
      user_id: this.currentUser._id,
      contact_id: this.contact._id,
    });
  }
}

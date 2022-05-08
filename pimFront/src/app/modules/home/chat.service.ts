import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from 'app/global.service';
import { ProjectService } from '../admin/example/project/project.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket!: Socket;
  private listOfContacts: any[] = [];
  private dataLoadCompleted = false;

  private _currentContact: any = null;
  picture;

  constructor(         private sanitizer: DomSanitizer,
    private _projectService: ProjectService,
    private globalService: GlobalService, private http: HttpClient) {
    globalService.currentUser.subscribe((user) => {
      console.log(user)
      if (user) {
        this.socket = io(globalService.BASE_URL, {
          query: { user_id: user._id },
        });

        this.listOfContacts.splice(0);

        this.socket.on('newMessage', (message) => {
          console.log(message)
          const contact = this.contactById(message.from);
          this.addNewMessages(contact, message);

          if (this.currentContact && message.from === this.currentContact._id) {
            this.markAsReaded(contact._id, message._id).subscribe(() => {});
          } else {
            this.markAsDelivred(contact._id, message._id).subscribe(() => {
              contact.unreaded.count++;
            });
          }
        });

        this.socket.on('newMessageFromMe', (message) => {
          const contact = this.contactById(message.to);
          this.addNewMessages(contact, message);
        });

        this.socket.on('contactStartTyping', (typeEvent) => {
          const contact = this.contactById(typeEvent.contact_id);

          if (contact) {
            contact.typings.push(typeEvent.socket_id);
          }
        });

        this.socket.on('contactStopTyping', (typeEvent) => {
          const contact = this.contactById(typeEvent.contact_id);

          if (contact) {
            const index = contact.typings.indexOf(typeEvent.socket_id);
            contact.typings.splice(index, 1);
          }
        });

        this.socket.on('markAllAsDelivred', (contact_id) => {
          const contact = this.contactById(contact_id);

          for (let message of contact.messages) {
            if (message.delivred) break;
            message.delivred = true;
          }

          contact.latest_message.delivred = true;

          contact.undelivred.count = 0;
        });

        this.socket.on('markAllAsReaded', (contact_id) => {
          const contact = this.contactById(contact_id);

          for (let message of contact.messages) {
            if (message.readed) break;
            message.delivred = true;
            message.readed = true;
          }

          contact.latest_message.delivred = true;
          contact.latest_message.readed = true;

          contact.unreaded.count = 0;
        });

        this.socket.on('markAllAsReadedFromMe', (contact_id) => {
          const contact = this.contactById(contact_id);

          contact.unreaded.count = 0;
        });

        this.socket.on('markMessageAsReaded', (ReadEvent) => {
          const contact = this.contactById(ReadEvent.contact_id);

          const message = contact.messages.find(
            (value: any) => value._id === ReadEvent.message_id
          );

          message.readed = true;
        });

        this.socket.on('markMessageAsDelivred', (ReadEvent) => {
          const contact = this.contactById(ReadEvent.contact_id);

          const message = contact.messages.find(
            (value: any) => value._id === ReadEvent.message_id
          );

          message.delivred = true;
        });

        http
          .get<any[]>(`${globalService.API_URL}/user/contacts`)
          .subscribe((contacts: any[]) => {
            contacts = contacts.map((contact) => {
              console.log("ontactttts",contact);
              contact['messages'] = [];
              contact['typings'] = [];
              contact['messages_loading'] = false;
              contact['messages_end'] = false;
              contact['messages_page'] = 0;

              if (contact.undelivred.count > 0) {
                this.markAllAsDelivred(contact).subscribe(() => {
                  contact.undelivred.count = 0;
                });
              }
              console.log("hello",contact);

              this._projectService
              .downloadMedia(contact.profilePicture)
              .subscribe((blob) => {
                  // var myFile = this.blobToFile(blob, 'my-image1.png');
                  const objectURL = URL.createObjectURL(blob);
                  this.picture =
                      this.sanitizer.bypassSecurityTrustUrl(
                          objectURL
                      );
                  // this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
                  contact.profilePicture = this.picture;
                  console.log(contact.profilePicture);
              });

              return contact;
            });
            this.listOfContacts.push(...contacts);
            this.dataLoadCompleted = true;
          });
      }
    });
  }

  get list() {
    return this.listOfContacts;
  }

  private contactById(id: string) {
    return this.list.find((value) => value._id === id);
  }

  getMessages(contact_id: any) {
    const contact = this.list.find((value) => value._id === contact_id);
    contact.messages_loading = true;

    return this.http
      .get<any[]>(`${this.globalService.API_URL}/message/by-conversation`, {
        params: { contact_id, page: contact.messages_page },
      })
      .subscribe((messages: any[]) => {
        const contact = this.contactById(contact_id);
        contact.messages_loading = false;

        if (messages.length === 0) {
          contact.messages_end = true;
        } else {
          this.addOldMessages(contact, ...messages);
          contact.messages_page++;
        }
      });
  }

  sendMessage(message: any) {
    return this.http.post(`${this.globalService.API_URL}/message`, {
      message,
      socket_id: this.socket.id,
    });
  }

  addNewMessages(contact: any, ...messages: any) {
    if (messages) {
      contact.messages.unshift(...messages);
      contact.latest_message = contact.messages[0];

      let index = this.listOfContacts.indexOf(contact);
      if (index !== 0) {
        this.listOfContacts.splice(index, 1);
        this.listOfContacts.unshift(contact);
      }
    }
  }

  addOldMessages(contact: any, ...messages: any) {
    if (messages) {
      contact.messages.push(...messages);
    }
  }

  startTyping(typeEvent: any) {
    this.socket.emit('startTyping', typeEvent);
  }

  stopTyping(typeEvent: any) {
    this.socket.emit('stopTyping', typeEvent);
  }

  markAllAsDelivred(contact: any) {
    return this.http.put(
      `${this.globalService.API_URL}/message/mark-all-delivred`,
      {
        contact_id: contact._id,
      }
    );
  }

  markAllAsReaded(contact: any) {
    return this.http.put(
      `${this.globalService.API_URL}/message/mark-all-readed`,
      {
        contact_id: contact._id,
        socket_id: this.socket.id,
      }
    );
  }

  markAsDelivred(contact_id: any, message_id: any) {
    return this.http.put(
      `${this.globalService.API_URL}/message/mark-delivred`,
      {
        contact_id,
        message_id,
      }
    );
  }

  markAsReaded(contact_id: any, message_id: any) {
    return this.http.put(`${this.globalService.API_URL}/message/mark-readed`, {
      contact_id,
      message_id,
    });
  }

  get finishLoading() {
    return this.dataLoadCompleted;
  }

  set currentContact(id: any) {
    this._currentContact = this.contactById(id);
  }

  get currentContact() {
    return this._currentContact;
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ContentComponent } from './content/content.component';
import { ContactComponent } from './sidenav/contact/contact.component';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { InputComponent } from './content/input/input.component';
import { TextareaAutosizeDirective } from './content/input/textarea-autosize.directive';
import { MessageBoxComponent } from './content/message-box/message-box.component';
import { ReversePipe } from './@Pipes/reverse.pipe';
import { FormsModule } from '@angular/forms';
import { LatestMessageDatePipe } from './@Pipes/latest-message-date.pipe';
import { CheckMarkComponent } from './components/check-mark/check-mark.component';
import { MessageDatePipe } from './@Pipes/message-date.pipe';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: ':id',
        component: ContentComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    SidenavComponent,
    ContentComponent,
    ContactComponent,
    ProfilePictureComponent,
    InputComponent,
    TextareaAutosizeDirective,
    MessageBoxComponent,
    ReversePipe,
    LatestMessageDatePipe,
    CheckMarkComponent,
    MessageDatePipe,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
})
export class HomeModule {}

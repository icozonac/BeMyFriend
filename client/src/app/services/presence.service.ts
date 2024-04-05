import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private messageService: MessageService
  ) {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.messageService.getUnreadMessagesCount();

    this.hubConnection.on('UserIsOnline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (usernames) => {
          this.onlineUsersSource.next([...usernames, username]);
        },
      });
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (usernames) => {
          this.onlineUsersSource.next(usernames.filter((x) => x !== username));
        },
      });
    });

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.messageService.unreadMessagesCount$.pipe(take(1)).subscribe({
        next: (count) => {
          this.messageService.unreadMessagesCountSource.next(count + 1);
        },
      });

      this.toastr
        .info(knownAs + ' has sent you a new message!')
        .onTap.pipe(take(1))
        .subscribe({
          next: () =>
            this.router.navigateByUrl('/members/' + username + '?tab=Messages'),
        });
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => console.log(error));
  }
}

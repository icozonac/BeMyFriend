import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Message } from 'src/app/models/message';
import { Pagination } from 'src/app/models/pagination';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  messages: Message[] | undefined;
  pagination: Pagination | undefined;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe({
        next: (response) => {
          this.messages = response.result;
          this.pagination = response.pagination;
          this.loading = false;
        },
      });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages?.splice(
          this.messages.findIndex((m) => m.id === id),
          1
        );
      },
    });

    this.messageService.unreadMessagesCount$.pipe(take(1)).subscribe({
      next: (count) => {
        this.messageService.unreadMessagesCountSource.next(count - 1);
      },
    });
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      window.scrollTo(0, 0);
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}

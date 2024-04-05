import { NavigationStart, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  isMobile = false;

  unreadMessagesCount = 0;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 769;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 769;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && this.isMenuOpen) {
        this.isMenuOpen = false;
      }
    });

    this.messageService.getUnreadMessagesCount();

    this.messageService.unreadMessagesCount$.subscribe({
      next: (count) => {
        this.unreadMessagesCount = count;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

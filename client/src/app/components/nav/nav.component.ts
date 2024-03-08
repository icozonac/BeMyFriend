import { NavigationStart, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  isMobile = false;

  constructor(public accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && this.isMenuOpen) {
        this.isMenuOpen = false;
      }
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

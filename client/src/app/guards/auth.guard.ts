import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user) => {
        if (user) return true;
        this.toastr.error('You not authorized');
        this.router.navigateByUrl('/');
        return false;
      })
    );
  }
}

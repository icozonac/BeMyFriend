import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  model: any = {};

  constructor(
    private toastr: ToastrService,
    public accountService: AccountService,
    private router: Router
  ) {}

  login() {
    if (!this.model.username || !this.model.password) {
      this.toastr.error('Please enter username and password');
      return;
    }

    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.model = {};
      },
    });
  }
}

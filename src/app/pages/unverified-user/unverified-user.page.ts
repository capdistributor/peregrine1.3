import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-unverified-user',
  templateUrl: './unverified-user.page.html',
  styleUrls: ['./unverified-user.page.scss'],
})
export class UnverifiedUserPage implements OnInit, OnDestroy {
subscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    
    this.subscription = this.authService.currentUserProfile$
      .subscribe(user => {
        if (user.isVerified) {
          this.router.navigateByUrl('/home');
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe;
  }
}
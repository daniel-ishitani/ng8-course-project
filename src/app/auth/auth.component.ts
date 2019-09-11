import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  inLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}
  
  onSwitchMode() {
    this.inLoginMode = !this.inLoginMode
  }

  onSubmit(form: NgForm){
    if (!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;
    this.error = null;
    if (this.inLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.singup(email, password);
    }

    authObservable.subscribe(resData => {
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      this.isLoading = false;
    });

    form.reset();
  }
}
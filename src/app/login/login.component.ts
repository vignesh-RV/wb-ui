import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signinForm: FormGroup = this.fb.group({});
  user: any | null = null;
  isLoggedIn: boolean = false;
  error_response:string = '';

  ngOnInit(): void {
  }

    constructor(private fb: FormBuilder, private auth: AuthService) {
      if(auth.isAuthenticated()){
        auth.navigateToHome();
      }
      this.initiateForm();
    }

    initiateForm(){
      this.signinForm = this.fb.group({
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        password: [
          '', 
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ]
      });
    }

    submitForm() {
      if(!this.signinForm) return;

      if (this.signinForm.invalid) {
        this.signinForm.markAllAsTouched();
        return;
      }

      let data = this.signinForm.getRawValue();
      this.auth.doLogin(data).then((res: any) => {}, (err: any) => {
        console.log(err);
        this.error_response = typeof err.message === 'string' ? err.message : 'Unable to validate your account, please try again later.';
      });
    }

    signInWithGoogle(){
      this.auth.showGoogleLogin();
    }

    navigateToSignup(){
      this.auth.navigateToSignup();
    }
    
    clearForm() {
      this.signinForm.reset();
      this.error_response = '';
    }
}
